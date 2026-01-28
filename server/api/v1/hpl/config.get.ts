import { ok, fail } from "~/server/utils/response"
import { MINIGAMES } from "~/server/data/minigames.dummy"
// import { useHplClient } from "~/server/services/hpl.client"

export default defineEventHandler(async () => {
    // try {
    //     const { fetchHpl } = useHplClient()
    //     const msResp: any = await fetchHpl("/config", { method: "GET" })
    //     return ok(msResp)
    // } catch (e: any) {
    //     return fail("UPSTREAM_ERROR", { details: e?.message }, "UP_502")
    // }
    return ok({ minigames: MINIGAMES })
})
