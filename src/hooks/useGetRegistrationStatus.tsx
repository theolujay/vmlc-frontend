import { UserMgtService } from '@/services/UserMgt.service'
import { RegistrationStatusType } from '@/types/UserMgtType'
import { useQuery } from '@tanstack/react-query'

export default function useGetRegistrationStatus() {
    const { isPending, data, error } = useQuery<RegistrationStatusType>({
        queryKey: ['registration-status'],
        queryFn: UserMgtService.getRegistrationStatus
    })
    return { isPending, data, error }
}
