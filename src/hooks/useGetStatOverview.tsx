import { UserMgtService } from '@/services/UserMgt.service'
import { StatOverviewType } from '@/types/UserMgtType'
import { useQuery } from '@tanstack/react-query'

export default function useGetStatOverview() {
    const { isPending, data } = useQuery<StatOverviewType>({
        queryKey: ['stat-overview'],
        queryFn: UserMgtService.getStatOverview
    })
    return { isPending, data }
}
