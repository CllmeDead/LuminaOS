export const MOCK_TASKS = [
  { id: 1, title: "Set up React frontend",    priority: "urgent", status: "done",        category: { name: "Work",     color: "#6366F1" }, due_date: null },
  { id: 2, title: "Build task API endpoints", priority: "high",   status: "done",        category: { name: "Work",     color: "#6366F1" }, due_date: null },
  { id: 3, title: "Design Lumina UI",         priority: "high",   status: "in_progress", category: { name: "Work",     color: "#6366F1" }, due_date: null },
  { id: 4, title: "Morning run",              priority: "medium", status: "todo",        category: { name: "Health",   color: "#10B981" }, due_date: null },
  { id: 5, title: "Read 20 minutes",          priority: "low",    status: "todo",        category: { name: "Learning", color: "#8B5CF6" }, due_date: null },
]

export const MOCK_HABITS = [
  { id: 1, name: "Morning run",    icon: "🏃", color: "#10B981", current_streak: 5,  target_streak: 30, completed_today: false },
  { id: 2, name: "Read 20 min",    icon: "📚", color: "#8B5CF6", current_streak: 12, target_streak: 30, completed_today: true  },
  { id: 3, name: "Drink 2L water", icon: "💧", color: "#6366F1", current_streak: 3,  target_streak: 21, completed_today: false },
]