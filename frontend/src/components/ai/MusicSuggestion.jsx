import { useState } from "react"
import { Music } from "lucide-react"

export default function MusicSuggestion({ taskTitle, taskCategory}) {
    const [suggestion, setSuggestio ] = useState(null)
    const [loading, setLoading ] = useState(false)

    const getSuggestion = () => {
        if (!taskTitle) return
        setLoading(true)

        fetch("/api/ai/music-suggestion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                task_title: taskTitle,
                task_category: taskCategory
            })
        })
            .then(res => res.json())
            .then(data => setSuggestion(data.content))
            .catch(err => console.error("Music error:", err))
            .finally(() => setLoading(false))
    }

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={getSuggestion}
                disabled={loading || !taskTitle}
                className="flex items-center gap-2 text-xs text-lumina-muted hover:text-lumina-amber transition-colors disabled:opacity-40"
            >
                <Music size={14} />
                {loading ? "Finding music..." : "Music for this task"}
            </button>
            {suggestion && (
                <p className="text-xs text-lumina-muted italic">
                    🎵 {suggestion}
                </p>
            )}
        </div>
    )
}