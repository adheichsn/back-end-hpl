import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { getSession, finishSession } from "~/server/data/hpl.sessions"

export default defineEventHandler(async (event) => {
    const guestId = requireGuestId(event)
    if (!guestId) return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")

    const gameId = getRouterParam(event, "gameId")
    if (!gameId) return fail("VALIDATION_ERROR", { details: "missing gameId" }, "VAL_001")

    const body = await readBody(event)
    const sessionId = String(body?.sessionId ?? "").trim()
    if (!sessionId) return fail("VALIDATION_ERROR", { details: "missing sessionId" }, "VAL_001")

    const s = getSession(sessionId)
    if (!s) return fail("NOT_FOUND", { details: "session not found" }, "NF_404")
    if (s.guestId !== guestId) return fail("FORBIDDEN", { details: "not your session" }, "AUTH_403")
    if (s.gameId !== gameId) return fail("FORBIDDEN", { details: "session not in this game" }, "AUTH_403")

    if (s.status === "FINISHED") {
        return ok(
            {
                done: true,
                sessionId: s.sessionId,
                status: s.status,
                gameId: s.gameId,
                state: s.state,
                expiresAt: s.expiresAt,
            },
            "Already finished"
        )
    }

    const submissions = Array.isArray(s.state?.submissions) ? s.state.submissions : []
    const hasSubmitted = submissions.length > 0

    if (!hasSubmitted) {
        setResponseStatus(event, 422)
        return fail("VALIDATION_ERROR", { details: "submit required before finish" }, "VAL_SUBMIT_REQUIRED")
    }

    const done = finishSession(sessionId)

    return ok(
        {
            done: true,
            sessionId: done?.sessionId,
            status: done?.status,
            gameId: done?.gameId,
            state: done?.state,
            expiresAt: done?.expiresAt,
        },
        "Finished"
    )
})