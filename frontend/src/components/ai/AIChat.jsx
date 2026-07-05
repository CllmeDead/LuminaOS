import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, X } from "lucide-react"

const BASE_URL = import.meta.env.VITE_API_URL || "/api"

export default function AIChat({ mood = "neutral "}) {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)

    const send = async () => {
  if (!input.trim() || loading) return

  const userMsg = input.trim()
  setInput("")
  setMessages(prev => [...prev, { role: "user", text: userMsg }])
  setLoading(true)

  try {
    const res = await fetch(
      `${BASE_URL}/ai/chat?message=${encodeURIComponent(userMsg)}&mood=${mood}`
    )
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
    const data = await res.json()
    setMessages(prev => [...prev, { role: "ai", text: data.content }])
  } catch (err) {
    console.error("Chat error:", err)
    setMessages(prev => [...prev, { 
      role: "ai", 
      text: "Sorry, I couldn't connect. Make sure the backend is running." 
    }])
  } finally {
    setLoading(false)
  }
}

    return (
        <>
            {}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-lumina-amber shadow-glow-amber flex items-center justify-center z-40"
            >
                {open
                ? <X size={20} className="text-lumina-bg" />
                : <Bot size={20} className="text-lumina-bg" />
            
            }
            </motion.button>

            {}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        className="fixed bottom-20 right-6 w-80 z-40"
                    >
                        <div className="card shadow-elevated flex flex-col max-h-96">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-full bg-lumina-amber/20 flex items-center justify-center">
                                    <Bot size={12} className="text-lumina-amber" />
                                </div>
                                <span className="text-lumina-text text-sm font-medium">
                                    Ask Lumina
                                </span>
                            </div>

                            {}
                            <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
                                {messages.length === 0 && (
                                    <p className="text-lumina-subtle text-xs text-center py-4">
                                        Ask me anything about your productivity...
                                    
                                    </p>
                                )}
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`text-xs px-3 py-2 rounded-xl max-w-[85%]
                                            ${msg.role === "user"
                                                ? "bg-lumina-amber/20 text-lumina-text ml-auto"
                                                : "bg-lumina-elevated text-lumina-text"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="bg-lumina-elevated rounded-xl px-3 py-2 max-w-[85%]">
                                        <div className="flex gap-1">
                                            {[0,1,2].map(i => (
                                                <div key={i}
                                                    className="w-1.5 h-1.5 rounded-full bg-lumina-muted animate-pulse-soft"
                                                    style={{ animateDelay: `${i * 0.2}s`}}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {}
                            <div className="flex gap-2">
                                <input
                                    className="input text-xs pyt-2 flex-1"
                                    placholder="Ask anything..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && send()}
                                />
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={send}
                                    disabled={loading || !input.trim()}
                                    className="w-8 h-8 rounded-lg bg-lumina-amber flex items-center justify-center disabled:opacity-40 flex-shrink-0"
                                >
                                    <Send size={14} className="text-lumina-bg" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </>
    )
}