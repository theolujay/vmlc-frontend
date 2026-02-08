import { CompetitionService } from '@/services/Competition.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function usePublishRanking() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ exam_id, publish_now }: { exam_id: string; publish_now: boolean }) =>
      CompetitionService.publishRanking(exam_id, publish_now),
    onSuccess: (data, variables) => {
      toast.success(variables.publish_now ? 'Ranking published successfully' : 'Ranking generation started');
      
      // Delay invalidation to allow backend processing time
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['exam-questions', variables.exam_id] });
        queryClient.invalidateQueries({ queryKey: ['list-exams'] });
        queryClient.invalidateQueries({ queryKey: ['competition-dashboard'] });
      }, 2000);
    },
    onError: (error: unknown) => {
      toast.error((error as any)?.response?.data?.message || 'Failed to process ranking');
    },
  });

  return { publishRanking: mutate, isPending };
}
