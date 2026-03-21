import { useNavigate, useLocation } from "react-router-dom"

const menus = {
  citizen: [
    { icon: "🏠", label: "Dashboard", path: "/citizen-dashboard" },
    { icon: "♻️", label: "Report Waste", path: "/report-waste" },
    { icon: "🚛", label: "Schedule Pickup", path: "/schedule-pickup" },
    { icon: "📋", label: "My Complaints", path: "/complaints" },
    { icon: "🌿", label: "Carbon Calculator", path: "/carbon-calculator" },
    { icon: "🏆", label: "Rewards", path: "/rewards" },
    { icon: "📍", label: "Nearby Centers", path: "/nearby" },
    { path: "/marketplace", label: "Marketplace", icon: "🏪" },
  ],
  admin: [
    { icon: "🏠", label: "Dashboard", path: "/admin-dashboard" },
    { icon: "👥", label: "Manage Users", path: "/manage-users" },
  ],
  municipal: [
    { icon: "🏠", label: "Dashboard", path: "/municipal-dashboard" },
    { icon: "🚛", label: "Manage Pickups", path: "/manage-pickups" },
    { icon: "📋", label: "Complaints", path: "/manage-complaints" },
    { icon: "🗺️", label: "Route Optimizer", path: "/route-optimizer" },
    { path: "/bin-dashboard", label: "Bin Monitor", icon: "📡" },
  ],
  recycler: [
    { icon: "🏠", label: "Dashboard", path: "/recycler-dashboard" },
    { icon: "🗺️", label: "My Routes", path: "/recycler-routes" },
  ],
}

const roleLabels = {
  citizen: "Citizen",
  admin: "Administrator",
  municipal: "Municipal Staff",
  recycler: "Recycler",
}

const roleColors = {
  citizen: "#16a34a",
  admin: "#7c3aed",
  municipal: "#0891b2",
  recycler: "#d97706",
}

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem("role") || "citizen"
  const name = localStorage.getItem("name") || "User"
  const items = menus[role] || menus.citizen

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div className="sidebar flex flex-col">
      {/* Logo */}
      <div style={{ padding: "28px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #16a34a, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 4px 12px rgba(22,163,74,0.4)"
          }}>🌿</div>
          <div>
            <div style={{ color: "white", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>EcoNova</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>Smart Waste Platform</div>
          </div>
        </div>

        {/* User info */}
        <div style={{
          background: "rgba(22,163,74,0.15)",
          border: "1px solid rgba(22,163,74,0.25)",
          borderRadius: 12, padding: "12px 14px",
          marginBottom: 24
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: roleColors[role] || "#16a34a",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontFamily: "Syne", fontWeight: 700, fontSize: 14
            }}>{name.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{roleLabels[role]}</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>
          Navigation
        </div>
        {items.map(item => (
          <a
            key={item.path}
            href={item.path}
            className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      {/* Logout */}
      <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "10px 14px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, color: "#fca5a5",
            fontSize: 14, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.2s"
          }}
          onMouseOver={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
          onMouseOut={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  )
}
