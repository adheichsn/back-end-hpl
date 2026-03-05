export type MarshallGenerateGameResponse = {
    id_requests: string
    game_type: string
    status: string
    message: string
}

export type MarshallGetGameResponse = {
    id_requests: string
    game_type: string
    status: string
    data: any
}

export async function marshallGenerateGame(lu_core: string) {
    const config = useRuntimeConfig()
    const baseUrl = String(config.MARSHALL_BASE_URL || "")
    const apiKey = String(config.MARSHALL_API_KEY || "")

    if (!baseUrl) throw new Error("MARSHALL_BASE_URL not set")
    if (!apiKey) throw new Error("MARSHALL_API_KEY not set")

    const body = new URLSearchParams({ lu_core })

    return await $fetch<MarshallGenerateGameResponse>(
        `${baseUrl}/hpl/v1/game-recommender/generate-game`,
        {
            method: "POST",
            headers: {
                "X-API-Key": apiKey,
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
            timeout: 60_000,
        }
    )
}

export async function marshallGetGame(id_requests: string) {
    const config = useRuntimeConfig()
    const baseUrl = String(config.MARSHALL_BASE_URL || "")
    const apiKey = String(config.MARSHALL_API_KEY || "")

    if (!baseUrl) throw new Error("MARSHALL_BASE_URL not set")
    if (!apiKey) throw new Error("MARSHALL_API_KEY not set")

    return await $fetch<MarshallGetGameResponse>(
        `${baseUrl}/hpl/v1/game-recommender/game/${encodeURIComponent(id_requests)}`,
        {
            method: "GET",
            headers: { "X-API-Key": apiKey, "Accept": "application/json" },
            timeout: 60_000,
        }
    )
}