export const candidateUrls = {
    candidate_exams_dashboard: '/dashboard/candidate',
    get_leaderboard: (query: string) => `/leaderboard/?${query}`,
    GET_LEADERBOARD_CANDIDATE_DETAIL: (stage: string, level: string, candidate_id: string) => `/leaderboard/${stage}/${level}/candidate/${candidate_id}/`,
    LIST_CANDIDATES: (query: string) => `/candidates/?${query}`,
    ACCOUNT_MGT: '/account-management/',
    CANDIDATE_DETAILS: (candidate_id: string) => `/candidates/${candidate_id}/`,
    PUBLISH_LEADERBOARD:`/leaderboard/publish/`
}