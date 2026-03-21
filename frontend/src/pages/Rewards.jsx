import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const API = "http://localhost:8000"

const redeemOptions = [
  { title: "Rs.50 Grocery Voucher",       points: 500,  icon: "🛒", },
  { title: "Free Pickup Slot",            points: 200,  icon: "🚛", },
  { title: "Plant a Tree in Your Name",   points: 1000, icon: "🌳", },
  { title: "Rs.100 Electricity Credit",  points: 1500, icon: "⚡", },
]

export default function Rewards() {
  const [leaderboard, setLeaderboard] = useState([])
  const [userPoints, setUserPoints] = useState(0)
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lbRes, dashRes] = await Promise.all([
          axios.get(`${API}/dashboard/leaderboard`, { headers }),
          axios.get(`${API}/dashboard/citizen`, { headers })
        ])
        setLeaderboard(lbRes.data)
        setUserPoints(dashRes.data.reward_points)
        setUserName(dashRes.data.name)
      } catch (err) {
        console.error("Error fetching rewards:", err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const medals = ["🥇", "🥈", "🥉"]

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <PageHeader title="Rewards and Leaderboard" subtitle="Earn points for responsible waste disposal" />
        <div style={{ padding: "28px 32px" }}>

          {/* Points banner */}
          <div style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            borderRadius: 16, padding: "28px 32px", marginBottom: 24,
            display: "flex", alignItems: "center", justifyContent: "space-between", color: "white"
          }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Your Total Points</div>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 52 }}>
                {loading ? "..." : userPoints}
              </div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                Keep recycling to climb the leaderboard!
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>🏆</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Next milestone: 1000 pts</div>
              <div style={{ marginTop: 8, background: "rgba(255,255,255,0.2)", borderRadius: 20, height: 8, width: 200 }}>
                <div style={{
                  background: "white", borderRadius: 20, height: 8,
                  width: `${Math.min((userPoints / 1000) * 100, 100)}%`,
                  transition: "width 1s ease"
                }} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

            {/* Leaderboard */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0a1f12" }}>
                City Leaderboard
              </h3>
              {loading ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#9ca3af" }}>Loading...</div>
              ) : leaderboard.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#9ca3af" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
                  <div style={{ fontSize: 13 }}>No citizens on the leaderboard yet!</div>
                </div>
              ) : (
                leaderboard.map((u, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 10, marginBottom: 6,
                    background: u.name === userName ? "#f0fdf4" : "transparent",
                    border: u.name === userName ? "1px solid #bbf7d0" : "1px solid transparent"
                  }}>
                    <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>
                      {i < 3 ? medals[i] : "⭐"}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: u.name === userName ? 700 : 500, flex: 1, color: u.name === userName ? "#16a34a" : "#1a2e1f" }}>
                      {u.name} {u.name === userName ? "(You)" : ""}
                    </span>
                    <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: u.name === userName ? "#16a34a" : "#374151" }}>
                      {u.points} pts
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* How to earn */}
            <div className="section-card">
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0a1f12" }}>
                How to Earn Points
              </h3>
              {[
                { action: "Report Plastic waste",   pts: "+20", icon: "🧴" },
                { action: "Report E-Waste",         pts: "+40", icon: "💻" },
                { action: "Report Battery",         pts: "+30", icon: "🔋" },
                { action: "Report Medical Waste",   pts: "+35", icon: "💉" },
                { action: "Report Metal",           pts: "+25", icon: "🥫" },
                { action: "Schedule a Pickup",      pts: "+10", icon: "🚛" },
                { action: "Report Glass",           pts: "+15", icon: "🍶" },
                { action: "Report Paper",           pts: "+10", icon: "📄" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: i < 7 ? "1px solid #f3f4f6" : "none"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: "#374151" }}>{item.action}</span>
                  </div>
                  <span style={{ fontFamily: "Syne", fontWeight: 700, color: "#16a34a" }}>{item.pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Redeem */}
          <div className="section-card">
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0a1f12" }}>
              Redeem Rewards
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {redeemOptions.map((r, i) => {
                const canRedeem = userPoints >= r.points
                return (
                  <div key={i} style={{
                    border: `2px solid ${canRedeem ? "#bbf7d0" : "#f3f4f6"}`,
                    borderRadius: 12, padding: "20px", textAlign: "center",
                    opacity: canRedeem ? 1 : 0.6
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{r.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#1a2e1f" }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 700, marginBottom: 12 }}>{r.points} points</div>
                    <button style={{
                      width: "100%", padding: "8px",
                      background: canRedeem ? "#16a34a" : "#e5e7eb",
                      color: canRedeem ? "white" : "#9ca3af",
                      border: "none", borderRadius: 8, fontSize: 12,
                      fontWeight: 600, cursor: canRedeem ? "pointer" : "not-allowed"
                    }}>
                      {canRedeem ? "Redeem" : `Need ${r.points - userPoints} more pts`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}