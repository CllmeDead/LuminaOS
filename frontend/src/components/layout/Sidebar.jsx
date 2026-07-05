import { useState, useEffect, useRef } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const navItems = [
  { path: "/app",         label: "Dashboard", icon: "dashboard" },
  { path: "/app/tasks",    label: "Tasks",     icon: "checklist" },
  { path: "/app/journal",  label: "Journal",   icon: "edit_note" },
  { path: "/app/habits",   label: "Habits",    icon: "auto_awesome" },
  { path: "/app/pomodoro", label: "Focus",     icon: "timer" },
  { path: "/app/mood",     label: "Mood",      icon: "sentiment_satisfied" },
]

export default function Sidebar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem("lumina_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        setUser(null)
      }
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"

  function handleLogout() {
    localStorage.removeItem("lumina_token")
    localStorage.removeItem("lumina_user")
    navigate("/")
  }

  return (
    <aside className="flex flex-col h-full w-sidebar_width bg-surface border-r border-outline-variant z-50 fixed left-0 top-0">

      <div className="p-6">
        <h1 className="font-display-lg text-headline-lg text-primary-container">
          Lumina
        </h1>
        <p className="font-label-sm-caps text-on-surface-variant mt-1 text-xs">
          Your productivity OS
        </p>
      </div>

      <button className="mx-6 mb-6 py-3 bg-primary-container text-on-primary-fixed rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all amber-glow-hover">
        <span className="material-symbols-outlined">Add</span>
        New
      </button>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink to={item.path} end={item.path === "/app"}>
                {({ isActive }) => (
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 py-4 px-6 transition-colors duration-200 cursor-pointer
                      ${isActive
                        ? "text-primary border-1-2 border-primary bg-primary/5 active-indicator"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}>
                    <span
                      className="material-symbols-outlined"
                      style={isActive
                        ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        {item.icon}
                    </span>
                    <span className="font-label-sm-caps text-label-sm-caps">
                      {item.label}
                    </span>
                  </motion.div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-outline-variant pt-4 pb-6 px-6">
        <div className="mt-2 space-y-2">
          <a className="flex items-center gap-3 py-3 px-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors"
            href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-body-md text-sm">Settings</span>
          </a>
          <a className="flex items-center gap-3 py-3 px-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors"
            href="#">
              <span className="material-symbols-outlined">help</span>
              <span className="font-body-md text-sm">Support</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
