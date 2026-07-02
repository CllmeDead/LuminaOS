import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart2, X } from "lucide-react"

function isShowReportDay() {
    return new Date().getDay() === 0
}

export default function Weeklyreport() {
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (!isShowReportDay()) return
        const seen = sessionStorage.getItem("weekly-report-seen")
        if (seen) return

        setLoading(true)
        setVisible(true)

        fetch("/api/ai/weekly-report")
            .then(res => res.json())
            .then(data => setReport(data.content))
            .catch(err => console.error("Weekly report error:", err))
            .finally(() => setLoading(false))
    }, [])

    const fetchReport = () => {
        setVisible(true)
        setLoading(true)
        fetch("/api/ai/weekly-report")
            .then(res => res.json())
            .then(data => setReport(data.content))
            .catch(err => console.error("Weekly report error:", err))
            .finally(() => setLoading(false))
    }

    return (
        <>
        {}
        <button
            onClick={fetchReport}
            className="felx items-center gap-2 text-lumina-muted hover:text-lumina-amber transition-colors text-sm"
        >
            <BarChart2 size={16} />
            Weekly report
        </button>

        {}
        <AnimatePresence>
            {visible && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1}}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            setVisible(false)
                            sessionStorage.setItem("weekly-report-seen", "true")
                        }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2-translate-y-1/2 z-50 w-full max-w-lg"
                    >
                        <div className="card shadow-elevated m-4">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lumina-text font-semibold text-lg">
                                        Weekly Report
                                    </h2>
                                    <p className="text-lumina-subtle text-xs mt-0.5">
                                        {new Date().toLocaleDateString("en-US", {
                                            month: "long", day: "numeric", year: "numeric"
                                        })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setVisible(false)
                                        sessionStorage.setItem("weekly-report-seen", "true")
                                    }}
                                    className="text-lumina-subtle hover:text-lumina-text transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {loading ? (
                                <div className="space-y-3 py-4">
                                    {[1,2,3].map(i => (
                                        <div key={i}
                                            className="h-3 bg-lumina-elevated rounded animate-pulse"
                                            style={{ width: `${70 + i * 10}%` }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-lumina-text text-sm leading-relaxed whitespace-pre-wrap">
                                    {report}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
        </>
    )
}