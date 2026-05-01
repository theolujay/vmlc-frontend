import { useCallback, useEffect, useRef } from "react";
import { autoSaveAnswers, AutoSaveAnswerPayload } from "@/services/ExamAutoSave";
import { useMutation } from "@tanstack/react-query";

const DEBOUNCE_MS = 2000;

export default function useAutoSaveAnswers(examId: string) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAnswersRef = useRef<Map<number, AutoSaveAnswerPayload>>(new Map());

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (answers: AutoSaveAnswerPayload[]) => {
      return autoSaveAnswers(examId, answers);
    },
    onError: (_err, failedAnswers) => {
      pendingAnswersRef.current = new Map([
        ...pendingAnswersRef.current,
        ...failedAnswers.map((a) => [a.question_id, a] as const),
      ]);
    },
  });

  const flushPending = useCallback(async () => {
    if (pendingAnswersRef.current.size === 0) return;
    const answersToSave = Array.from(pendingAnswersRef.current.values());
    pendingAnswersRef.current.clear();
    await mutateAsync(answersToSave);
  }, [mutateAsync]);

  const autoSave = useCallback((answer: AutoSaveAnswerPayload) => {
    pendingAnswersRef.current.set(answer.question_id, answer);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      void flushPending();
    }, DEBOUNCE_MS);
  }, [flushPending]);

  const forceSave = useCallback(async () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    await flushPending();
  }, [flushPending]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    autoSave,
    forceSave,
    isPending,
    error,
    pendingCount: pendingAnswersRef.current.size,
  };
}
