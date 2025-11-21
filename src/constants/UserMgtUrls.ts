export const UserMgtUrls={
    getUserList:'/user/list/',
    // getUserList:`/staff/`,
    inviteStaffMember:`/staff/invite/`,
    STATISTICS_OVERVIEW:`/stats/overview/`,
    ACCOUNT_DETAILS:(user_id:string)=>`/account-management/${user_id}/`
}