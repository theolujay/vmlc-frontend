import { VerificationService } from '@/services/verification.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetVerificationStatus() {
    const { isPending, data } = useQuery({
        queryKey: ['verification-status'],
        queryFn: VerificationService.getVerificationStatus,

    })
    return { isPending, data }
}
