import { ok } from "~/server/utils/response"
import { MINIGAMES } from "~/server/data/minigames.dummy"

export default defineEventHandler(() => {
    // sementara 1 game yang berisi semua minigame dummy
    const games = [
        {
            id: "game_001",
            title: "HPL Game Launcher",
            description: "1 game berisi beberapa minigame",
            minigames: MINIGAMES.map((m) => ({
                id: m.slug,
                slug: m.slug,
                title: m.title,
                description: m.description,
            })),
        },
    ]

    return ok({ games })
})
