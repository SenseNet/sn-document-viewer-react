export const asyncDelay: (ms: number) => Promise<void> = async (ms) => {
    return await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}
