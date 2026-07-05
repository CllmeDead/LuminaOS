import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const BASE_URL = import.meta.env.VITE_API_URL || "/api"
const CACHE_KEY        = "lumina_briefing"
const CACHE_DURATION   = 3 * 60 * 60 * 1000
const REFRESH_INTERVAL = 3 * 60 * 60 * 1000

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}

export default function MorningBriefing({ mood = "neutral", energy = 5, onBriefingLoad }) {
  const [briefing, setBriefing] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [visible, setVisible]   = useState(false)
  const [error, setError]       = useState(null)

  const fetchBriefing = useCallback(async () => {
    setVisible(true)
    setError(null)

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
      const res = await fetch(`${BASE_URL}/ai/morning-briefing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          energy_level: energy,
          time_of_day: getTimeOfDay()
        })
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json()
      const content = data?.content || "Unable to generate a briefing right now."
      setBriefing(content)
      onBriefingLoad?.(content)
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        text:      content,
        timestamp: Date.now()
      }))
    } catch (err) {
      console.error("Briefing error:", err)
      setError("Unable to generate a briefing right now. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [mood, energy, onBriefingLoad])

  useEffect(() => {
    fetchBriefing()
    const interval = setInterval(fetchBriefing, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchBriefing])

  return (
    <div className="mb-stack_lg">
      {(!visible || error) && (
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
          {error ? "Retry today's briefing" : "View today's briefing"}
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
              ) : error ? (
                <div className="space-y-3">
                  <p className="text-sm font-title-md text-red-300 italic">
                    {error}
                  </p>
                  <button
                    onClick={fetchBriefing}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
                  >
                    Try again
                  </button>
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