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
  var prompt = "Kit de lanzamiento digital en espanol para:\nNicho:" + nicho + "\nFormato:" + formato + "\nExpertise:" + expertise + "\nAudiencia:" + audiencia + "\nProblema:" + problema + "\n\nResponde SOLO con el objeto JSON, sin texto antes ni despues, sin backticks, sin markdown:\n{\"nombreProducto\":\"nombre\",\"tagline\":\"frase\",\"descripcionCorta\":\"descripcion\",\"publicoObjetivo\":\"avatar\",\"precio\":{\"usd\":\"27\",\"ars\":\"36700\",\"justificacion\":\"justificacion\"},\"propuestaUnica\":\"diferenciador\",\"beneficiosTop\":[\"b1\",\"b2\",\"b3\",\"b4\",\"b5\"],\"paginaVentas\":\"texto ventas\",\"postsInstagram\":[\"post1\",\"post2\",\"post3\"],\"emailBienvenida\":\"email\",\"planLanzamiento\":\"plan 7 dias\",\"faq\":[{\"pregunta\":\"p1\",\"respuesta\":\"r1\"},{\"pregunta\":\"p2\",\"respuesta\":\"r2\"},{\"pregunta\":\"p3\",\"respuesta\":\"r3\"}],\"hashtags\":\"hashtags\"}";
  try {
    var res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
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
    var start = raw.indexOf("{");
    var end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) {
      console.error("No JSON found:", raw.slice(0, 200));
      return { statusCode: 502, body: JSON.stringify({ error: "Intenta de nuevo." }) };
    }
    var clean = raw.slice(start, end + 1);
    var parsed;
    try { parsed = JSON.parse(clean); }
    catch(e) {
      console.error("JSON parse error:", clean.slice(0, 200));
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
