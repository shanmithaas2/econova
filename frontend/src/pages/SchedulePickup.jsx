import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const API = "https://econova-backend-qg2j.onrender.com"

export default function SchedulePickup() {
  const [form, setForm] = useState({ wasteType: "", quantity: "", location: "", date: "", notes: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pickups, setPickups] = useState([])
  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    fetchPickups()
  }, [])

  const fetchPickups = async () => {
    try {
      const res = await axios.get(`${API}/pickup/my-pickups`, { headers })
      setPickups(res.data)
    } catch (err) {
      console.error("Error fetching pickups:", err)
    }
  }

  const handleSubmit = async () => {
    if (!form.wasteType || !form.location || !form.date) return
    setLoading(true)
    try {
      await axios.post(
        `${API}/pickup/schedule`,
        {
          waste_type: form.wasteType,
          quantity_kg: parseFloat(form.quantity) || 1,
          location: form.location,
          preferred_date: form.date,
          notes: form.notes
        },
        { headers }
      )
      setSubmitted(true)
      setForm({ wasteType: "", quantity: "", location: "", date: "", notes: "" })
      fetchPickups()
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error("Error scheduling pickup:", err)
    }
    setLoading(false)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="Schedule Waste Pickup" subtitle="Request a pickup at your convenience" />
        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* Form */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#0a1f12" }}>
                New Pickup Request
              </h3>

              {submitted && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                  Pickup scheduled successfully! +10 points added.
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Waste Type</label>
                <select value={form.wasteType} onChange={e => setForm({ ...form, wasteType: e.target.value })} className="eco-input">
                  <option value="">Select waste type</option>
                  {["Plastic", "Glass", "Paper", "Metal", "Food Waste", "E-Waste", "Battery", "Clothes", "Medical Waste"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Quantity (kg)</label>
                <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                  placeholder="Approximate weight" className="eco-input" min="0.1" step="0.1" />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Pickup Location</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="Your full address" className="eco-input" />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Preferred Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="eco-input" />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Additional Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any special instructions..." className="eco-input" rows={3} style={{ resize: "vertical" }} />
              </div>

              <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: "100%" }}>
                {loading ? "Scheduling..." : "Schedule Pickup"}
              </button>
            </div>

            {/* History */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0a1f12" }}>
                My Pickup History
              </h3>

              {pickups.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🚛</div>
                  <div style={{ fontSize: 13 }}>No pickups scheduled yet</div>
                </div>
              ) : (
                pickups.map((p, i) => (
                  <div key={i} style={{ padding: "14px", borderRadius: 10, border: "1px solid #f3f4f6", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontFamily: "Syne", fontWeight: 700, color: "#0891b2", fontSize: 13 }}>#{p.id}</span>
                      <span className={`badge ${p.status === "Completed" ? "badge-green" : p.status === "Assigned" ? "badge-blue" : "badge-yellow"}`}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.waste_type} — {p.quantity_kg} kg</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{p.location}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{formatDate(p.preferred_date)}</div>
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