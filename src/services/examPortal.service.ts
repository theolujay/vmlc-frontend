import { candidateUrls } from "@/constants/candidateUrls";
import { examUrls } from "@/constants/examUrls";
import { DashboardType } from "@/types/Examtype";
import client from "@/utils/axios";

export class ExamPortal {

    static async examInfo(): Promise<DashboardType> {
        const response = await client.get(candidateUrls.candidate_exams_dashboard)
        return response.data;
    }


    static async getLeaderBoard(): Promise<DashboardType> {
        const response = await client.get(candidateUrls.get_leaderboard)
        return response.data;
    }


    static async getExamQuestions(id: number) {
        const response = await client.get(examUrls.take_exam(id))
        return response.data;
    }

}