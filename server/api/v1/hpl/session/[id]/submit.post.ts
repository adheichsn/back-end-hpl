import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { getSession, patchSession, finishSession } from "~/server/data/hpl.sessions"

export default defineEventHandler(async (event) => {
    const guestId = requireGuestId(event)
    if (!guestId) return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")

    const id = getRouterParam(event, "id")
    if (!id) return fail("VALIDATION_ERROR", { details: "missing id" }, "VAL_001")

    const s = getSession(id)
    if (!s) return fail("NOT_FOUND", { details: "session not found" }, "NF_404")
    if (s.guestId !== guestId) return fail("FORBIDDEN", { details: "not your session" }, "AUTH_403")

    if (s.status === "FINISHED") {
        return ok({ sessionId: s.sessionId, status: s.status, gameId: s.gameId, state: s.state, expiresAt: s.expiresAt }, "Already finished")
    }

    const body = await readBody(event)
    const submittedAt = new Date().toISOString()

    const scoreRaw = body?.score ?? body?.payload?.score
    const maxRaw = body?.maxScore ?? body?.payload?.maxScore

    const score =
        typeof scoreRaw === "number" && Number.isFinite(scoreRaw) && scoreRaw >= 0
            ? scoreRaw
            : (s.state?.score?.current ?? 0)

    const maxScore =
        typeof maxRaw === "number" && Number.isFinite(maxRaw) && maxRaw >= 0
            ? maxRaw
            : (s.state?.score?.max ?? 0)

    const submissions = Array.isArray(s.state?.submissions) ? s.state.submissions : []
    const submissionsNext = [...submissions, { submittedAt, payload: body }]

    const patch = {
        submissions: submissionsNext,
        score: { current: score, max: maxScore },
        lastPayload: body,
        lastSubmittedAt: submittedAt,
    }

    const finish = body?.finish === true
    const updated = finish ? finishSession(id, patch) : patchSession(id, patch)

    return ok({
        sessionId: updated?.sessionId,
        status: updated?.status,
        gameId: s.gameId,
        score: updated?.state?.score,
        state: updated?.state,
        expiresAt: updated?.expiresAt,
    }, finish ? "Submitted & finished" : "Submitted")
})