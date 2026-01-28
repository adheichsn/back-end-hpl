import jwt from "jsonwebtoken"

export function signGuestToken(guestId: string, secret: string) {
    // token 7 hari
    return jwt.sign({ sub: guestId, typ: "guest" }, secret, { expiresIn: "7d" })
}

export function verifyGuestToken(token: string, secret: string) {
    return jwt.verify(token, secret) as {
        sub: string
        typ: "guest"
        iat: number
        exp: number
    }
}
