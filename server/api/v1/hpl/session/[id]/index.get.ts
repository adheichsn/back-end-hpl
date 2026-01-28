import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { getSession } from "~/server/data/hpl.sessions"

export default defineEventHandler((event) => {
    const guestId = requireGuestId(event)
    if (!guestId) return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")

    const id = getRouterParam(event, "id")
    if (!id) return fail("VALIDATION_ERROR", { details: "missing id" }, "VAL_001")

    const s = getSession(id)
    if (!s) return fail("NOT_FOUND", { details: "session not found" }, "NF_404")
    if (s.guestId !== guestId) return fail("FORBIDDEN", { details: "not your session" }, "AUTH_403")

    const game_id = s.state?.game_id ?? s.state?.game?.game_id ?? null

    return ok({
        sessionId: s.sessionId,
        status: s.status,
        state: s.state,
        expiresAt: s.expiresAt,
        game_id,
    })
})
