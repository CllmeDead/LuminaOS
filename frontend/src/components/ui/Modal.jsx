import { motion, AnimatePresence } from "framer-motion"

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={e => e.stopPropagation()}
            className="fixed top-1 left-1/2 -translate-x-1/2 -translate-y-1/2
                       z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-display-lg text-[24px] text-on-surface">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span ClassName="material-symbols-outlined">
                      close
                    </span>
                  </button>
                </div>
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}