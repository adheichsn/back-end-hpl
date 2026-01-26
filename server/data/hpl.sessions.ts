type Session = {
    sessionId: string
    guestId: string
    minigameId: string
    createdAt: string
    expiresAt: string
    state: any
    status: "RUNNING" | "FINISHED"
}

const sessions = new Map<string, Session>()

export function createSession(input: { guestId: string; minigameId: string }) {
    const sessionId = "sess_" + Math.random().toString(16).slice(2)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000)

    const s: Session = {
        sessionId,
        guestId: input.guestId,
        minigameId: input.minigameId,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: "RUNNING",
        state: { progress: 0 }
    }

    sessions.set(sessionId, s)
    return s
}

export function getSession(sessionId: string) {
    return sessions.get(sessionId) || null
}

export function finishSession(sessionId: string, patch?: any) {
    const s = sessions.get(sessionId)
    if (!s) return null
    s.status = "FINISHED"
    s.state = { ...s.state, ...(patch || {}) }
    sessions.set(sessionId, s)
    return s
}
