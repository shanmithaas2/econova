import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  const features = [
    { icon: "♻️", title: "Smart Waste Reporting", desc: "Report and classify your waste with instant disposal guidance and eco tips." },
    { icon: "🚛", title: "Pickup Scheduling", desc: "Schedule waste pickups at your convenience with real-time status tracking." },
    { icon: "🗺️", title: "ML Route Optimization", desc: "AI-powered route planning minimizes travel distance for collection vehicles." },
    { icon: "🌿", title: "Carbon Calculator", desc: "Track your environmental impact and see how much CO₂ you've helped save." },
    { icon: "🏆", title: "Rewards System", desc: "Earn points for responsible waste disposal and climb the leaderboard." },
    { icon: "📍", title: "Recycling Locator", desc: "Find certified recycling centers and drop-off points near you instantly." },
  ]

  const stats = [
    { value: "50K+", label: "Active Citizens" },
    { value: "2.3T", label: "CO₂ Saved (kg)" },
    { value: "98%", label: "Pickup Accuracy" },
    { value: "120+", label: "Recycling Centers" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#0a1f12", color: "white", fontFamily: "DM Sans, sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 60px", position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,31,18,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(22,163,74,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: "linear-gradient(135deg, #16a34a, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
          }}>🌿</div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20 }}>EcoNova</span>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
          <a href="#features" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Features</a>
          <a href="#stats" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Impact</a>
          <a href="#about" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>About</a>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/login")} style={{
            padding: "9px 20px", borderRadius: 8, border: "1px solid rgba(22,163,74,0.5)",
            background: "transparent", color: "#4ade80", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>Login</button>
          <button onClick={() => navigate("/register")} style={{
            padding: "9px 20px", borderRadius: 8,
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(22,163,74,0.4)"
          }}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "100px 60px 80px", textAlign: "center", position: "relative" }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400,
          background: "radial-gradient(ellipse, rgba(22,163,74,0.15) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div className="animate-fadeInUp" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)",
          borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#4ade80",
          marginBottom: 28, fontWeight: 500
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse-green 2s infinite" }} />
          Smart Waste Management Platform
        </div>

        <h1 className="animate-fadeInUp delay-100" style={{
          fontFamily: "Syne", fontWeight: 800,
          fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1.1,
          marginBottom: 24, position: "relative", zIndex: 1
        }}>
          Transform Waste<br />
          <span style={{ background: "linear-gradient(135deg, #4ade80, #16a34a, #059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            into Opportunity
          </span>
        </h1>

        <p className="animate-fadeInUp delay-200" style={{
          fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 560,
          margin: "0 auto 40px", lineHeight: 1.7
        }}>
          Join EcoNova's intelligent ecosystem where waste management meets innovation,
          community engagement, and environmental responsibility.
        </p>

        <div className="animate-fadeInUp delay-300" style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button onClick={() => navigate("/register")} style={{
            padding: "14px 32px", borderRadius: 10,
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            border: "none", color: "white", fontSize: 15, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 8px 24px rgba(22,163,74,0.4)",
            fontFamily: "Syne", transition: "all 0.2s"
          }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            🌿 Start Your Journey
          </button>
          <button onClick={() => navigate("/login")} style={{
            padding: "14px 32px", borderRadius: 10,
            background: "transparent",
            border: "2px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
            fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Syne",
            transition: "all 0.2s"
          }}
            onMouseOver={e => e.currentTarget.style.borderColor = "rgba(22,163,74,0.6)"}
            onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
          >
            Login to Dashboard
          </button>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" style={{ padding: "40px 60px 80px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
          background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)",
          borderRadius: 16, overflow: "hidden"
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: "32px 24px", textAlign: "center",
              borderRight: i < 3 ? "1px solid rgba(22,163,74,0.15)" : "none"
            }}>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 36, color: "#4ade80" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "40px 60px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 40, marginBottom: 14 }}>
            Everything you need to manage waste
            <span style={{ color: "#4ade80" }}> smarter</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>
            A complete platform for citizens, municipalities, and recyclers
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(22,163,74,0.15)",
              borderRadius: 16, padding: "28px 24px",
              transition: "all 0.3s", cursor: "default"
            }}
              onMouseOver={e => {
                e.currentTarget.style.background = "rgba(22,163,74,0.08)"
                e.currentTarget.style.borderColor = "rgba(22,163,74,0.4)"
                e.currentTarget.style.transform = "translateY(-4px)"
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)"
                e.currentTarget.style.borderColor = "rgba(22,163,74,0.15)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17, marginBottom: 10, color: "white" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section id="about" style={{ padding: "40px 60px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 36, marginBottom: 12 }}>Built for everyone</h2>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Four dedicated dashboards for every stakeholder</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { icon: "👤", role: "Citizen", color: "#16a34a", desc: "Report waste, schedule pickups, earn rewards" },
            { icon: "⚙️", role: "Admin", color: "#7c3aed", desc: "Manage users and monitor platform health" },
            { icon: "🏙️", role: "Municipal", color: "#0891b2", desc: "Manage pickups, complaints & routes" },
            { icon: "♻️", role: "Recycler", color: "#d97706", desc: "Process materials and track routes" },
          ].map((r, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${r.color}33`,
              borderRadius: 14, padding: "24px 20px", textAlign: "center"
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{r.icon}</div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, color: r.color, marginBottom: 8 }}>{r.role}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "32px 60px",
        borderTop: "1px solid rgba(22,163,74,0.15)",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🌿</span>
          <span style={{ fontFamily: "Syne", fontWeight: 700 }}>EcoNova</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          © 2024 EcoNova Solutions. PSG College of Technology.
        </div>
      </footer>
    </div>
  )
}
