import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return }
    setLoading(true); setError("")
    try {
      const res = await axios.post("https://econova-backend-qg2j.onrender.com/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("name", res.data.name)
      localStorage.setItem("user_id", res.data.user_id)
      const role = res.data.role
      if (role === "citizen") navigate("/citizen-dashboard")
      else if (role === "admin") navigate("/admin-dashboard")
      else if (role === "municipal") navigate("/municipal-dashboard")
      else if (role === "recycler") navigate("/recycler-dashboard")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "linear-gradient(135deg, #0a1f12 0%, #0f2d1a 50%, #0a1f12 100%)"
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "60px",
        borderRight: "1px solid rgba(22,163,74,0.15)"
      }}>
        <div className="animate-slideInLeft">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #16a34a, #059669)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
            }}>🌿</div>
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 22, color: "white" }}>EcoNova</span>
          </div>

          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 40, color: "white", marginBottom: 12, lineHeight: 1.2 }}>
            Welcome<br />
            <span style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              back 👋
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 48, lineHeight: 1.6 }}>
            Log in to your EcoNova account to continue managing waste and building a greener city.
          </p>

          {/* Feature highlights */}
          {["Track your recycling impact in real-time", "Earn rewards for responsible disposal", "Connect with your municipal services"].map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "rgba(22,163,74,0.2)", border: "1px solid rgba(22,163,74,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0
              }}>✓</div>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{
        width: 480, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "48px"
      }}>
        <div className="animate-fadeInUp" style={{ width: "100%" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(22,163,74,0.2)",
            borderRadius: 20, padding: "40px"
          }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 24, color: "white", marginBottom: 6 }}>
              Sign in
            </h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>
              Enter your credentials to access your dashboard
            </p>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8, padding: "10px 14px", marginBottom: 20,
                color: "#fca5a5", fontSize: 13
              }}>{error}</div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "white", fontSize: 14,
                  outline: "none", fontFamily: "DM Sans",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#16a34a"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "white", fontSize: 14,
                  outline: "none", fontFamily: "DM Sans",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#16a34a"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <button
              onClick={handleLogin} disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "rgba(22,163,74,0.5)" : "linear-gradient(135deg, #16a34a, #15803d)",
                border: "none", borderRadius: 10, color: "white",
                fontSize: 15, fontFamily: "Syne", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                transition: "all 0.2s"
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              Don't have an account?{" "}
              <a href="/register" style={{ color: "#4ade80", fontWeight: 600, textDecoration: "none" }}>
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
