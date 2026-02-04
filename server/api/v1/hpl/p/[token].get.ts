import { ok, fail } from "~/server/utils/response"
import { getPublishRecord } from "~/server/data/hpl.publish"
import { getSession } from "~/server/data/hpl.sessions"

export default defineEventHandler((event) => {
    const token = getRouterParam(event, "token")
    if (!token) return fail("VALIDATION_ERROR", { details: "missing token" }, "VAL_001")

    const rec = getPublishRecord(token)
    if (!rec) return fail("NOT_FOUND", { details: "publish link invalid/expired" }, "NF_404")

    const s = getSession(rec.sessionId)
    if (!s) return fail("NOT_FOUND", { details: "session not found" }, "NF_404")

    return ok({
        gameId: rec.gameId,
        sessionId: rec.sessionId,
        minigameId: rec.minigameId,
        expiresAt: s.expiresAt,
        status: s.status,
        state: s.state,
    })
})
