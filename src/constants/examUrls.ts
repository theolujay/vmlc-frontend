export const examUrls = {
    take_exam: (id: number) => `/exams/${id}/take-exam/`,
    create_exam: '/exams/',
    EDIT_SESSION: (exam_id: number) => `/exams/${exam_id}/`,
    CREATE_QUESTION: '/questions/',
    list_exams: (id: number = 1) => `/exams/?page=${id}`,
    VIEW_QUESTIONS: (exam_id: number) => `/exams/${exam_id}`,
    // VIEW_QUESTIONS: (exam_id: number) => `/exams/${exam_id}/questions/`,
    LIST_QUESTIONS: (query: string) => `/questions/?${query}`,
    DELETE_EXAM_SESSION: (exam_id: number) => `/exams/${exam_id}/`,
    DELETE_QUESTION: (question_id: number) => `/questions/${question_id}/`,
    BULK_ADD_QUESTION_TO_SESSION: `/questions/bulk-add-to-exams/`
}