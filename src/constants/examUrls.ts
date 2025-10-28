export const examUrls = {
    take_exam: (id: number) => `/exams/${id}/take-exam/`,
    create_exam: '/exams/',
    CREATE_QUESTION: '/questions/',
    list_exams: (id: number = 1) => `/exams/?page=${id}`,
    VIEW_QUESTIONS: (exam_id: number) => `/exams/${exam_id}/questions/`,
    LIST_QUESTIONS: (query: string) => `/questions/?${query}`,
}