import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Journal from "./pages/Journal"
import Habits from "./pages/Habits"
import Pomodoro from "./pages/Pomodoro"
import MoodCheckin from "./pages/MoodCheckin"

export default function App() {
  return (
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element ={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/mood" element={<MoodCheckin />} />
      </Routes>
    </Layout>
    </BrowserRouter>
  )
}