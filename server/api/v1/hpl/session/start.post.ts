import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { createSession } from "~/server/data/hpl.sessions"

export default defineEventHandler(async (event) => {
    const guestId = requireGuestId(event)
    if (!guestId) return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")

    const body = await readBody(event)
    const gameId = String(body?.gameId ?? "").trim()
    if (!gameId) return fail("VALIDATION_ERROR", { details: "missing gameId" }, "VAL_001")

    const s = createSession({ guestId, gameId })

    return ok({
        sessionId: s.sessionId,
        gameId: s.gameId,
        stepId: s.minigameId,
        status: s.status,
        state: s.state,
        expiresAt: s.expiresAt,
    }, "Session started")
})