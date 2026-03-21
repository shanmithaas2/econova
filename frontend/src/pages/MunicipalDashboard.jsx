import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import StatCard from "../components/StatCard"
import PageHeader from "../components/PageHeader"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const API = "https://econova-backend-qg2j.onrender.com"

const pickupData = [
  { area: "RS Puram",     count: 24 },
  { area: "Gandhipuram",  count: 18 },
  { area: "Peelamedu",    count: 32 },
  { area: "Saibaba",      count: 15 },
  { area: "Singanallur",  count: 28 },
]

export default function MunicipalDashboard() {
  const [stats, setStats] = useState({ pending_pickups: 0, active_pickups: 0, completed_pickups: 0, pending_complaints: 0 })
  const [recentPickups, setRecentPickups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, pickupRes] = await Promise.all([
          axios.get(`${API}/dashboard/municipal`),
          axios.get(`${API}/pickup/all`)
        ])
        setStats(dashRes.data)
        setRecentPickups(pickupRes.data.slice(0, 5))
      } catch (err) {
        console.error("Municipal dashboard error:", err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/pickup/update-status/${id}?status=${status}`)
      setRecentPickups(recentPickups.map(p => p.id === id ? { ...p, status } : p))
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader
          title="Municipal Authority Dashboard"
          subtitle="Real-time waste collection operations"
          action={
            <a href="/route-optimizer" style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              color: "white", padding: "10px 20px", borderRadius: 10,
              textDecoration: "none", fontSize: 13, fontFamily: "Syne", fontWeight: 700,
              boxShadow: "0 4px 12px rgba(22,163,74,0.3)"
            }}>Optimize Routes</a>
          }
        />
        <div style={{ padding: "28px 32px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
            <StatCard title="Pending Pickups"   value={loading ? "..." : stats.pending_pickups}    icon="⏳" gradient="amber"   delay={0}   />
            <StatCard title="Active Pickups"    value={loading ? "..." : stats.active_pickups}     icon="🚛" gradient="teal"    delay={100} />
            <StatCard title="Completed Today"   value={loading ? "..." : stats.completed_pickups}  icon="✅" gradient="green"   delay={200} />
            <StatCard title="Open Complaints"   value={loading ? "..." : stats.pending_complaints} icon="📋" gradient="rose"    delay={300} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#0a1f12" }}>
                Pickups by Area Today
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={pickupData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="area" type="category" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontFamily: "DM Sans" }} />
                  <Bar dataKey="count" fill="#0891b2" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#0a1f12" }}>
                Quick Stats
              </h3>
              {[
                { label: "Total Requests",  value: stats.pending_pickups + stats.active_pickups + stats.completed_pickups, icon: "📦" },
                { label: "Completion Rate", value: stats.completed_pickups > 0 ? `${Math.round((stats.completed_pickups / (stats.pending_pickups + stats.active_pickups + stats.completed_pickups)) * 100)}%` : "0%", icon: "📊" },
                { label: "Open Complaints", value: stats.pending_complaints, icon: "📋" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: i < 2 ? "1px solid #f3f4f6" : "none" }}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.label}</div>
                    <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, color: "#0a1f12" }}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: "#0a1f12" }}>
                Recent Pickup Requests
              </h3>
              <a href="/manage-pickups" style={{ fontSize: 13, color: "#0891b2", fontWeight: 600, textDecoration: "none", background: "#e0f2fe", padding: "6px 14px", borderRadius: 8 }}>
                Manage All
              </a>
            </div>
            {recentPickups.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", color: "#9ca3af" }}>No pickup requests yet</div>
            ) : (
              <table className="eco-table">
                <thead>
                  <tr><th>ID</th><th>Location</th><th>Waste Type</th><th>Date</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {recentPickups.map((p, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: "#0891b2" }}>#{p.id}</td>
                      <td style={{ fontSize: 12, color: "#6b7280" }}>{p.location}</td>
                      <td><span className="badge badge-green">{p.waste_type}</span></td>
                      <td style={{ color: "#6b7280", fontSize: 12 }}>{p.preferred_date}</td>
                      <td><span className={`badge ${p.status === "Completed" ? "badge-green" : p.status === "Assigned" ? "badge-blue" : "badge-yellow"}`}>{p.status}</span></td>
                      <td style={{ display: "flex", gap: 6 }}>
                        {p.status === "Pending" && (
                          <button onClick={() => updateStatus(p.id, "Assigned")} style={{ background: "#2563eb", color: "white", border: "none", padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Assign</button>
                        )}
                        {p.status === "Assigned" && (
                          <button onClick={() => updateStatus(p.id, "Completed")} style={{ background: "#16a34a", color: "white", border: "none", padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Complete</button>
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