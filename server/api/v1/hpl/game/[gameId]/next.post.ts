import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { getSession, setMinigame, finishSession, patchSession } from "~/server/data/hpl.sessions"

const STEPS = ["intro", "play", "result"] as const

export default defineEventHandler(async (event) => {
    const guestId = requireGuestId(event)
    if (!guestId) return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")

    const gameId = getRouterParam(event, "gameId")
    if (!gameId) return fail("VALIDATION_ERROR", { details: "missing gameId" }, "VAL_001")

    const body = await readBody(event)
    const sessionId = body?.sessionId as string | undefined
    if (!sessionId) return fail("VALIDATION_ERROR", { details: "missing sessionId" }, "VAL_001")

    const s = getSession(sessionId)
    if (!s) return fail("NOT_FOUND", { details: "session not found" }, "NF_404")
    if (s.guestId !== guestId) return fail("FORBIDDEN", { details: "not your session" }, "AUTH_403")
    if (s.gameId !== gameId) return fail("FORBIDDEN", { details: "session not in this game" }, "AUTH_403")

    if (s.status === "FINISHED") {
        return ok({ done: true, status: "FINISHED", sessionId: s.sessionId, gameId: s.gameId, stepId: s.state.flow.stepId, state: s.state, expiresAt: s.expiresAt })
    }

    const current = s.state.flow.stepId
    const completed = Array.isArray(s.state.flow.completedSteps) ? s.state.flow.completedSteps : []

    // rule: selain intro, step harus sudah submit sebelum next
    if (current !== "intro" && !completed.includes(current)) {
        return fail("VALIDATION_ERROR", { details: "current step not submitted yet" }, "VAL_002")
    }

    const idx = STEPS.findIndex((x) => x === current)
    if (idx < 0) return fail("VALIDATION_ERROR", { details: "invalid stepId" }, "VAL_003")

    const next = STEPS[idx + 1]
    if (!next) {
        const done = finishSession(sessionId, {
            flow: { ...s.state.flow, progress: 100 },
        })
        return ok({
            done: true,
            sessionId: done?.sessionId,
            status: done?.status,
            gameId: done?.gameId,
            stepId: done?.state.flow.stepId,
            state: done?.state,
            expiresAt: done?.expiresAt,
        })
    }

    setMinigame(sessionId, next)

    const progress = Math.round(((idx + 1) / STEPS.length) * 100)
    const updated = patchSession(sessionId, {
        flow: { ...s.state.flow, stepId: next, stepIndex: idx + 1, progress },
    })

    return ok({
        done: false,
        sessionId: updated?.sessionId,
        status: updated?.status,
        gameId: updated?.gameId,
        stepId: next,
        state: updated?.state,
        expiresAt: updated?.expiresAt,
    })
})