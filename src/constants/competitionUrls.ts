export const competitionUrls = {
  PUBLISH_STANDINGS: '/v1/competition/standings/publish/',
  GET_STANDINGS: (exam_id: string) => `/v1/competition/standings/${exam_id}/`,
  GET_CANDIDATE_STANDING_DETAIL: (exam_id: string, candidate_id: string) => `/v1/competition/standings/${exam_id}/candidate/${candidate_id}/`,
  GET_LEAGUE_LEADERBOARD: '/v1/competition/leaderboard/league/',
  GET_CANDIDATE_LEAGUE_DETAIL: (candidate_id: string) => `/v1/competition/leaderboard/league/candidate/${candidate_id}/`,
};
