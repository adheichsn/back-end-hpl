type StepId = "intro" | "play" | "result"

type Session = {
    sessionId: string
    guestId: string
    gameId: string

    minigameId: StepId

    createdAt: string
    expiresAt: string
    status: "RUNNING" | "FINISHED"

    state: {
        flow: {
            stepId: StepId
            stepIndex: number
            totalSteps: number
            progress: number
            completedSteps: StepId[]
        }
        marshall?: {
            id_requests?: string
            game_type?: string
        }
        submissions: Array<{ stepId: StepId; submittedAt: string; payload: any }>
        lastPayload?: any
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
        minigameId: "intro",
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: "RUNNING",
        state: {
            flow: {
                stepId: "intro",
                stepIndex: 0,
                totalSteps: 3,
                progress: 0,
                completedSteps: [],
            },
            submissions: [],
        },
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

export function patchSession(sessionId: string, patch?: any) {
    const s = sessions.get(sessionId)
    if (!s) return null
    s.state = { ...s.state, ...(patch || {}) }
    sessions.set(sessionId, s)
    return s
}

export function setMinigame(sessionId: string, stepId: StepId) {
    const s = sessions.get(sessionId)
    if (!s) return null
    s.minigameId = stepId
    s.state.flow.stepId = stepId
    sessions.set(sessionId, s)
    return s
}