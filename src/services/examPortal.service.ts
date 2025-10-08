import { candidateUrls } from "@/constants/candidateUrls";
import { DashboardType } from "@/types/Examtype";
import client from "@/utils/axios";

export class ExamPortal{

    static async examInfo():Promise<DashboardType>{
        const response= await client.get(candidateUrls.candidate_exams_dashboard)
        return response.data;
    }

}