import { SupportService } from "@/services/Support.service";
import { SupportMessageType } from "@/types/SupportType";
import { useEffect, useState } from "react";

export default function useGetSupportMessages(conversationId: string | null) {
    const [messages, setMessages] = useState<SupportMessageType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!conversationId) return;
            setLoading(true);
            try {
                const response = await SupportService.getMessages(conversationId);
                setMessages(response);
            } catch {
                setError('Failed to fetch messages');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [conversationId]);

    const addMessage = (message: SupportMessageType) => {
        setMessages((prev) => [...prev, message]);
    };

    return { messages, loading, error, addMessage, setMessages };
}
