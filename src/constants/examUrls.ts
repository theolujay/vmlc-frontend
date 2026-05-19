export const examUrls = {
  create_exam: "/v1/exams/",
  EDIT_SESSION: (exam_id: string) => `/v1/exams/${exam_id}/`,
  CREATE_QUESTION: "/v1/questions/",
  list_exams: (id: number = 1) => `/v1/exams/?page=${id}`,
  VIEW_QUESTIONS: (exam_id: string) => `/v1/exams/${exam_id}/questions/`,
  EXAM_DETAILS: (exam_id: string) => `/v1/exams/${exam_id}/`,
  LIST_QUESTIONS: (query: string) => `/v1/questions/?${query}`,
  DELETE_EXAM_SESSION: (exam_id: string) => `/v1/exams/${exam_id}/`,
  DELETE_QUESTION: (question_id: number) => `/v1/questions/${question_id}/`,
  UPDATE_QUESTION: (question_id: number) => `/v1/questions/${question_id}/`,
  BULK_ADD_QUESTION_TO_SESSION: `/v1/questions/bulk-action/`,
  BULK_ARCHIVE_QUESTIONS: `/v1/questions/bulk-action/`,
  BULK_ACTION_QUESTIONS: `/v1/questions/bulk-action/`,
  UPDATE_EXAM: (exam_id: string) => `/v1/exams/${exam_id}/`,
  RETRACT_EXAM: (exam_id: string) => `/v1/exams/${exam_id}/retract/`,
  FACE_CAPTURE: (exam_id: string) => `/v1/exams/${exam_id}/face-capture/`,
  TAKE_EXAM: (exam_id: string) => `/v1/exams/${exam_id}/take-exam/`,
  CANDIDATE_SUBMIT_ANSWERS: (exam_id: string) => `/v1/exams/${exam_id}/submit/`,
  EXAM_RESULTS: (exam_id: string) => `/v1/exams/${exam_id}/results/`,
  CANDIDATE_EXAM_HISTORY: (candidate_id: string) =>
    `/v1/candidates/${candidate_id}/exam-history/`,
  HEARTBEAT: (exam_id: string) => `/v1/exams/${exam_id}/heartbeat/`,
  INTEGRITY_AUDIT: (exam_id: string, candidate_id: string) =>
    `/v1/exams/${exam_id}/candidates/${candidate_id}/integrity-audit/`,
  UPDATE_PROCTORING_STATUS: (exam_id: string, candidate_id: string) =>
    `/v1/exams/${exam_id}/candidates/${candidate_id}/update-status/`,
  EXAM_TIME: (exam_id: string) => `/v1/exams/${exam_id}/time/`,
};
