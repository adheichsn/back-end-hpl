import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { createSession, attachPublish } from "~/server/data/hpl.sessions"
import { createPublishLink } from "~/server/data/hpl.publish"
import { MINIGAMES } from "~/server/data/minigames.dummy"

export default defineEventHandler(async (event) => {
    const guestId = requireGuestId(event)
    if (!guestId) return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")

    const body = await readBody(event)
    const gameId = body?.gameId as string | undefined
    const minigameId = (body?.minigameId as string | undefined) || MINIGAMES[0]?.slug

    if (!gameId) return fail("VALIDATION_ERROR", { details: "missing gameId" }, "VAL_001")
    if (!minigameId) return fail("VALIDATION_ERROR", { details: "missing minigameId" }, "VAL_001")

    // validasi minigameId dari dummy list
    const exists = MINIGAMES.some((m) => m.slug === minigameId)
    if (!exists) return fail("VALIDATION_ERROR", { details: "invalid minigameId" }, "VAL_001")

    const s = createSession({ guestId, gameId, minigameId })

    // public publish token (shareable lintas device)
    const pub = createPublishLink({
        sessionId: s.sessionId,
        gameId,
        minigameId,
        ttlMinutes: 60,
    })

    // bangun full URL publish (domain dari request)
    const url = new URL(event.node.req.url || "/", `http://${event.node.req.headers.host}`)
    const linkPublish = `${url.origin}/api/v1/hpl/p/${pub.token}`

    attachPublish(s.sessionId, { token: pub.token, url: linkPublish })

    // TODO: notify MARSHALL (dummy)
    console.log("[DUMMY] LAUNCH -> MARSHALL", {
        guestId,
        gameId,
        sessionId: s.sessionId,
        minigameId,
        linkPublish,
    })

    return ok({
        gameId,
        sessionId: s.sessionId,
        minigameId,
        linkPublish,
        expiresAt: s.expiresAt,
        status: s.status,
        state: s.state,
    })
})
