import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

export default function NearbyPlaces() {
  const centers = [
    { name: "GreenCycle Recycling Center", type: "Recyclables", dist: "1.2 km", hours: "9AM - 6PM", accepts: ["Plastic", "Glass", "Metal", "Paper"] },
    { name: "EcoTech E-Waste Hub", type: "E-Waste", dist: "2.4 km", hours: "10AM - 5PM", accepts: ["Electronics", "Batteries", "Cables"] },
    { name: "BioWaste Composting Facility", type: "Organic", dist: "3.1 km", hours: "8AM - 4PM", accepts: ["Food Waste", "Garden Waste"] },
    { name: "Hazmat Disposal Center", type: "Hazardous", dist: "4.8 km", hours: "9AM - 3PM", accepts: ["Medical Waste", "Chemicals", "Batteries"] },
    { name: "City Waste Transfer Station", type: "General", dist: "0.8 km", hours: "7AM - 7PM", accepts: ["All Types"] },
    { name: "Textile Recycling Drop-off", type: "Clothes", dist: "2.9 km", hours: "10AM - 6PM", accepts: ["Clothes", "Textiles", "Shoes"] },
  ]

  const typeColors = {
    Recyclables: "#16a34a", "E-Waste": "#e11d48",
    Organic: "#84cc16", Hazardous: "#f59e0b",
    General: "#6b7280", Clothes: "#7c3aed"
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="Nearby Recycling Centers" subtitle="Find certified disposal facilities near you" />
        <div style={{ padding: "28px 32px" }}>

          {/* Map placeholder */}
          <div style={{
            background: "linear-gradient(135deg, #0a1f12, #0f2d1a)",
            borderRadius: 16, height: 220, marginBottom: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(22,163,74,0.2)"
          }}>
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>📍</div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Interactive Map</div>
              <div style={{ fontSize: 13, opacity: 0.6 }}>Connect Google Maps API to see live centers</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {centers.map((c, i) => (
              <div key={i} className="section-card card-hover" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="badge" style={{ background: `${typeColors[c.type]}15`, color: typeColors[c.type] }}>{c.type}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>📍 {c.dist}</span>
                </div>
                <h4 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, marginBottom: 6, color: "#0a1f12" }}>{c.name}</h4>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>🕐 {c.hours}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                  {c.accepts.map((a, j) => (
                    <span key={j} style={{ fontSize: 10, background: "#f0fdf4", color: "#16a34a", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{a}</span>
                  ))}
                </div>
                <button style={{
                  width: "100%", padding: "8px",
                  background: "#f0fdf4", color: "#16a34a",
                  border: "1px solid #bbf7d0", borderRadius: 8,
                  fontSize: 12, fontWeight: 600, cursor: "pointer"
                }}>Get Directions →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
