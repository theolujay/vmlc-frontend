import { candidateUrls } from "@/constants/candidateUrls";
import { examUrls } from "@/constants/examUrls";
import { CreateExamSessionType, CreateQuestionType, DashboardType, EditExamSession, QuestionPoolType, SessionType, TakeExamType, UpdatedSessionQuestionType } from "@/types/Examtype";
import { BulkActionType, BulkArchiveType, BulkPayloadType, CandidateSubmitAnswerType } from "@/types/Index";
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

    static async viewExamQuestions(id: string, page: number = 1, filters: Record<string, string> = {}): Promise<UpdatedSessionQuestionType> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''))
            });
            const response = await client.get(`${examUrls.EXAM_DETAILS(id)}?${queryParams.toString()}`)
            return response.data;
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    static async createQuestion(payload: CreateQuestionType | FormData) {
        try {
            const response = await client.post(examUrls.CREATE_QUESTION, payload, {
                headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
            })
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    static async updateQuestion(id: number, payload: CreateQuestionType | FormData) {
        try {
            const response = await client.patch(examUrls.UPDATE_QUESTION(id), payload, {
                headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
            })
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }



    static async deleteExamSession(id: string) {
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


    static async editExamSession(examId: string, payload: EditExamSession) {
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
                ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''))
            });
            console.log(queryParams.toString(), 'query params in service')
            const response = await client.get(examUrls.LIST_QUESTIONS(queryParams.toString()))
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }



    static async bulkAddQuestionToSession(payload: BulkPayloadType) {
        try {
            const response = await client.post(examUrls.BULK_ACTION_QUESTIONS, {
                action: 'assign',
                ...payload
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async bulkArchiveQuestions(payload: BulkArchiveType) {
        try {
            const response = await client.post(examUrls.BULK_ACTION_QUESTIONS, {
                action: 'archive',
                ...payload
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async bulkActionQuestions(payload: BulkActionType) {
        try {
            const response = await client.post(examUrls.BULK_ACTION_QUESTIONS, payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    static async updateExamSession(exam_id: string, payload: Record<string, unknown>) {
        try {
            const response = await client.put(examUrls.UPDATE_EXAM(exam_id), payload);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    static async candidateTakeExam(exam_id: string): Promise<TakeExamType> {
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

    static async getExamResults(exam_id: string) {
        try {
            const response = await client.get(examUrls.EXAM_RESULTS(exam_id));
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getCandidateExamHistory(candidate_id: string) {
        try {
            const response = await client.get(examUrls.CANDIDATE_EXAM_HISTORY(candidate_id));
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}