import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Journal from "./pages/Journal"
import Habits from "./pages/Habits"
import Pomodoro from "./pages/Pomodoro"
import MoodCheckin from "./pages/MoodCheckin"
import LandingPage from "./pages/LandingPage"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("lumina_token")
  return token ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/app/tasks" element={<ProtectedRoute><Layout><Tasks /></Layout></ProtectedRoute>} />
        <Route path="/app/journal" element={<ProtectedRoute><Layout><Journal /></Layout></ProtectedRoute>} />
        <Route path="/app/habits" element={<ProtectedRoute><Layout><Habits /></Layout></ProtectedRoute>} />
        <Route path="/app/pomodoro" element={<ProtectedRoute><Layout><Pomodoro /></Layout></ProtectedRoute>} />
        <Route path="/app/mood" element={<ProtectedRoute><Layout><MoodCheckin /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}