import { candidateUrls } from "@/constants/candidateUrls";
import { CandidateListType, CandidateType } from "@/types/CandidateType";
import { LeaderBoardResponse, ViewCandidateDetailType } from "@/types/LeaderBoardType";
import client from "@/utils/axios";

export class CandidateMgtService {
    static async getCandidateList(page = 1): Promise<CandidateListType> {
        const response = await client.get(candidateUrls.LIST_CANDIDATES(page));
        return response.data;
    }

    static async getCandidateDetails(id: string): Promise<CandidateType> {
        const response = await client.get(candidateUrls.CANDIDATE_DETAILS(id))
        return response.data;
    }



    static async getAccountDetails() {
        const response = await client.get(candidateUrls.ACCOUNT_MGT)
        return response.data.profile;
    }


    static async getLeaderBoard(page: number = 1, filters: Record<string, string | number> = {}): Promise<LeaderBoardResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== undefined && value !== ''))
            });
            const response = await client.get(candidateUrls.get_leaderboard(queryParams.toString()));
            return response.data;
        } catch (error) {
            console.error(error)
            throw error
        }
    }





    static async getLeaderBoardCandidateDetail(stage: string, level: string, candidate_id: string): Promise<ViewCandidateDetailType> {
        try {
            const response = await client.get(candidateUrls.GET_LEADERBOARD_CANDIDATE_DETAIL(stage, level, candidate_id));
            return response.data;
        } catch (error) {
            console.error(error)
            throw error
        }
    }






}