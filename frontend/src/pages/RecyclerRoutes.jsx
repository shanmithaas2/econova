import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"
import { useState } from "react"

export default function RecyclerRoutes() {
  const [routes, setRoutes] = useState([
    { id: "R-01", zone: "North Zone", stops: 8, distance: "12.4 km", material: "Plastic & Glass", status: "In Progress", progress: 5 },
    { id: "R-02", zone: "Central Zone", stops: 6, distance: "8.7 km", material: "E-Waste", status: "Pending", progress: 0 },
    { id: "R-03", zone: "South Zone", stops: 10, distance: "15.2 km", material: "Organic", status: "Completed", progress: 10 },
  ])

  const updateProgress = (id) => {
    setRoutes(routes.map(r => {
      if (r.id === id && r.progress < r.stops) {
        const newProgress = r.progress + 1
        return { ...r, progress: newProgress, status: newProgress === r.stops ? "Completed" : "In Progress" }
      }
      return r
    }))
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="My Routes" subtitle="Your assigned collection routes for today" />
        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {routes.map((r, i) => (
              <div key={i} className="section-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: "#0a1f12" }}>{r.zone}</span>
                      <span className={`badge ${r.status === "Completed" ? "badge-green" : r.status === "In Progress" ? "badge-blue" : "badge-yellow"}`}>
                        {r.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#6b7280" }}>
                      <span>📦 {r.stops} stops</span>
                      <span>📏 {r.distance}</span>
                      <span>♻️ {r.material}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "Syne", fontWeight: 700, color: "#d97706", fontSize: 16 }}>{r.id}</span>
                    {r.status !== "Completed" && (
                      <button onClick={() => updateProgress(r.id)} style={{
                        background: "#d97706", color: "white", border: "none",
                        padding: "8px 16px", borderRadius: 8, fontSize: 12,
                        fontWeight: 600, cursor: "pointer"
                      }}>
                        Mark Stop Done ✓
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ background: "#f3f4f6", borderRadius: 20, height: 10, marginBottom: 8 }}>
                  <div style={{
                    background: r.status === "Completed" ? "#16a34a" : "#d97706",
                    borderRadius: 20, height: 10,
                    width: `${(r.progress / r.stops) * 100}%`,
                    transition: "width 0.5s ease"
                  }} />
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {r.progress} / {r.stops} stops completed ({Math.round((r.progress / r.stops) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
