import { useState, useEffect, useRef } from "react"

// ================================================================
// DigiLaunch IA — 100% Responsive: celular, tablet y computadora
// ================================================================

const nichos = [
  { id: "finanzas",    emoji: "💰", label: "Finanzas & Cripto" },
  { id: "salud",       emoji: "🥗", label: "Salud & Nutrición" },
  { id: "tecnologia",  emoji: "🤖", label: "Tech & IA" },
  { id: "negocio",     emoji: "🚀", label: "Emprendimiento" },
  { id: "bienestar",   emoji: "🧘", label: "Bienestar & Mindset" },
  { id: "educacion",   emoji: "📚", label: "Educación & Idiomas" },
  { id: "creatividad", emoji: "🎨", label: "Creatividad & Arte" },
  { id: "cocina",      emoji: "🍳", label: "Cocina & Recetas" },
  { id: "marketing",   emoji: "📱", label: "Marketing Digital" },
  { id: "otro",        emoji: "✨", label: "Otro nicho" },
]

const formatos = [
  { id: "ebook",       emoji: "📕", label: "eBook / PDF" },
  { id: "curso",       emoji: "🎬", label: "Curso en Video" },
  { id: "template",    emoji: "🖼️", label: "Templates" },
  { id: "membresia",   emoji: "🔐", label: "Membresía" },
  { id: "consultoria", emoji: "💬", label: "Consultoría" },
  { id: "app",         emoji: "⚡", label: "App / Herramienta" },
]

const loadingMsgs = [
  "Analizando tu nicho con IA...",
  "Investigando el mercado latinoamericano...",
  "Generando tu propuesta de valor...",
  "Creando tu página de ventas...",
  "Redactando posts para Instagram...",
  "Diseñando tu secuencia de email...",
  "Armando tu plan de lanzamiento...",
  "Finalizando tu kit completo...",
]

/* ── ESTILOS GLOBALES ── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    *, *::before, *::after {
      margin: 0; padding: 0; box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html { scroll-behavior: smooth; }

    body {
      background: #080808;
      color: #fff;
      font-family: 'DM Sans', system-ui, sans-serif;
      overflow-x: hidden;
      -webkit-text-size-adjust: 100%;
    }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #111; }
    ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 4px; }

    /* ─ ANIMATIONS ─ */
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes float {
      0%,100% { transform:translateY(0) rotate(0deg); }
      50%     { transform:translateY(-10px) rotate(180deg); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes gradShift {
      0%,100% { background-position:0% 50%; }
      50%     { background-position:100% 50%; }
    }
    @keyframes barPulse {
      0%,100% { opacity:0.6; }
      50%     { opacity:1; }
    }

    /* ─ UTILITIES ─ */
    button { cursor:pointer; transition:all 0.2s ease; border:none; }
    button:active { transform:scale(0.97); }
    textarea { resize:vertical; }
    textarea, input { outline:none; }
    textarea:focus, input:focus { border-color: rgba(212,175,55,0.5) !important; }

    /* ─ RESPONSIVE GRID ─ */
    .chip-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    @media (min-width: 480px) {
      .chip-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (min-width: 720px) {
      .chip-grid { grid-template-columns: repeat(5, 1fr); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
    }
    @media (min-width: 640px) {
      .stats-grid { grid-template-columns: repeat(4, 1fr); }
    }

    .features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    @media (min-width: 560px) {
      .features-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 900px) {
      .features-grid { grid-template-columns: repeat(3, 1fr); }
    }

    .price-row {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
    }
    @media (min-width: 480px) {
      .price-row { flex-direction: row; justify-content: center; }
    }

    .hero-cta-row {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }
    @media (min-width: 480px) {
      .hero-cta-row { flex-direction: row; justify-content: center; }
    }

    .result-nav {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }
    @media (min-width: 480px) {
      .result-nav { flex-direction: row; align-items: center; }
    }
  `}</style>
)

/* ── PARTICLES (se ocultan en móvil para performance) ── */
function Particles() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {[...Array(12)].map((_,i) => (
        <div key={i} style={{
          position:"absolute",
          width: i%3===0 ? "3px" : "1.5px",
          height: i%3===0 ? "3px" : "1.5px",
          background: i%3===0 ? "#D4AF37" : "rgba(212,175,55,0.2)",
          borderRadius:"50%",
          left:`${(i*21+5)%100}%`,
          top:`${(i*13+10)%100}%`,
          animation:`float ${5+(i%4)}s ease-in-out ${i*0.5}s infinite alternate`,
        }}/>
      ))}
    </div>
  )
}

/* ── COPY BUTTON ── */
function CopyBtn({ text, small = false }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // fallback for older browsers
      const ta = document.createElement("textarea")
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button onClick={copy} style={{
      background: copied ? "rgba(74,222,128,0.15)" : "rgba(212,175,55,0.08)",
      border: `1px solid ${copied ? "rgba(74,222,128,0.4)" : "rgba(212,175,55,0.35)"}`,
      color: copied ? "#4ADE80" : "#D4AF37",
      padding: small ? "5px 12px" : "8px 16px",
      borderRadius:"8px",
      fontSize: small ? "12px" : "13px",
      letterSpacing:"0.04em",
      fontFamily:"'DM Mono', monospace",
      flexShrink: 0,
      whiteSpace: "nowrap",
    }}>
      {copied ? "✓ Copiado" : "Copiar"}
    </button>
  )
}

/* ── RESULT CARD ── */
function ResultCard({ title, icon, content, delay=0, children }) {
  const [visible, setVisible] = useState(false)
  useEffect(()=>{ const t=setTimeout(()=>setVisible(true), delay); return()=>clearTimeout(t) },[delay])
  return (
    <div style={{
      background:"rgba(255,255,255,0.02)",
      border:"1px solid rgba(212,175,55,0.15)",
      borderRadius:"16px",
      padding: "clamp(18px, 4vw, 28px)",
      marginBottom:"14px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition:"all 0.6s cubic-bezier(0.16,1,0.3,1)",
      position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"12px", marginBottom:"16px", flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"clamp(18px,3vw,22px)" }}>{icon}</span>
          <span style={{ color:"#D4AF37", fontFamily:"'Playfair Display',serif", fontSize:"clamp(15px,2.5vw,17px)", fontWeight:"700" }}>{title}</span>
        </div>
        {content && <CopyBtn text={content} small/>}
      </div>
      <div style={{ color:"rgba(255,255,255,0.8)", lineHeight:"1.75", fontSize:"clamp(14px,2vw,15px)" }}>{children}</div>
    </div>
  )
}

/* ── CHIP ── */
function Chip({ selected, onClick, emoji, label }) {
  return (
    <div onClick={onClick} style={{
      border: selected ? "1px solid #D4AF37" : "1px solid rgba(255,255,255,0.07)",
      borderRadius:"12px",
      padding:"14px 10px",
      cursor:"pointer",
      textAlign:"center",
      background: selected ? "rgba(212,175,55,0.09)" : "rgba(255,255,255,0.02)",
      boxShadow: selected ? "0 0 18px rgba(212,175,55,0.12)" : "none",
      transition:"all 0.2s",
      userSelect:"none",
    }}>
      <div style={{ fontSize:"clamp(22px,5vw,28px)", marginBottom:"6px" }}>{emoji}</div>
      <div style={{ fontSize:"clamp(11px,2vw,13px)", color: selected ? "#D4AF37" : "rgba(255,255,255,0.65)", fontWeight: selected ? "600" : "400", lineHeight:"1.3" }}>{label}</div>
    </div>
  )
}

/* ── FIELD ── */
function Field({ label, value, onChange, placeholder, rows=3 }) {
  return (
    <div>
      <label style={{ display:"block", color:"rgba(255,255,255,0.45)", fontSize:"11px", marginBottom:"8px", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'DM Mono',monospace" }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width:"100%",
          background:"rgba(255,255,255,0.03)",
          border:"1px solid rgba(255,255,255,0.09)",
          borderRadius:"12px",
          padding:"14px 16px",
          color:"#fff",
          fontSize:"16px",           /* 16px evita zoom automático en iOS */
          fontFamily:"'DM Sans',sans-serif",
          lineHeight:"1.6",
        }}
      />
    </div>
  )
}

/* ── LOGO ── */
const Logo = () => (
  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(18px,3vw,22px)", fontWeight:"700", background:"linear-gradient(135deg,#D4AF37,#F5E17A,#B8860B)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
    DigiLaunch IA
  </span>
)

/* ── GLOW ── */
const Glow = ({ top="-300px", right="-200px", size="600px", opacity="0.07" }) => (
  <div style={{ position:"fixed", width:size, height:size, borderRadius:"50%", background:`radial-gradient(circle,rgba(212,175,55,${opacity}) 0%,transparent 70%)`, top, right, pointerEvents:"none", zIndex:0 }}/>
)

/* ═══════════════════════════════════════
   PANTALLA 1 — INICIO
═══════════════════════════════════════ */
function PageInicio({ onStart }) {
  const pad = "clamp(20px, 5vw, 48px)"

  const features = [
    { i:"📦", t:"Nombre + Tagline",      d:"Un nombre atractivo y una frase que vende en una línea." },
    { i:"📝", t:"Página de Ventas",       d:"Copywriting de 400+ palabras listo para pegar en Hotmart." },
    { i:"📱", t:"3 Posts Instagram",      d:"Con hooks, emojis y hashtags. Listos para copiar y pegar." },
    { i:"📧", t:"Email de Bienvenida",    d:"Post-compra profesional que fideliza a tu cliente." },
    { i:"📅", t:"Plan 7 Días",           d:"Qué hacer cada día hasta el lanzamiento. Sin improvisar." },
    { i:"❓", t:"FAQs Anti-objeciones",  d:"Las 3 dudas que frenan la venta, respondidas con persuasión." },
  ]

  return (
    <div style={{ minHeight:"100vh", background:"#080808", overflowX:"hidden" }}>
      <GlobalStyles/>
      <Particles/>
      <Glow top="-200px" right="-150px" size="500px"/>

      <div style={{ maxWidth:"860px", margin:"0 auto", padding:`0 ${pad} 80px`, position:"relative", zIndex:1 }}>

        {/* NAV */}
        <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"clamp(20px,4vw,32px) 0 0", marginBottom:"clamp(48px,8vw,80px)" }}>
          <Logo/>
          <span style={{ background:"rgba(212,175,55,0.09)", border:"1px solid rgba(212,175,55,0.28)", color:"#D4AF37", padding:"5px 14px", borderRadius:"100px", fontSize:"11px", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em" }}>
            BETA · 2026
          </span>
        </nav>

        {/* HERO */}
        <div style={{ textAlign:"center", animation:"fadeUp 0.8s ease both" }}>
          <div style={{ display:"inline-block", background:"rgba(212,175,55,0.07)", border:"1px solid rgba(212,175,55,0.22)", color:"#D4AF37", padding:"6px 16px", borderRadius:"100px", fontSize:"11px", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:"28px", fontFamily:"'DM Mono',monospace" }}>
            🤖 Powered by Inteligencia Artificial
          </div>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(36px,8vw,82px)", fontWeight:"900", lineHeight:"1.06", letterSpacing:"-0.025em", marginBottom:"24px" }}>
            Tu negocio digital,{" "}
            <span style={{ background:"linear-gradient(135deg,#D4AF37,#F5E17A,#D4AF37)", backgroundSize:"200% 200%", animation:"gradShift 4s ease infinite", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              creado por IA
            </span>
            {" "}en minutos.
          </h1>

          <p style={{ fontSize:"clamp(16px,3vw,19px)", color:"rgba(255,255,255,0.58)", lineHeight:"1.75", maxWidth:"560px", margin:"0 auto 40px" }}>
            Ingresás tu idea. La IA genera un kit completo: nombre, página de ventas, posts de Instagram, email de bienvenida y plan de lanzamiento de 7 días. Todo en español.
          </p>

          <div className="hero-cta-row" style={{ marginBottom:"16px" }}>
            <button onClick={onStart} style={{ background:"linear-gradient(135deg,#D4AF37,#B8860B)", color:"#000", padding:"clamp(16px,3vw,20px) clamp(32px,6vw,48px)", borderRadius:"14px", fontSize:"clamp(15px,2.5vw,17px)", fontWeight:"700", letterSpacing:"0.01em", boxShadow:"0 0 50px rgba(212,175,55,0.3)", width:"100%", maxWidth:"340px" }}>
              ⚡ Crear mi Kit Digital
            </button>
          </div>
          <p style={{ color:"rgba(255,255,255,0.28)", fontSize:"13px", fontFamily:"'DM Mono',monospace" }}>
            Sin conocimientos técnicos · Acceso instantáneo · En español
          </p>
        </div>

        {/* STATS */}
        <div className="stats-grid" style={{ background:"rgba(212,175,55,0.08)", border:"1px solid rgba(212,175,55,0.1)", borderRadius:"16px", overflow:"hidden", margin:"clamp(40px,8vw,72px) 0", animation:"fadeUp 0.8s ease 0.15s both" }}>
          {[
            { n:"$234B", l:"Economía creadores 2026" },
            { n:"8 min", l:"Tu kit completo" },
            { n:"100%", l:"En español latino" },
            { n:"∞",    l:"Productos posibles" },
          ].map((s,i)=>(
            <div key={i} style={{ background:"#0E0E0E", padding:"clamp(20px,4vw,28px) 16px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,5vw,36px)", color:"#D4AF37", fontWeight:"700", lineHeight:"1", marginBottom:"6px" }}>{s.n}</div>
              <div style={{ fontSize:"clamp(10px,1.8vw,12px)", color:"rgba(255,255,255,0.35)", letterSpacing:"0.06em", fontFamily:"'DM Mono',monospace" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <div style={{ animation:"fadeUp 0.8s ease 0.3s both" }}>
          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.35)", fontSize:"11px", letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:"28px" }}>QUÉ INCLUYE CADA KIT</p>
          <div className="features-grid">
            {features.map((f,i)=>(
              <div key={i} style={{ background:"rgba(212,175,55,0.03)", border:"1px solid rgba(212,175,55,0.11)", borderRadius:"14px", padding:"clamp(18px,3vw,24px)", display:"flex", gap:"14px", alignItems:"flex-start", transition:"all 0.2s" }}>
                <span style={{ fontSize:"clamp(22px,4vw,26px)", flexShrink:0 }}>{f.i}</span>
                <div>
                  <div style={{ fontWeight:"600", marginBottom:"4px", fontSize:"clamp(14px,2vw,15px)" }}>{f.t}</div>
                  <div style={{ color:"rgba(255,255,255,0.42)", fontSize:"clamp(12px,1.8vw,13px)", lineHeight:"1.55" }}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   PANTALLA 2 — FORMULARIO
═══════════════════════════════════════ */
function PageForm({ onGenerate, onBack, error }) {
  const [nicho,    setNicho]    = useState(null)
  const [formato,  setFormato]  = useState(null)
  const [expertise, setExpertise] = useState("")
  const [audiencia, setAudiencia] = useState("")
  const [problema,  setProblema]  = useState("")

  const canSubmit = nicho && formato && expertise.length > 10 && audiencia.length > 5 && problema.length > 10

  const pad = "clamp(20px, 5vw, 40px)"

  return (
    <div style={{ minHeight:"100vh", background:"#080808" }}>
      <GlobalStyles/>
      <Glow top="-150px" right="-100px" size="400px" opacity="0.05"/>

      <div style={{ maxWidth:"860px", margin:"0 auto", padding:`0 ${pad} 100px`, position:"relative", zIndex:1 }}>

        {/* NAV */}
        <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"clamp(20px,4vw,28px) 0 0", marginBottom:"clamp(32px,6vw,52px)" }}>
          <Logo/>
          <button onClick={onBack} style={{ background:"none", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(255,255,255,0.45)", padding:"8px 16px", borderRadius:"8px", fontSize:"13px" }}>
            ← Volver
          </button>
        </nav>

        {/* ERROR */}
        {error && (
          <div style={{ background:"rgba(255,60,60,0.08)", border:"1px solid rgba(255,60,60,0.28)", borderRadius:"12px", padding:"14px 18px", marginBottom:"24px", color:"#ff6b6b", fontSize:"14px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* HEADER */}
        <div style={{ marginBottom:"clamp(32px,6vw,48px)", animation:"fadeUp 0.5s ease" }}>
          <div style={{ display:"inline-block", background:"rgba(212,175,55,0.07)", border:"1px solid rgba(212,175,55,0.22)", color:"#D4AF37", padding:"5px 14px", borderRadius:"100px", fontSize:"11px", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:"16px", fontFamily:"'DM Mono',monospace" }}>
            CONFIGURÁ TU KIT
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,5vw,42px)", fontWeight:"700", marginBottom:"6px" }}>Contanos tu idea</h2>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"clamp(14px,2vw,15px)" }}>Mientras más específico seas, mejor será el kit generado.</p>
        </div>

        {/* NICHO */}
        <div style={{ marginBottom:"clamp(28px,5vw,40px)" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(18px,3vw,22px)", marginBottom:"4px" }}>¿Cuál es tu temática?</h3>
          <p style={{ color:"rgba(255,255,255,0.38)", fontSize:"13px", marginBottom:"16px" }}>Elegí el nicho principal de tu producto</p>
          <div className="chip-grid">
            {nichos.map(n=>(
              <Chip key={n.id} selected={nicho===n.id} onClick={()=>setNicho(n.id)} emoji={n.emoji} label={n.label}/>
            ))}
          </div>
        </div>

        {/* FORMATO */}
        <div style={{ marginBottom:"clamp(28px,5vw,40px)" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(18px,3vw,22px)", marginBottom:"4px" }}>¿Qué formato de producto?</h3>
          <p style={{ color:"rgba(255,255,255,0.38)", fontSize:"13px", marginBottom:"16px" }}>El tipo de producto digital que querés crear</p>
          <div className="chip-grid">
            {formatos.map(f=>(
              <Chip key={f.id} selected={formato===f.id} onClick={()=>setFormato(f.id)} emoji={f.emoji} label={f.label}/>
            ))}
          </div>
        </div>

        <hr style={{ borderColor:"rgba(212,175,55,0.1)", margin:"8px 0 clamp(24px,4vw,36px)" }}/>

        {/* INPUTS */}
        <div style={{ display:"grid", gap:"clamp(16px,3vw,24px)" }}>
          <Field
            label="Tu expertise o conocimiento especial"
            value={expertise}
            onChange={setExpertise}
            placeholder="Ej: Llevo 3 años invirtiendo en cripto y sé cómo evitar las estafas más comunes en Latam..."
            rows={3}
          />
          <Field
            label="¿A quién va dirigido tu producto?"
            value={audiencia}
            onChange={setAudiencia}
            placeholder="Ej: Jóvenes de 20-35 años en Argentina y México que quieren empezar a invertir..."
            rows={2}
          />
          <Field
            label="¿Qué problema concreto resuelve?"
            value={problema}
            onChange={setProblema}
            placeholder="Ej: No saben cómo empezar sin perder sus ahorros. Tienen miedo a las estafas..."
            rows={3}
          />
        </div>

        {/* SUBMIT */}
        <div style={{ marginTop:"clamp(28px,5vw,40px)" }}>
          <button
            onClick={canSubmit ? () => onGenerate({
              nicho:    nichos.find(n=>n.id===nicho)?.label || nicho,
              formato:  formatos.find(f=>f.id===formato)?.label || formato,
              expertise, audiencia, problema,
            }) : undefined}
            style={{
              width:"100%",
              background: canSubmit ? "linear-gradient(135deg,#D4AF37,#B8860B)" : "rgba(255,255,255,0.06)",
              color: canSubmit ? "#000" : "rgba(255,255,255,0.22)",
              padding:"clamp(16px,3vw,20px)",
              borderRadius:"14px",
              fontSize:"clamp(15px,2.5vw,17px)",
              fontWeight:"700",
              cursor: canSubmit ? "pointer" : "not-allowed",
              boxShadow: canSubmit ? "0 0 40px rgba(212,175,55,0.25)" : "none",
              letterSpacing:"0.01em",
              transition:"all 0.25s",
            }}
          >
            ⚡ Generar mi Kit Completo
          </button>
          {!canSubmit && (
            <p style={{ textAlign:"center", color:"rgba(255,255,255,0.26)", fontSize:"13px", fontFamily:"'DM Mono',monospace", marginTop:"10px" }}>
              Completá todos los campos para continuar
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   PANTALLA 3 — GENERANDO
═══════════════════════════════════════ */
function PageLoading({ loadingMsg, progress }) {
  return (
    <div style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
      <GlobalStyles/>
      <Particles/>
      <Glow top="-200px" right="-200px"/>

      <div style={{ textAlign:"center", maxWidth:"400px", width:"100%", position:"relative", zIndex:1 }}>
        {/* Spinner */}
        <div style={{ width:"clamp(64px,15vw,88px)", height:"clamp(64px,15vw,88px)", margin:"0 auto 32px", position:"relative" }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(212,175,55,0.1)", borderTopColor:"#D4AF37", animation:"spin 1s linear infinite" }}/>
          <div style={{ position:"absolute", inset:"10px", borderRadius:"50%", border:"1px solid rgba(212,175,55,0.06)", borderBottomColor:"rgba(212,175,55,0.45)", animation:"spin 1.6s linear infinite reverse" }}/>
          <div style={{ position:"absolute", inset:"20px", borderRadius:"50%", background:"rgba(212,175,55,0.05)" }}/>
        </div>

        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,4vw,30px)", marginBottom:"12px" }}>Creando tu kit...</h2>
        <p style={{ color:"#D4AF37", fontSize:"clamp(12px,2vw,14px)", fontFamily:"'DM Mono',monospace", marginBottom:"36px", minHeight:"20px", letterSpacing:"0.04em", padding:"0 16px" }}>
          {loadingMsg}
        </p>

        {/* Progress */}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"100px", height:"4px", overflow:"hidden", marginBottom:"10px" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#D4AF37,#F5E17A)", width:`${progress}%`, transition:"width 1.1s ease", borderRadius:"100px" }}/>
        </div>
        <p style={{ color:"rgba(255,255,255,0.22)", fontSize:"12px", fontFamily:"'DM Mono',monospace" }}>{progress}% completado</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   PANTALLA 4 — RESULTADO
═══════════════════════════════════════ */
function PageResult({ result, onNew }) {
  const topRef = useRef(null)
  useEffect(()=>{ topRef.current?.scrollIntoView({ behavior:"smooth" }) },[])

  const allText = [
    `PRODUCTO: ${result.nombreProducto}`,
    `TAGLINE: ${result.tagline}`,
    `\nDESCRIPCIÓN:\n${result.descripcionCorta}`,
    `\nCLIENTE IDEAL:\n${result.publicoObjetivo}`,
    `\nPROPUESTA ÚNICA:\n${result.propuestaUnica}`,
    `\nBENEFICIOS:\n${result.beneficiosTop?.join("\n")}`,
    `\nPÁGINA DE VENTAS:\n${result.paginaVentas}`,
    `\nPOST INSTAGRAM 1:\n${result.postsInstagram?.[0]}`,
    `\nPOST INSTAGRAM 2:\n${result.postsInstagram?.[1]}`,
    `\nPOST INSTAGRAM 3:\n${result.postsInstagram?.[2]}`,
    `\nEMAIL BIENVENIDA:\n${result.emailBienvenida}`,
    `\nPLAN 7 DÍAS:\n${result.planLanzamiento}`,
    `\nFAQs:\n${result.faq?.map(f=>`P: ${f.pregunta}\nR: ${f.respuesta}`).join("\n\n")}`,
    `\nHASHTAGS:\n${result.hashtags}`,
  ].join("\n")

  const pad = "clamp(20px, 5vw, 40px)"

  return (
    <div style={{ minHeight:"100vh", background:"#080808" }}>
      <GlobalStyles/>
      <Glow top="-100px" right="-100px" size="400px" opacity="0.05"/>

      <div ref={topRef} style={{ maxWidth:"860px", margin:"0 auto", padding:`0 ${pad} 80px`, position:"relative", zIndex:1 }}>

        {/* NAV */}
        <nav style={{ padding:"clamp(20px,4vw,28px) 0 0", marginBottom:"clamp(32px,6vw,52px)" }}>
          <div className="result-nav" style={{ justifyContent:"space-between" }}>
            <Logo/>
            <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
              <CopyBtn text={allText} small/>
              <button onClick={onNew} style={{ background:"rgba(212,175,55,0.09)", border:"1px solid rgba(212,175,55,0.28)", color:"#D4AF37", padding:"8px 16px", borderRadius:"8px", fontSize:"13px", fontFamily:"'DM Mono',monospace" }}>
                + Nuevo kit
              </button>
            </div>
          </div>
        </nav>

        {/* HEADER DEL RESULTADO */}
        <div style={{ textAlign:"center", marginBottom:"clamp(36px,6vw,56px)", animation:"fadeUp 0.6s ease" }}>
          <div style={{ display:"inline-block", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.25)", color:"#4ADE80", padding:"5px 14px", borderRadius:"100px", fontSize:"11px", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:"20px", fontFamily:"'DM Mono',monospace" }}>
            ✓ Kit generado exitosamente
          </div>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,6vw,54px)", fontWeight:"700", marginBottom:"14px", lineHeight:"1.1" }}>
            {result.nombreProducto}
          </h1>

          <p style={{ color:"#D4AF37", fontSize:"clamp(15px,2.5vw,19px)", fontStyle:"italic", fontFamily:"'Playfair Display',serif", marginBottom:"24px", padding:"0 8px" }}>
            "{result.tagline}"
          </p>

          {/* Precios */}
          <div className="price-row">
            <div style={{ background:"rgba(212,175,55,0.09)", border:"1px solid rgba(212,175,55,0.28)", borderRadius:"12px", padding:"14px clamp(18px,4vw,28px)", textAlign:"center", minWidth:"140px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,4vw,28px)", color:"#D4AF37", fontWeight:"700" }}>{result.precio?.usd} USD</div>
              <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"11px", fontFamily:"'DM Mono',monospace" }}>Internacional</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"14px clamp(18px,4vw,28px)", textAlign:"center", minWidth:"140px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,4vw,28px)", color:"rgba(255,255,255,0.85)", fontWeight:"700" }}>{result.precio?.ars} ARS</div>
              <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"11px", fontFamily:"'DM Mono',monospace" }}>Mercado local</div>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"13px", fontStyle:"italic", marginTop:"10px", padding:"0 12px" }}>{result.precio?.justificacion}</p>
        </div>

        {/* CARDS */}
        <ResultCard title="Descripción del Producto" icon="📦" content={result.descripcionCorta} delay={80}>
          <p>{result.descripcionCorta}</p>
        </ResultCard>

        <ResultCard title="Tu Cliente Ideal" icon="🎯" content={result.publicoObjetivo} delay={140}>
          <p>{result.publicoObjetivo}</p>
        </ResultCard>

        <ResultCard title="Propuesta Única de Valor" icon="💎" content={result.propuestaUnica} delay={200}>
          <p style={{ color:"#D4AF37" }}>{result.propuestaUnica}</p>
        </ResultCard>

        <ResultCard title="Top 5 Beneficios" icon="⚡" content={result.beneficiosTop?.join("\n")} delay={260}>
          <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:"10px" }}>
            {result.beneficiosTop?.map((b,i)=>(
              <li key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
                <span style={{ color:"#D4AF37", fontWeight:"700", minWidth:"22px", fontFamily:"'DM Mono',monospace", fontSize:"13px", flexShrink:0 }}>0{i+1}</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard title="Página de Ventas Completa" icon="📝" content={result.paginaVentas} delay={320}>
          <pre style={{ whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(13px,2vw,15px)", lineHeight:"1.8" }}>{result.paginaVentas}</pre>
        </ResultCard>

        <ResultCard title="Post Instagram — El Problema" icon="📱" content={result.postsInstagram?.[0]} delay={380}>
          <pre style={{ whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.8", fontSize:"clamp(13px,2vw,15px)" }}>{result.postsInstagram?.[0]}</pre>
        </ResultCard>

        <ResultCard title="Post Instagram — La Transformación" icon="📱" content={result.postsInstagram?.[1]} delay={440}>
          <pre style={{ whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.8", fontSize:"clamp(13px,2vw,15px)" }}>{result.postsInstagram?.[1]}</pre>
        </ResultCard>

        <ResultCard title="Post Instagram — Social Proof" icon="📱" content={result.postsInstagram?.[2]} delay={500}>
          <pre style={{ whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.8", fontSize:"clamp(13px,2vw,15px)" }}>{result.postsInstagram?.[2]}</pre>
        </ResultCard>

        <ResultCard title="Email de Bienvenida Post-Compra" icon="📧" content={result.emailBienvenida} delay={560}>
          <pre style={{ whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.8", fontSize:"clamp(13px,2vw,15px)" }}>{result.emailBienvenida}</pre>
        </ResultCard>

        <ResultCard title="Plan de Lanzamiento — 7 Días" icon="📅" content={result.planLanzamiento} delay={620}>
          <pre style={{ whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", lineHeight:"1.8", fontSize:"clamp(13px,2vw,15px)" }}>{result.planLanzamiento}</pre>
        </ResultCard>

        <ResultCard title="Preguntas Frecuentes" icon="❓" content={result.faq?.map(f=>`P: ${f.pregunta}\nR: ${f.respuesta}`).join("\n\n")} delay={680}>
          <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
            {result.faq?.map((faq,i)=>(
              <div key={i} style={{ borderLeft:"2px solid rgba(212,175,55,0.25)", paddingLeft:"16px" }}>
                <div style={{ color:"#D4AF37", fontWeight:"600", marginBottom:"6px", fontSize:"clamp(13px,2vw,15px)" }}>❓ {faq.pregunta}</div>
                <div style={{ color:"rgba(255,255,255,0.72)", fontSize:"clamp(13px,2vw,15px)" }}>{faq.respuesta}</div>
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="Hashtags Estratégicos" icon="#️⃣" content={result.hashtags} delay={740}>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"clamp(11px,1.8vw,13px)", lineHeight:"2.2", color:"rgba(212,175,55,0.8)", wordBreak:"break-word" }}>{result.hashtags}</p>
        </ResultCard>

        {/* CTA FINAL */}
        <div style={{ marginTop:"48px", padding:"clamp(32px,6vw,52px) clamp(20px,5vw,40px)", background:"rgba(212,175,55,0.03)", border:"1px solid rgba(212,175,55,0.13)", borderRadius:"20px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)" }}/>
          <p style={{ color:"#D4AF37", fontSize:"11px", letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:"16px" }}>🚀 SIGUIENTE PASO</p>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,4vw,30px)", marginBottom:"12px" }}>¿Listo para publicar en Hotmart?</h3>
          <p style={{ color:"rgba(255,255,255,0.42)", marginBottom:"28px", fontSize:"clamp(14px,2vw,15px)" }}>Ya tenés todo el material. Subí el producto y lanzá esta semana.</p>
          <button onClick={onNew} style={{ background:"linear-gradient(135deg,#D4AF37,#B8860B)", color:"#000", padding:"clamp(14px,3vw,18px) clamp(28px,5vw,40px)", borderRadius:"14px", fontSize:"clamp(14px,2.5vw,16px)", fontWeight:"700", boxShadow:"0 0 36px rgba(212,175,55,0.25)", width:"100%", maxWidth:"300px" }}>
            Generar otro producto →
          </button>
        </div>

      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   APP PRINCIPAL
═══════════════════════════════════════ */
export default function App() {
  const [screen,    setScreen]    = useState("inicio")
  const [result,    setResult]    = useState(null)
  const [error,     setError]     = useState(null)
  const [loadingMsg, setLoadingMsg] = useState(loadingMsgs[0])
  const [progress,  setProgress]  = useState(0)

  const handleGenerate = async (formData) => {
    setScreen("loading")
    setError(null)
    setProgress(0)

    let msgIdx = 0
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMsgs.length
      setLoadingMsg(loadingMsgs[msgIdx])
      setProgress(p => Math.min(p + 11, 90))
    }, 1200)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Error ${response.status}`)
      }

      const data = await response.json()
      clearInterval(msgInterval)
      setProgress(100)

      setTimeout(() => {
        setResult(data)
        setScreen("result")
      }, 500)

    } catch (err) {
      clearInterval(msgInterval)
      setError(err.message || "Error al generar el kit. Intentá de nuevo.")
      setScreen("form")
    }
  }

  if (screen === "inicio")  return <PageInicio onStart={()=>setScreen("form")}/>
  if (screen === "form")    return <PageForm onGenerate={handleGenerate} onBack={()=>setScreen("inicio")} error={error}/>
  if (screen === "loading") return <PageLoading loadingMsg={loadingMsg} progress={progress}/>
  if (screen === "result" && result) return <PageResult result={result} onNew={()=>{ setResult(null); setScreen("form") }}/>
  return null
}
