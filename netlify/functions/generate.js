exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Metodo no permitido" })
    };
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API Key no configurada en Netlify." })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch(e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request invalido." })
    };
  }

  const { nicho, formato, expertise, audiencia, problema } = body;

  if (!nicho || !formato || !expertise || !audiencia || !problema) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Faltan datos del formulario." })
    };
  }

  const prompt = `Eres un experto en marketing digital, copywriting persuasivo y creacion de productos digitales para el mercado hispanohablante de America Latina.

DATOS DEL EMPRENDEDOR:
- Nicho: ${nicho}
- Formato: ${formato}
- Expertise: ${expertise}
- Audiencia: ${audiencia}
- Problema que resuelve: ${problema}

Genera un kit de lanzamiento digital COMPLETO y ORIGINAL en español latinoamericano.
Responde UNICAMENTE con JSON valido, sin texto adicional, sin backticks, sin comentarios:

{
  "nombreProducto": "nombre atractivo del producto en espanol (max 6 palabras)",
  "tagline": "frase de impacto de 1 linea (max 12 palabras)",
  "descripcionCorta": "descripcion de 2-3 oraciones para redes sociales",
  "publicoObjetivo": "descripcion detallada del cliente ideal",
  "precio": {
    "usd": "precio en USD solo el numero",
    "ars": "precio en ARS con puntos de miles",
    "justificacion": "por que vale ese precio"
  },
  "propuestaUnica": "que hace diferente a este producto de todo lo demas",
  "beneficiosTop": ["beneficio 1", "beneficio 2", "beneficio 3", "beneficio 4", "beneficio 5"],
  "paginaVentas": "texto completo de pagina de ventas 350-450 palabras con gancho, historia, beneficios y CTA separados por dobles saltos de linea",
  "postsInstagram": [
    "POST 1 completo enfocado en el problema del cliente con emojis y hashtags",
    "POST 2 completo enfocado en la transformacion con emojis y hashtags",
    "POST 3 completo estilo historia personal con emojis y hashtags"
  ],
  "emailBienvenida": "email completo post-compra con asunto, cuerpo de 200 palabras y cierre motivador",
  "planLanzamiento": "plan de 7 dias con formato DIA 1: accion concreta, DIA 2: accion, etc separados por saltos de linea",
  "faq": [
    {"pregunta": "pregunta 1", "respuesta": "respuesta persuasiva"},
    {"pregunta": "pregunta 2", "respuesta": "respuesta"},
    {"pregunta": "pregunta 3", "respuesta": "respuesta"}
  ],
  "hashtags": "30 hashtags relevantes separados por espacios en espanol e ingles"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001"
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error Anthropic:", errText);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Error al conectar con la IA. Intenta de nuevo." })
      };
    }

    const data = await response.json();
    const rawText = data.content && data.content[0] && data.content[0].text ? data.content[0].text : "";
    const cleanText = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch(e) {
      console.error("Error parseando JSON:", rawText.slice(0, 300));
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "La IA genero una respuesta inesperada. Intenta de nuevo." })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(parsed)
    };

  } catch(err) {
    console.error("Error interno:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno. Intenta de nuevo." })
    };
  }
};
