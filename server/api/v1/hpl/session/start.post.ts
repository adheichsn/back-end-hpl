// import { z } from "zod"
// import { ok, fail } from "~/utils/response"
// import { requireGuestId } from "~/utils/auth"
// import { useHplClient } from "~/server/services/hpl.client"

// const BodySchema = z.object({
//     minigameId: z.string().min(1),
// })

// export default defineEventHandler(async (event) => {
//     const guestId = requireGuestId(event)
//     if (!guestId) {
//         return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")
//     }

//     const bodyRaw = await readBody(event)
//     const parsed = BodySchema.safeParse(bodyRaw)
//     if (!parsed.success) {
//         return fail("VALIDATION_ERROR", { details: parsed.error.flatten() }, "VAL_001")
//     }

//     try {
//         const { fetchHpl } = useHplClient()
//         const msResp: any = await fetchHpl("/session/start", {
//             method: "POST",
//             body: { ...parsed.data, guestId },
//         })

//         return ok({
//             sessionId: msResp.sessionId ?? msResp.session_id,
//             expiresAt: msResp.expiresAt ?? msResp.expires_at,
//             state: msResp.state ?? {},
//         })
//     } catch (e: any) {
//         return fail("UPSTREAM_ERROR", { details: e?.message }, "UP_502")
//     }
// })

import { z } from "zod"
import { ok, fail } from "~/server/utils/response"
import { requireGuestId } from "~/server/utils/auth"
import { createSession } from "~/server/data/hpl.sessions"

const BodySchema = z.object({
    minigameId: z.string().min(1),
})

export default defineEventHandler(async (event) => {
    const guestId = requireGuestId(event)
    if (!guestId) return fail("UNAUTHORIZED", { details: "missing/invalid token" }, "AUTH_401")

    const bodyRaw = await readBody(event)
    const parsed = BodySchema.safeParse(bodyRaw)
    if (!parsed.success) {
        return fail("VALIDATION_ERROR", { details: parsed.error.flatten() }, "VAL_001")
    }

    const s = createSession({ guestId, minigameId: parsed.data.minigameId })

    return ok({
        sessionId: s.sessionId,
        expiresAt: s.expiresAt,
        state: s.state,
        status: s.status
    })
})
