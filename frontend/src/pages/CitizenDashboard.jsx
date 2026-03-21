import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import StatCard from "../components/StatCard"
import PageHeader from "../components/PageHeader"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const API = "https://econova-backend-qg2j.onrender.com"

const weeklyData = [
  { day: "Mon", kg: 2.4 }, { day: "Tue", kg: 1.8 }, { day: "Wed", kg: 3.2 },
  { day: "Thu", kg: 2.1 }, { day: "Fri", kg: 4.5 }, { day: "Sat", kg: 3.8 }, { day: "Sun", kg: 1.2 },
]

const actionIcons = {
  waste_report: "♻️",
  pickup_scheduled: "🚛",
  complaint_submitted: "📋",
  default: "🌿"
}

export default function CitizenDashboard() {
  const name = localStorage.getItem("name") || "Citizen"
  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const [stats, setStats] = useState({
    waste_recycled: 0, carbon_saved: 0,
    reward_points: 0, eco_score: 0
  })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const quickActions = [
    { icon: "♻️", label: "Report Waste",      path: "/report-waste",       color: "#16a34a" },
    { icon: "🚛", label: "Schedule Pickup",   path: "/schedule-pickup",    color: "#0891b2" },
    { icon: "📋", label: "Lodge Complaint",   path: "/complaints",         color: "#f59e0b" },
    { icon: "🌿", label: "Carbon Calculator", path: "/carbon-calculator",  color: "#059669" },
    { icon: "🏆", label: "Check Rewards",     path: "/rewards",            color: "#7c3aed" },
    { icon: "📍", label: "Nearby Centers",    path: "/nearby",             color: "#e11d48" },
  ]

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API}/dashboard/citizen`, { headers })
        setStats({
          waste_recycled: res.data.waste_recycled,
          carbon_saved: res.data.carbon_saved,
          reward_points: res.data.reward_points,
          eco_score: res.data.eco_score
        })
        setActivities(res.data.activities || [])
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      }
      setLoading(false)
    }
    fetchDashboard()
  }, [])

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return `${mins} min ago`
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader
          title={`Good morning, ${name}! 🌿`}
          subtitle="Here's your sustainability overview for today"
        />

        <div style={{ padding: "28px 32px" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
            <StatCard title="Waste Recycled (kg)" value={loading ? "..." : stats.waste_recycled} icon="♻️" gradient="green"   delay={0}   />
            <StatCard title="CO₂ Saved (kg)"      value={loading ? "..." : stats.carbon_saved}   icon="🌿" gradient="teal"    delay={100} />
            <StatCard title="Reward Points"        value={loading ? "..." : stats.reward_points}  icon="🏆" gradient="amber"   delay={200} />
            <StatCard title="Eco Score"            value={loading ? "..." : stats.eco_score}      icon="📈" gradient="emerald" delay={300} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            {/* Quick Actions */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0a1f12" }}>
                Quick Actions
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {quickActions.map((a, i) => (
                  <a key={i} href={a.path} style={{ textDecoration: "none" }}>
                    <div style={{
                      padding: "16px", borderRadius: 12,
                      border: `1px solid ${a.color}22`,
                      background: `${a.color}08`,
                      display: "flex", alignItems: "center", gap: 10,
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                      onMouseOver={e => { e.currentTarget.style.background = `${a.color}15`; e.currentTarget.style.transform = "translateY(-2px)" }}
                      onMouseOut={e =>  { e.currentTarget.style.background = `${a.color}08`; e.currentTarget.style.transform = "translateY(0)" }}
                    >
                      <span style={{ fontSize: 22 }}>{a.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1f" }}>{a.label}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0a1f12" }}>
                Recent Activity
              </h3>
              {activities.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 0", color: "#9ca3af" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
                  <div style={{ fontSize: 13 }}>No activity yet — start reporting waste!</div>
                </div>
              ) : (
                activities.map((a, i) => (
                  <div key={i} className="activity-item">
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, flexShrink: 0
                    }}>
                      {actionIcons[a.action] || actionIcons.default}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#1a2e1f" }}>{a.description}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{getTimeAgo(a.created_at)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="section-card">
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#0a1f12" }}>
              Weekly Waste Report (kg) — Sample Data
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: "DM Sans" }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontFamily: "DM Sans" }} />
                <Bar dataKey="kg" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}