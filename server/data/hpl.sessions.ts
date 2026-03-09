type Session = {
    sessionId: string
    guestId: string
    gameId: string

    createdAt: string
    expiresAt: string
    status: "RUNNING" | "FINISHED"

    state: {
        marshall?: {
            id_requests?: string
            game_type?: string
        }
        score: {
            current: number
            max: number
        }
        submissions: Array<{ submittedAt: string; payload: any }>
        lastPayload?: any
        lastSubmittedAt?: string
    }
}

const sessions = new Map<string, Session>()

export function createSession(input: { guestId: string; gameId: string }) {
    const sessionId = "sess_" + Math.random().toString(16).slice(2)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000)

    const s: Session = {
        sessionId,
        guestId: input.guestId,
        gameId: input.gameId,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: "RUNNING",
        state: {
            score: { current: 0, max: 0 },
            submissions: [],
        },
    }

    sessions.set(sessionId, s)
    return s
}

export function getSession(sessionId: string) {
    return sessions.get(sessionId) || null
}

export function finishSession(sessionId: string, patch?: Partial<Session["state"]>) {
    const s = sessions.get(sessionId)
    if (!s) return null
    s.status = "FINISHED"
    s.state = { ...s.state, ...(patch || {}) }
    sessions.set(sessionId, s)
    return s
}

export function patchSession(sessionId: string, patch?: Partial<Session["state"]>) {
    const s = sessions.get(sessionId)
    if (!s) return null
    s.state = { ...s.state, ...(patch || {}) }
    sessions.set(sessionId, s)
    return s
}