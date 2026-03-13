export const competitionUrls = {
  PUBLISH_RANKING: '/v1/competition/rankings/publish/',
  LIST_RANKINGS: '/v1/competition/rankings/',
  GET_RANKING: (exam_id: string) => `/v1/competition/rankings/${exam_id}/`,
  GET_CANDIDATE_RANKING_DETAIL: (exam_id: string, candidate_id: string) => `/v1/competition/rankings/${exam_id}/candidate/${candidate_id}/`,
  GET_LEAGUE_LEADERBOARD: '/v1/competition/leaderboard/league/',
  GET_CANDIDATE_LEAGUE_DETAIL: (candidate_id: string) => `/v1/competition/leaderboard/league/candidate/${candidate_id}/`,
};
