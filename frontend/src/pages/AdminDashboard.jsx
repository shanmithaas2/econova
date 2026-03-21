import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import StatCard from "../components/StatCard"
import PageHeader from "../components/PageHeader"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const API = "https://econova-backend-qg2j.onrender.com"

const monthlyUsers = [
  { month: "Jul", users: 320 }, { month: "Aug", users: 480 },
  { month: "Sep", users: 620 }, { month: "Oct", users: 890 },
  { month: "Nov", users: 1200 }, { month: "Dec", users: 1580 },
]

const wasteBreakdown = [
  { name: "Recyclable", value: 45, color: "#16a34a" },
  { name: "Organic",    value: 30, color: "#f59e0b" },
  { name: "Hazardous",  value: 15, color: "#e11d48" },
  { name: "General",    value: 10, color: "#6b7280" },
]

const roleColors = { Citizen: "badge-green", Recycler: "badge-blue", Municipal: "badge-yellow", Admin: "badge-red" }

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_reports: 0, total_pickups: 0, total_complaints: 0 })
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/dashboard/admin`)
        setStats({
          total_users: res.data.total_users,
          total_reports: res.data.total_reports,
          total_pickups: res.data.total_pickups,
          total_complaints: res.data.total_complaints
        })
        setRecentUsers(res.data.recent_users || [])
      } catch (err) {
        console.error("Admin dashboard error:", err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    return `${days} days ago`
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="Administrator Dashboard" subtitle="Full platform overview and management" />
        <div style={{ padding: "28px 32px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
            <StatCard title="Total Users"       value={loading ? "..." : stats.total_users}      icon="👥" gradient="purple"  delay={0}   />
            <StatCard title="Waste Reports"     value={loading ? "..." : stats.total_reports}    icon="♻️" gradient="green"   delay={100} />
            <StatCard title="Pickup Requests"   value={loading ? "..." : stats.total_pickups}    icon="🚛" gradient="teal"    delay={200} />
            <StatCard title="Open Complaints"   value={loading ? "..." : stats.total_complaints} icon="📋" gradient="amber"   delay={300} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#0a1f12" }}>
                User Growth (Last 6 Months)
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyUsers}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontFamily: "DM Sans" }} />
                  <Line type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={3} dot={{ fill: "#16a34a", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#0a1f12" }}>
                Waste Breakdown
              </h3>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <PieChart width={180} height={180}>
                  <Pie data={wasteBreakdown} cx={85} cy={85} innerRadius={50} outerRadius={80} dataKey="value">
                    {wasteBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
              <div style={{ marginTop: 8 }}>
                {wasteBreakdown.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
                    <span style={{ fontSize: 12, color: "#6b7280", flex: 1 }}>{item.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="section-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: "#0a1f12" }}>
                Recently Registered Users
              </h3>
              <a href="/manage-users" style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, textDecoration: "none", background: "#f0fdf4", padding: "6px 14px", borderRadius: 8 }}>
                View All
              </a>
            </div>
            {recentUsers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", color: "#9ca3af" }}>No users yet</div>
            ) : (
              <table className="eco-table">
                <thead>
                  <tr><th>Name</th><th>Role</th><th>Email</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {recentUsers.map((u, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td><span className={`badge ${roleColors[u.role] || "badge-green"}`}>{u.role}</span></td>
                      <td style={{ color: "#6b7280" }}>{u.email}</td>
                      <td style={{ color: "#6b7280" }}>{getTimeAgo(u.created_at)}</td>
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