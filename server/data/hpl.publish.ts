type PublishRecord = {
    token: string
    sessionId: string
    gameId: string
    minigameId: string
    createdAt: string
    expiresAt: string
}

const publishMap = new Map<string, PublishRecord>()

function genToken() {
    // token panjang biar susah ditebak
    return (
        "pub_" +
        Math.random().toString(16).slice(2) +
        Math.random().toString(16).slice(2) +
        Date.now().toString(16)
    )
}

export function createPublishLink(input: {
    sessionId: string
    gameId: string
    minigameId: string
    ttlMinutes?: number
}) {
    const now = new Date()
    const ttl = (input.ttlMinutes ?? 60) * 60 * 1000 // default 60 menit
    const expiresAt = new Date(now.getTime() + ttl)

    const token = genToken()
    const rec: PublishRecord = {
        token,
        sessionId: input.sessionId,
        gameId: input.gameId,
        minigameId: input.minigameId,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
    }

    publishMap.set(token, rec)
    return rec
}

export function getPublishRecord(token: string) {
    const rec = publishMap.get(token)
    if (!rec) return null
    if (new Date(rec.expiresAt).getTime() < Date.now()) return null
    return rec
}
