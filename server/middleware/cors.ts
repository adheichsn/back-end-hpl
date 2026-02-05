export default defineEventHandler((event) => {
    const origin = getHeader(event, "origin") || ""
    const config = useRuntimeConfig()

    const raw = (config.CORS_ORIGINS as string | undefined) || ""
    const allowed = new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))

    if (origin && allowed.has(origin)) {
        setHeader(event, "Access-Control-Allow-Origin", origin)
        setHeader(event, "Vary", "Origin")
    }

    setHeader(event, "Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
    setHeader(event, "Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
    setHeader(event, "Access-Control-Max-Age", 86400)

    if (getMethod(event) === "OPTIONS") {
        setResponseStatus(event, 204)
        return ""
    }
})
