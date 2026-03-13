import { UserMgtService } from '@/services/UserMgt.service';
import { useQuery } from '@tanstack/react-query';

export default function useGetRegistrationTrends(days: number) {
    const { isPending, data, error } = useQuery({
        queryKey: ['registration-trends', days],
        queryFn: () => UserMgtService.getRegistrationTrends(days)
    });
    return { isPending, data, error };
}
