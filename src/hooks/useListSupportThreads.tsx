import { SupportService } from "@/services/Support.service";
import { SupportThreadListResponse } from "@/types/SupportType";
import { useEffect, useState } from "react";

/**
 * Hook to list support threads for staff.
 */
export default function useListSupportThreads(page: number, filters?: Record<string, string>) {
    const [data, setData] = useState<SupportThreadListResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThreads = async () => {
            setLoading(true);
            try {
                const response = await SupportService.listThreads(page, filters);
                setData(response);
            } catch (_err) {
                setError('Failed to fetch support threads');
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, [page, filters]);

    return { data, loading, error };
}
