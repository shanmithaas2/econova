import { useState, useRef, useEffect } from "react"

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I am EcoNova's AI Waste Assistant. Ask me anything about waste disposal, recycling, carbon footprint, or environmental tips!"
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { from: "user", text: userMessage }])
    setLoading(true)

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are EcoNova's AI Waste Management Assistant. You are an expert on:
- Waste disposal methods for all types of waste (plastic, glass, paper, metal, food waste, e-waste, batteries, clothes, medical waste, etc.)
- Recycling techniques and best practices
- Carbon footprint reduction
- Environmental impact of different waste types
- Composting and organic waste management
- Hazardous waste handling
- Indian waste management regulations and Swachh Bharat initiative
- Waste segregation (wet waste, dry waste, hazardous waste)
- Zero waste lifestyle tips
- Circular economy concepts
- Municipal solid waste management
- E-waste recycling centers
- Plastic waste reduction strategies

Keep answers concise, practical, and helpful. Use simple language. When mentioning bin colors, use Indian standards: Blue (dry/recyclable), Green (wet/organic), Red (hazardous). Always encourage responsible disposal. If asked about something unrelated to waste/environment, politely redirect to your area of expertise.`,
          messages: [
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      })

      const data = await response.json()
      const botReply = data.content?.[0]?.text || "Sorry, I could not process that. Please try again!"
      setMessages(prev => [...prev, { from: "bot", text: botReply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        from: "bot",
        text: "Sorry, I am having trouble connecting. Please try again in a moment!"
      }])
    }

    setLoading(false)
  }

  const quickQuestions = [
    "How to dispose plastic?",
    "What is e-waste?",
    "How to compost?",
    "Carbon footprint tips",
  ]

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(22,163,74,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s", fontSize: 24
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 100, right: 28, zIndex: 999,
          width: 360, height: 520, background: "white",
          borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          border: "1px solid #f3f4f6", display: "flex",
          flexDirection: "column", overflow: "hidden"
        }}>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #0a1f12, #16a34a)",
            padding: "16px 20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 18
              }}>🤖</div>
              <div>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: "white" }}>
                  EcoNova AI Assistant
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                  {loading ? "Thinking..." : "Powered by AI • Ask me anything!"}
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                marginBottom: 12
              }}>
                {m.from === "bot" && (
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 14,
                    marginRight: 8, flexShrink: 0, marginTop: 2
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "78%", padding: "10px 14px", borderRadius: 14,
                  fontSize: 13, lineHeight: 1.6,
                  background: m.from === "user" ? "#16a34a" : "#f3f4f6",
                  color: m.from === "user" ? "white" : "#1a2e1f",
                  borderBottomRightRadius: m.from === "user" ? 2 : 14,
                  borderBottomLeftRadius: m.from === "bot" ? 2 : 14,
                  whiteSpace: "pre-wrap"
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 14
                }}>🤖</div>
                <div style={{
                  background: "#f3f4f6", padding: "10px 16px",
                  borderRadius: 14, borderBottomLeftRadius: 2
                }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#16a34a",
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length === 1 && (
            <div style={{ padding: "0 16px 8px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); }}
                  style={{
                    padding: "5px 10px", borderRadius: 20, fontSize: 11,
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    color: "#16a34a", cursor: "pointer", fontWeight: 600
                  }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "12px 16px", borderTop: "1px solid #f3f4f6",
            display: "flex", gap: 8
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about waste disposal..."
              disabled={loading}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10,
                border: "1px solid #e5e7eb", fontSize: 13,
                outline: "none", fontFamily: "DM Sans",
                opacity: loading ? 0.6 : 1
              }}
            />
            <button onClick={sendMessage} disabled={loading} style={{
              background: loading ? "#9ca3af" : "#16a34a",
              color: "white", border: "none",
              borderRadius: 10, padding: "10px 14px",
              cursor: loading ? "not-allowed" : "pointer", fontSize: 14
            }}>→</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  )
}