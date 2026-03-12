import { SupportService } from "@/services/Support.service";
import { SupportConversationListResponse } from "@/types/SupportType";
import { useEffect, useState } from "react";

export default function useListConversations(page: number, filters: Record<string, string>) {
    const [data, setData] = useState<SupportConversationListResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true);
            try {
                const response = await SupportService.getConversations(page, filters);
                setData(response);
            } catch (err) {
                setError('Failed to fetch conversations');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [page, filters]);

    return { data, loading, error };
}
