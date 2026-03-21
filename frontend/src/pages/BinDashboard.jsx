import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const API = "https://econova-backend-qg2j.onrender.com"

const BINS = [
  { id: 1, zone: "RS Puram",       type: "General",    color: "#6b7280", capacity: 100 },
  { id: 2, zone: "Gandhipuram",    type: "Recyclable", color: "#0891b2", capacity: 100 },
  { id: 3, zone: "Peelamedu",      type: "Organic",    color: "#16a34a", capacity: 100 },
  { id: 4, zone: "Saibaba Colony", type: "Hazardous",  color: "#e11d48", capacity: 100 },
  { id: 5, zone: "Singanallur",    type: "General",    color: "#6b7280", capacity: 100 },
  { id: 6, zone: "Nanjundapuram",  type: "Recyclable", color: "#0891b2", capacity: 100 },
  { id: 7, zone: "Ukkadam",        type: "Organic",    color: "#16a34a", capacity: 100 },
  { id: 8, zone: "Vadavalli",      type: "Hazardous",  color: "#e11d48", capacity: 100 },
]

function randomFill(base, variance = 15) {
  return Math.min(100, Math.max(5, base + (Math.random() - 0.5) * variance))
}

function generateHistory() {
  return Array.from({ length: 8 }, (_, i) => ({
    time: `${8 + i}:00`,
    fill: Math.round(10 + i * 10 + Math.random() * 8)
  }))
}

export default function BinDashboard() {
  const [bins, setBins] = useState(
    BINS.map(b => ({ ...b, fillLevel: Math.round(randomFill(50)), history: generateHistory(), lastUpdated: new Date() }))
  )
  const [selected, setSelected] = useState(null)
  const [tick, setTick] = useState(0)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setBins(prev => prev.map(b => {
        const newFill = Math.round(randomFill(b.fillLevel, 8))

        // Auto trigger pickup when bin crosses 85%
        if (newFill >= 85 && b.fillLevel < 85) {
          axios.post(`${API}/pickup/schedule`, {
            waste_type: b.type,
            quantity_kg: 100,
            location: b.zone,
            preferred_date: new Date().toISOString().split("T")[0],
            notes: `AUTO-ALERT: Bin sensor triggered at ${newFill}% capacity`
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }).then(() => {
            setAlerts(prev => [...prev, `${b.zone} bin is ${newFill}% full — pickup auto-scheduled!`])
          }).catch(() => {})
        }

        return { ...b, fillLevel: newFill, lastUpdated: new Date() }
      }))
      setTick(t => t + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatus = (fill) => {
    if (fill >= 85) return { label: "Critical", color: "#e11d48", bg: "#fef2f2" }
    if (fill >= 60) return { label: "High",     color: "#d97706", bg: "#fffbeb" }
    if (fill >= 30) return { label: "Medium",   color: "#0891b2", bg: "#eff6ff" }
    return                 { label: "Low",      color: "#16a34a", bg: "#f0fdf4" }
  }

  const critical = bins.filter(b => b.fillLevel >= 85).length
  const high     = bins.filter(b => b.fillLevel >= 60 && b.fillLevel < 85).length
  const avgFill  = Math.round(bins.reduce((a, b) => a + b.fillLevel, 0) / bins.length)

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader
          title="Live Bin Monitor"
          subtitle="Simulated IoT sensor data — updates every 5 seconds"
          action={
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#f0fdf4", padding: "8px 14px", borderRadius: 10
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
              <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>LIVE</span>
            </div>
          }
        />
        <div style={{ padding: "28px 32px" }}>

          {/* Auto alerts */}
          {alerts.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              {alerts.slice(-3).map((a, i) => (
                <div key={i} style={{
                  background: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: 10, padding: "12px 20px", marginBottom: 8,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>🚨</span>
                    <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>{a}</span>
                  </div>
                  <button
                    onClick={() => setAlerts(prev => prev.filter((_, j) => j !== i))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Total Bins",      value: bins.length,   icon: "🗑️", color: "#374151" },
              { label: "Critical (85%+)", value: critical,      icon: "🔴", color: "#e11d48" },
              { label: "Needs Attention", value: high,          icon: "🟡", color: "#d97706" },
              { label: "Avg Fill Level",  value: `${avgFill}%`, icon: "📊", color: "#0891b2" },
            ].map((s, i) => (
              <div key={i} className="section-card" style={{ textAlign: "center", padding: "16px" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 26, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 24 }}>

            {/* Bin grid */}
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {bins.map((bin, i) => {
                  const status = getStatus(bin.fillLevel)
                  return (
                    <div key={i}
                      onClick={() => setSelected(selected?.id === bin.id ? null : bin)}
                      style={{
                        padding: "18px", borderRadius: 14, cursor: "pointer",
                        border: `2px solid ${selected?.id === bin.id ? bin.color : "#f3f4f6"}`,
                        background: selected?.id === bin.id ? `${bin.color}08` : "white",
                        transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#0a1f12" }}>
                            {bin.zone}
                          </div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{bin.type} Bin</div>
                        </div>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "3px 8px",
                          borderRadius: 20, background: status.bg, color: status.color
                        }}>{status.label}</span>
                      </div>

                      {/* Fill bar */}
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: "#9ca3af" }}>Fill Level</span>
                          <span style={{ fontSize: 13, fontFamily: "Syne", fontWeight: 700, color: status.color }}>
                            {bin.fillLevel}%
                          </span>
                        </div>
                        <div style={{ background: "#f3f4f6", borderRadius: 20, height: 10, overflow: "hidden" }}>
                          <div style={{
                            height: 10, borderRadius: 20,
                            width: `${bin.fillLevel}%`,
                            background: bin.fillLevel >= 85
                              ? "linear-gradient(90deg, #f59e0b, #e11d48)"
                              : bin.fillLevel >= 60
                              ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                              : bin.color,
                            transition: "width 1s ease"
                          }} />
                        </div>
                      </div>

                      <div style={{ fontSize: 10, color: "#9ca3af" }}>
                        Updated {bin.lastUpdated.toLocaleTimeString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Detail panel */}
            {selected && (() => {
              const status = getStatus(selected.fillLevel)
              const binData = bins.find(b => b.id === selected.id)
              return (
                <div className="section-card">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                      <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: "#0a1f12" }}>
                        {selected.zone}
                      </h3>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>
                        {selected.type} Bin • Sensor ID: BIN-00{selected.id}
                      </div>
                    </div>
                    <button onClick={() => setSelected(null)}
                      style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>
                      ✕
                    </button>
                  </div>

                  {/* Big fill indicator */}
                  <div style={{
                    background: status.bg, border: `1px solid ${status.color}30`,
                    borderRadius: 14, padding: "20px", textAlign: "center", marginBottom: 20
                  }}>
                    <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 56, color: status.color }}>
                      {binData?.fillLevel}%
                    </div>
                    <div style={{ fontSize: 14, color: status.color, fontWeight: 600 }}>
                      {status.label} — {
                        binData?.fillLevel >= 85 ? "Needs immediate pickup!" :
                        binData?.fillLevel >= 60 ? "Schedule pickup soon" :
                        "Operating normally"
                      }
                    </div>
                  </div>

                  {/* Fill history chart */}
                  <h4 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#0a1f12" }}>
                    Fill History Today
                  </h4>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={selected.history}>
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, fontFamily: "DM Sans", fontSize: 12 }}
                        formatter={(v) => [`${v}%`, "Fill Level"]}
                      />
                      <Line type="monotone" dataKey="fill" stroke={selected.color}
                        strokeWidth={2.5} dot={{ fill: selected.color, r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>

                  {binData?.fillLevel >= 60 && (
                    <a href="/manage-pickups" style={{
                      display: "block", marginTop: 16, textAlign: "center",
                      background: "#e11d48", color: "white", padding: "12px",
                      borderRadius: 10, textDecoration: "none",
                      fontFamily: "Syne", fontWeight: 700, fontSize: 13
                    }}>
                      Schedule Emergency Pickup →
                    </a>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}