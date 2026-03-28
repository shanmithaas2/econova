import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const API = "http://localhost:8000"

const WASTE_ICONS = {
  Plastic: "🧴", Glass: "🍶", Paper: "📄", Metal: "🥫",
  "Food Waste": "🍌", "E-Waste": "💻", Battery: "🔋",
  Clothes: "👕", "Medical Waste": "💉"
}

const WASTE_COLORS = {
  Plastic: "#0891b2", Glass: "#7c3aed", Paper: "#d97706",
  Metal: "#0d9488", "Food Waste": "#84cc16", "E-Waste": "#e11d48",
  Battery: "#dc2626", Clothes: "#f59e0b", "Medical Waste": "#9333ea"
}

export default function Marketplace() {
  const [listings, setListings] = useState([])
  const [myListings, setMyListings] = useState([])
  const [tab, setTab] = useState("browse")
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(null)
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState({
    waste_type: "", quantity_kg: "", price_per_kg: "", location: "", description: ""
  })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => { fetchListings() }, [])

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API}/marketplace/listings`)
      setListings(res.data)
    } catch (err) {
      console.error("Error:", err)
    }
    setLoading(false)
  }

  const handlePost = async () => {
    if (!form.waste_type || !form.quantity_kg || !form.price_per_kg || !form.location) return
    try {
      const res = await axios.post(`${API}/marketplace/listings`, {
        waste_type: form.waste_type,
        quantity_kg: parseFloat(form.quantity_kg),
        price_per_kg: parseFloat(form.price_per_kg),
        location: form.location,
        description: form.description
      }, { headers })
      setMyListings([res.data, ...myListings])
      setListings([res.data, ...listings])
      setForm({ waste_type: "", quantity_kg: "", price_per_kg: "", location: "", description: "" })
      setSuccess("Listing posted successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error posting:", err)
    }
  }

  const handleBuy = async (id) => {
    setBuying(id)
    try {
      await axios.put(`${API}/marketplace/listings/${id}/buy`, {}, { headers })
      setListings(listings.filter(l => l.id !== id))
      setSuccess("Purchase successful! Contact the seller to arrange pickup.")
      setTimeout(() => setSuccess(""), 4000)
    } catch (err) {
      setSuccess(err.response?.data?.detail || "Error purchasing listing")
      setTimeout(() => setSuccess(""), 3000)
    }
    setBuying(null)
  }

  const tabStyle = (t) => ({
    padding: "10px 24px", borderRadius: 10, cursor: "pointer",
    fontFamily: "Syne", fontWeight: 700, fontSize: 14, border: "none",
    background: tab === t ? "#16a34a" : "#f3f4f6",
    color: tab === t ? "white" : "#6b7280",
    transition: "all 0.2s"
  })

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader
          title="Recycler Marketplace"
          subtitle="Buy and sell recyclable materials directly"
        />
        <div style={{ padding: "28px 32px" }}>

          {/* Stats banner */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16, marginBottom: 24
          }}>
            {[
              { label: "Active Listings", value: listings.length, icon: "🏪", color: "#16a34a" },
              { label: "Waste Types",     value: "9",             icon: "♻️", color: "#0891b2" },
              { label: "Earn By Selling", value: "Cash + Points", icon: "💰", color: "#d97706" },
            ].map((s, i) => (
              <div key={i} className="section-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px" }}>
                <div style={{ fontSize: 32 }}>{s.icon}</div>
                <div>
                  <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 22, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {success && (
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 10, padding: "12px 20px", marginBottom: 20,
              fontSize: 13, color: "#16a34a", fontWeight: 600
            }}>{success}</div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button style={tabStyle("browse")} onClick={() => setTab("browse")}>Browse Listings</button>
            <button style={tabStyle("sell")}   onClick={() => setTab("sell")}>Post a Listing</button>
          </div>

          {/* Browse Tab */}
          {tab === "browse" && (
            loading ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>Loading listings...</div>
            ) : listings.length === 0 ? (
              <div className="section-card" style={{ textAlign: "center", padding: "60px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No listings yet</h3>
                <p style={{ color: "#6b7280", fontSize: 14 }}>Be the first to post recyclable materials!</p>
                <button onClick={() => setTab("sell")} className="btn-primary" style={{ marginTop: 16 }}>
                  Post a Listing
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {listings.map((l, i) => (
                  <div key={i} className="section-card card-hover" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{WASTE_ICONS[l.waste_type] || "♻️"}</span>
                        <div>
                          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>{l.waste_type}</div>
                          <div style={{ fontSize: 12, color: "#9ca3af" }}>{l.location}</div>
                        </div>
                      </div>
                      <span style={{
                        background: `${WASTE_COLORS[l.waste_type] || "#16a34a"}15`,
                        color: WASTE_COLORS[l.waste_type] || "#16a34a",
                        fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20
                      }}>Available</span>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                      <div style={{ flex: 1, background: "#f9fafb", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                        <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16 }}>{l.quantity_kg} kg</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>Quantity</div>
                      </div>
                      <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                        <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: "#16a34a" }}>
                          ₹{l.price_per_kg}/kg
                        </div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>Price</div>
                      </div>
                      <div style={{ flex: 1, background: "#fffbeb", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                        <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: "#d97706" }}>
                          ₹{l.total_price}
                        </div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>Total</div>
                      </div>
                    </div>

                    {l.description && (
                      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14, fontStyle: "italic" }}>
                        "{l.description}"
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>by {l.seller_name}</span>
                      <button
                        onClick={() => handleBuy(l.id)}
                        disabled={buying === l.id}
                        style={{
                          background: "#16a34a", color: "white", border: "none",
                          padding: "8px 18px", borderRadius: 8, fontSize: 12,
                          fontWeight: 700, cursor: "pointer", fontFamily: "Syne"
                        }}
                      >
                        {buying === l.id ? "Processing..." : "Buy Now"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Sell Tab */}
          {tab === "sell" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div className="section-card">
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#0a1f12" }}>
                  Post Recyclable Material
                </h3>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Waste Type</label>
                  <select value={form.waste_type} onChange={e => setForm({ ...form, waste_type: e.target.value })} className="eco-input">
                    <option value="">Select type</option>
                    {Object.keys(WASTE_ICONS).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Quantity (kg)</label>
                    <input type="number" value={form.quantity_kg} onChange={e => setForm({ ...form, quantity_kg: e.target.value })}
                      placeholder="e.g. 5" className="eco-input" min="0.1" step="0.1" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Price per kg (₹)</label>
                    <input type="number" value={form.price_per_kg} onChange={e => setForm({ ...form, price_per_kg: e.target.value })}
                      placeholder="e.g. 12" className="eco-input" min="1" />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Pickup Location</label>
                  <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="Your area / address" className="eco-input" />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Description (optional)</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Any details about the material..." className="eco-input" rows={3} style={{ resize: "vertical" }} />
                </div>

                <button onClick={handlePost} className="btn-primary" style={{ width: "100%" }}>
                  Post Listing
                </button>
              </div>

              {/* Tips */}
              <div className="section-card">
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0a1f12" }}>
                  Pricing Guide
                </h3>
                {[
                  { type: "Metal",    price: "₹25–40/kg",  icon: "🥫" },
                  { type: "Paper",    price: "₹8–12/kg",   icon: "📄" },
                  { type: "Plastic",  price: "₹10–18/kg",  icon: "🧴" },
                  { type: "Glass",    price: "₹2–5/kg",    icon: "🍶" },
                  { type: "E-Waste",  price: "₹50–200/kg", icon: "💻" },
                  { type: "Battery",  price: "₹30–80/kg",  icon: "🔋" },
                  { type: "Clothes",  price: "₹5–15/kg",   icon: "👕" },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 0", borderBottom: i < 6 ? "1px solid #f3f4f6" : "none"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      <span style={{ fontSize: 13, color: "#374151" }}>{item.type}</span>
                    </div>
                    <span style={{ fontFamily: "Syne", fontWeight: 700, color: "#16a34a", fontSize: 13 }}>{item.price}</span>
                  </div>
                ))}

                <div style={{
                  marginTop: 16, background: "#f0fdf4", borderRadius: 10,
                  padding: "14px", fontSize: 13, color: "#166534"
                }}>
                  💡 Clean and sorted materials fetch higher prices!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}