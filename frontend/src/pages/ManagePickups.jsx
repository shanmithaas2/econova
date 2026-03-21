import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const API = "http://localhost:8000"

export default function ManagePickups() {
  const [pickups, setPickups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPickups() }, [])

  const fetchPickups = async () => {
    try {
      const res = await axios.get(`${API}/pickup/all`)
      setPickups(res.data)
    } catch (err) {
      console.error("Error:", err)
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/pickup/update-status/${id}?status=${status}`)
      setPickups(pickups.map(p => p.id === id ? { ...p, status } : p))
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  const counts = {
    total: pickups.length,
    pending: pickups.filter(p => p.status === "Pending").length,
    assigned: pickups.filter(p => p.status === "Assigned").length,
    completed: pickups.filter(p => p.status === "Completed").length,
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="Manage Pickups" subtitle="View and update all pickup requests" />
        <div style={{ padding: "28px 32px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Total",     value: counts.total,     color: "#6b7280" },
              { label: "Pending",   value: counts.pending,   color: "#f59e0b" },
              { label: "Assigned",  value: counts.assigned,  color: "#2563eb" },
              { label: "Completed", value: counts.completed, color: "#16a34a" },
            ].map((s, i) => (
              <div key={i} className="section-card" style={{ textAlign: "center", padding: "16px" }}>
                <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="section-card">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading pickups...</div>
            ) : pickups.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🚛</div>
                <div>No pickup requests yet</div>
              </div>
            ) : (
              <table className="eco-table">
                <thead>
                  <tr><th>ID</th><th>Location</th><th>Waste Type</th><th>Qty</th><th>Date</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {pickups.map((p, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: "#0891b2" }}>#{p.id}</td>
                      <td style={{ fontSize: 12, color: "#6b7280" }}>{p.location}</td>
                      <td><span className="badge badge-green">{p.waste_type}</span></td>
                      <td>{p.quantity_kg} kg</td>
                      <td style={{ color: "#6b7280", fontSize: 12 }}>{p.preferred_date}</td>
                      <td>
                        <span className={`badge ${p.status === "Completed" ? "badge-green" : p.status === "Assigned" ? "badge-blue" : "badge-yellow"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ display: "flex", gap: 6 }}>
                        {p.status === "Pending" && (
                          <button onClick={() => updateStatus(p.id, "Assigned")}
                            style={{ background: "#2563eb", color: "white", border: "none", padding: "5px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
                            Assign
                          </button>
                        )}
                        {p.status === "Assigned" && (
                          <button onClick={() => updateStatus(p.id, "Completed")}
                            style={{ background: "#16a34a", color: "white", border: "none", padding: "5px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
                            Complete
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