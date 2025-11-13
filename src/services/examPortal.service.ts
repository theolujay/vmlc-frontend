import { candidateUrls } from "@/constants/candidateUrls";
import { examUrls } from "@/constants/examUrls";
import { CreateExamSessionType, CreateQuestionType, DashboardType, EditExamSession, QuestionPoolType, SessionQuestionType, SessionType, UpdatedSessionQuestionType } from "@/types/Examtype";
import { BulkArchiveType, BulkPayloadType, CandidateSubmitAnswerType } from "@/types/Index";
import { LeaderBoardResponse, LeaderBoardType } from "@/types/LeaderBoardType";
import client from "@/utils/axios";

export class ExamPortal {

    static async examInfo(): Promise<DashboardType> {
        try {
            const response = await client.get(candidateUrls.candidate_exams_dashboard)
            return response.data;

        } catch (error) {
            console.error(error)
            throw error;

        }
    }


    // static async getLeaderBoard(): Promise<LeaderBoardType> {
    //     try {

    //         const response = await client.get(candidateUrls.get_leaderboard)
    //         return response.data;
    //     } catch (error) {
    //         console.error(error)
    //         throw error
    //     }
    // }









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





    static async createExamSession(payload: CreateExamSessionType) {
        try {

            const response = await client.post(examUrls.create_exam, payload)
            return response.data.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
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
        try {

            const response = await client.get(examUrls.VIEW_QUESTIONS(id))
            return response.data;
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    static async createQuestion(payload: CreateQuestionType) {
        try {
            const response = await client.post(examUrls.CREATE_QUESTION, payload)
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }



    static async deleteExamSession(id: number) {
        try {

            const response = await client.delete(examUrls.DELETE_EXAM_SESSION(id))
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }



    static async deleteQuestion(id: number) {
        try {

            const response = await client.delete(examUrls.DELETE_QUESTION(id))
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }


    static async editExamSession(examId: number, payload: EditExamSession) {
        try {
            const response = await client.put(examUrls.EDIT_SESSION(examId), payload);
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
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
            throw error;
        }
    }



    static async bulkAddQuestionToSession(payload: BulkPayloadType) {
        try {
            const response = await client.post(examUrls.BULK_ADD_QUESTION_TO_SESSION, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async bulkArchiveQuestions(payload: BulkArchiveType) {
        try {
            const response = await client.post(examUrls.BULK_ARCHIVE_QUESTIONS, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    static async updateExamSession(exam_id: number, payload: any) {
        try {
            const response = await client.put(examUrls.UPDATE_EXAM(exam_id), payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    static async candidateTakeExam(exam_id: string) {
        try {
            const response = await client.get(examUrls.TAKE_EXAM(exam_id));
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }

    }

    static async candidateSubmitAnswers(exam_id: string, payload: CandidateSubmitAnswerType) {
        try {
            const response = await client.post(examUrls.CANDIDATE_SUBMIT_ANSWERS(exam_id), payload);
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

}