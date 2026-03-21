import { useState } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const API = "http://localhost:8000"

export default function RouteOptimizer() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [completed, setCompleted] = useState([])
  const [message, setMessage] = useState("")
  const [numVehicles, setNumVehicles] = useState(3)

  const generateRoutes = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await axios.get(`${API}/routes/optimize?num_vehicles=${numVehicles}`)
      if (res.data.routes.length === 0) {
        setMessage("No pending pickups found! Schedule some pickups first.")
        setRoutes([])
      } else {
        setRoutes(res.data.routes)
        setSelected(res.data.routes[0])
        setCompleted([])
      }
    } catch (err) {
      console.error("Route optimization error:", err)
      setMessage("Error generating routes. Check backend is running.")
    }
    setLoading(false)
  }

  const markComplete = (stopId) => {
    setCompleted([...completed, stopId])
  }

  const totalPickups = routes.reduce((a, r) => a + r.total_stops, 0)
  const totalDistance = routes.reduce((a, r) => a + r.total_distance_km, 0).toFixed(1)

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader
          title="ML Route Optimizer"
          subtitle="K-Means clustering + Nearest Neighbor algorithm"
          action={
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>Vehicles:</label>
                <select
                  value={numVehicles}
                  onChange={e => setNumVehicles(parseInt(e.target.value))}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none" }}
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button
                onClick={generateRoutes}
                disabled={loading}
                style={{
                  background: loading ? "rgba(22,163,74,0.5)" : "linear-gradient(135deg, #16a34a, #15803d)",
                  color: "white", padding: "10px 20px", borderRadius: 10,
                  border: "none", fontSize: 13, fontFamily: "Syne", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.3)"
                }}
              >
                {loading ? "Optimizing..." : "Generate Optimized Routes"}
              </button>
            </div>
          }
        />

        <div style={{ padding: "28px 32px" }}>

          {message && (
            <div style={{
              background: "#fef9c3", border: "1px solid #fde047",
              borderRadius: 10, padding: "14px 20px", marginBottom: 24,
              fontSize: 14, color: "#854d0e", fontWeight: 500
            }}>
              {message}
            </div>
          )}

          {routes.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Pending Pickups", value: totalPickups,    icon: "📦" },
                { label: "Vehicles Deployed",     value: routes.length,  icon: "🚛" },
                { label: "Total Distance",         value: `${totalDistance} km`, icon: "🗺️" },
              ].map((s, i) => (
                <div key={i} className="section-card" style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28, color: "#0a1f12" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {routes.length === 0 && !message ? (
            <div className="section-card" style={{
              textAlign: "center", padding: "60px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", minHeight: 300
            }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🗺️</div>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, marginBottom: 8, color: "#0a1f12" }}>
                No Routes Generated Yet
              </h3>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
                Click the button above to run the ML algorithm and optimize pickup routes
              </p>
              <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#9ca3af" }}>
                <span>📊 K-Means Clustering</span>
                <span>🔄 Nearest Neighbor</span>
                <span>⚡ Distance Minimization</span>
              </div>
            </div>
          ) : routes.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
              {/* Vehicle cards */}
              <div>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#0a1f12" }}>
                  Vehicles
                </h3>
                {routes.map((r, i) => (
                  <div key={i}
                    onClick={() => setSelected(r)}
                    style={{
                      padding: "16px", borderRadius: 12, marginBottom: 10, cursor: "pointer",
                      border: `2px solid ${selected?.vehicle_id === r.vehicle_id ? r.color : "#f3f4f6"}`,
                      background: selected?.vehicle_id === r.vehicle_id ? `${r.color}08` : "white",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: r.color }} />
                      <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14 }}>
                        Vehicle {r.vehicle_id}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280" }}>
                      <span>📦 {r.total_stops} stops</span>
                      <span>📏 {r.total_distance_km} km</span>
                    </div>
                    <div style={{ marginTop: 8, background: "#f3f4f6", borderRadius: 20, height: 6 }}>
                      <div style={{
                        background: r.color, borderRadius: 20, height: 6,
                        width: `${(completed.filter(id => r.stops.some(s => s.id === id)).length / r.total_stops) * 100}%`,
                        transition: "width 0.5s"
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stop details */}
              {selected && (
                <div className="section-card">
                  <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#0a1f12" }}>
                    Vehicle {selected.vehicle_id} — Route Details
                    <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 400, marginLeft: 8 }}>
                      {selected.total_distance_km} km total
                    </span>
                  </h3>

                  <div style={{ position: "relative", paddingLeft: 24 }}>
                    <div style={{
                      position: "absolute", left: 11, top: 12, bottom: 12,
                      width: 2, background: `${selected.color}30`
                    }} />
                    {selected.stops.map((stop, i) => (
                      <div key={stop.id} style={{
                        display: "flex", alignItems: "flex-start",
                        gap: 12, marginBottom: 16, position: "relative"
                      }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                          background: completed.includes(stop.id) ? "#16a34a" : selected.color,
                          color: "white", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 11, fontWeight: 700, zIndex: 1
                        }}>
                          {completed.includes(stop.id) ? "✓" : i + 1}
                        </div>
                        <div style={{ flex: 1, background: "#f9fafb", borderRadius: 10, padding: "10px 14px" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{stop.address}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            {stop.waste_type} • {stop.citizen_name}
                          </div>
                        </div>
                        <button
                          onClick={() => markComplete(stop.id)}
                          disabled={completed.includes(stop.id)}
                          style={{
                            padding: "6px 12px", borderRadius: 8, border: "none",
                            fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0,
                            background: completed.includes(stop.id) ? "#f0fdf4" : selected.color,
                            color: completed.includes(stop.id) ? "#16a34a" : "white"
                          }}
                        >
                          {completed.includes(stop.id) ? "Done" : "Complete"}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    marginTop: 16, padding: "12px 16px",
                    background: "#f0fdf4", borderRadius: 10,
                    fontSize: 13, color: "#16a34a"
                  }}>
                    {completed.filter(id => selected.stops.some(s => s.id === id)).length} / {selected.stops.length} stops completed
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}