export const candidateUrls = {
    candidate_exams_dashboard: '/v1/dashboard/candidate',
    get_leaderboard: (query: string) => `/v1/leaderboard/?${query}`,
    GET_LEADERBOARD_CANDIDATE_DETAIL: (stage: string, round: string, candidate_id: string) => `/v1/leaderboard/${stage}/${round}/candidate/${candidate_id}/`,
    LIST_CANDIDATES: (query: string) => `/v1/candidates/?${query}`,
    ACCOUNT_MGT: '/v1/account-management/',
    CANDIDATE_DETAILS: (candidate_id: string) => `/v1/candidates/${candidate_id}/`,
    PUBLISH_LEADERBOARD:`/v1/leaderboard/publish/`
}