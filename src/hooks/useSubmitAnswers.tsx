import { ExamPortal } from "@/services/examPortal.service";
import { CandidateSubmitAnswerType } from "@/types/Index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function useSubmitAnswers(exam_id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["submit-exam", exam_id],
    mutationFn: (payload: CandidateSubmitAnswerType) =>
      ExamPortal.candidateSubmitAnswers(exam_id, payload),
    onSuccess: () => {
      toast.success("Exam submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["exam-dashboard"] });
      router.push("/exam-portal");
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { answers?: string[] } };
      };
      const errorMessage = axiosError?.response?.data?.answers?.[0];

      if (errorMessage?.includes("At least one answer must be provided")) {
        toast.error("Please answer at least one question before submitting");
      } else {
        toast.error("Error submitting exam");
      }
    },
  });

  async function onSubmit(payload: CandidateSubmitAnswerType) {
    return await mutateAsync(payload);
  }
  return { onSubmit, isPending };
}
