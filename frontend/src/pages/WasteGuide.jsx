import { useState } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const API = "http://localhost:8000"

const WASTE_GUIDE = {
  Plastic: {
    category: "Recyclable", color: "#16a34a", binColor: "Blue Bin",
    instructions: ["Rinse the plastic item clean", "Remove any caps or lids", "Flatten bottles to save space", "Place in the blue recycling bin"],
    doNot: "Do not include plastic bags or food-soiled plastic",
    points: 20, carbon: 0.3
  },
  Glass: {
    category: "Recyclable", color: "#0891b2", binColor: "Blue Bin",
    instructions: ["Rinse bottles and jars thoroughly", "Remove metal lids separately", "Do not break the glass", "Place carefully in blue bin"],
    doNot: "Do not include broken glass, mirrors or window panes",
    points: 15, carbon: 0.3
  },
  Paper: {
    category: "Recyclable", color: "#7c3aed", binColor: "Blue Bin",
    instructions: ["Keep paper clean and dry", "Flatten cardboard boxes", "Remove plastic wrapping", "Bundle newspapers together"],
    doNot: "Do not include greasy or food-stained paper",
    points: 10, carbon: 0.9
  },
  Metal: {
    category: "Recyclable", color: "#0d9488", binColor: "Blue Bin",
    instructions: ["Rinse cans and tins", "Crush cans to save space", "Remove paper labels if possible", "Place in blue recycling bin"],
    doNot: "Do not include aerosol cans under pressure",
    points: 25, carbon: 0.4
  },
  "Food Waste": {
    category: "Organic", color: "#84cc16", binColor: "Green Bin",
    instructions: ["Separate from other waste immediately", "Place in compostable bag", "Deposit in green organic bin", "Can also be home composted"],
    doNot: "Do not mix with plastic or glass",
    points: 10, carbon: 0.5
  },
  "E-Waste": {
    category: "Hazardous", color: "#e11d48", binColor: "Red Bin",
    instructions: ["Wipe all personal data from devices", "Do not attempt to dismantle", "Take to certified e-waste collector", "Check manufacturer take-back programs"],
    doNot: "Never dump in regular landfill or burn",
    points: 40, carbon: 2.0
  },
  Battery: {
    category: "Hazardous", color: "#dc2626", binColor: "Red Bin",
    instructions: ["Tape the battery terminals", "Store in cool dry place", "Drop off at nearest e-waste center", "Never mix with regular garbage"],
    doNot: "Never burn, puncture, or throw in regular bin",
    points: 30, carbon: 1.5
  },
  Clothes: {
    category: "Reusable", color: "#f59e0b", binColor: "Donation Box",
    instructions: ["Wash and clean before donating", "Separate wearable from non-wearable", "Donate wearable clothes to charity", "Send damaged fabric for textile recycling"],
    doNot: "Do not throw in regular waste if reusable",
    points: 15, carbon: 0.6
  },
  "Medical Waste": {
    category: "Hazardous", color: "#9333ea", binColor: "Yellow Bin",
    instructions: ["Place sharps in puncture-proof container", "Seal all medical waste bags tightly", "Never mix with household waste", "Contact health authority for pickup"],
    doNot: "Never dispose in regular trash under any circumstances",
    points: 35, carbon: 1.8
  },
}

export default function WasteGuide() {
  const [selected, setSelected] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [result, setResult] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("token")

  const handleSubmit = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await axios.post(
        `${API}/waste/report`,
        { waste_type: selected, quantity_kg: quantity, location: "Home" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const guide = WASTE_GUIDE[selected]
      setResult({ ...guide, carbonSaved: res.data.carbon_saved, pointsEarned: res.data.points_earned })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error("Error reporting waste:", err)
    }
    setLoading(false)
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="Waste Disposal Guide" subtitle="Select your waste type to get instant disposal instructions" />
        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            <div>
              <div className="section-card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#0a1f12" }}>
                  What waste do you have?
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {Object.keys(WASTE_GUIDE).map(type => (
                    <div key={type}
                      onClick={() => { setSelected(type); setResult(null) }}
                      style={{
                        padding: "14px 10px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                        border: selected === type ? `2px solid ${WASTE_GUIDE[type].color}` : "2px solid #f3f4f6",
                        background: selected === type ? `${WASTE_GUIDE[type].color}10` : "white",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 6 }}>
                        {type === "Plastic" ? "🧴" : type === "Glass" ? "🍶" : type === "Paper" ? "📄" :
                         type === "Metal" ? "🥫" : type === "Food Waste" ? "🍌" : type === "E-Waste" ? "💻" :
                         type === "Battery" ? "🔋" : type === "Clothes" ? "👕" : "💉"}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: selected === type ? WASTE_GUIDE[type].color : "#374151" }}>
                        {type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selected && (
                <div className="section-card">
                  <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#0a1f12" }}>
                    How much do you have?
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <input type="number" value={quantity} min={0.1} step={0.1}
                      onChange={e => setQuantity(parseFloat(e.target.value))}
                      className="eco-input" style={{ flex: 1 }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>kg</span>
                  </div>
                  <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: "100%" }}>
                    {loading ? "Saving..." : "Get Disposal Instructions"}
                  </button>
                </div>
              )}
            </div>

            <div>
              {result ? (
                <div className="section-card">
                  <div style={{
                    display: "inline-flex", alignItems: "center",
                    background: `${result.color}15`, border: `1px solid ${result.color}30`,
                    borderRadius: 20, padding: "6px 16px", marginBottom: 16
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: result.color }}>{result.category}</span>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontFamily: "Syne", fontWeight: 800, color: "#16a34a" }}>+{result.pointsEarned}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>Points Earned</div>
                    </div>
                    <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontFamily: "Syne", fontWeight: 800, color: "#059669" }}>{result.carbonSaved}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>kg CO2 Saved</div>
                    </div>
                    <div style={{ flex: 1, background: "#eff6ff", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontFamily: "Syne", fontWeight: 700, color: "#2563eb" }}>{result.binColor}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>Use This Bin</div>
                    </div>
                  </div>

                  <h4 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "#0a1f12", marginBottom: 10 }}>
                    How to Dispose
                  </h4>
                  {result.instructions.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", background: result.color, color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, flexShrink: 0
                      }}>{i + 1}</div>
                      <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}

                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px", marginTop: 12 }}>
                    <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>Do NOT: </span>
                    <span style={{ fontSize: 13, color: "#7f1d1d" }}>{result.doNot}</span>
                  </div>

                  {submitted && (
                    <div style={{ marginTop: 14, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px", fontSize: 13, color: "#16a34a", fontWeight: 600, textAlign: "center" }}>
                      Report saved! Points added to your account.
                    </div>
                  )}
                </div>
              ) : (
                <div className="section-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>♻️</div>
                  <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: "#0a1f12", marginBottom: 8 }}>Select a waste type</h3>
                  <p style={{ color: "#6b7280", fontSize: 14 }}>Choose from the options on the left to get instant disposal guidance</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}