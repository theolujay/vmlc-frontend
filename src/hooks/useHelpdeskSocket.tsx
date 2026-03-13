import { useEffect, useRef, useState, useCallback } from 'react';
import { HelpdeskMessageType, HelpdeskSocketEvent, HelpdeskThreadType } from '@/types/HelpdeskType';
import { useSocket, SocketMessage } from '@/contexts/SocketProvider';

/**
 * Hook to manage real-time interactions for a specific helpdesk thread using the Unified WebSocket.
 */
export default function useHelpdeskSocket(
    threadId: string | null, 
    onMessageReceived: (message: HelpdeskMessageType) => void,
    onThreadUpdated?: (thread: Partial<HelpdeskThreadType>) => void
) {
    const { isConnected, addListener, removeListener, sendAction } = useSocket();
    const onMessageReceivedRef = useRef(onMessageReceived);
    const onThreadUpdatedRef = useRef(onThreadUpdated);
    const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
    const typingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

    // Update refs when callbacks change
    useEffect(() => {
        onMessageReceivedRef.current = onMessageReceived;
    }, [onMessageReceived]);

    useEffect(() => {
        onThreadUpdatedRef.current = onThreadUpdated;
    }, [onThreadUpdated]);

    const handleThreadEvent = useCallback((event: SocketMessage) => {
        const typedEvent = event as unknown as HelpdeskSocketEvent;
        if (typedEvent.type === 'helpdesk.thread' && typedEvent.data.thread_id === threadId) {
            const { update_type, message, thread } = typedEvent.data;

            if (update_type === 'message' && message) {
                // When a message is received, clear the typing status for that user
                const identifier = message.sender || message.sender_name;
                if (identifier) {
                    setIsTyping(prev => {
                        const newState = { ...prev };
                        delete newState[identifier];
                        return newState;
                    });
                    if (typingTimeoutsRef.current[identifier]) {
                        clearTimeout(typingTimeoutsRef.current[identifier]);
                        delete typingTimeoutsRef.current[identifier];
                    }
                }

                if (onMessageReceivedRef.current) {
                    onMessageReceivedRef.current(message);
                }
            } else if (update_type === 'metadata' && thread) {
                if (onThreadUpdatedRef.current) {
                    onThreadUpdatedRef.current(thread);
                }
            }
        }
    }, [threadId]);

    const handleTypingEvent = useCallback((event: SocketMessage) => {
        const typedEvent = event as unknown as HelpdeskSocketEvent;
        if (typedEvent.type === 'helpdesk.thread.typing' && typedEvent.data.thread_id === threadId) {
            const { user_id, is_typing } = typedEvent.data;
            const identifier = user_id;

            setIsTyping((prev) => ({
                ...prev,
                [identifier]: !!is_typing
            }));

            // Clear existing timeout for this user
            if (typingTimeoutsRef.current[identifier]) {
                clearTimeout(typingTimeoutsRef.current[identifier]);
            }

            // If they are typing, set a timeout to clear it after 10 seconds of inactivity
            if (is_typing) {
                typingTimeoutsRef.current[identifier] = setTimeout(() => {
                    setIsTyping(prev => {
                        const newState = { ...prev };
                        delete newState[identifier];
                        return newState;
                    });
                    delete typingTimeoutsRef.current[identifier];
                }, 10000);
            }
        }
    }, [threadId]);

    useEffect(() => {
        if (!threadId || !isConnected) return;

        // Subscribe to the thread
        sendAction('subscribe_thread', { thread_id: threadId });

        addListener('helpdesk.thread', handleThreadEvent);
        addListener('helpdesk.thread.typing', handleTypingEvent);

        return () => {
            // Cleanup timeouts
            Object.values(typingTimeoutsRef.current).forEach(clearTimeout);
            typingTimeoutsRef.current = {};

            // Unsubscribe from the thread
            sendAction('unsubscribe_thread', { thread_id: threadId });
            removeListener('helpdesk.thread', handleThreadEvent);
            removeListener('helpdesk.thread.typing', handleTypingEvent);
        };
    }, [threadId, isConnected, addListener, removeListener, sendAction, handleThreadEvent, handleTypingEvent]);

    const sendTypingStatus = (typing: boolean) => {
        if (threadId && isConnected) {
            sendAction('thread.typing', {
                thread_id: threadId,
                is_typing: typing
            });
        }
    };

    return { connected: isConnected, isTyping, sendTypingStatus };
}
