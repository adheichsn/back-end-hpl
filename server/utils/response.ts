export const ok = (data: any, message = "OK") => ({
    success: true,
    message,
    data,
    meta: { ts: new Date().toISOString() },
})

export const fail = (message: string, error?: any, code = "ERR") => ({
    success: false,
    message,
    error: { code, ...error },
    meta: { ts: new Date().toISOString() },
})
