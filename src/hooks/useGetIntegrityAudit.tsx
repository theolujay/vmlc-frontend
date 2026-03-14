import { ExamPortal } from '@/services/examPortal.service';
import { IntegrityAuditResponse } from '@/types/ViolationType';
import { useQuery } from '@tanstack/react-query';

export default function useGetIntegrityAudit(examId?: string, candidateId?: string, enabled: boolean = true) {
    return useQuery<IntegrityAuditResponse>({
        queryKey: ['integrity-audit', examId, candidateId],
        queryFn: () => ExamPortal.getIntegrityAudit(examId!, candidateId!),
        enabled: !!examId && !!candidateId && enabled,
    });
}
