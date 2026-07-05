import { useState, useEffect } from "react"
import { TrendingUp } from "lucide-react"

const BASE_URL = import.meta.env.VITE_API_URL || "/api"

export default function PatternInsight() {
    const [insight, SetInsight] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${BASE_URL}/ai/patterns`)
            .then(res => res.json())
            .then(data => setInsight(data.content))
            .catch(err => console.error("Pattern error:", err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return null

    return (
        <div className="card border-lumina-info/20 bg-lumina-info/5">
            <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-lumina-info/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={14} className="text-lumina-info" />
                </div>
                <div>
                    <p className="text-xs text-lumina-info font-medium mb-1">
                        Pattern detected
                    </p>
                    <p className="text-lumina-text text-sm leading-relaxed">
                        {insight}
                    </p>
                </div>
            </div>
        </div>
    )
}