import { HelpdeskService } from "@/services/Helpdesk.service";
import { HelpdeskThreadType, HelpdeskMessageType } from "@/types/HelpdeskType";
import { useEffect, useState, useCallback } from "react";
import useHelpdeskSocket from "./useHelpdeskSocket";

/**
 * Hook to get or create a helpdesk thread for the candidate.
 * Includes real-time message updates and unread count tracking.
 */
export default function useGetHelpdeskThread() {
    const [thread, setThread] = useState<HelpdeskThreadType | null>(null);
    const [messages, setMessages] = useState<HelpdeskMessageType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThread = async () => {
            setLoading(true);
            try {
                const response = await HelpdeskService.getOrCreateThread();
                setThread(response);
                setUnreadCount(response.unread_by_staff_count || 0);
                if (response.messages) {
                    setMessages(response.messages);
                }
            } catch (_err) {
                setError('Failed to fetch helpdesk thread');
            } finally {
                setLoading(false);
            }
        };

        fetchThread();
    }, []);

    const onMessageReceived = useCallback((message: HelpdeskMessageType) => {
        setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
        });

        // If it's a new message from staff/system, increment unread count
        if (message.sender_type !== 'candidate') {
            setUnreadCount(prev => prev + 1);
        }
    }, []);

    const { connected } = useHelpdeskSocket(thread?.id || null, onMessageReceived);

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
