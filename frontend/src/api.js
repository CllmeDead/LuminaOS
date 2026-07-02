const BASE_URL = "/api"

async function request(method, path, body = null) {
    const options = {
        method,
        headers: { "Content-Type": "application/json" },
    }
    if (body) options.body = JSON.stringify(body)

    const res = await fetch(`${BASE_URL}${path}`, options)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    if (res.status === 204) return null
    return res.json()
}

export const api = {
    getTasks: (params = {}) => request("GET", `/tasks/?${new URLSearchParams(params)}`),
    createTask: (data) => request("POST", "/tasks/", data),
    updateTask: (id, data) => request("PUT", `/tasks/${id}`, data),
    deleteTask: (id) => request("DELETE", `/tasks/${id}`),

    getCategories: () => request("GET", "/categories/"),

    getEntries: (params = {}) => request("GET", `/journal/?${new URLSearchParams(params)}`),
    createEntry: (data) => request("POST", "/journal/", data),
    updateEntry: (id, data) => request("PUT", `/journal/${id}`, data),
    deleteEntry: (id) => request("DELETE", `/journal/${id}`),

    getHabits: () => request("GET", "/habits/"),
    createHabit: (data) => request("POST", "/habits/", data),
    completeHabit: (id) => request("POST", `/habits/${id}/complete`, {}),

    getSessions: () => request("GET", "/pomodoro/"),
    startSession: (data) => request("POST", "/pomodoro/", data),
    updateSession: (id, data) => request("PUT", `/pomodoro/${id}`, data),

    getMoodCheckins: () => request("GET", "/mood/"),
    createMoodCheckin: (data) => request("POST", "/mood/", data),
}