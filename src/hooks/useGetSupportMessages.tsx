import { SupportService } from "@/services/Support.service";
import { SupportConversationType, SupportMessageType } from "@/types/SupportType";
import { useEffect, useState } from "react";

export default function useGetSupportMessages(conversationId: string | null) {
    const [messages, setMessages] = useState<SupportMessageType[]>([]);
    const [conversation, setConversation] = useState<SupportConversationType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversationDetail = async () => {
            if (!conversationId) return;
            setLoading(true);
            try {
                const response = await SupportService.getConversationDetail(conversationId);
                setConversation(response);
                if (response.messages) {
                    setMessages(response.messages);
                } else {
                    // Fallback if messages key is missing but it's an array response
                    const msgs = await SupportService.getMessages(conversationId);
                    setMessages(msgs);
                }
            } catch {
                setError('Failed to fetch conversation details');
            } finally {
                setLoading(false);
            }
        };

        fetchConversationDetail();
    }, [conversationId]);

    const addMessage = (message: SupportMessageType) => {
        setMessages((prev) => [...prev, message]);
    };

    return { conversation, messages, loading, error, addMessage, setMessages };
}
