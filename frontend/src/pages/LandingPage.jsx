import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { ArrowRight, Sparkles, CheckCircle2, BrainCircuit, CalendarClock, NotebookPen, TimerReset } from "lucide-react"
import { api } from "../api"

const features = [
  {
    title: "AI Morning Briefing",
    description: "Start the day with priorities, habits, and a calm plan tailored to your energy.",
    icon: BrainCircuit,
  },
  {
    title: "Flow Sessions",
    description: "Use a focused Pomodoro timer with gentle cues to stay present and productive.",
    icon: TimerReset,
  },
  {
    title: "Reflect with Ease",
    description: "Capture your thoughts, mood, and progress in one beautiful daily journal.",
    icon: NotebookPen,
  },
]

const highlights = [
  "Task planning with clear priorities",
  "Habit building that keeps momentum visible",
  "Mood tracking that supports better routines",
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ email: "", password: "", name: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = mode === "login"
        ? await api.loginUser({ email: form.email, password: form.password })
        : await api.registerUser({ email: form.email, password: form.password, name: form.name })

      localStorage.setItem("lumina_token", response.token)
      localStorage.setItem("lumina_user", JSON.stringify(response.user))
      navigate("/app")
    } catch (err) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060606] text-[#f7f1ea]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060606]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-xl font-semibold tracking-tight text-[#f5a623]" style={{ fontFamily: "'Playfair Display', serif" }}>Lumina</p>
            <p className="text-xs uppercase tracking-[0.35em] text-[#a7a09a]">AI productivity OS</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-[#d7d0ca] md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#about" className="transition hover:text-white">About</a>
          </nav>
          <button
            onClick={() => navigate("/app")}
            className="rounded-full border border-[#f5a623]/40 bg-[#f5a623]/10 px-4 py-2 text-sm font-medium text-[#ffd07a] transition hover:bg-[#f5a623]/20"
          >
            Open App
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16 lg:px-8 lg:py-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1 text-sm text-[#ffd07a]">
              <Sparkles size={16} />
              Calm intelligence for your everyday rhythm
            </div>
            <h1 className="text-4xl font-semibold leading-[0.95] text-white sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              Plan less. Focus more. Let Lumina guide your day.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#b8b1aa]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Bring tasks, habits, journaling, mood, and deep work into one elegant workspace designed to feel lighter than your to-do list.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/app")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5a623] px-6 py-3 font-semibold text-[#120b04] transition hover:opacity-90"
              >
                Launch Lumina
                <ArrowRight size={18} />
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-[#f2ece7] transition hover:border-[#f5a623]/40 hover:text-white"
              >
                Explore features
              </a>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 rounded-[24px] border border-white/10 bg-[#0f0f0f] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              <div className="mb-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${mode === "login" ? "bg-[#f5a623] text-[#120b04]" : "text-[#d7d0ca]"}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${mode === "register" ? "bg-[#f5a623] text-[#120b04]" : "text-[#d7d0ca]"}`}
                >
                  Create account
                </button>
              </div>
              {mode === "register" && (
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="mb-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                  placeholder="Your name"
                />
              )}
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="mb-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="mb-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                placeholder="Password"
                required
              />
              {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f5a623] px-6 py-3 font-semibold text-[#120b04] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
                <ArrowRight size={18} />
              </button>
            </form>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-[#8f8a84]">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#f5a623]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.35)]"
          >
            <div className="rounded-[24px] border border-white/10 bg-[#0f0f0f] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8f8a84]">Today at a glance</p>
                  <h2 className="text-xl font-semibold text-white">Your calm command center</h2>
                </div>
                <div className="rounded-full border border-[#f5a623]/20 bg-[#f5a623]/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#ffd07a]">
                  Focus mode
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-[#ffd07a]">
                    <CalendarClock size={16} />
                    Morning briefing
                  </div>
                  <p className="text-sm text-[#d7d0ca]">2 priorities, 1 habit streak, and a gentle nudge to journal before lunch.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-[#ffd07a]">
                    <TimerReset size={16} />
                    Deep work session
                  </div>
                  <p className="text-sm text-[#d7d0ca]">25 minutes of focused flow, with a short reset waiting after.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-[#ffd07a]">
                    <NotebookPen size={16} />
                    Evening reflection
                  </div>
                  <p className="text-sm text-[#d7d0ca]">Capture the day’s wins and what needs more care tomorrow.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 * index }}
                className="rounded-[24px] border border-white/10 bg-[#0f0f0f] p-6"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-[#f5a623]/10 p-3 text-[#f5a623]">
                  <Icon size={20} />
                </div>
                <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#b8b1aa]">{feature.description}</p>
              </motion.article>
            )
          })}
        </section>

        <section id="about" className="rounded-[32px] border border-[#f5a623]/20 bg-[#111111] p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#f5a623]">Why people love it</p>
              <h2 className="mt-3 text-3xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>A lighter way to stay intentional.</h2>
            </div>
            <div className="grid gap-4 text-sm text-[#d7d0ca] sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Focused by design</p>
                <p className="mt-2 leading-7">Every section is built to reduce decision fatigue and keep your attention on what matters.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Personal and adaptive</p>
                <p className="mt-2 leading-7">The experience grows with your routines, helping you reflect, reset, and move forward.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-[#8f8a84] lg:px-8">
        Built for thoughtful days and steady progress.
      </footer>
    </div>
  )
}
