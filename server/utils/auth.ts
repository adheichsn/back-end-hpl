import { verifyGuestToken } from "./guestJwt"

export function getBearerToken(event: any) {
    const auth = getHeader(event, "authorization") || ""
    return auth.startsWith("Bearer ") ? auth.slice(7) : null
}

export function requireGuestId(event: any) {
    const config = useRuntimeConfig()

    const secret = config.GUEST_JWT_SECRET
    if (typeof secret !== "string" || !secret.length) return null

    const token = getBearerToken(event)
    if (!token) return null

    try {
        const payload = verifyGuestToken(token, secret)
        if (payload.typ !== "guest") return null
        return payload.sub
    } catch {
        return null
    }
}



