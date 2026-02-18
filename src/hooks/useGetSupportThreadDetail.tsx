import { SupportService } from "@/services/Support.service";
import { SupportThreadType, SupportMessageType } from "@/types/SupportType";
import { useEffect, useState } from "react";

/**
 * Hook to get a specific support thread details for staff.
 */
export default function useGetSupportThreadDetail(threadId: string | null) {
    const [thread, setThread] = useState<SupportThreadType | null>(null);
    const [messages, setMessages] = useState<SupportMessageType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThreadDetail = async () => {
            if (!threadId) return;
            setLoading(true);
            try {
                const response = await SupportService.getThreadDetail(threadId);
                setThread(response);
                if (response.messages) {
                    setMessages(response.messages);
                }
            } catch (_err) {
                setError('Failed to fetch thread detail');
            } finally {
                setLoading(false);
            }
        };

        fetchThreadDetail();
    }, [threadId]);

    const addMessage = (message: SupportMessageType) => {
        setMessages((prev) => [...prev, message]);
    };

    return { thread, messages, loading, error, addMessage, setMessages };
}
