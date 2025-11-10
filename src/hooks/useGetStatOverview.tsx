import { UserMgtService } from '@/services/UserMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetStatOverview() {
    const { isPending, data } = useQuery({
        queryKey: ['stat-overview'],
        queryFn: UserMgtService.getStatOverview
    })
    return { isPending, data }
}
