export const SupportUrls = {
    // Candidate
    getOrCreateThread: `/v1/support/thread/`,
    postMessage: (threadId: string) => `/v1/support/thread/${threadId}/message/`,

    // Staff
    listThreads: (query?: string) => query ? `/v1/staff/support/threads/?${query}` : `/v1/staff/support/threads/`,
    getThreadDetail: (threadId: string) => `/v1/staff/support/threads/${threadId}/`,

    // WebSocket
    supportSocket: (threadId: string) => `/v1/ws/support/thread/${threadId}/`
}
