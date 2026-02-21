import { useEffect, useRef, useState } from 'react';
import { HelpdeskSocketEvent, HelpdeskMessageType } from '@/types/HelpdeskType';
import config from '../../config';

/**
 * Hook to manage WebSocket connection for a helpdesk thread.
 */
export default function useHelpdeskSocket(threadId: string | null, onMessageReceived: (message: HelpdeskMessageType) => void) {
    const socketRef = useRef<WebSocket | null>(null);
    const onMessageReceivedRef = useRef(onMessageReceived);
    const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
    const [connected, setConnected] = useState(false);
    const connectTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Update ref when callback changes
    useEffect(() => {
        onMessageReceivedRef.current = onMessageReceived;
    }, [onMessageReceived]);

    useEffect(() => {
        if (!threadId) {
            setConnected(false);
            return;
        }

        // Cleanup function to clear any pending connection
        const cleanup = () => {
            if (connectTimerRef.current) {
                clearTimeout(connectTimerRef.current);
                connectTimerRef.current = null;
            }
            if (socketRef.current) {
                if (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING) {
                    console.log('Closing Helpdesk WebSocket during cleanup');
                    socketRef.current.close();
                }
                socketRef.current = null;
            }
        };

        // Delay connection slightly to avoid rapid open/close in StrictMode/re-renders
        connectTimerRef.current = setTimeout(() => {
            const session = localStorage.getItem("session");
            const token = session ? JSON.parse(session).access : null;
            if (!token) return;

            const baseUrl = config.BASE_URL || 'http://localhost:8000/';
            let wsUrl = baseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
            if (wsUrl.endsWith('/')) wsUrl = wsUrl.slice(0, -1);
            
            const fullWsUrl = `${wsUrl}/v1/ws/helpdesk/thread/${threadId}/?api_key=${config.API_KEY}&token=${token}`;

            console.log(`Connecting to Helpdesk WebSocket: ${fullWsUrl}`);
            const socket = new WebSocket(fullWsUrl);
            socketRef.current = socket;

            socket.onopen = () => {
                console.log('Helpdesk WebSocket connected');
                setConnected(true);
            };

            socket.onmessage = (event) => {
                try {
                    const data: HelpdeskSocketEvent = JSON.parse(event.data);
                    if (data.type === 'chat.message' && data.message) {
                        onMessageReceivedRef.current(data.message);
                    } else if (data.type === 'chat.typing') {
                        if (data.user_id) {
                            setIsTyping((prev) => ({
                                ...prev,
                                [data.user_id as string]: !!data.is_typing
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error parsing helpdesk socket message:', error);
                }
            };

            socket.onclose = (event) => {
                console.log('Helpdesk WebSocket disconnected', event.code, event.reason);
                setConnected(false);
                // Only clear socketRef if it's still this socket
                if (socketRef.current === socket) {
                    socketRef.current = null;
                }
            };

            socket.onerror = (error) => {
                console.error('Helpdesk WebSocket error:', error);
                setConnected(false);
            };
        }, 100); // 100ms delay

        return cleanup;
    }, [threadId]);

    const sendTypingStatus = (typing: boolean) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'chat.typing',
                is_typing: typing
            }));
        }
    };

    return { connected, isTyping, sendTypingStatus };
}
