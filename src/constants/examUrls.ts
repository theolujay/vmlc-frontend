export const examUrls = {
    create_exam: '/v2/exams/',
    EDIT_SESSION: (exam_id: string) => `/v2/exams/${exam_id}/`,
    CREATE_QUESTION: '/v1/questions/',
    list_exams: (id: number = 1) => `/v2/exams/?page=${id}`,
    VIEW_QUESTIONS: (exam_id: string) => `/v2/exams/${exam_id}/questions/`,
    EXAM_DETAILS: (exam_id: string) => `/v2/exams/${exam_id}/`,
    LIST_QUESTIONS: (query: string) => `/v1/questions/?${query}`,
    DELETE_EXAM_SESSION: (exam_id: string) => `/v2/exams/${exam_id}/`,
    DELETE_QUESTION: (question_id: number) => `/v1/questions/${question_id}/`,
    BULK_ADD_QUESTION_TO_SESSION: `/v1/questions/bulk-add-to-exams/`,
    BULK_ARCHIVE_QUESTIONS: `/v1/questions/bulk-archive/`,
    UPDATE_EXAM: (exam_id: string) => `/v2/exams/${exam_id}/`,
    TAKE_EXAM: (exam_id: string) => `/v2/exams/${exam_id}/take-exam/`,
    CANDIDATE_SUBMIT_ANSWERS: (exam_id: string) => `/v2/exams/${exam_id}/submit-exam-answers/`,
    EXAM_RESULTS: (exam_id: string) => `/v2/exams/${exam_id}/results/`,
    CANDIDATE_EXAM_HISTORY: (candidate_id: string) => `/v2/candidates/${candidate_id}/exam-history/`
}