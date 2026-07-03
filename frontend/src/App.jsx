import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Journal from "./pages/Journal"
import Habits from "./pages/Habits"
import Pomodoro from "./pages/Pomodoro"
import MoodCheckin from "./pages/MoodCheckin"
import LandingPage from "./pages/LandingPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Layout><Dashboard /></Layout>} />
        <Route path="/app/tasks" element={<Layout><Tasks /></Layout>} />
        <Route path="/app/journal" element={<Layout><Journal /></Layout>} />
        <Route path="/app/habits" element={<Layout><Habits /></Layout>} />
        <Route path="/app/pomodoro" element={<Layout><Pomodoro /></Layout>} />
        <Route path="/app/mood" element={<Layout><MoodCheckin /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}