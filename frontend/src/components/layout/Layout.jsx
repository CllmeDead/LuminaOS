import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import AIChat from "../ai/AIChat"

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-1 ml-sidebar_width min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      <AIChat mood="neutral" />
    </div>
  )
}