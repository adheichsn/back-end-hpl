export function useHplClient() {
    const config = useRuntimeConfig()

    const fetchHpl = $fetch.create({
        baseURL: config.HPL_MS_URL,
        timeout: 8000,
        retry: 1,
        retryDelay: 200,
    })

    return { fetchHpl }
}
