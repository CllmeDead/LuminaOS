import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { api } from "../api"
import Modal from "../components/ui/Modal"
import Spinner from "../components/ui/Spinner"

const HABIT_ICONS = ["🧘‍♂️", "💧", "📖", "🏃‍♂️", "🎨", "🍎", "✍️", "🌱"]

function HabitCard({ habit, onComplete }) {
  const pct = Math.min(
    (habit.current_streak / habit.target_streak) * 100,
    100
  )
  const isCompleted = habit.completed_today

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={`glass-panel p-6 rounded-xl flex items-center group
                  hover:border-primary/50 transition-all duration-300
        ${isCompleted ? "border-l-4 border-l-primary/30" : ""}`}
    >
      <div className="w-14 h-14 rounded-full bg-surface-container
                      flex items-center justify-center text-3xl
                      group-hover:bg-primary/10 transition-colors">
        {habit.icon || "⭐"}
      </div>

      <div className="ml-6 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-title-md text-title-md text-on-surface">
            {habit.name}
          </h3>
          <div className="flex items-center gap-1">
            <span
              className={`material-symbols-outlined text-sm
                ${habit.current_streak > 0
                  ? "text-primary-container"
                  : "text-on-surface-variant"
                }`}
              style={habit.current_streak > 0
                ? { fontVariationSettings: "'FILL' 1" }
                : {}
              }
            >
              local_fire_department
            </span>
            <span className={`text-sm font-bold
              ${habit.current_streak > 0
                ? "text-primary-container"
                : "text-on-surface-variant"
              }`}>
              {habit.current_streak} days
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 h-2 bg-surface-container-highest
                          rounded-full overflow-hidden relative">
            <motion.div
              className="absolute top-0 left-0 h-full
                         bg-primary-container rounded-full progress-glow"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs font-bold text-on-surface-variant">
            {habit.current_streak}/{habit.target_streak} days
          </span>
        </div>
      </div>

      <div className="ml-8">
        {isCompleted ? (
          <div className="w-12 h-12 rounded-full bg-primary-container
                          flex items-center justify-center
                          text-on-primary-fixed amber-glow">
            <span className="material-symbols-outlined font-bold">
              check
            </span>
          </div>
        ) : (
          <button
            onClick={() => onComplete(habit.id)}
            className="w-12 h-12 rounded-full border-2
                       border-outline-variant flex items-center
                       justify-center text-on-surface-variant
                       hover:border-primary-container
                       hover:text-primary-container transition-all
                       active:scale-90"
          >
            <span className="material-symbols-outlined">check</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}

function WeeklyFlowChart({ completions }) {
  const days = ["MON","TUE","WED","THU","FRI","SAT","SUN"]
  const today = new Date().getDay()
  const todayIndex = today === 0 ? 6 : today - 1

  const dayHeights = days.map((_, i) => {
    if (i > todayIndex) return 10
    const base = 20 + Math.random() * 80
    return Math.min(base, 100)
  })

  return (
    <div className="glass-panel rounded-2xl h-48 relative
                    overflow-hidden flex items-end px-8 pb-4 gap-4">
      <div className="relative z-10 w-full flex justify-between
                      items-end h-full">
        {days.map((day, i) => {
          const isFuture = i > todayIndex
          const isPeak = !isFuture && dayHeights[i] > 60
          return (
            <div key={day} className={`flex flex-col items-center gap-2
              ${isFuture ? "opacity-30" : ""}`}>
              <motion.div
                className={`w-4 rounded-t-sm
                  ${isFuture
                    ? "bg-outline-variant"
                    : isPeak
                      ? "bg-primary-container amber-glow"
                      : "bg-primary/20 border-t-2 border-primary/40"
                  }`}
                initial={{ height: 0 }}
                animate={{ height: `${dayHeights[i]}%` }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
                style={{ minHeight: "4px" }}
              />
              <span className={`text-[10px] font-bold
                ${isPeak ? "text-primary" : "text-on-surface-variant"}`}>
                {day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CreateHabitForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: "", icon: "⭐", target_streak: 30
  })

  return (
    <div className="space-y-4">
      <input
        className="w-full bg-surface-container border
                   border-outline-variant rounded-xl px-4 py-3
                   text-on-surface text-sm outline-none
                   focus:border-primary/50 placeholder-on-surface-variant"
        placeholder="Habit name..."
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        autoFocus
      />
      <div>
        <label className="text-on-surface-variant text-xs mb-2 block
                          uppercase tracking-wider font-bold">
          Pick an icon
        </label>
        <div className="flex gap-2 flex-wrap">
          {HABIT_ICONS.map(icon => (
            <button
              key={icon}
              onClick={() => setForm({ ...form, icon })}
              className={`w-10 h-10 rounded-lg border text-lg
                         transition-all
                ${form.icon === icon
                  ? "border-primary-container bg-primary/10"
                  : "border-outline-variant hover:border-primary/40"
                }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-on-surface-variant text-xs mb-1.5 block
                          uppercase tracking-wider font-bold">
          Target streak (days)
        </label>
        <input
          type="number"
          className="w-full bg-surface-container border
                     border-outline-variant rounded-xl px-4 py-3
                     text-on-surface text-sm outline-none
                     focus:border-primary/50"
          value={form.target_streak}
          min={1} max={365}
          onChange={e => setForm({
            ...form, target_streak: Number(e.target.value)
          })}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => {
            if (form.name.trim()) { onSubmit(form); onClose() }
          }}
          className="flex-1 bg-primary-container text-on-primary-fixed
                     font-bold py-3 rounded-xl hover:opacity-90
                     transition-all text-sm"
        >
          Create Habit
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 border border-outline-variant
                     text-on-surface rounded-xl
                     hover:bg-surface-container-high
                     transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function Habits() {
  const [habits, setHabits]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [modalOpen, setModal]   = useState(false)

  useEffect(() => {
    api.getHabits()
      .then(setHabits)
      .catch(err => console.error("Habits fetch error:", err))
      .finally(() => setLoading(false))
  }, [])

  const handleComplete = async (id) => {
    setHabits(habits.map(h =>
      h.id === id
        ? { ...h, completed_today: true, current_streak: h.current_streak + 1 }
        : h
    ))
    try {
      await api.completeHabit(id)
    } catch (err) {
      console.error("Complete habit failed:", err)
    }
  }

  const handleCreate = async (form) => {
    try {
      const habit = await api.createHabit(form)
      setHabits([...habits, { ...habit, completed_today: false }])
    } catch (err) {
      console.error("Create habit failed:", err)
    }
  }

  const longestStreak = habits.reduce(
    (max, h) => Math.max(max, h.current_streak), 0
  )
  const avgProgress = habits.length > 0
    ? Math.round(
        habits.reduce((sum, h) =>
          sum + (h.current_streak / h.target_streak) * 100, 0
        ) / habits.length
      )
    : 0
  const activeStreakDays = habits.filter(h => h.current_streak > 0).length

  return (
    <div className="flex flex-1 min-h-screen">
      <div className="flex-1 mr-right_panel_width h-full
                      overflow-hidden flex flex-col">
        <header className="h-16 flex items-center px-gutter
                           border-b border-outline-variant
                           bg-surface/80 backdrop-blur-md
                           sticky top-0 z-40">
          <span className="font-title-md text-title-md text-on-surface">
            Habits Tracker
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-container_padding">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-stack_lg">
              <div>
                <h2 className="font-display-lg text-display-lg
                               text-on-surface">
                  Your Habits
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="material-symbols-outlined
                               text-primary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                  <span className="font-title-md text-primary text-xl">
                    {activeStreakDays > 0
                      ? `${longestStreak}-day streak!`
                      : "No streaks yet"
                    }
                  </span>
                  <span className="text-on-surface-variant text-sm ml-2">
                    — Keep the momentum going.
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-surface-container-high
                                   border border-outline-variant
                                   rounded-full text-xs font-bold
                                   uppercase tracking-widest
                                   hover:border-primary transition-all">
                  Daily View
                </button>
                <button className="px-4 py-2 bg-primary/10 border
                                   border-primary/30 rounded-full
                                   text-xs font-bold uppercase
                                   tracking-widest text-primary">
                  Overview
                </button>
              </div>
            </div>

            {loading ? <Spinner /> : (
              <div className="grid grid-cols-1 gap-stack_md">
                {habits.length === 0 ? (
                  <div className="glass-panel p-8 rounded-xl text-center">
                    <p className="text-on-surface-variant text-sm">
                      No habits yet. Create your first one.
                    </p>
                  </div>
                ) : (
                  habits.map(habit => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onComplete={handleComplete}
                    />
                  ))
                )}
              </div>
            )}

            <div className="mt-12">
              <h4 className="font-label-sm-caps text-label-sm-caps
                             text-on-surface-variant mb-4 uppercase">
                Weekly Flow Intensity
              </h4>
              <WeeklyFlowChart completions={habits} />
            </div>
          </div>
        </main>
      </div>

      <aside className="fixed top-0 right-0 h-full w-right_panel_width
                        bg-surface-container-low border-l
                        border-outline-variant p-6 flex flex-col
                        gap-8 z-30 overflow-y-auto">
        <div className="pt-12">
          <h4 className="font-label-sm-caps text-label-sm-caps
                         text-on-surface-variant mb-6 uppercase">
            Consistency Grid
          </h4>
          <div className="flex justify-between items-center px-2">
            {["M","T","W","T","F","S","S"].map((day, i) => {
              const active = i < activeStreakDays
              return (
                <div key={i} className={`flex flex-col items-center
                                         gap-2 ${!active ? "opacity-30" : ""}`}>
                  <div className={`w-3 h-3 rounded-full
                    ${active
                      ? "bg-primary-container amber-glow"
                      : "bg-outline-variant"
                    }`}
                  />
                  <span className="text-[10px] text-on-surface-variant
                                   font-bold">
                    {day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10
                            flex items-center justify-center">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                military_tech
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold
                            text-on-surface-variant">
                Longest Streak
              </p>
              <p className="text-xl font-display-lg text-primary">
                {longestStreak} days
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-outline-variant
                          flex justify-between items-center">
            <span className="text-xs text-on-surface-variant">
              Avg. Daily Progress
            </span>
            <span className="text-xs font-bold text-on-surface">
              {avgProgress}%
            </span>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden p-6
                        border border-primary/30 group">
          <div className="absolute inset-0 bg-gradient-to-br
                          from-primary/10 to-transparent
                          pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="material-symbols-outlined
                           text-primary-container text-sm ai-breath"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span className="font-label-sm-caps text-label-sm-caps
                               text-primary tracking-widest uppercase">
                AI Insight
              </span>
            </div>
            <p className="font-title-md text-on-surface leading-tight
                          italic">
              {habits.length > 0
                ? `Your consistency with ${habits[0]?.name || "your habits"} is building strong momentum. Keep showing up daily for compounding results.`
                : "Start your first habit today to begin building momentum."
              }
            </p>
          </div>
        </div>

        <button
          onClick={() => setModal(true)}
          className="mt-auto w-full py-3 bg-primary-container
                     text-on-primary-fixed font-bold rounded-lg
                     flex items-center justify-center gap-2
                     hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          New Habit
        </button>
      </aside>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModal(false)}
        title="New Habit"
      >
        <CreateHabitForm
          onSubmit={handleCreate}
          onClose={() => setModal(false)}
        />
      </Modal>
    </div>
  )
}