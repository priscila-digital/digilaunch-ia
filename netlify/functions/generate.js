exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }
  var key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ error: "API Key no configurada." }) };
  }
  var body;
  try { body = JSON.parse(event.body); }
  catch(e) { return { statusCode: 400, body: JSON.stringify({ error: "Request invalido." }) }; }
  var nicho = body.nicho || "";
  var formato = body.formato || "";
  var expertise = body.expertise || "";
  var audiencia = body.audiencia || "";
  var problema = body.problema || "";
  if (!nicho || !formato || !expertise || !audiencia || !problema) {
    return { statusCode: 400, body: JSON.stringify({ error: "Faltan datos." }) };
  }
  var prompt = "Eres experto en marketing digital latinoamericano. Crea un kit de lanzamiento para:\nNicho: " + nicho + "\nFormato: " + formato + "\nExpertise: " + expertise + "\nAudiencia: " + audiencia + "\nProblema: " + problema + "\n\nResponde SOLO JSON sin backticks:\n{\"nombreProducto\":\"nombre comercial\",\"tagline\":\"frase de venta\",\"descripcionCorta\":\"descripcion 2 oraciones\",\"publicoObjetivo\":\"avatar del cliente ideal\",\"precio\":{\"usd\":\"27\",\"ars\":\"36.700\",\"justificacion\":\"justificacion del precio\"},\"propuestaUnica\":\"diferenciador clave\",\"beneficiosTop\":[\"beneficio 1\",\"beneficio 2\",\"beneficio 3\",\"beneficio 4\",\"beneficio 5\"],\"paginaVentas\":\"pagina de ventas 300 palabras con gancho, problema, solucion, beneficios y CTA\",\"postsInstagram\":[\"Post 1 problema con emojis y hashtags\",\"Post 2 transformacion con emojis y hashtags\",\"Post 3 historia con emojis y hashtags\"],\"emailBienvenida\":\"email post-compra completo con asunto y cuerpo\",\"planLanzamiento\":\"DIA 1: accion\\nDIA 2: accion\\nDIA 3: accion\\nDIA 4: accion\\nDIA 5: accion\\nDIA 6: accion\\nDIA 7: accion\",\"faq\":[{\"pregunta\":\"Para quien es?\",\"respuesta\":\"respuesta\"},{\"pregunta\":\"Como accedo?\",\"respuesta\":\"Por email de Hotmart al instante\"},{\"pregunta\":\"Tiene garantia?\",\"respuesta\":\"Si, 7 dias sin preguntas\"}],\"hashtags\":\"#emprendimiento #negociodigital #productosdigitales #marketingdigital #latinoamerica #libertadfinanciera #emprender #ingresos #trabajodesdecasa #emprendedora\"}";
  try {
    var res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) {
      var errText = await res.text();
      console.error("Error Anthropic:", errText);
      return { statusCode: 502, body: JSON.stringify({ error: "Error IA: " + errText.slice(0, 100) }) };
    }
    var data = await res.json();
    var raw = "";
    if (data.content && data.content[0] && data.content[0].text) {
      raw = data.content[0].text;
    }
    var clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    var parsed;
    try { parsed = JSON.parse(clean); }
    catch(e) {
      console.error("JSON error:", raw.slice(0, 200));
      return { statusCode: 502, body: JSON.stringify({ error: "Intenta de nuevo." }) };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(parsed)
    };
  } catch(err) {
    console.error("Error:", err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
