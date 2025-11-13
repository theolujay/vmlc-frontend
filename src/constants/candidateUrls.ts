export const candidateUrls = {
    candidate_exams_dashboard: '/dashboard/candidate',
    get_leaderboard: (query: string) => `/leaderboard/?${query}`,
    LIST_CANDIDATES: (page: number) => `/candidates/?page=${page}`,
    ACCOUNT_MGT: '/account-management/',
    CANDIDATE_DETAILS: (candidate_id: string) => `/candidates/${candidate_id}/`
}