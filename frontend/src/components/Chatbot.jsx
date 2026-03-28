import { useState } from "react"

const FAQ = [
  { keywords: ["hello", "hi", "hey"],                         answer: "Hello! I am EcoNova's assistant. Ask me anything about waste management!" },
  { keywords: ["plastic", "recycle plastic"],                 answer: "Plastic goes in the Blue Bin. Rinse it first, remove caps, and flatten bottles. You earn 20 points per report!" },
  { keywords: ["glass"],                                      answer: "Glass goes in the Blue Bin. Rinse bottles, remove metal lids. Never include broken glass or mirrors." },
  { keywords: ["battery", "batteries"],                       answer: "Batteries are hazardous! Tape the terminals and drop them at a certified e-waste center. Never throw in regular bins. You earn 30 points!" },
  { keywords: ["e-waste", "ewaste", "electronics", "laptop", "phone", "mobile"], answer: "E-Waste goes in the Red Bin. Wipe personal data first, take to a certified collector. Earn 40 points per report!" },
  { keywords: ["food", "organic", "compost"],                 answer: "Food waste goes in the Green Bin. You can also home compost it. Earn 10 points per report!" },
  { keywords: ["medical", "medicine", "syringe"],             answer: "Medical waste goes in the Yellow Bin. Use puncture-proof containers for sharps and contact your health authority." },
  { keywords: ["clothes", "textile", "fabric"],               answer: "Clean clothes can be donated. Damaged textiles go for textile recycling. Earn 15 points per report!" },
  { keywords: ["points", "rewards", "earn"],                  answer: "You earn points by reporting waste, scheduling pickups, and more. Redeem them for grocery vouchers, electricity credits, and more!" },
  { keywords: ["pickup", "schedule", "collect"],              answer: "Go to Schedule Pickup from your dashboard to request a waste collection. You earn 10 bonus points per pickup!" },
  { keywords: ["complaint", "issue", "problem", "overflow"],  answer: "You can lodge a complaint from the Complaints section. Our municipal team responds within 24 hours!" },
  { keywords: ["carbon", "co2", "environment"],               answer: "Every kg of waste you recycle saves carbon emissions. Check your Carbon Calculator page to see your total impact!" },
  { keywords: ["nearby", "center", "location", "where"],      answer: "Visit the Nearby Centers page to find certified recycling and disposal facilities close to you!" },
  { keywords: ["leaderboard", "rank", "top"],                 answer: "Check the Rewards page to see the city leaderboard and your rank among all eco-conscious citizens!" },
  { keywords: ["bin", "color", "colour"],                     answer: "Blue Bin = Recyclables, Green Bin = Organic, Red Bin = Hazardous, Yellow Bin = Medical Waste" },
  { keywords: ["register", "signup", "account"],              answer: "You can register as a Citizen, Municipal Staff, Recycler, or Admin from the Register page!" },
]

function getBotResponse(input) {
  const lower = input.toLowerCase()
  for (const faq of FAQ) {
    if (faq.keywords.some(k => lower.includes(k))) {
      return faq.answer
    }
  }
  return "I am not sure about that! Try asking about waste types, points, pickups, complaints, or nearby centers."
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I am EcoNova Assistant. Ask me about waste disposal, points, or pickups!" }
  ])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = { from: "user", text: input }
    const botMsg = { from: "bot", text: getBotResponse(input) }
    setMessages([...messages, userMsg, botMsg])
    setInput("")
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          border: "none", cursor: "pointer", fontSize: 24,
          boxShadow: "0 4px 20px rgba(22,163,74,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s"
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 999,
          width: 340, height: 460, background: "white",
          borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          border: "1px solid #f3f4f6", display: "flex", flexDirection: "column",
          overflow: "hidden"
        }}>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            padding: "16px 20px", color: "white"
          }}>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>EcoNova Assistant</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>Ask me anything about waste!</div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                marginBottom: 10
              }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: 12,
                  fontSize: 13, lineHeight: 1.5,
                  background: m.from === "user" ? "#16a34a" : "#f3f4f6",
                  color: m.from === "user" ? "white" : "#1a2e1f",
                  borderBottomRightRadius: m.from === "user" ? 2 : 12,
                  borderBottomLeftRadius: m.from === "bot" ? 2 : 12,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 16px", borderTop: "1px solid #f3f4f6",
            display: "flex", gap: 8
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about waste, points..."
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10,
                border: "1px solid #e5e7eb", fontSize: 13,
                outline: "none", fontFamily: "DM Sans"
              }}
            />
            <button onClick={sendMessage} style={{
              background: "#16a34a", color: "white", border: "none",
              borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontSize: 14
            }}>→</button>
          </div>
        </div>
      )}
    </>
  )
}