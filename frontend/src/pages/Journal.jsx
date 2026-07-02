import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "../api"
import Spinner from "../components/ui/Spinner"

const MOODS = [
  { value: "great", icon: "wb_sunny", label: "Radiant" },
  { value: "good", icon: "filter_drama", label: "Calm" },
  { value: "neutral", icon: "bedtime", label: "Quiet" },
  { value: "low", icon: "battery_low", label: "Tired" },
]

const PROMPTS = [
  "What's one small victory you celebrated today, no matter how minor it felt?",
  "If you could change one interaction from today, what would it be?",
]

const MOOD_DOT_COLOR = {
  great: "bg-primary-container",
  good: "bg-blue-400",
  neutral: "bg-purple-400",
  low: "bg-red-400",
  rough: "bg-red-400",
}

export default function Journal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [mood, setMood] = useState("great")
  const [title, setTitle] = useState("Untitled Entry")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    api.getEntries()
      .then(setEntries)
      .catch(err => console.error("Journal fetch error:", err))
      .finally(() => setLoading(false))
  }, [])

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).filter(w => w.length > 0).length
    : 0

  const handleSave = async (finish = false) => {
    if (!content.trim()) return
    setSaving(true)
    try {
      const entry = await api.createEntry({
        content,
        mood,
        tags: null,
      })
      setEntries([entry, ...entries])
      if (finish) {
        setContent("")
        setTitle("Untitled Entry")
      }
    } catch (err) {
      console.error("Save entry failed:", err)
    } finally {
      setSaving(false)
    }
  }

  const usePrompt = (prompt) => {
    setContent(prev => prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-1 min-h-screen">
      <main className="flex-1 mr-right_panel_width h-full
                       overflow-y-auto bg-background relative
                       px-container_padding py-10">
        <div className="absolute top-0 right-0 w-96 h-96
                        bg-primary/5 rounded-full blur-[120px]
                        -z-10 pointer-events-none" />

        <header className="max-w-4xl mx-auto mb-10">
          <h1 className="font-display-lg text-display-lg text-on-surface
                         mb-8">
            How are you feeling today?
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MOODS.map(m => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex flex-col items-center justify-center
                            p-6 rounded-xl transition-all group
                  ${mood === m.value
                    ? "bg-[#161616] border-2 border-primary-container glow-amber-selected"
                    : "bg-[#161616] border border-[#2A2A2A] hover:border-outline-variant"
                  }`}
              >
                <span
                  className={`material-symbols-outlined text-4xl mb-3
                    ${mood === m.value
                      ? "text-primary"
                      : "text-on-surface-variant group-hover:text-on-surface"
                    }`}
                  style={mood === m.value
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                  }
                >
                  {m.icon}
                </span>
                <span className={`font-label-sm-caps
                  ${mood === m.value
                    ? "text-primary"
                    : "text-on-surface-variant group-hover:text-on-surface"
                  }`}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </header>

        <section className="max-w-4xl mx-auto flex flex-col
                            h-[calc(100vh-420px)] min-h-[400px]">
          <div className="glass-panel rounded-t-2xl p-8 flex-1
                          flex flex-col shadow-2xl">
            <input
              className="bg-transparent border-none outline-none
                         font-display-lg text-headline-lg text-on-surface
                         placeholder-on-surface-variant/30 mb-4 p-0"
              placeholder="Untitled Entry"
              value={title}
              onChange={e => setTitle(e.target.value)}
              type="text"
            />
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent border-none outline-none
                         font-body-md text-on-surface
                         placeholder-on-surface-variant/40 resize-none
                         p-0 leading-relaxed"
              placeholder="Start typing..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          <div className="glass-panel border-t-0 rounded-b-2xl px-6
                          py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 text-on-surface-variant
                                 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">
                  attach_file
                </span>
              </button>
              <button className="p-2 text-on-surface-variant
                                 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">image</span>
              </button>
              <button className="p-2 text-on-surface-variant
                                 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">mic</span>
              </button>
              <div className="h-4 w-px bg-outline-variant mx-2" />
              <span className="text-xs text-on-surface-variant
                               uppercase tracking-widest font-bold">
                {wordCount} words
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave(false)}
                disabled={saving || !content.trim()}
                className="px-5 py-2 text-sm font-bold text-on-surface
                           border border-outline-variant rounded-lg
                           hover:bg-surface-container-high
                           transition-colors disabled:opacity-40"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving || !content.trim()}
                className="px-5 py-2 text-sm font-bold
                           bg-primary-container text-on-primary-fixed
                           rounded-lg glow-amber-sm
                           hover:scale-[1.02] transition-transform
                           disabled:opacity-40"
              >
                {saving ? "Saving..." : "Finish Entry"}
              </button>
            </div>
          </div>
        </section>
      </main>

      <aside className="w-right_panel_width h-full bg-[#0D0D0D]
                        border-l border-outline-variant p-6 flex
                        flex-col overflow-y-auto fixed right-0 top-0
                        z-30">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="material-symbols-outlined text-primary
                         ai-glow"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <h3 className="font-label-sm-caps text-on-surface
                           tracking-[0.2em]">
              Evening Prompts
            </h3>
          </div>
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-xl border-l-4
                            border-primary/40 relative overflow-hidden
                            group">
              <div className="absolute -right-4 -bottom-4 opacity-10
                              group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">
                  lightbulb
                </span>
              </div>
              <p className="text-sm text-on-surface-variant
                            leading-relaxed">
                {PROMPTS[0]}
              </p>
              <button
                onClick={() => usePrompt(PROMPTS[0])}
                className="mt-4 text-[10px] font-bold uppercase
                           tracking-widest text-primary flex
                           items-center gap-1"
              >
                Use Prompt
                <span className="material-symbols-outlined text-xs">
                  arrow_forward
                </span>
              </button>
            </div>
            <div
              onClick={() => usePrompt(PROMPTS[1])}
              className="bg-[#161616] border border-[#2A2A2A] p-5
                         rounded-xl opacity-60 hover:opacity-100
                         transition-opacity cursor-pointer"
            >
              <p className="text-xs text-on-surface-variant
                            leading-relaxed">
                {PROMPTS[1]}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-label-sm-caps text-on-surface
                           tracking-[0.2em]">
              Reflections Archive
            </h3>
            <span className="material-symbols-outlined text-sm
                             text-on-surface-variant hover:text-on-surface
                             cursor-pointer">
              history
            </span>
          </div>

          {loading ? <Spinner /> : (
            <div className="space-y-0">
              {entries.length === 0 ? (
                <p className="text-xs text-on-surface-variant py-4">
                  No entries yet. Write your first one.
                </p>
              ) : (
                entries.slice(0, 6).map(entry => {
                  const date = new Date(entry.created_at)
                    .toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })
                  const previewTitle = entry.content.slice(0, 30) +
                    (entry.content.length > 30 ? "…" : "")

                  return (
                    <div
                      key={entry.id}
                      className="py-4 border-b border-[#2A2A2A]
                                 hover:bg-surface-container-low
                                 transition-colors px-2 rounded-lg
                                 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-bold
                                       uppercase tracking-widest
                                       text-on-surface-variant mb-1">
                            {date}
                          </p>
                          <h4 className="text-sm font-semibold
                                        text-on-surface
                                        group-hover:text-primary
                                        transition-colors">
                            {previewTitle}
                          </h4>
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full mt-1
                            ${MOOD_DOT_COLOR[entry.mood] || "bg-secondary"}`}
                          title={`Mood: ${entry.mood}`}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-outline-variant
                        flex items-center gap-3 opacity-60">
          <div className="w-2 h-2 bg-primary rounded-full ai-glow" />
          <span className="text-[10px] font-bold uppercase
                           tracking-widest">
            Lumina AI Analyzing Trends
          </span>
        </div>
      </aside>
    </div>
  )
}