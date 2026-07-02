import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "../api"

const MOODS = [
  { value: "great",   emoji: "🌟", label: "Great"   },
  { value: "good",    emoji: "😊", label: "Good"    },
  { value: "neutral", emoji: "😐", label: "Neutral" },
  { value: "low",     emoji: "😔", label: "Low"     },
  { value: "rough",   emoji: "😞", label: "Rough"   },
]

const DOT_COLORS = {
  great:   "bg-primary",
  good:    "bg-primary",
  neutral: "bg-secondary",
  low:     "bg-secondary",
  rough:   "bg-error",
}

export default function MoodCheckin() {
  const [selected, setSelected]   = useState("great")
  const [energy, setEnergy]       = useState(7)
  const [notes, setNotes]         = useState("")
  const [saving, setSaving]       = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [history, setHistory]     = useState([])

  useEffect(() => {
    api.getMoodCheckins()
      .then(data => setHistory(data.slice(0, 7).reverse()))
      .catch(err => console.error("Mood history fetch error:", err))
  }, [])

  const handleSubmit = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await api.createMoodCheckin({
        mood: selected,
        energy_level: energy,
        notes: notes || null,
      })
      setSubmitted(true)
    } catch (err) {
      console.error("Mood checkin failed:", err)
    } finally {
      setSaving(false)
    }
  }

  const moodValue = { great: 100, good: 80, neutral: 50, low: 30, rough: 10 }
  const points = history.length > 0
    ? history.map((h, i) => {
        const x = (i / Math.max(history.length - 1, 1)) * 300
        const y = 120 - (moodValue[h.mood] || 50) * 0.9
        return `${x},${y}`
      })
    : ["0,100","50,80","100,90","150,40","200,60","250,20","300,30"]

  const pathD = `M${points.join(" L")}`
  const areaD = `${pathD} L300,120 L0,120 Z`

  if (submitted) {
    return (
      <div className="flex flex-1 min-h-screen items-center
                      justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">
            {MOODS.find(m => m.value === selected)?.emoji}
          </div>
          <h1 className="font-display-lg text-display-lg
                         text-on-surface mb-2">
            Logged ✓
          </h1>
          <p className="text-on-surface-variant">
            Lumina will factor this into your insights.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setNotes("")
            }}
            className="mt-6 px-6 py-2 border border-outline-variant
                       rounded-lg text-on-surface
                       hover:bg-surface-container-high transition-colors"
          >
            Log again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 min-h-screen">
      <main className="flex-1 mr-right_panel_width h-full
                       overflow-y-auto bg-background
                       p-container_padding">
        <header className="mb-12">
          <h2 className="font-display-lg text-display-lg text-on-surface">
            How are you feeling?
          </h2>
          <p className="text-on-surface-variant mt-2 font-body-md">
            Take a moment to reflect on your current emotional state.
          </p>
        </header>

        <section className="grid grid-cols-5 gap-4 mb-12">
          {MOODS.map(mood => (
            <button
              key={mood.value}
              onClick={() => setSelected(mood.value)}
              className={`glass-card p-6 rounded-xl flex flex-col
                          items-center justify-center gap-3 group
                          transition-all
                ${selected === mood.value
                  ? "mood-card-active"
                  : "hover:border-outline"
                }`}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className={`font-label-sm-caps
                ${selected === mood.value
                  ? "text-primary"
                  : "text-on-surface-variant"
                }`}>
                {mood.label}
              </span>
            </button>
          ))}
        </section>

<section className="mb-12">
  <div className="flex justify-between items-center mb-6">
    <h3 className="font-title-md text-title-md">
      Energy Level
    </h3>
    <span className="font-display-lg text-primary text-2xl">
      {energy}
    </span>
  </div>
  <div className="relative w-full h-2 bg-surface-container-high
                  rounded-full overflow-hidden">
    <div
      className="absolute top-0 left-0 h-full bg-primary
                 rounded-full pointer-events-none"
      style={{
        width: `${energy * 10}%`,
        boxShadow: "0 0 10px rgba(245,166,35,0.4)"
      }}
    />
    <input
      type="range"
      min={1} max={10}
      value={energy}
      onChange={e => setEnergy(Number(e.target.value))}
      className="slider-thumb absolute inset-0 w-full h-full
                 cursor-pointer m-0 p-0"
      style={{
        background: "transparent",
        WebkitAppearance: "none",
        appearance: "none",
      }}
    />
  </div>
  <div className="flex justify-between mt-4
                  text-on-surface-variant font-label-sm-caps">
    <span>Exhausted</span>
    <span>Hyper-Focused</span>
  </div>
</section>

        <section className="mb-12">
          <h3 className="font-title-md text-title-md mb-4">
            What's on your mind?
          </h3>
          <textarea
            className="w-full h-40 bg-surface-container-low border
                       border-outline-variant rounded-xl p-4
                       text-on-surface focus:border-primary
                       focus:ring-1 focus:ring-primary outline-none
                       transition-all resize-none font-body-md
                       placeholder-on-surface-variant"
            placeholder="Briefly describe what's influencing your mood today..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </section>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={saving}
            className="bg-primary text-on-primary-fixed font-bold
                       px-12 py-4 rounded-full transition-all
                       flex items-center gap-2 group
                       disabled:opacity-50"
            style={{
              boxShadow: "0 0 0 rgba(245,166,35,0)"
            }}
          >
            {saving ? "Logging..." : "Log Mood"}
            <span className="material-symbols-outlined
                             group-hover:translate-x-1
                             transition-transform">
              arrow_forward
            </span>
          </motion.button>
        </div>
      </main>

      <aside className="w-right_panel_width h-full
                        bg-surface-container-lowest border-l
                        border-outline-variant fixed right-0 top-0
                        overflow-y-auto p-6 z-30">
        <div className="mb-10">
          <h3 className="font-label-sm-caps text-on-surface-variant
                         uppercase tracking-[0.2em] mb-6">
            Mood History
          </h3>
          <div className="glass-card p-4 rounded-xl h-48 relative
                          overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 300 120">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0"
                  y1="0" y2="1">
                  <stop offset="0%" stopColor="#F5A623"
                    stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F5A623"
                    stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#chartGradient)" />
              <path
                d={pathD}
                fill="none"
                stroke="#F5A623"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
              {points.map((p, i) => {
                const [x, y] = p.split(",")
                const isLast = i === points.length - 1
                return (
                  <circle
                    key={i}
                    cx={x} cy={y}
                    r={isLast ? "4" : "3"}
                    fill={isLast ? "#FFFFFF" : "#F5A623"}
                  />
                )
              })}
            </svg>
            <div className="absolute bottom-2 left-0 w-full flex
                            justify-between px-2 font-label-sm-caps
                            text-[10px] text-on-surface-variant">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Today"].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="font-label-sm-caps text-on-surface-variant
                         uppercase tracking-[0.2em] mb-6">
            Past 7 Days
          </h3>
          <div className="flex justify-between items-center px-2">
            {["M","T","W","T","F","S","S"].map((day, i) => {
              const entry = history[i]
              return (
                <div key={i} className="flex flex-col items-center
                                        gap-2">
                  {entry ? (
                    <span
                      className={`w-3 h-3 rounded-full
                                 ${DOT_COLORS[entry.mood]}`}
                      style={{
                        boxShadow: entry.mood !== "neutral"
                          ? "0 0 8px rgba(245,166,35,0.4)"
                          : "none"
                      }}
                    />
                  ) : (
                    <span className="w-3 h-3 rounded-full border-2
                                     border-primary border-dashed" />
                  )}
                  <span className="font-label-sm-caps text-[10px]
                                   text-on-surface-variant">
                    {day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="ai-pulse glass-card p-6 rounded-2xl
                        border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <h3 className="font-title-md text-primary">AI Insight</h3>
          </div>
          <p className="font-body-md text-on-surface italic
                        leading-relaxed text-sm">
            {history.length > 2
              ? "Your mood typically peaks mid-week when your focus sessions are completed early. Try scheduling your hardest tasks for tomorrow morning."
              : "Log a few more mood check-ins to unlock personalized AI insights about your patterns."
            }
          </p>
          <div className="mt-4 pt-4 border-t border-primary/10
                          flex items-center justify-between">
            <span className="font-label-sm-caps text-[10px]
                             text-on-surface-variant">
              {history.length > 2 ? "Refined Pattern Found" : "Gathering Data"}
            </span>
          </div>
        </div>
      </aside>
    </div>
  )
}