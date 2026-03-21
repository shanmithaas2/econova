import Sidebar from "../components/Sidebar"
import StatCard from "../components/StatCard"
import PageHeader from "../components/PageHeader"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const collectionData = [
  { day: "Mon", kg: 480 }, { day: "Tue", kg: 620 }, { day: "Wed", kg: 390 },
  { day: "Thu", kg: 750 }, { day: "Fri", kg: 820 }, { day: "Sat", kg: 560 }, { day: "Sun", kg: 310 },
]

const assignedRoutes = [
  { id: "R-01", zone: "North Zone", stops: 8, distance: "12.4 km", material: "Plastic & Glass", status: "In Progress" },
  { id: "R-02", zone: "Central Zone", stops: 6, distance: "8.7 km", material: "E-Waste", status: "Pending" },
  { id: "R-03", zone: "South Zone", stops: 10, distance: "15.2 km", material: "Organic", status: "Completed" },
  { id: "R-04", zone: "East Zone", stops: 5, distance: "7.1 km", material: "Mixed", status: "Pending" },
]

const recentActivity = [
  { icon: "✅", text: "Route #12 completed — 8 stops", time: "30 min ago" },
  { icon: "♻️", text: "2.5 tonnes of materials collected", time: "2 hours ago" },
  { icon: "📊", text: "95% collection efficiency achieved", time: "4 hours ago" },
  { icon: "🚛", text: "Vehicle V-04 dispatched to East Zone", time: "5 hours ago" },
]

export default function RecyclerDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader
          title="Recycler Dashboard"
          subtitle="Resource recovery operations and route management"
          action={
            <a href="/recycler-routes" style={{
              background: "linear-gradient(135deg, #d97706, #b45309)",
              color: "white", padding: "10px 20px", borderRadius: 10,
              textDecoration: "none", fontSize: 13, fontFamily: "Syne", fontWeight: 700,
              boxShadow: "0 4px 12px rgba(217,119,6,0.3)"
            }}>🗺️ View My Routes</a>
          }
        />

        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
            <StatCard title="Total Materials (kg)" value="4.7K" icon="♻️" gradient="amber" delay={0} />
            <StatCard title="Optimized Routes" value="125" icon="🗺️" gradient="green" delay={100} />
            <StatCard title="Collection Efficiency %" value="45" icon="📊" gradient="teal" delay={200} />
            <StatCard title="Vehicles Active" value="678" icon="🚛" gradient="emerald" delay={300} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
            {/* Collection Chart */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#0a1f12" }}>
                Weekly Collection Volume (kg)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={collectionData}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontFamily: "DM Sans" }} />
                  <Area type="monotone" dataKey="kg" stroke="#d97706" fill="#fef3c7" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0a1f12" }}>
                Recent Activity
              </h3>
              {recentActivity.map((a, i) => (
                <div key={i} className="activity-item">
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#1a2e1f" }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Routes Table */}
          <div className="section-card">
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#0a1f12" }}>
              Assigned Routes
            </h3>
            <table className="eco-table">
              <thead>
                <tr><th>Route ID</th><th>Zone</th><th>Stops</th><th>Distance</th><th>Material</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {assignedRoutes.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: "#d97706" }}>{r.id}</td>
                    <td style={{ fontWeight: 500 }}>{r.zone}</td>
                    <td>{r.stops} stops</td>
                    <td style={{ color: "#6b7280" }}>{r.distance}</td>
                    <td><span className="badge badge-green">{r.material}</span></td>
                    <td>
                      <span className={`badge ${r.status === "Completed" ? "badge-green" : r.status === "In Progress" ? "badge-blue" : "badge-yellow"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status !== "Completed" && (
                        <button style={{
                          background: "#d97706", color: "white", border: "none",
                          padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer"
                        }}>Start</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
