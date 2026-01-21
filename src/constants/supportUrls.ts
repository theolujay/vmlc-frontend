export const SupportUrls = {
    getConversations: (query?: string) => query ? `/support/conversations/?${query}` : `/support/conversations/`,
    getMessages: (id: string) => `/support/conversations/${id}/`,
    sendMessage: (id: string) => `/support/conversations/${id}/reply/`,
}
