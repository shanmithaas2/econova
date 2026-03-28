import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "citizen" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const roles = [
    { value: "citizen", label: "Citizen", icon: "👤", desc: "Report waste, earn rewards" },
    { value: "municipal", label: "Municipal Staff", icon: "🏙️", desc: "Manage pickups & routes" },
    { value: "recycler", label: "Recycler", icon: "♻️", desc: "Process recyclables" },
    { value: "admin", label: "Admin", icon: "⚙️", desc: "Full platform access" },
  ]

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields"); return }
    setLoading(true); setError("")
    try {
      await axios.post("http://localhost:8000/auth/register", form)
      setSuccess("Account created! Redirecting to login...")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setError("Registration failed. Email may already be in use.")
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0a1f12 0%, #0f2d1a 50%, #0a1f12 100%)",
      padding: "40px 20px"
    }}>
      <div className="animate-fadeInUp" style={{ width: "100%", maxWidth: 520 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #16a34a, #059669)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
            }}>🌿</div>
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 22, color: "white" }}>EcoNova</span>
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(22,163,74,0.2)",
          borderRadius: 20, padding: "40px"
        }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 24, color: "white", marginBottom: 6 }}>
            Create your account
          </h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>
            Join thousands of citizens building a greener city
          </p>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: "#fca5a5", fontSize: 13
            }}>{error}</div>
          )}
          {success && (
            <div style={{
              background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: "#4ade80", fontSize: 13
            }}>{success}</div>
          )}

          {/* Input fields */}
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
            { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", key: "password", type: "password", placeholder: "Min. 8 characters" },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                {field.label}
              </label>
              <input
                type={field.type} placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "white", fontSize: 14,
                  outline: "none", fontFamily: "DM Sans", transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#16a34a"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
          ))}

          {/* Role selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 10 }}>
              Select Your Role
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {roles.map(r => (
                <div key={r.value}
                  onClick={() => setForm({ ...form, role: r.value })}
                  style={{
                    padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                    border: form.role === r.value ? "2px solid #16a34a" : "1px solid rgba(255,255,255,0.1)",
                    background: form.role === r.value ? "rgba(22,163,74,0.15)" : "rgba(255,255,255,0.03)",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: form.role === r.value ? "#4ade80" : "rgba(255,255,255,0.7)" }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleRegister} disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: loading ? "rgba(22,163,74,0.5)" : "linear-gradient(135deg, #16a34a, #15803d)",
              border: "none", borderRadius: 10, color: "white",
              fontSize: 15, fontFamily: "Syne", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(22,163,74,0.35)"
            }}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#4ade80", fontWeight: 600, textDecoration: "none" }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
