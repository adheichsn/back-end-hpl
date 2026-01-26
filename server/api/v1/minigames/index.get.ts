import { ok } from "~/utils/response"
import { MINIGAMES } from "~/server/data/minigames.dummy"

export default defineEventHandler(() => {
    return ok({ minigames: MINIGAMES })
})
