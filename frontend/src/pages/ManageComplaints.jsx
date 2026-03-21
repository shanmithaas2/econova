import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const API = "https://econova-backend-qg2j.onrender.com"

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchComplaints() }, [])

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API}/complaints/all`)
      setComplaints(res.data)
    } catch (err) {
      console.error("Error:", err)
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/complaints/update-status/${id}?status=${status}`)
      setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c))
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="Manage Complaints" subtitle="Review and resolve citizen complaints" />
        <div style={{ padding: "28px 32px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Open",        value: complaints.filter(c => c.status === "Open").length,        color: "#f59e0b" },
              { label: "In Progress", value: complaints.filter(c => c.status === "In Progress").length, color: "#2563eb" },
              { label: "Resolved",    value: complaints.filter(c => c.status === "Resolved").length,    color: "#16a34a" },
            ].map((s, i) => (
              <div key={i} className="section-card" style={{ textAlign: "center", padding: "16px" }}>
                <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="section-card">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading complaints...</div>
            ) : complaints.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
                <div>No complaints submitted yet</div>
              </div>
            ) : (
              <table className="eco-table">
                <thead>
                  <tr><th>ID</th><th>Description</th><th>Location</th><th>Date</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {complaints.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: "#e11d48" }}>#{c.id}</td>
                      <td style={{ fontSize: 12, color: "#374151", maxWidth: 200 }}>{c.description}</td>
                      <td style={{ fontSize: 12, color: "#6b7280" }}>{c.location}</td>
                      <td style={{ color: "#6b7280", fontSize: 12 }}>
                        {new Date(c.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        <span className={`badge ${c.status === "Resolved" ? "badge-green" : c.status === "In Progress" ? "badge-blue" : "badge-yellow"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ display: "flex", gap: 6 }}>
                        {c.status === "Open" && (
                          <button onClick={() => updateStatus(c.id, "In Progress")}
                            style={{ background: "#2563eb", color: "white", border: "none", padding: "5px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
                            Progress
                          </button>
                        )}
                        {c.status !== "Resolved" && (
                          <button onClick={() => updateStatus(c.id, "Resolved")}
                            style={{ background: "#16a34a", color: "white", border: "none", padding: "5px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}