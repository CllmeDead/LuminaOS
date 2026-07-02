export function getInitials(name) {
  if (!name || !name.trim()) return "?"

  return name
    .trim()
    .split(" ")
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .join("")
}