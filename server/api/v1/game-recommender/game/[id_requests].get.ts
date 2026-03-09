
import type { H3Event } from "h3"
import { ok, fail, type ApiOk, type ApiFail } from "@/server/utils/response"
import { marshallGetGame } from "@/server/services/marshall.client"
import type { MarshallGetGameResponse } from "@/server/services/marshall.client"

export default defineEventHandler(
    async (event: H3Event): Promise<ApiOk<MarshallGetGameResponse> | ApiFail> => {
        try {
            const id_requests = String(getRouterParam(event, "id_requests") || "").trim()

            if (!id_requests) {
                setResponseStatus(event, 422)
                return fail("id_requests is required", { field: "id_requests" }, "VALIDATION_ERROR")
            }

            const data = await marshallGetGame(id_requests)
            return ok(data, "Game instance fetched")
        } catch (err: any) {
            const status = err?.statusCode || err?.response?.status || 502
            setResponseStatus(event, status)
            return fail(err?.message || "Failed to fetch game", { upstream: "marshall", details: err?.data }, "MARSHALL_ERROR")
        }
    }
)