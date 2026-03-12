export const notificationUrls = {
    history: "/v1/notifications/",
    markAsRead: (id: number) => `/v1/notifications/${id}/mark-as-read/`,
    markAllAsRead: "/v1/notifications/mark-all-as-read/",
};