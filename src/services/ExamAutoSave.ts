import client from "@/utils/axios";

export interface SavedAnswer {
  question_id: number;
  selected_option: string;
  answered_at: string | null;
}

export interface AutoSaveAnswerPayload {
  question_id: number;
  selected_option: string;
}

export async function autoSaveAnswers(
  examId: string,
  answers: AutoSaveAnswerPayload[]
): Promise<{ saved: number }> {
  const response = await client.post(`/v2/exams/${examId}/auto-save/`, {
    answers,
  });
  return response.data;
}

export async function getSavedAnswers(
  examId: string
): Promise<{ answers: SavedAnswer[]; total: number }> {
  const response = await client.get(`/v2/exams/${examId}/saved-answers/`);
  return response.data;
}