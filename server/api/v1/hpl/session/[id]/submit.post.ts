import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { getSession, patchSession } from "~/server/data/hpl.sessions"

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

    const stepId = s.state.flow.stepId // intro/play/result
    const completedSteps = Array.isArray(s.state.flow.completedSteps) ? s.state.flow.completedSteps : []
    const submissions = Array.isArray(s.state.submissions) ? s.state.submissions : []

    const completedNext = completedSteps.includes(stepId) ? completedSteps : [...completedSteps, stepId]
    const submissionsNext = [...submissions, { stepId, submittedAt, payload: body }]

    const total = s.state.flow.totalSteps || 3
    const progress = Math.round((completedNext.length / total) * 100)

    const updated = patchSession(id, {
        flow: {
            ...s.state.flow,
            completedSteps: completedNext,
            progress,
        },
        submissions: submissionsNext,
        lastPayload: body,
        lastSubmittedAt: submittedAt,
    })

    return ok({
        sessionId: updated?.sessionId,
        status: updated?.status,
        expiresAt: updated?.expiresAt,
        gameId: s.gameId,
        stepId,
        state: updated?.state,
    }, "Submitted")
})