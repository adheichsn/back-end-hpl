import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { MINIGAMES } from "~/server/data/minigames.dummy"
import { getSession, setMinigame, finishSession, patchSession } from "~/server/data/hpl.sessions"

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
        return ok({ done: true, status: "FINISHED", sessionId: s.sessionId, gameId: s.gameId, minigameId: s.minigameId, state: s.state, expiresAt: s.expiresAt })
    }

    const completed: string[] = Array.isArray(s.state?.completed) ? s.state.completed : []
    const total = MINIGAMES.length

    const current = s.minigameId
    if (!completed.includes(current)) {
        return fail("VALIDATION_ERROR", { details: "current minigame not submitted yet" }, "VAL_002")
    }

    if (total > 0 && completed.length >= total) {
        const done = finishSession(sessionId, { progress: 100 })
        return ok({
            done: true,
            sessionId: done?.sessionId,
            status: done?.status,
            gameId: done?.gameId,
            minigameId: done?.minigameId,
            state: done?.state,
            expiresAt: done?.expiresAt,
        })
    }

    const idx = MINIGAMES.findIndex((m) => m.slug === current)

    if (idx < 0) {
        return fail("VALIDATION_ERROR", { details: "invalid current minigameId" }, "VAL_003")
    }

    const next = MINIGAMES[idx + 1]

    if (!next) {
        const done = finishSession(sessionId, { progress: 100 })
        return ok({
            done: true,
            sessionId: done?.sessionId,
            status: done?.status,
            gameId: done?.gameId,
            minigameId: done?.minigameId,
            state: done?.state,
            expiresAt: done?.expiresAt,
        })
    }

    setMinigame(sessionId, next.slug)

    const progress = total > 0 ? Math.round((completed.length / total) * 100) : 0

    const updated = patchSession(sessionId, {
        currentIndex: idx + 1,
        total,
        progress,
    })

    return ok({
        done: false,
        sessionId: updated?.sessionId,
        status: updated?.status,
        gameId: updated?.gameId,
        minigameId: next.slug,
        state: updated?.state,
        expiresAt: updated?.expiresAt,
    })
})
