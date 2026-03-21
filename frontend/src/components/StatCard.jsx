export default function StatCard({ title, value, icon, gradient, delay = 0 }) {
  const gradients = {
    green: "linear-gradient(135deg, #16a34a, #15803d)",
    teal: "linear-gradient(135deg, #0d9488, #0891b2)",
    amber: "linear-gradient(135deg, #f59e0b, #d97706)",
    emerald: "linear-gradient(135deg, #10b981, #059669)",
    purple: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    blue: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    rose: "linear-gradient(135deg, #e11d48, #be123c)",
    cyan: "linear-gradient(135deg, #0891b2, #0e7490)",
  }

  return (
    <div
      className="stat-card card-hover animate-fadeInUp"
      style={{
        background: gradients[gradient] || gradients.green,
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
        <div style={{
          fontSize: 32, fontFamily: "Syne, sans-serif",
          fontWeight: 800, lineHeight: 1, marginBottom: 6
        }}>{value}</div>
        <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 500 }}>{title}</div>
      </div>
    </div>
  )
}
