import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { api } from "../api"

const TIMER_STATE_KEY = "lumina_timer_state"

const MODES = {
  focus: { label: "Deep Work",   minutes: 25 },
  short: { label: "Short Break", minutes: 5  },
  long:  { label: "Long Break",  minutes: 15 },
}

const SOUNDS = [
  { id: "rain",   label: "Rainy Night",  icon: "rainy"  },
  { id: "lofi",   label: "Lofi Beats",   icon: "headset" },
  { id: "forest", label: "Quiet Forest", icon: "forest" },
  { id: "coffee", label: "Coffee Shop",  icon: "coffee" },
]

function pad(n) { return String(n).padStart(2, "0") }

export default function Pomodoro() {
  const [mode, setMode]         = useState("focus")
  const [seconds, setSeconds]   = useState(MODES.focus.minutes * 60)
  const [running, setRunning]   = useState(false)
  const [sound, setSound]       = useState("lofi")
  const [thoughts, setThoughts] = useState("")
  const [tasks, setTasks]       = useState([])
  const [sessions, setSessions] = useState([])
  const intervalRef             = useRef(null)
  const sessionIdRef            = useRef(null)

  useEffect(() => {
    Promise.all([api.getTasks(), api.getSessions()])
      .then(([t, s]) => {
        setTasks(t.filter(task => task.status !== "done").slice(0, 3))
        setSessions(s.slice(0, 3))
      })
      .catch(err => console.error("Pomodoro fetch error:", err))
  }, [])

  useEffect(() => {
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({
      mode,
      seconds,
      running,
      total: MODES[mode].minutes * 60,
      updatedAt: Date.now(),
    }))
  }, [mode, seconds, running])

  const total = MODES[mode].minutes * 60
  const circumference = 2 * Math.PI * 150
  const progress = (total - seconds) / total
  const offset = circumference * (1 - progress)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            handleComplete()
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const handleStart = async () => {
    if (!running && mode === "focus" && !sessionIdRef.current) {
      try {
        const session = await api.startSession({
          duration_minutes: MODES[mode].minutes,
          break_duration_minutes: 5,
          started_at: new Date().toISOString(),
        })
        sessionIdRef.current = session.id
      } catch (err) {
        console.error("Start session failed:", err)
      }
    }
    setRunning(!running)
  }

  const handleComplete = async () => {
    if (sessionIdRef.current) {
      try {
        await api.updateSession(sessionIdRef.current, {
          completed: true,
          ended_at: new Date().toISOString(),
        })
      } catch (err) {
        console.error("Complete session failed:", err)
      }
      sessionIdRef.current = null
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setSeconds(MODES[newMode].minutes * 60)
    setRunning(false)
    sessionIdRef.current = null
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="flex flex-1 min-h-screen">
      <main className="flex-1 mr-right_panel_width relative
                       overflow-y-auto bg-background p-gutter">
        <div className="absolute inset-0 pointer-events-none
                        overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2
                          -translate-y-1/2 w-[600px] h-[600px]
                          bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex
                        flex-col items-center justify-center
                        min-h-full py-12">

          <div className="flex gap-2 mb-10">
            {Object.entries(MODES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`px-4 py-2 rounded-full text-xs font-bold
                            uppercase tracking-widest transition-all
                  ${mode === key
                    ? "bg-primary/10 border border-primary/30 text-primary"
                    : "bg-surface-container-high border border-outline-variant text-on-surface-variant hover:border-primary"
                  }`}
              >
                {val.label}
              </button>
            ))}
          </div>

          <div className="relative flex flex-col items-center
                          mb-stack_lg">
            <div className="relative w-80 h-80 flex items-center
                            justify-center">
              <svg className="absolute inset-0 transform -rotate-90
                              w-full h-full">
                <circle
                  cx="160" cy="160" r="150"
                  fill="transparent"
                  stroke="#1C1C1C"
                  strokeWidth="8"
                />
                <motion.circle
                  className="amber-glow"
                  cx="160" cy="160" r="150"
                  fill="transparent"
                  stroke="#F5A623"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.5, ease: "linear" }}
                />
              </svg>
              <div className="text-center">
                <p className="font-label-sm-caps text-primary-container
                              tracking-[0.2em] mb-2">
                  {MODES[mode].label.toUpperCase()}
                </p>
                <h1 className="font-display-lg text-[84px] leading-none
                               text-on-surface">
                  {pad(mins)}:{pad(secs)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-stack_lg mt-stack_lg">
              <button className="text-on-surface-variant
                                 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">
                  skip_previous
                </span>
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="bg-primary-container text-background w-16 h-16
                           rounded-full flex items-center justify-center
                           shadow-lg amber-glow transition-all"
              >
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {running ? "pause" : "play_arrow"}
                </span>
              </motion.button>
              <button
                onClick={() => switchMode(mode)}
                className="text-on-surface-variant
                           hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-3xl">
                  skip_next
                </span>
              </button>
            </div>
          </div>

          <div className="w-full max-w-2xl mt-12">
            <p className="font-label-sm-caps text-on-surface-variant
                         mb-4 text-center">
              SOUNDSCAPE
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SOUNDS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSound(s.id)}
                  className={`glass-card p-4 rounded-xl flex flex-col
                              items-center gap-2 transition-all group
                    ${sound === s.id
                      ? "border-primary-container/40 bg-primary/5"
                      : "hover:border-primary-container"
                    }`}
                >
                  <span
                    className={`material-symbols-outlined
                      ${sound === s.id
                        ? "text-primary-container"
                        : "text-on-surface-variant group-hover:text-primary-container"
                      }`}
                    style={sound === s.id
                      ? { fontVariationSettings: "'FILL' 1" }
                      : {}
                    }
                  >
                    {s.icon}
                  </span>
                  <span className="text-sm font-medium text-on-surface">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-2xl mt-stack_lg">
            <div className="glass-card p-4 rounded-xl">
              <label className="font-label-sm-caps
                                text-on-surface-variant mb-2 block">
                CURRENT THOUGHTS
              </label>
              <textarea
                className="w-full bg-transparent border-none outline-none
                           text-on-surface placeholder-on-surface-variant/40
                           resize-none h-20 font-body-md"
                placeholder="Dump any distracting thoughts here to clear your mind..."
                value={thoughts}
                onChange={e => setThoughts(e.target.value)}
              />
            </div>
          </div>
        </div>
      </main>

      <aside className="fixed top-0 right-0 h-full w-right_panel_width
                        bg-surface-container-low border-l
                        border-outline-variant flex flex-col p-6
                        space-y-8 z-30 overflow-y-auto">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-title-md text-title-md">
              Upcoming Tasks
            </h3>
            <span className="material-symbols-outlined
                             text-on-surface-variant cursor-pointer
                             hover:text-on-surface">
              more_horiz
            </span>
          </div>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-xs text-on-surface-variant">
                No pending tasks
              </p>
            ) : (
              tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 glass-card
                             rounded-lg hover:border-outline
                             transition-colors cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded border border-outline
                                  group-hover:border-primary
                                  transition-colors" />
                  <span className="text-sm text-on-surface">
                    {task.title}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="font-title-md text-title-md mb-4">
            Focus Flow
          </h3>
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-end justify-between h-24 gap-1">
              {[40, 60, 85, 100, 70, 45, 75].map((h, i) => (
                <div
                  key={i}
                  className={`w-full rounded-t-sm
                    ${h === 100
                      ? "bg-primary-container amber-glow"
                      : "bg-primary"
                    }`}
                  style={{ height: `${h}%`, opacity: h === 100 ? 1 : h / 150 }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 font-label-sm-caps
                            text-[10px] text-on-surface-variant">
              {["MON","TUE","WED","THU","FRI","SAT","SUN"].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="flex-1 overflow-y-auto min-h-0">
          <h3 className="font-title-md text-title-md mb-4">
            Session History
          </h3>
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <p className="text-xs text-on-surface-variant">
                No sessions yet today
              </p>
            ) : (
              sessions.map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-2
                             border-b border-outline-variant"
                >
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {session.completed ? "Deep Work Session" : "Focus Session"}
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      {new Date(session.started_at).toLocaleString(
                        "en-US",
                        { month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit" }
                      )}
                    </p>
                  </div>
                  <span className="font-label-sm-caps text-primary">
                    {session.duration_minutes} MIN
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="glass-card p-4 rounded-xl
                        border-primary-container/20 breath-animation">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="material-symbols-outlined
                         text-primary-container text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="font-label-sm-caps text-[10px]
                             text-primary-container uppercase">
              Lumina AI
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Your peak focus usually occurs between 10 AM and 12 PM.
            Consider scheduling high-priority tasks then.
          </p>
        </div>
      </aside>
    </div>
  )
}