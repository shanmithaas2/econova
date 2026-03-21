import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const API = "https://econova-backend-qg2j.onrender.com"

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/dashboard/admin`)
      setUsers(res.data.recent_users || [])
    } catch (err) {
      console.error("Error fetching users:", err)
    }
    setLoading(false)
  }

  const roleColors = {
    citizen: "badge-green",
    recycler: "badge-blue",
    municipal: "badge-yellow",
    admin: "badge-red"
  }

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    return `${days} days ago`
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    total: users.length,
    citizens: users.filter(u => u.role === "citizen").length,
    municipal: users.filter(u => u.role === "municipal").length,
    recyclers: users.filter(u => u.role === "recycler").length,
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="Manage Users" subtitle="All registered platform users" />
        <div style={{ padding: "28px 32px" }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Total Users",    value: counts.total,    color: "#16a34a" },
              { label: "Citizens",       value: counts.citizens,  color: "#059669" },
              { label: "Municipal",      value: counts.municipal, color: "#0891b2" },
              { label: "Recyclers",      value: counts.recyclers, color: "#d97706" },
            ].map((s, i) => (
              <div key={i} className="section-card" style={{ textAlign: "center", padding: "16px" }}>
                <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32, color: s.color }}>
                  {loading ? "..." : s.value}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="section-card">
            {/* Search bar */}
            <div style={{ marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Search by name, email or role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="eco-input"
                style={{ maxWidth: 360 }}
              />
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                Loading users...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>👥</div>
                <div>{search ? "No users match your search" : "No users registered yet"}</div>
              </div>
            ) : (
              <table className="eco-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={i}>
                      <td style={{ color: "#9ca3af" }}>{u.id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "linear-gradient(135deg, #16a34a, #059669)",
                            color: "white", display: "flex", alignItems: "center",
                            justifyContent: "center", fontFamily: "Syne",
                            fontWeight: 700, fontSize: 13, flexShrink: 0
                          }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color: "#6b7280", fontSize: 13 }}>{u.email}</td>
                      <td>
                        <span className={`badge ${roleColors[u.role] || "badge-green"}`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td style={{ color: "#6b7280", fontSize: 13 }}>{getTimeAgo(u.created_at)}</td>
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
