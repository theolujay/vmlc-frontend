export const UserMgtUrls = {
  getUserList: (query?: string) =>
    query ? `/v1/user/list/?${query}` : `/v1/user/list/`,
  exportUsers: (query?: string) =>
    query ? `/v1/user/export/?${query}` : `/v1/user/export/`,
  bulkNotification: `/v1/user/bulk-notification/`,
  bulkStaffImport: `/v1/user/import/staff/`,
  bulkCandidateImport: `/v1/user/import/candidate/`,
  resetPassword: `/v1/user/reset-password/`,
  userActivity: (userId: string) => `/v1/user/activity/?user_id=${userId}`,
  getPreRegisteredCandidateList: (query: string) =>
    `/v1/user/list/?profile=pre_reg_candidate&${query}`,
  // getUserList:`/staff/`,
  inviteStaffMember: `/v1/staff/invite/`,
  STATISTICS_OVERVIEW: `/v1/stats/overview/`,
  REGISTRATION_TRENDS: (days: number) =>
    `/v1/stats/registration-trends/?days=${days}`,
  REGISTRATION_STATUS: `/v2/registration/`,
  ACCOUNT_MGT: `/v1/account-management/`,
  ACCOUNT_DETAILS: (user_id: string) => `/v1/account-management/${user_id}/`,
  HANDLE_VERIFICATION_STATUS: (user_id: string) =>
    `/v1/user/verification/action/${user_id}/`,
};
