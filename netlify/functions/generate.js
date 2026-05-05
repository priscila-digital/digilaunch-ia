// netlify/functions/generate.js
// ─────────────────────────────────────────────────────────────────
// Función serverless segura — la API Key de Anthropic NUNCA llega
// al navegador del usuario. Se guarda en Netlify Environment Variables.
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, context) {
  // Solo aceptar POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Leer la API Key desde variables de entorno de Netlify
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

  if (!ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY no está configurada en las variables de entorno de Netlify.")
    return new Response(
      JSON.stringify({ error: "Configuración del servidor incompleta. Contactá al administrador." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  // Leer el cuerpo del request
  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Request inválido." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { nicho, formato, expertise, audiencia, problema } = body

  // Validar que llegaron los datos necesarios
  if (!nicho || !formato || !expertise || !audiencia || !problema) {
    return new Response(JSON.stringify({ error: "Faltan datos del formulario." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // ── PROMPT ──
  const prompt = `Eres un experto en marketing digital, copywriting persuasivo y creación de productos digitales para el mercado hispanohablante de América Latina. Generás kits de lanzamiento completos, únicos y altamente comerciales.

DATOS DEL EMPRENDEDOR:
- Nicho / Temática: ${nicho}
- Formato del producto: ${formato}
- Expertise o conocimiento: ${expertise}
- Audiencia objetivo: ${audiencia}
- Problema que resuelve: ${problema}

Generá un kit de lanzamiento digital COMPLETO, ORIGINAL y ALTAMENTE COMERCIAL. El lenguaje debe ser natural en español latinoamericano, apelando a emociones reales y beneficios concretos.

Respondé ÚNICAMENTE con JSON válido, sin texto adicional, sin backticks, sin comentarios. Solo el objeto JSON:

{
  "nombreProducto": "nombre atractivo y único del producto (máx 6 palabras, en español)",
  "tagline": "frase de impacto de 1 línea que lo vende todo (máx 12 palabras)",
  "descripcionCorta": "descripción de 2-3 oraciones para redes sociales, con emoción y beneficios",
  "publicoObjetivo": "descripción específica y detallada del cliente ideal: quién es, qué siente, qué busca, sus frustraciones y aspiraciones",
  "precio": {
    "usd": "precio sugerido en USD (sin símbolo de dólar, solo el número con decimales si aplica)",
    "ars": "precio sugerido en ARS (número con puntos de miles)",
    "justificacion": "por qué vale ese precio y por qué la audiencia lo va a pagar"
  },
  "propuestaUnica": "qué hace DIFERENTE a este producto de todo lo que existe. La razón #1 para elegirlo",
  "beneficiosTop": [
    "beneficio 1 con emoción y resultado concreto",
    "beneficio 2 con emoción y resultado concreto",
    "beneficio 3 con emoción y resultado concreto",
    "beneficio 4 con emoción y resultado concreto",
    "beneficio 5 con emoción y resultado concreto"
  ],
  "paginaVentas": "texto completo de página de ventas de 350-450 palabras. Debe tener: 1) Gancho inicial potente (pregunta o dato impactante), 2) El problema que sufre el lector, 3) La promesa/transformación, 4) Qué incluye el producto, 5) Para quién es, 6) CTA poderoso. Formato de párrafos separados por \\n\\n",
  "postsInstagram": [
    "POST 1 completo enfocado en el PROBLEMA del cliente (con hook, desarrollo, emojis y 5 hashtags al final)",
    "POST 2 completo enfocado en la TRANSFORMACIÓN prometida (con hook, desarrollo, emojis y 5 hashtags al final)",
    "POST 3 completo estilo SOCIAL PROOF o historia personal (con hook, desarrollo, emojis y 5 hashtags al final)"
  ],
  "emailBienvenida": "email de bienvenida completo post-compra. Debe tener: asunto del email, cuerpo cálido y profesional de 200+ palabras con el nombre del comprador como [NOMBRE], valor inmediato, qué esperar a continuación y cierre motivador",
  "planLanzamiento": "plan detallado de 7 días. Formato: DÍA 1: [acción concreta]\\nDÍA 2: [acción concreta]\\n... etc. Cada día con una tarea clara y alcanzable.",
  "faq": [
    {"pregunta": "¿pregunta frecuente 1 que frena la compra?", "respuesta": "respuesta clara, honesta y persuasiva de 2-3 oraciones"},
    {"pregunta": "¿pregunta frecuente 2?", "respuesta": "respuesta"},
    {"pregunta": "¿pregunta frecuente 3?", "respuesta": "respuesta"}
  ],
  "hashtags": "30 hashtags relevantes separados por espacios: mezcla de hashtags en español sobre el tema, hashtags de emprendimiento latam, y 5 en inglés para mayor alcance"
}`

  // ── LLAMADA A CLAUDE API ──
  try {
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text()
      console.error("Error de Anthropic API:", errText)
      return new Response(
        JSON.stringify({ error: "Error al conectar con la IA. Intentá en unos segundos." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      )
    }

    const anthropicData = await anthropicResponse.json()

    // Extraer el texto de la respuesta
    const rawText = anthropicData.content?.find(b => b.type === "text")?.text || ""

    // Limpiar y parsear JSON
    const cleanText = rawText.replace(/```json|```/g, "").trim()
    let parsed
    try {
      parsed = JSON.parse(cleanText)
    } catch {
      console.error("Error parseando JSON de Claude:", rawText.slice(0, 500))
      return new Response(
        JSON.stringify({ error: "La IA generó una respuesta inesperada. Intentá de nuevo." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      )
    }

    // Retornar el kit generado al frontend
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })

  } catch (err) {
    console.error("Error interno:", err)
    return new Response(
      JSON.stringify({ error: "Error interno del servidor. Intentá de nuevo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

// Configuración de la función para Netlify
export const config = {
  path: "/api/generate",
}
