import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const API = "http://localhost:8000"

export default function Complaints() {
  const [form, setForm] = useState({ description: "", location: "", type: "Overflow" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [complaints, setComplaints] = useState([])
  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API}/complaints/my-complaints`, { headers })
      setComplaints(res.data)
    } catch (err) {
      console.error("Error fetching complaints:", err)
    }
  }

  const handleSubmit = async () => {
    if (!form.description || !form.location) return
    setLoading(true)
    try {
      await axios.post(
        `${API}/complaints/submit`,
        {
          complaint_type: form.type,
          description: form.description,
          location: form.location
        },
        { headers }
      )
      setSubmitted(true)
      setForm({ description: "", location: "", type: "Overflow" })
      fetchComplaints()
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error("Error submitting complaint:", err)
    }
    setLoading(false)
  }

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor(diff / 3600000)
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return "Just now"
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="Complaints" subtitle="Report waste management issues in your area" />
        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* Form */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#0a1f12" }}>
                Lodge a Complaint
              </h3>

              {submitted && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                  Complaint submitted! We will respond within 24 hours.
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Complaint Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="eco-input">
                  {["Overflow", "Missed Pickup", "Improper Disposal", "Bin Damage", "Other"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Location</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="Where is the issue?" className="eco-input" />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the issue in detail..." className="eco-input" rows={4} style={{ resize: "vertical" }} />
              </div>

              <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: "100%" }}>
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>

            {/* History */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0a1f12" }}>
                My Complaints
              </h3>

              {complaints.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
                  <div style={{ fontSize: 13 }}>No complaints submitted yet</div>
                </div>
              ) : (
                complaints.map((c, i) => (
                  <div key={i} style={{ padding: "14px", borderRadius: 10, border: "1px solid #f3f4f6", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontFamily: "Syne", fontWeight: 700, color: "#e11d48", fontSize: 13 }}>#{c.id}</span>
                      <span className={`badge ${c.status === "Resolved" ? "badge-green" : c.status === "In Progress" ? "badge-blue" : "badge-yellow"}`}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.description}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{c.location}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{getTimeAgo(c.created_at)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}