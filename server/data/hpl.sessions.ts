type Session = {
    sessionId: string
    guestId: string

    // NEW:
    gameId: string
    minigameId: string
    linkPublishToken?: string
    linkPublishUrl?: string

    createdAt: string
    expiresAt: string
    state: any
    status: "RUNNING" | "FINISHED"
}

const sessions = new Map<string, Session>()

export function createSession(input: { guestId: string; gameId: string; minigameId: string }) {
    const sessionId = "sess_" + Math.random().toString(16).slice(2)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000)

    const s: Session = {
        sessionId,
        guestId: input.guestId,
        gameId: input.gameId,
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

export function listSessionsByGuestId(guestId: string) {
    return Array.from(sessions.values()).filter((s) => s.guestId === guestId)
}

export function finishSession(sessionId: string, patch?: any) {
    const s = sessions.get(sessionId)
    if (!s) return null
    s.status = "FINISHED"
    s.state = { ...s.state, ...(patch || {}) }
    sessions.set(sessionId, s)
    return s
}

export function attachPublish(sessionId: string, patch: { token: string; url: string }) {
    const s = sessions.get(sessionId)
    if (!s) return null
    s.linkPublishToken = patch.token
    s.linkPublishUrl = patch.url
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

export function setMinigame(sessionId: string, minigameId: string) {
  const s = sessions.get(sessionId)
  if (!s) return null
  s.minigameId = minigameId
  sessions.set(sessionId, s)
  return s
}
