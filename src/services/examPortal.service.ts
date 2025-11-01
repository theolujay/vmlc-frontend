import { candidateUrls } from "@/constants/candidateUrls";
import { examUrls } from "@/constants/examUrls";
import { CreateExamSessionType, CreateQuestionType, DashboardType, EditExamSession, QuestionPoolType, SessionQuestionType, SessionType, UpdatedSessionQuestionType } from "@/types/Examtype";
import { BulkPayloadType } from "@/types/Index";
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


    static async listExams(id: number): Promise<SessionType> {
        try {
            const response = await client.get(examUrls.list_exams(id))
            return response.data;
        } catch (error) {
            console.error('Error fetching exam list:', error);
            throw error;
        }
    }

    static async viewExamQuestions(id: number): Promise<UpdatedSessionQuestionType> {
        const response = await client.get(examUrls.VIEW_QUESTIONS(id))
        return response.data;
    }

    static async createQuestion(payload: CreateQuestionType) {
        try {
            const response = await client.post(examUrls.CREATE_QUESTION, payload)
            return response.data;
        } catch (error) {
            console.error(error)
        }
    }



    static async deleteExamSession(id: number) {
        try {

            const response = await client.delete(examUrls.DELETE_EXAM_SESSION(id))
            return response.data;
        } catch (error) {
            console.error(error)
        }
    }



    static async deleteQuestion(id: number) {
        try {

            const response = await client.delete(examUrls.DELETE_QUESTION(id))
            return response.data;
        } catch (error) {
            console.error(error)
        }
    }


    static async editExamSession(examId: number, payload: EditExamSession) {
        try {
            const response = await client.put(examUrls.EDIT_SESSION(examId), payload);
            return response.data;
        } catch (error) {
            console.error(error)
        }
    }


    static async listQuestions(page: number = 1, filters: Record<string, string> = {}): Promise<QuestionPoolType | undefined> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== undefined && value !== ''))
            });
            const response = await client.get(examUrls.LIST_QUESTIONS(queryParams.toString()))
            return response.data;
        } catch (error) {
            console.error(error)
            return undefined
        }
    }



    static async bulkAddQuestionToSession(payload:BulkPayloadType){
        try {
            const response=await client.post(examUrls.BULK_ADD_QUESTION_TO_SESSION,payload);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

}