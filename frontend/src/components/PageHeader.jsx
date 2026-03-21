export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header animate-fadeIn">
      <div>
        <h1 style={{
          fontFamily: "Syne, sans-serif", fontWeight: 700,
          fontSize: 22, color: "#0a1f12"
        }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

