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
  var prompt = "Kit de lanzamiento digital en español para:\nNicho:" + nicho + "\nFormato:" + formato + "\nExpertise:" + expertise + "\nAudiencia:" + audiencia + "\nProblema:" + problema + "\n\nJSON sin backticks:{\"nombreProducto\":\"X\",\"tagline\":\"X\",\"descripcionCorta\":\"X\",\"publicoObjetivo\":\"X\",\"precio\":{\"usd\":\"27\",\"ars\":\"36700\",\"justificacion\":\"X\"},\"propuestaUnica\":\"X\",\"beneficiosTop\":[\"X\",\"X\",\"X\",\"X\",\"X\"],\"paginaVentas\":\"X\",\"postsInstagram\":[\"X\",\"X\",\"X\"],\"emailBienvenida\":\"X\",\"planLanzamiento\":\"X\",\"faq\":[{\"pregunta\":\"X\",\"respuesta\":\"X\"},{\"pregunta\":\"X\",\"respuesta\":\"X\"},{\"pregunta\":\"X\",\"respuesta\":\"X\"}],\"hashtags\":\"X\"}";
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
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) {
      var errText = await res.text();
      console.error("Error Anthropic:", errText);
      return { statusCode: 502, body: JSON.stringify({ error: "Error IA: " + errText.slice(0, 100) }) };
    }
    var data = await res.json();
    var raw = data.content && data.content[0] ? data.content[0].text : "";
    var clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
var start = clean.indexOf("{");
var end = clean.lastIndexOf("}");
if (start !== -1 && end !== -1) { clean = clean.slice(start, end + 1); }
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
