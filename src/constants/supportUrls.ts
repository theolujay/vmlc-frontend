export const SupportUrls = {
    getConversations: (query?: string) => query ? `/v1/support/conversations/?${query}` : `/v1/support/conversations/`,
    getMessages: (id: string) => `/v1/support/conversations/${id}/`,
    sendMessage: (id: string) => `/v1/support/conversations/${id}/reply/`,
}
