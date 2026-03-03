import client from "@/utils/axios";
import { competitionUrls } from "@/constants/competitionUrls";

export class CompetitionService {
  static async publishRanking(exam_id: string, publish_now: boolean = true) {
    try {
      const response = await client.post(competitionUrls.PUBLISH_RANKING, {
        exam_id,
        publish_now,
      });
      return response.data;
    } catch (error) {
      console.error('Error publishing ranking:', error);
      throw error;
    }
  }

  static async listRankings(page: number = 1) {
    try {
      const response = await client.get(competitionUrls.LIST_RANKINGS, { params: { page } });
      return response.data;
    } catch (error) {
      console.error('Error fetching rankings list:', error);
      throw error;
    }
  }

  static async getRanking(exam_id: string) {
    try {
      const response = await client.get(competitionUrls.GET_RANKING(exam_id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching ranking for exam ${exam_id}:`, error);
      throw error;
    }
  }

  static async getCandidateRankingDetail(exam_id: string, candidate_id: string) {
    try {
      const response = await client.get(competitionUrls.GET_CANDIDATE_RANKING_DETAIL(exam_id, candidate_id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching candidate ranking detail for candidate ${candidate_id} in exam ${exam_id}:`, error);
      throw error;
    }
  }

  static async getLeagueLeaderboard() {
    try {
      const response = await client.get(competitionUrls.GET_LEAGUE_LEADERBOARD);
      return response.data;
    } catch (error) {
      console.error('Error fetching league leaderboard:', error);
      throw error;
    }
  }

  static async getCompetitionDashboard() {
    try {
      const response = await client.get('/v1/competition/dashboard/staff');
      return response.data;
    } catch (error) {
      console.error('Error fetching competition dashboard:', error);
      throw error;
    }
  }

  static async getCandidateLeagueDetail(candidate_id: string) {
    try {
      const response = await client.get(competitionUrls.GET_CANDIDATE_LEAGUE_DETAIL(candidate_id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching candidate league detail for candidate ${candidate_id}:`, error);
      throw error;
    }
  }
}
