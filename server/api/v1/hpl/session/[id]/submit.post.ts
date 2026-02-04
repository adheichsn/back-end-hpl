import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { getSession, patchSession } from "~/server/data/hpl.sessions"
import { MINIGAMES } from "~/server/data/minigames.dummy"

export default defineEventHandler(async (event) => {
    const guestId = requireGuestId(event)
    if (!guestId) return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")

    const id = getRouterParam(event, "id")
    if (!id) return fail("VALIDATION_ERROR", { details: "missing id" }, "VAL_001")

    const s = getSession(id)
    if (!s) return fail("NOT_FOUND", { details: "session not found" }, "NF_404")
    if (s.guestId !== guestId) return fail("FORBIDDEN", { details: "not your session" }, "AUTH_403")

    const body = await readBody(event)
    const submittedAt = new Date().toISOString()

    const scoreRaw = body?.score
    const score =
        typeof scoreRaw === "number" && Number.isFinite(scoreRaw) && scoreRaw >= 0
            ? scoreRaw
            : 0

    const completed: string[] = Array.isArray(s.state?.completed) ? s.state.completed : []
    const scores: Record<string, number> =
        typeof s.state?.scores === "object" && s.state?.scores ? s.state.scores : {}

    const current = s.minigameId
    const completedNext = completed.includes(current) ? completed : [...completed, current]
    const scoresNext = { ...scores, [current]: score }

    const total = MINIGAMES.length
    const progress = total > 0 ? Math.round((completedNext.length / total) * 100) : 0

    const updated = patchSession(id, {
        submittedAt,
        completed: completedNext,
        scores: scoresNext,
        lastPayload: body,
        progress,
    })

    console.log("[DUMMY] SUBMIT -> MARSHALL", {
        guestId,
        gameId: s.gameId,
        sessionId: s.sessionId,
        minigameId: s.minigameId,
        score,
        payload: body,
    })

    return ok({
        sessionId: updated?.sessionId,
        status: updated?.status,
        expiresAt: updated?.expiresAt,

        gameId: s.gameId,
        minigameId: s.minigameId,

        state: updated?.state,
    })
})
