export const HelpdeskUrls = {
    // Candidate
    getOrCreateThread: `/v1/helpdesk/thread/`,
    postMessage: (threadId: string) => `/v1/helpdesk/thread/${threadId}/message/`,

    // Staff
    listThreads: (query?: string) => query ? `/v1/staff/helpdesk/threads/?${query}` : `/v1/staff/helpdesk/threads/`,
    getThreadDetail: (threadId: string) => `/v1/staff/helpdesk/threads/${threadId}/`,

    // WebSocket
    supportSocket: (threadId: string) => `/v1/ws/helpdesk/thread/${threadId}/`
}
