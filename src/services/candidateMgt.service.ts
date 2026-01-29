import { candidateUrls } from "@/constants/candidateUrls";
import { CandidateListType, CandidateType } from "@/types/CandidateType";
import { LeaderBoardResponse, ViewCandidateDetailType } from "@/types/LeaderBoardType";
import client from "@/utils/axios";

export class CandidateMgtService {





   


     static async getCandidateList(page = 1,filters:Record<string,string>={}): Promise<CandidateListType> {
        try {
            const queryParams=new URLSearchParams({
                page:page.toString(),
                ...Object.fromEntries(Object.entries(filters).filter(([,value])=>value!==undefined && value!==''))
            })
             const response = await client.get(candidateUrls.LIST_CANDIDATES(queryParams.toString()));
             return response.data;
        } catch (error) {
            throw error;
        }
       
    }








    // static async getCandidateList(page = 1): Promise<CandidateListType> {
    //     const response = await client.get(candidateUrls.LIST_CANDIDATES(page));
    //     return response.data;
    // }

    static async getCandidateDetails(id: string): Promise<CandidateType> {
        try { 
            const response = await client.get(candidateUrls.CANDIDATE_DETAILS(id))
            return response.data;
        } catch (error) {
            throw error;
        }
    }



    static async getAccountDetails() {
        try {
            
            const response = await client.get(candidateUrls.ACCOUNT_MGT)
            return response.data.profile;
        } catch (error) {
            throw error;
        }
    }


    static async getLeaderBoard(page: number = 1, filters: Record<string, string | number> = {}): Promise<LeaderBoardResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''))
            });
            const response = await client.get(candidateUrls.get_leaderboard(queryParams.toString()));
            return response.data;
        } catch (error) {
            console.error(error)
            throw error
        }
    }





    static async getLeaderBoardCandidateDetail(stage: string, round: string, candidate_id: string): Promise<ViewCandidateDetailType> {
        try {
            const response = await client.get(candidateUrls.GET_LEADERBOARD_CANDIDATE_DETAIL(stage, round, candidate_id));
            return response.data;
        } catch (error) {
            console.error(error)
            throw error
        }
    }




    static async publishLeaderBoard(){
        try {
            const response=await client.post(candidateUrls.PUBLISH_LEADERBOARD);
            return response.data;
        } catch (error) {
            throw error;
        }
    }



}