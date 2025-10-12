import { candidateUrls } from "@/constants/candidateUrls";
import client from "@/utils/axios";

export class CandidateMgtService{
    static async getCandidateList(){
        const response=await client.get(candidateUrls.LIST_CANDIDATES);
        console.log(response,'what is response from candidate')
        return response.data.data
    }
}