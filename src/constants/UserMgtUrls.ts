export const UserMgtUrls = {
    getUserList: (query?: string) => query ? `/user/list/?${query}` : `/user/list/`,
    getPreRegisteredCandidateList: (query: string) => `/user/list/?profile=pre_reg_candidate&${query}`,
    // getUserList:`/staff/`,
    inviteStaffMember: `/staff/invite/`,
    STATISTICS_OVERVIEW: `/stats/overview/`,
    REGISTRATION_TRENDS: (days: number) => `/stats/registration-trends/?days=${days}`,
    ACCOUNT_DETAILS: (user_id: string) => `/account-management/${user_id}/`,
    HANDLE_VERIFICATION_STATUS: (user_id: string) => `/user/verification/action/${user_id}/`
}