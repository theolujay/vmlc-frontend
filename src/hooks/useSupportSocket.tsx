import { useEffect, useRef, useState } from 'react';
import { SupportSocketEvent, SupportMessageType } from '@/types/SupportType';
import config from '../../config';

/**
 * Hook to manage WebSocket connection for a support thread.
 */
export default function useSupportSocket(threadId: string | null, onMessageReceived: (message: SupportMessageType) => void) {
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
                    console.log('Closing Support WebSocket during cleanup');
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
            
            const path = wsUrl.endsWith('/v1') ? '/ws/support/thread' : '/v1/ws/support/thread';
            const fullWsUrl = `${wsUrl}${path}/${threadId}/?api_key=${config.API_KEY}&token=${token}`;

            console.log(`Connecting to Support WebSocket: ${fullWsUrl}`);
            const socket = new WebSocket(fullWsUrl);
            socketRef.current = socket;

            socket.onopen = () => {
                console.log('Support WebSocket connected');
                setConnected(true);
            };

            socket.onmessage = (event) => {
                try {
                    const data: SupportSocketEvent = JSON.parse(event.data);
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
                    console.error('Error parsing support socket message:', error);
                }
            };

            socket.onclose = (event) => {
                console.log('Support WebSocket disconnected', event.code, event.reason);
                setConnected(false);
                // Only clear socketRef if it's still this socket
                if (socketRef.current === socket) {
                    socketRef.current = null;
                }
            };

            socket.onerror = (error) => {
                console.error('Support WebSocket error:', error);
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
