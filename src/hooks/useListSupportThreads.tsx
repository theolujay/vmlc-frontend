import { SupportService } from "@/services/Support.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to list support threads for staff with automatic 5-second polling.
 */
export default function useListSupportThreads(page: number, filters?: Record<string, string>) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['support-threads', page, filters],
        queryFn: () => SupportService.listThreads(page, filters),
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
