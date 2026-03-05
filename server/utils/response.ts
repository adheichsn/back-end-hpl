// server/utils/response.ts
export type ApiOk<T> = {
    success: true
    message: string
    data: T
    meta: { ts: string }
}

export type ApiFail = {
    success: false
    message: string
    error: { code: string;[k: string]: any }
    meta: { ts: string }
}

export const ok = <T>(data: T, message = "OK"): ApiOk<T> => ({
    success: true,
    message,
    data,
    meta: { ts: new Date().toISOString() },
})

export const fail = (message: string, error?: any, code = "ERR"): ApiFail => ({
    success: false,
    message,
    error: { code, ...(error ?? {}) },
    meta: { ts: new Date().toISOString() },
})