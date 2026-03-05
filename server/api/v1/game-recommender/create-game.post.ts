import { ok, fail } from "~/server/utils/response"
import { marshallGenerateGame } from "~/server/services/marshall.client"
import { getSession, patchSession } from "~/server/data/hpl.sessions"
import { requireGuestId } from "~/server/utils/auth"

export default defineEventHandler(async (event) => {
    const guestId = requireGuestId(event)
    if (!guestId) return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")

    const body = await readBody(event)
    const lu_core = String(body?.lu_core ?? "").trim()
    const sessionId = body?.sessionId ? String(body.sessionId).trim() : ""

    if (!lu_core) return fail("VALIDATION_ERROR", { details: "missing lu_core" }, "VAL_001")

    // optional: validasi session milik guest
    if (sessionId) {
        const s = getSession(sessionId)
        if (!s) return fail("NOT_FOUND", { details: "session not found" }, "NF_404")
        if (s.guestId !== guestId) return fail("FORBIDDEN", { details: "not your session" }, "AUTH_403")
    }

    const data = await marshallGenerateGame(lu_core)

    if (sessionId) {
        const s = getSession(sessionId)!
        patchSession(sessionId, {
            marshall: {
                ...(s.state.marshall || {}),
                id_requests: data.id_requests,
                game_type: data.game_type,
            },
        })
    }

    return ok(data, "Game request created")
})