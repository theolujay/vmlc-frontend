import { ExamPortal } from '@/services/examPortal.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function useUpdateProctoringStatus(examId?: string, candidateId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (status: string) => 
            ExamPortal.updateProctoringStatus(examId!, candidateId!, status),
        onSuccess: (data) => {
            toast.success(data.message || `Proctoring status updated to ${data.status}.`);
            // Invalidate the audit query to reflect the new status and is_manually_reviewed flag
            queryClient.invalidateQueries({ queryKey: ['integrity-audit', examId, candidateId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to update proctoring status.');
        }
    });
}
