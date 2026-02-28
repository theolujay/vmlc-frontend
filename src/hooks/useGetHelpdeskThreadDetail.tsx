import { HelpdeskService } from "@/services/Helpdesk.service";
import { HelpdeskThreadType, HelpdeskMessageType } from "@/types/HelpdeskType";
import { useEffect, useState } from "react";

/**
 * Hook to get a specific helpdesk thread details for staff.
 */
export default function useGetHelpdeskThreadDetail(threadId: string | null) {
    const [thread, setThread] = useState<HelpdeskThreadType | null>(null);
    const [messages, setMessages] = useState<HelpdeskMessageType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThreadDetail = async () => {
            if (!threadId) return;
            setLoading(true);
            try {
                const response = await HelpdeskService.getThreadDetail(threadId);
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

    const addMessage = (message: HelpdeskMessageType) => {
        setMessages((prev) => [...prev, message]);
    };

    return { thread, messages, loading, error, addMessage, setMessages, setThread };
}
