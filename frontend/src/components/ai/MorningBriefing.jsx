import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CACHE_KEY      = "lumina_briefing"
const CACHE_DURATION = 12 * 60 * 60 * 1000

export default function MorningBriefing({ mood = "neutral", energy = 5, onBriefingLoad }) {
  const [briefing, setBriefing] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [visible, setVisible]   = useState(false)

  const fetchBriefing = async () => {
    setVisible(true)

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { text, timestamp } = JSON.parse(cached)
        const age = Date.now() - timestamp
        if (age < CACHE_DURATION) {
          setBriefing(text)
          onBriefingLoad?.(text)
          return
        }
      }
    } catch {
      localStorage.removeItem(CACHE_KEY)
    }

    setLoading(true)
    try {
      const res = await fetch("/api/ai/morning-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, energy_level: energy })
      })
      const data = await res.json()
      setBriefing(data.content)
      onBriefingLoad?.(data.content)
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        text:      data.content,
        timestamp: Date.now()
      }))
    } catch (err) {
      console.error("Briefing error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-stack_lg">
      {!visible && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchBriefing}
          className="flex items-center gap-2 px-4 py-2 rounded-full
                     bg-primary/10 border border-primary/30
                     text-primary text-sm font-semibold
                     hover:bg-primary/20 transition-all"
        >
          <span
            className="material-symbols-outlined text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          View today's briefing
        </motion.button>
      )}

      <AnimatePresence>
        {visible && (
          <motion.section
            initial={{ opacity: 0, y: -16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -16, height: 0 }}
            className="p-6 bg-gradient-to-r from-surface-container-high
                       to-surface rounded-xl flex items-center gap-6
                       ai-pulse relative overflow-hidden"
          >
            <div className="w-12 h-12 flex-shrink-0 bg-primary/10
                            rounded-full flex items-center
                            justify-center">
              <span
                className="material-symbols-outlined
                           text-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>

            <div className="flex-1">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-3 bg-surface-container-high
                                  rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-surface-container-high
                                  rounded animate-pulse w-1/2" />
                </div>
              ) : (
                <p className="text-sm font-title-md
                              text-primary-fixed-dim italic">
                  {briefing}
                </p>
              )}
            </div>

            <button
              onClick={() => setVisible(false)}
              className="text-on-surface-variant hover:text-on-surface
                         transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-xl">
                close
              </span>
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}