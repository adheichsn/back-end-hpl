import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { getSession } from "~/server/data/hpl.sessions"
import { MINIGAMES } from "~/server/data/minigames.dummy"

export default defineEventHandler((event) => {
    const guestId = requireGuestId(event)
    if (!guestId) return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")

    const id = getRouterParam(event, "id")
    if (!id) return fail("VALIDATION_ERROR", { details: "missing id" }, "VAL_001")

    const s = getSession(id)
    if (!s) return fail("NOT_FOUND", { details: "session not found" }, "NF_404")
    if (s.guestId !== guestId) return fail("FORBIDDEN", { details: "not your session" }, "AUTH_403")

    const completed: string[] = Array.isArray(s.state?.completed) ? s.state.completed : []
    const total = MINIGAMES.length
    const safeTotal = total || 1

    const rawProgress =
        typeof s.state?.progress === "number"
            ? s.state.progress
            : Math.round((completed.length / safeTotal) * 100)

    const progress = Math.max(0, Math.min(100, rawProgress))
    const isDone = s.status === "FINISHED" || (total > 0 && completed.length >= total)

    return ok({
        sessionId: s.sessionId,
        status: s.status,
        expiresAt: s.expiresAt,

        gameId: s.gameId,
        minigameId: s.minigameId,
        linkPublish: s.linkPublishUrl ?? null,

        isDone,

        state: {
            ...s.state,
            total,
            progress,
            completed,
        },
    })
})
