import { ok, fail } from "~/utils/response"
import { LEVELS } from "~/server/data/minigames.dummy"
import type { MinigameSlug } from "~/server/data/minigames.dummy"

export default defineEventHandler((event) => {
    const slug = getRouterParam(event, "slug") as MinigameSlug
    const idRaw = getRouterParam(event, "id")
    const id = Number(idRaw)

    if (!slug || !Number.isFinite(id)) {
        return fail("VALIDATION_ERROR", { details: "invalid slug or id" }, "VAL_001")
    }

    const level = (LEVELS as any)[slug]?.[id]
    if (!level) {
        return fail("NOT_FOUND", { details: `level not found for ${slug} id=${id}` }, "NF_404")
    }

    return ok(level)
})
