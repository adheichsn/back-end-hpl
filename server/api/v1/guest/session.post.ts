import crypto from "node:crypto"
import { signGuestToken } from "~/server/utils/guestJwt"
import { ok } from "~/server/utils/response"

export default defineEventHandler(async () => {
    const config = useRuntimeConfig()

    const guestId = "gst_" + crypto.randomBytes(16).toString("hex")
    const accessToken = signGuestToken(guestId, config.GUEST_JWT_SECRET)

    return ok({
        guestId,
        accessToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    })
})