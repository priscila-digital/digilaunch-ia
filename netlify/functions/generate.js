exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Metodo no permitido" }) };
  }

  var key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ error: "API Key no configurada." }) };
  }

  var body;
  try { body = JSON.parse(event.body); }
  catch(e) { return { statusCode: 400, body: JSON.stringify({ error: "Request invalido." }) }; }

  var nicho = body.nicho;
  var formato = body.formato;
  var expertise = body.expertise;
  var audiencia = body.audiencia;
  var problema = body.problema;

  if (!nicho || !formato || !expertise || !audiencia || !problema) {
    return { statusCode: 400, body: JSON.stringify({ error: "Faltan datos." }) };
  }

  var prompt = "Eres un experto en marketing digital para Latinoamerica.\n\nDATOS:\n- Nicho: " + nicho + "\n- Formato: " + formato + "\n- Expertise: " + expertise + "\n- Audiencia: " + audiencia + "\n- Problema: " + problema + "\n\nGenera un kit de lanzamiento en español. Responde SOLO con JSON valido sin backticks:\n\n{\"nombreProducto\":\"nombre del producto\",\"tagline\":\"frase de impacto\",\"descripcionCorta\":\"descripcion 2-3 oraciones\",\"publicoObjetivo\":\"cliente ideal detallado\",\"precio\":{\"usd\":\"27\",\"ars\":\"36700\",\"justificacion\":\"justificacion del precio\"},\"propuestaUnica\":\"diferenciador clave\",\"beneficiosTop\":[\"beneficio 1\",\"beneficio 2\",\"beneficio 3\",\"beneficio 4\",\"beneficio 5\"],\"paginaVentas\":\"pagina de ventas completa 400 palabras\",\"postsInstagram\":[\"post 1 con emojis y hashtags\",\"post 2 con emojis y hashtags\",\"post 3 con emojis y hashtags\"],\"emailBienvenida\":\"email post-compra completo\",\"planLanzamiento\":\"DIA 1: accion\\nDIA 2: accion\\nDIA 3: accion\\nDIA 4: accion\\nDIA 5: accion\\nDIA 6: accion\\nDIA 7: accion\",\"faq\":[{\"pregunta\":\"pregunta 1\",\"respuesta\":\"respuesta 1\"},{\"pregunta\":\"pregunta 2\",\"respuesta\":\"respuesta 2\"},{\"pregunta\":\"pregunta 3\",\"respuesta\":\"respuesta 3\"}],\"hashtags\":\"30 hashtags relevantes\"}";

  try {
    var response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      var errText = await response.text();
      console.error("Error Anthropic:", errText);
      return { statusCode: 502, body: JSON.stringify({ error: "Error IA: " + errText.slice(0, 100) }) };
    }

    var data = await response.json();
    var rawText = "";
    if (data.content && data.content[0] && data.content[0].text) {
      rawText = data.content[0].text;
    }
    var cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    var parsed;
    try { parsed = JSON.parse(cleanText); }
    catch(e) {
      console.error("JSON parse error:", rawText.slice(0, 200));
      return { statusCode: 502, body: JSON.stringify({ error: "Respuesta inesperada de la IA. Intenta de nuevo." }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(parsed)
    };

  } catch(err) {
    console.error("Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno: " + err.message }) };
  }
};
