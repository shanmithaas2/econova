import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const API = "https://econova-backend-qg2j.onrender.com"

const CARBON_FACTORS = {
  Plastic: 0.3, Glass: 0.3, Paper: 0.9, Metal: 0.4,
  "Food Waste": 0.5, "E-Waste": 2.0, Battery: 1.5,
  Clothes: 0.6, "Medical Waste": 1.8
}

export default function CarbonCalculator() {
  const [wasteType, setWasteType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [totalSaved, setTotalSaved] = useState(0)
  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API}/waste/my-reports`, { headers })
        const reports = res.data
        setHistory(reports.slice(0, 6))
        const total = reports.reduce((a, r) => a + r.carbon_saved, 0)
        setTotalSaved(total.toFixed(2))
      } catch (err) {
        console.error("Error fetching history:", err)
      }
    }
    fetchHistory()
  }, [])

  const calculate = () => {
    if (!wasteType || !quantity) return
    const saved = (CARBON_FACTORS[wasteType] * parseFloat(quantity)).toFixed(2)
    setResult({ type: wasteType, qty: parseFloat(quantity), saved: parseFloat(saved) })
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="Carbon Footprint Calculator" subtitle="Track your environmental impact" />
        <div style={{ padding: "28px 32px" }}>

          {/* Banner */}
          <div style={{
            background: "linear-gradient(135deg, #0a1f12, #16a34a)",
            borderRadius: 16, padding: "28px 32px", marginBottom: 24,
            color: "white", display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Your total CO2 saved</div>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 48 }}>
                {totalSaved} <span style={{ fontSize: 20 }}>kg</span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
                Equivalent to planting {Math.round(totalSaved / 21)} trees
              </div>
            </div>
            <div style={{ fontSize: 64 }}>🌿</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* Calculator */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#0a1f12" }}>
                Calculate Carbon Saved
              </h3>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                  Waste Type
                </label>
                <select value={wasteType} onChange={e => setWasteType(e.target.value)} className="eco-input">
                  <option value="">Select waste type</option>
                  {Object.keys(CARBON_FACTORS).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                  Quantity (kg)
                </label>
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)}
                  placeholder="Enter quantity in kg" className="eco-input" min="0.1" step="0.1" />
              </div>
              <button onClick={calculate} className="btn-primary" style={{ width: "100%" }}>
                Calculate Impact
              </button>

              {result && (
                <div style={{
                  marginTop: 20, background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 12, padding: "20px", textAlign: "center"
                }}>
                  <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
                    CO2 saved by recycling {result.qty}kg of {result.type}
                  </div>
                  <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 40, color: "#16a34a" }}>
                    {result.saved} <span style={{ fontSize: 16 }}>kg CO2</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                    That is like driving {Math.round(result.saved * 4)} km less!
                  </div>
                </div>
              )}
            </div>

            {/* History from DB */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0a1f12" }}>
                Your Waste Report History
              </h3>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
                  <div style={{ fontSize: 13 }}>No reports yet — start reporting waste!</div>
                </div>
              ) : (
                history.map((h, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 0", borderBottom: i < history.length - 1 ? "1px solid #f3f4f6" : "none"
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{h.waste_type}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                        {h.quantity_kg} kg • {new Date(h.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Syne", fontWeight: 700, color: "#16a34a", fontSize: 16 }}>
                        -{h.carbon_saved} kg
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>CO2</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}