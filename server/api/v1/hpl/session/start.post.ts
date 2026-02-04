import { fail } from "~/server/utils/response"

export default defineEventHandler(() => {
    return fail(
        "DEPRECATED",
        { details: "Use POST /api/v1/hpl/game/launch instead" },
        "DEP_410"
    )
})
