import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "../api"
import Modal from "../components/ui/Modal"
import Spinner from "../components/ui/Spinner"

function TopBar({ taskCount, onQuickTask }) {
  return (
    <header className="h-20 flex items-center justify-between
                       px-gutter border-b border-outline-variant/20
                       bg-surface/80 backdrop-blur-md sticky top-0
                       z-40">
      <div className="flex items-baseline gap-4">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Tasks
        </h2>
        <span className="text-on-surface-variant text-sm opacity-60">
          {taskCount} tasks today
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3
                           top-1/2 -translate-y-1/2
                           text-on-surface-variant opacity-60
                           text-[18px]">
            search
          </span>
          <input
            className="bg-[#161616] border border-[#2A2A2A] rounded-full
                       py-2 pl-10 pr-4 text-sm outline-none
                       focus:border-primary focus:ring-1
                       focus:ring-primary/30 w-64 transition-all
                       text-on-surface placeholder-on-surface-variant"
            placeholder="Search tasks..."
            type="text"
          />
        </div>
        <button
          onClick={onQuickTask}
          className="bg-[#2A2A2A] text-white px-5 py-2 rounded-full
                     text-sm font-semibold hover:bg-[#3A3A3A]
                     transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">
            bolt
          </span>
          Quick Task
        </button>
        <div className="flex items-center gap-3 border-l
                        border-outline-variant/30 pl-6">
          <span className="material-symbols-outlined text-on-surface-variant
                           cursor-pointer hover:text-primary
                           transition-colors">
            notifications
          </span>
          <div className="w-8 h-8 rounded-full bg-primary-container/20
                          border border-outline-variant flex items-center
                          justify-center">
            <span className="text-primary-container text-xs font-bold">
              G
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

function TaskCard({ task, onStatusChange }) {
  const [checked, setChecked] = useState(task.status === "done")

  const handleCheck = (e) => {
    e.stopPropagation()
    const newStatus = checked ? "todo" : "done"
    setChecked(!checked)
    onStatusChange(task.id, newStatus)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: checked ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="glass-card p-5 rounded-xl hover:border-primary/50
                 transition-all cursor-pointer group relative
                 overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary
                      transform -translate-x-full
                      group-hover:translate-x-0 transition-transform
                      duration-200" />

      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-3">
            {task.category ? (
              <span className="px-2 py-0.5 rounded-full bg-primary/10
                               text-[10px] font-bold text-primary
                               tracking-wider">
                {task.category.name.toUpperCase()}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#2A2A2A]
                               text-[10px] font-bold
                               text-on-surface-variant tracking-wider">
                {task.priority.toUpperCase()}
              </span>
            )}
            <span className="text-xs text-on-surface-variant opacity-60
                             flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                schedule
              </span>
              {task.priority} priority
            </span>
          </div>

          <h4 className={`font-title-md text-title-md
            ${checked ? "line-through opacity-50" : "text-on-surface"}`}>
            {task.title}
          </h4>

          {task.description && (
            <p className="text-sm text-on-surface-variant/80 max-w-lg
                          leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        <div
          onClick={handleCheck}
          className={`w-6 h-6 rounded border flex items-center
                      justify-center transition-colors flex-shrink-0
                      mt-1 cursor-pointer
            ${checked
              ? "bg-primary border-primary"
              : "border-outline/40 hover:bg-primary/20"
            }`}
        >
          {checked && (
            <span className="material-symbols-outlined text-[16px]
                             text-on-primary-fixed">
              check
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function TomorrowCard({ task, onStatusChange }) {
  return (
    <div className="glass-card p-4 rounded-lg flex items-center
                    justify-between">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined
                         text-on-surface-variant/40">
          drag_indicator
        </span>
        <div>
          <h4 className="text-sm font-semibold text-on-surface">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-[12px] text-on-surface-variant/60">
              {task.description}
            </p>
          )}
        </div>
      </div>
      {task.category && (
        <span className="px-2 py-0.5 rounded-full bg-[#2A2A2A]
                         text-[10px] font-bold text-on-surface-variant">
          {task.category.name.toUpperCase()}
        </span>
      )}
    </div>
  )
}

function TaskSection({ title, tasks, onStatusChange }) {
  const isToday    = title === "Today"
  const isSomeday  = title === "Someday"
  const isTomorrow = title === "Tomorrow"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between
                      border-b border-[#2A2A2A] pb-2">
        <h3 className={`font-label-sm-caps text-label-sm-caps
                        tracking-widest
          ${isToday ? "text-primary-container" : "text-on-surface-variant"}`}>
          {title.toUpperCase()}
        </h3>
        {isToday && (
          <span className="material-symbols-outlined text-sm opacity-40
                           text-on-surface-variant">
            more_horiz
          </span>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className={`flex items-center justify-center py-8
                         glass-card rounded-xl
          ${isSomeday ? "border-dashed border-outline-variant/50" : ""}`}>
          <p className="text-xs text-on-surface-variant opacity-40">
            {isSomeday
              ? "Drag tasks here for future consideration"
              : `No ${title.toLowerCase()} tasks`
            }
          </p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-${isTomorrow ? "3" : "4"}
          ${isTomorrow ? "opacity-80" : ""}`}>
          <AnimatePresence>
            {tasks.map(task => (
              isTomorrow
                ? <TomorrowCard
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                  />
                : <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                  />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function CreateTaskForm({ onSubmit, onClose, categories }) {
  const [form, setForm] = useState({
    title: "", priority: "medium", category_id: null, due_date: null, description: "",
  })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [dueDate, setDueDate] = useState("today")

  const handleCategoryClick = (cat) => {
    if (selectedCategory === cat.id) {
      setSelectedCategory(null)
      setForm({ ...form, category_id: null })
    } else {
      setSelectedCategory(cat.id)
      setForm({ ...form, category_id: cat.id })
    }
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    await onSubmit(form)
    onClose()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="font-label-sm-caps text-[11px] text-on-surface-variant opacity-60 uppercase">
          Task Name
        </label>
        <input className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg py-3 px-4 text-on-surface outline-none focus:border-primary transition-all placeholder-on-surface-variant text-sm"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
      </div>

      <div className="space-y-2">
      <label className="font-label-sm-caps text-[11px] text-on-surface-variant opacity-60 uppercase">
        Category
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors
              ${selectedCategory === cat.id
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-[#2A2A2A] text-on-surface-variant hover:bg-[#3A3A3A]"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <label className="font-label-sm-caps text-[11px] text-on-surface-variant opacity-60 uppercase">
        Priority
      </label>
      <div className="flex gap-2">
        {["urgent", "high", "medium", "low"].map(p => (
          <button
            key={p}
            onClick={() => setForm({ ...form, priority: p })}
            className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors capitalize
              ${form.priority === p
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-[#2A2A2A] text-on-surface-variant hover:bg-[#3A3A3A]"
              }`}
            >
              {p}
            </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="font-label-sm-caps text-[11px] text-on-surface-variant opacity-60 uppercase">
          Date
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            calender_today
          </span>
          <input className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary transition-all"
            type="text"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="font-label-sm-caps text-[11px] text-on-surface-variant opacity-60 uppercase">
          Time
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            schedule
          </span>
          <input className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary transition-all placeholder-on-surface-variant"
            placeholder="Set time"
            type="text"
          />
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <label className="font-label-sm-caps text-[11px] text-on-surface-variant opacity-60 uppercase">
        Description
      </label>
      <textarea className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg py-3 px-4 text-sm text-on-surface outline-none focus:border-primary transition-all resize-none placeholder-on-surface-variant"
        placeholder="Add notes or details..."
        rows={3}
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
    </div>

    <div className="flex gap-3 pt-4">
      <button
        onClick={onClose}
        className="flex-1 bg-[#2A2A2A] text-on-surface py-3 rounded-lg font-bold hover:bg-[#3A3A3A] transition-all text-sm"
      >
        Cancel
      </button>
      <button onClick={handleSubmit}
        className="flex-1 bg-primary-container text-on-primary-fixed py-3 rounded-lg font-bold amber-glow-hover transition-all text-sm"
      >
        Create Task
      </button>
    </div>
    </div>
  )
}

function RightPanel({ sessions, tasks }) {
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

  const focusHoursRaw = sessions
    .filter(s => s.completed &&
      new Date(s.started_at).toDateString() === today)
    .reduce((sum, s) => sum + s.duration_minutes, 0) / 60

  const yesterdayFocusHoursRaw = sessions
    .filter(s => s.completed &&
      new Date(s.started_at).toDateString() === yesterday)
    .reduce((sum, s) => sum + s.duration_minutes, 0) / 60

  const focusHours = focusHoursRaw.toFixed(1)
  const focusPct = Math.min((focusHoursRaw / 8) * 100, 100)
  const focusIncrease = yesterdayFocusHoursRaw > 0
    ? ((focusHoursRaw - yesterdayFocusHoursRaw) / yesterdayFocusHoursRaw) * 100
    : null

  return (
    <aside className="fixed right-0 top-0 h-full w-right_panel_width
                      bg-[#0D0D0D] border-l border-outline-variant/20
                      flex flex-col p-6 z-30 overflow-y-auto">

      <div className="space-y-2 mb-10">
        <h5 className="font-label-sm-caps text-[11px] tracking-widest
                       text-on-surface-variant opacity-50 uppercase">
          Focus Stats
        </h5>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-display-lg text-primary-container
                           breath-animation">
            {focusHours}
          </span>
          <span className="text-sm text-on-surface-variant">
            hours today
          </span>
        </div>
        <div className="w-full bg-[#2A2A2A] h-1.5 rounded-full
                        overflow-hidden mt-4">
          <motion.div
            className="bg-primary h-full rounded-full amber-glow"
            initial={{ width: 0 }}
            animate={{ width: `${focusPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-[11px] text-primary/70 italic mt-2">
          {focusIncrease === null
            ? "No focus baseline available yet"
            : focusIncrease >= 0
              ? `+${focusIncrease.toFixed(0)}% from yesterday`
              : `${focusIncrease.toFixed(0)}% from yesterday`
          }
        </p>
      </div>

      <div className="space-y-4 mb-10">
        <h5 className="font-label-sm-caps text-[11px] tracking-widest
                       text-on-surface-variant opacity-50 uppercase">
          Upcoming Deadlines
        </h5>
        <ul className="space-y-3">
          {tasks.filter(t => t.status !== "done" && t.due_date)
            .slice(0, 3)
            .map((task, i) => (
              <li
                key={task.id}
                className={`pl-4 py-2 border-l-2 rounded-r-lg
                            transition-colors
                  ${i === 0
                    ? "border-primary bg-primary/5"
                    : "border-outline-variant hover:border-primary/40"
                  }`}
              >
                <p className="text-sm font-semibold text-on-surface">
                  {task.title}
                </p>
                <p className="text-[11px] text-on-surface-variant/60">
                  {new Date(task.due_date).toLocaleDateString()}
                </p>
              </li>
            ))
          }
          {tasks.filter(t => t.status !== "done" && t.due_date).length === 0 && (
            <li className="text-xs text-on-surface-variant">
              No upcoming deadlines yet.
            </li>
          )}
        </ul>
      </div>

      <div className="mt-auto glass-card p-6 rounded-2xl relative
                      overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-24 h-24
                        bg-primary/5 rounded-full blur-3xl
                        group-hover:bg-primary/10 transition-colors
                        pointer-events-none" />
        <span className="material-symbols-outlined text-primary/30
                         text-3xl absolute top-4 left-4">
          format_quote
        </span>
        <div className="relative z-10 pt-6">
          <p className="text-sm leading-relaxed italic text-on-surface">
            "Focus is not about saying yes to the thing you're focusing
             on, it's about saying no to the hundred other good ideas."
          </p>
          <p className="mt-4 text-[11px] font-bold text-primary-container
                        tracking-widest uppercase">
            — Steve Jobs
          </p>
        </div>
      </div>
    </aside>
  )
}

export default function Tasks() {
  const [tasks, setTasks]           = useState([])
  const [categories, setCategories] = useState([])
  const [sessions, setSessions]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [modalOpen, setModalOpen]   = useState(false)

  useEffect(() => {
    Promise.all([
      api.getTasks(),
      api.getCategories(),
      api.getSessions(),
    ])
      .then(([t, c, s]) => {
        setTasks(t)
        setCategories(c)
        setSessions(s)
      })
      .catch(err => console.error("Tasks fetch error:", err))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status: newStatus } : t
    ))
    try {
      await api.updateTask(id, { status: newStatus })
    } catch (err) {
      console.error("Update failed:", err)
    }
  }

  const handleCreate = async (form) => {
    try {
      const newTask = await api.createTask(form)
      setTasks([newTask, ...tasks])
    } catch (err) {
      console.error("Create task failed:", err)
    }
  }

  const today    = new Date()
  const tomorrow = new Date(Date.now() + 86400000)

  const todayTasks = tasks.filter(t =>
    t.status !== "done" && (
      !t.due_date ||
      new Date(t.due_date).toDateString() === today.toDateString()
    )
  )
  const tomorrowTasks = tasks.filter(t =>
    t.status !== "done" &&
    t.due_date &&
    new Date(t.due_date).toDateString() === tomorrow.toDateString()
  )
  const somedayTasks = tasks.filter(t =>
    t.status !== "done" &&
    t.due_date &&
    new Date(t.due_date) > tomorrow
  )

  return (
    <div className="flex flex-1 min-h-screen">
      <main className="flex-1 mr-right_panel_width flex flex-col
                       min-h-screen bg-background">
        <TopBar
          taskCount={tasks.filter(t => t.status !== "done").length}
          onQuickTask={() => setModalOpen(true)}
        />

        <section className="flex-1 overflow-y-auto p-10 space-y-12">
          {loading ? <Spinner /> : (
            <>
              <TaskSection
                title="Today"
                tasks={todayTasks}
                onStatusChange={handleStatusChange}
              />
              <TaskSection
                title="Tomorrow"
                tasks={tomorrowTasks}
                onStatusChange={handleStatusChange}
              />
              <TaskSection
                title="Someday"
                tasks={somedayTasks}
                onStatusChange={handleStatusChange}
              />
            </>
          )}
        </section>
      </main>

      <RightPanel sessions={sessions} tasks={tasks} />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setModalOpen(true)}
        className="fixed bottom-10 right-[340px] w-14 h-14
                   bg-primary text-on-primary rounded-full
                   flex items-center justify-center shadow-2xl
                   amber-glow z-50 hover:scale-105 active:scale-95
                   transition-transform"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </motion.button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Task"
      >
        <CreateTaskForm
          onSubmit={handleCreate}
          onClose={() => setModalOpen(false)}
          categories={categories}
        />
      </Modal>
    </div>
  )
}