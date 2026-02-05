import client from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface PromoteCandidatesPayload {
  from_stage: string;
  to_stage: string;
  cutoff_rank?: number;
}

export default function usePromoteCandidates() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: PromoteCandidatesPayload) => {
      const response = await client.post("/v1/competition/promote-candidates/", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Candidates promoted successfully!");
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ["list-exams"] });
      queryClient.invalidateQueries({ queryKey: ["competition-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["statistics-overview"] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to promote candidates. Please try again.";
      toast.error(errorMessage);
    },
  });

  return { promoteCandidates: mutate, isPending };
}
