import { candidateUrls } from "@/constants/candidateUrls";
import { examUrls } from "@/constants/examUrls";
import { CreateExamSessionType, DashboardType, SessionType } from "@/types/Examtype";
import { LeaderBoardType } from "@/types/LeaderBoardType";
import client from "@/utils/axios";

export class ExamPortal {

    static async examInfo(): Promise<DashboardType> {
        const response = await client.get(candidateUrls.candidate_exams_dashboard)
        return response.data;
    }


    static async getLeaderBoard(): Promise<LeaderBoardType> {
        const response = await client.get(candidateUrls.get_leaderboard)
        return response.data;
    }


    static async getExamQuestions(id: number) {
        const response = await client.get(examUrls.take_exam(id))
        return response.data;
    }


    static async createExamSession(payload: CreateExamSessionType) {
        const response = await client.post(examUrls.create_exam, payload)
        return response.data.data;
    }


    static async listExams(id:number): Promise<SessionType> {
        try {
            const response = await client.get(examUrls.list_exams(id))
            return response.data;
        } catch (error) {
            console.error('Error fetching exam list:', error);
            throw error;
        }
    }

    static async viewExamQuestions(id: number) {
        const response = await client.get(examUrls.VIEW_QUESTIONS(id))
        return response.data;
    }

}