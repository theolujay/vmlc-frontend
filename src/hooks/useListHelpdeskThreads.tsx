import { HelpdeskService } from "@/services/Helpdesk.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to list helpdesk threads for staff with automatic 5-second polling.
 */
export default function useListHelpdeskThreads(page: number, filters?: Record<string, string>, enabled: boolean = true) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['helpdesk-threads', page, filters],
        queryFn: () => HelpdeskService.listThreads(page, filters),
        enabled,
        refetchInterval: 5000, // Poll every 5 seconds
        refetchIntervalInBackground: true,
    });

    return { 
        data, 
        loading: isLoading, 
        error: error ? (error as Error).message : null,
        refetch 
    };
}
