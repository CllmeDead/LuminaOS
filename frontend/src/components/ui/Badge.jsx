const variants = {
    urgent: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-lumina-amber/20 text-lumina-amber border-lumina-amber/30",
    low: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",

    todo: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    in_progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    done: "bg-green-500/20 text-green-400 border-green-500/30",
    archived: "bg-zinc-700/20 text-zinc-600 border-zinc-700/30",

    great: "bg-green-500/20 text-green-400 border-green-500/30",
    good: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    neutral: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    low: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    rough: "bg-red-500/20 text-red-400 border-red-500/30",
}

export default function Badge({ label, variant }) {
    return (
        <span className={`
            text-xs font-medium px-2 py-0.5 rounded-full border
            ${variants[variant] || variants.medium}
        `}>
            {label}
        </span>
    )
}