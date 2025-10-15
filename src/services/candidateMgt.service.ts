import { candidateUrls } from "@/constants/candidateUrls";
import { CandidateType } from "@/types/CandidateType";
import client from "@/utils/axios";

export class CandidateMgtService {
    static async getCandidateList(page=1) {
        const response = await client.get(candidateUrls.LIST_CANDIDATES(page));
        return response.data;
    }

    static async getCandidateDetails(id:string)
    :Promise<CandidateType>
    {
        const response=await client.get(candidateUrls.CANDIDATE_DETAILS(id))
        return response.data;
    }



    static async getAccountDetails() {
        const response = await client.get(candidateUrls.ACCOUNT_MGT)
        return response.data.profile;
    }
}