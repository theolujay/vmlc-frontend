import { SupportService } from "@/services/Support.service";
import { SupportThreadType, SupportMessageType } from "@/types/SupportType";
import { useEffect, useState, useCallback } from "react";
import useSupportSocket from "./useSupportSocket";

/**
 * Hook to get or create a support thread for the candidate.
 * Includes real-time message updates and unread count tracking.
 */
export default function useGetSupportThread() {
    const [thread, setThread] = useState<SupportThreadType | null>(null);
    const [messages, setMessages] = useState<SupportMessageType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThread = async () => {
            setLoading(true);
            try {
                const response = await SupportService.getOrCreateThread();
                setThread(response);
                setUnreadCount(response.unread_count || 0);
                if (response.messages) {
                    setMessages(response.messages);
                }
            } catch (_err) {
                setError('Failed to fetch support thread');
            } finally {
                setLoading(false);
            }
        };

        fetchThread();
    }, []);

    const onMessageReceived = useCallback((message: SupportMessageType) => {
        setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
        });
        
        // If it's a new message from staff/system, increment unread count
        if (message.sender_type !== 'candidate') {
            setUnreadCount(prev => prev + 1);
        }
    }, []);

    const { connected } = useSupportSocket(thread?.id || null, onMessageReceived);

    const markAllAsRead = () => {
        setUnreadCount(0);
    };

    return { 
        thread, 
        messages, 
        unreadCount, 
        loading, 
        error, 
        setMessages, 
        markAllAsRead,
        connected 
    };
}
