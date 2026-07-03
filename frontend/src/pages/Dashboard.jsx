import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
import Spinner from "../components/ui/Spinner"
import MorningBriefing from "../components/ai/MorningBriefing"
import WeeklyReport from "../components/ai/WeeklyReport"

function TopBar() {
  return (
    <header className="h-16 flex items-center justify-between
                       px-gutter border-b border-outline-variant
                       sticky top-0 bg-surface/80 backdrop-blur-md
                       z-40">
      <div className="flex items-center gap-4">
        <h2 className="font-title-md text-primary">
          Dashboard Overview
        </h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3
                           top-1/2 -translate-y-1/2
                           text-on-surface-variant text-lg">
            search
          </span>
          <input
            className="bg-surface-container rounded-full pl-10 pr-4
                       py-1.5 text-sm border-none outline-none
                       focus:ring-1 focus:ring-primary-container w-64
                       text-on-surface placeholder-on-surface-variant"
            placeholder="Quick search..."
            type="text"
          />
        </div>
        <button className="text-on-surface-variant hover:text-primary
                           transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-primary-container/20
                        border border-outline-variant flex items-center
                        justify-center">
          <span className="text-primary-container text-xs font-bold">G</span>
        </div>
      </div>
    </header>
  )
}

function FocusHero({ onClick }) {
  const [timerState, setTimerState] = useState(null)

  useEffect(() => {
    const readState = () => {
      try {
        const raw = localStorage.getItem("lumina_timer_state")
        if (raw) {
          const state = JSON.parse(raw)
          const isStale = state.running &&
            (Date.now() - state.updatedAt > 5000)
          setTimerState(isStale ? null : state)
        }
      } catch {
        setTimerState(null)
      }
    }

    readState()
    const interval = setInterval(readState, 1000)
    return () => clearInterval(interval)
  }, [])

  const isActive = timerState?.running
  const seconds  = timerState?.seconds ?? 1500 // default 25:00
  const total    = timerState?.total ?? 1500
  const mins     = Math.floor(seconds / 60)
  const secs     = seconds % 60

  const circumference = 2 * Math.PI * 88
  const progress = total > 0 ? (total - seconds) / total : 0
  const offset = circumference * (1 - progress)

  return (
    <section className="glass-card rounded-xl p-8 relative
                        overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64
                      bg-primary/10 rounded-full blur-[100px]
                      pointer-events-none" />

      <div className="relative flex flex-col md:flex-row
                      items-center gap-12">
        <div className="relative w-48 h-48 flex items-center
                        justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-surface-container-high"
              cx="96" cy="96" r="88"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
            />
            <motion.circle
              className="text-primary-container timer-glow"
              cx="96" cy="96" r="88"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-display-lg text-4xl text-on-surface">
              {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
            </span>
            <span className="font-label-sm-caps text-primary uppercase
                             tracking-widest text-[10px]">
              {isActive ? "remaining" : "ready"}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <span className="px-3 py-1 bg-primary/20
                             text-primary-fixed-dim rounded-full
                             text-xs font-bold uppercase tracking-wider">
              {isActive ? "Deep Work" : "Ready to focus"}
            </span>
            <h3 className="font-headline-lg mt-2 text-white text-2xl
                           font-semibold">
              {isActive ? "Focus Session Active" : "No active session"}
            </h3>
            <p className="text-on-surface-variant max-w-sm mt-1 text-sm">
              {isActive
                ? "You're making great progress. Stay centered and eliminate distractions."
                : "Start a deep work session to enter your flow state."
              }
            </p>
          </div>
          <div className="flex items-center justify-center
                          md:justify-start gap-4">
            <button
              onClick={onClick}
              className="px-6 py-2 bg-primary-container
                         text-on-primary-fixed font-bold rounded-lg
                         hover:opacity-90 transition-all
                         flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                {isActive ? "pause" : "play_arrow"}
              </span>
              {isActive ? "Go to Session" : "Start Session"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function DailyIntentions({ tasks, habits, loading }) {
  const navigate = useNavigate()
  const topTask  = tasks.filter(t => t.status !== "done")[0]
  const topHabit = habits.filter(h => !h.completed_today)[0]

  if (loading) return <Spinner />

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-headline-lg text-2xl text-on-surface">
          Daily Intentions
        </h4>
        <button
          onClick={() => navigate("/tasks")}
          className="text-primary text-sm font-bold flex items-center
                     gap-1 hover:underline"
        >
          View All
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl border-l-4
                        border-primary group
                        hover:bg-surface-container-high transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container
                            flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                checklist
              </span>
            </div>
            <span className="text-xs font-label-sm-caps
                             text-on-surface-variant">
              PRIORITY
            </span>
          </div>
          <h5 className="font-title-md text-on-surface mb-2">
            {topTask ? topTask.title : "No pending tasks 🎉"}
          </h5>
          <p className="text-sm text-on-surface-variant mb-6
                        leading-relaxed">
            {topTask
              ? topTask.description ||
                "Your most important task for today."
              : "All tasks complete. Great work!"
            }
          </p>
          {topTask && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">
                {topTask.category?.name || "Uncategorized"}
              </span>
              <button
                className="w-8 h-8 rounded-full border border-outline
                           flex items-center justify-center
                           text-on-surface-variant
                           group-hover:bg-primary
                           group-hover:text-on-primary-fixed
                           transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  check
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="glass-card p-6 rounded-xl border-l-4
                        border-outline group
                        hover:bg-surface-container-high transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container
                            flex items-center justify-center">
              <span className="material-symbols-outlined
                               text-primary-fixed-dim">
                water_drop
              </span>
            </div>
            <span className="text-xs font-label-sm-caps
                             text-on-surface-variant">
              RECURRING
            </span>
          </div>
          <h5 className="font-title-md text-on-surface mb-2">
            {topHabit ? topHabit.name : "All habits done today 🔥"}
          </h5>
          {topHabit ? (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs text-on-surface-variant">
                  {topHabit.current_streak} day streak
                </span>
                <span className="text-xs font-bold text-primary">
                  {Math.round(
                    (topHabit.current_streak / topHabit.target_streak) * 100
                  )}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-surface-container
                              rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-container rounded-full
                             relative"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      (topHabit.current_streak /
                        topHabit.target_streak) * 100,
                      100
                    )}%`
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-4
                                  bg-white/20 animate-pulse" />
                </motion.div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="px-4 py-1.5 rounded-full
                                   border border-outline text-xs
                                   font-bold text-on-surface
                                   hover:border-primary-container
                                   hover:text-primary transition-all">
                  Log progress
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              You're crushing it today!
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function AIInsightBar() {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/ai/patterns")
      .then(res => res.json())
      .then(data => setInsight(data.content))
      .catch(err => {
        console.error("Pattern fetch error:", err)
        setInsight(
          "Keep logging tasks and habits — Lumina will surface " +
          "personalized patterns once there's enough data."
        )
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="p-6 bg-gradient-to-r from-surface-container-high
                        to-surface rounded-xl flex items-center gap-6
                        ai-pulse">
      <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full
                      flex items-center justify-center">
        <span
          className="material-symbols-outlined text-primary-container"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
      </div>
      {loading ? (
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-surface-container-high rounded
                          animate-pulse w-2/3" />
        </div>
      ) : (
        <p className="text-sm font-title-md text-primary-fixed-dim italic">
          "{insight}"
        </p>
      )}
    </section>
  )
}

function RightPanel({ tasks, entries, loading }) {
  const navigate = useNavigate()
  const now = new Date()

  const upcoming  = tasks.filter(t => t.status !== "done").slice(0, 2)
  const completed = tasks.filter(t => t.status === "done").slice(0, 1)
  const latestEntry = entries[0]

  const year     = now.getFullYear()
  const month    = now.getMonth()
  const today    = now.getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dayHeaders  = ["S","M","T","W","T","F","S"]
  const calDays = []
  for (let i = 0; i < firstDay; i++) calDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calDays.push(i)

  return (
    <aside className="w-right_panel_width h-full bg-surface
                      border-l border-outline-variant fixed right-0
                      top-0 overflow-y-auto z-30">
      <div className="p-6 space-y-stack_lg">

        <div>
          <h4 className="font-label-sm-caps text-on-surface-variant
                         mb-4 uppercase">
            Upcoming Tasks
          </h4>
          {loading ? <Spinner /> : (
            <ul className="space-y-4">
              {upcoming.map(task => (
                <li key={task.id}
                  className="flex items-start gap-3 group">
                  <div className="w-2 h-2 mt-2 rounded-full
                                  bg-primary-container flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-title-md text-on-surface
                                  group-hover:text-primary
                                  transition-colors cursor-pointer">
                      {task.title}
                    </p>
                    <span className="text-[10px] font-label-sm-caps
                                     text-on-surface-variant flex
                                     items-center gap-1 mt-1">
                      <span className="material-symbols-outlined
                                       text-[12px]">
                        schedule
                      </span>
                      {task.priority} priority
                    </span>
                  </div>
                </li>
              ))}
              {completed.map(task => (
                <li key={task.id}
                  className="flex items-start gap-3 group opacity-60">
                  <div className="w-2 h-2 mt-2 rounded-full
                                  bg-outline flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-title-md text-on-surface
                                  line-through">
                      {task.title}
                    </p>
                    <span className="text-[10px] font-label-sm-caps
                                     text-on-surface-variant flex
                                     items-center gap-1 mt-1">
                      <span className="material-symbols-outlined
                                       text-[12px]">
                        done
                      </span>
                      Completed
                    </span>
                  </div>
                </li>
              ))}
              {upcoming.length === 0 && completed.length === 0 && (
                <p className="text-xs text-on-surface-variant">
                  No tasks yet. Add one!
                </p>
              )}
            </ul>
          )}
        </div>

        <div className="glass-card p-6 rounded-xl space-y-4">
          <h4 className="font-label-sm-caps text-on-surface-variant
                         uppercase">
            Daily Reflection
          </h4>
          <p className="text-sm font-title-md text-on-surface italic
                        leading-relaxed">
            {latestEntry
              ? `"${latestEntry.content.slice(0, 140)}${
                  latestEntry.content.length > 140 ? "…" : ""
                }"`
              : '"The way to get started is to quit talking and begin doing. Today has been a testament to consistent small wins over giant leaps."'
            }
          </p>
          <div className="h-px bg-outline-variant w-full" />
          <button
            onClick={() => navigate("/app/journal")}
            className="w-full py-2 bg-surface-container border
                       border-outline-variant text-xs font-bold
                       rounded-lg flex items-center justify-center
                       gap-2 hover:bg-surface-container-high
                       hover:border-primary-container transition-all
                       text-on-surface"
          >
            <span className="material-symbols-outlined text-sm">
              edit
            </span>
            Continue Writing
          </button>
        </div>

        <div className="rounded-xl overflow-hidden
                        border border-outline-variant">
          <div className="bg-surface-container-high p-3 flex
                          justify-between items-center">
            <span className="text-xs font-bold text-on-surface">
              {now.toLocaleDateString("en-US", {
                month: "long", year: "numeric"
              }).toUpperCase()}
            </span>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-sm
                               cursor-pointer text-on-surface-variant
                               hover:text-on-surface">
                chevron_left
              </span>
              <span className="material-symbols-outlined text-sm
                               cursor-pointer text-on-surface-variant
                               hover:text-on-surface">
                chevron_right
              </span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 p-2 text-center
                          text-[10px] font-label-sm-caps
                          text-on-surface-variant">
            {dayHeaders.map((d, i) => (
              <div key={i}>{d}</div>
            ))}
            {calDays.map((d, i) => (
              <div
                key={i}
                className={`py-2 rounded cursor-pointer text-[10px]
                  transition-colors
                  ${d === today
                    ? "bg-primary-container text-on-primary-fixed font-bold"
                    : d
                      ? "text-on-surface hover:bg-surface-container-high"
                      : "text-on-surface-variant/30"
                  }`}
              >
                {d || ""}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-outline-variant">
          <WeeklyReport />
        </div>

      </div>
    </aside>
  )
}

export default function Dashboard() {
  const [tasks, setTasks]       = useState([])
  const [habits, setHabits]     = useState([])
  const [sessions, setSessions] = useState([])
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [mood, setMood]         = useState("neutral")
  const navigate                = useNavigate()

  useEffect(() => {
    api.getMoodCheckins()
      .then(c => { if (c.length > 0) setMood(c[0].mood) })
      .catch(() => {})

    Promise.all([
      api.getTasks(),
      api.getHabits(),
      api.getSessions(),
      api.getEntries(),
    ])
      .then(([t, h, s, e]) => {
        setTasks(t)
        setHabits(h)
        setSessions(s)
        setEntries(e)
      })
      .catch(err => console.error("Dashboard error:", err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-1 min-h-screen">
      <main className="flex-1 mr-right_panel_width overflow-y-auto
                       min-h-screen">
        <TopBar />

        <div className="p-gutter space-y-stack_lg max-w-5xl mx-auto">
          <MorningBriefing
            mood={mood}
            energy={5}
          />

          <FocusHero onClick={() => navigate("/app/pomodoro")} />

          <DailyIntentions
            tasks={tasks}
            habits={habits}
            loading={loading}
          />


          <AIInsightBar />
        </div>
      </main>
      <RightPanel
        tasks={tasks}
        entries={entries}
        loading={loading}
      />
    </div>
  )
}