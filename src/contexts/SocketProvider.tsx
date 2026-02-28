"use client"
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { socketUrl } from '@/constants/socketUrl';
import config from '../../config';

export type SocketMessage = {
    type: string;
    [key: string]: unknown;
};

type SocketAction = {
    action: string;
    data?: unknown;
};

type Listener = (data: SocketMessage) => void;

interface SocketContextType {
    isConnected: boolean;
    sendAction: (action: string, data?: unknown) => void;
    addListener: (type: string, listener: Listener) => void;
    removeListener: (type: string, listener: Listener) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { authState } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const listenersRef = useRef<Record<string, Set<Listener>>>({});
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (!authState?.isAuthenticated || !authState?.token) return;
        if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) return;

        const url = `${socketUrl}?api_key=${config.API_KEY}&token=${authState.token}`;
        console.log('Connecting to Unified WebSocket:', url);

        try {
            const ws = new WebSocket(url);
            socketRef.current = ws;

            ws.onopen = () => {
                console.log('Unified WebSocket connected');
                setIsConnected(true);
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };

            ws.onmessage = (event) => {
                try {
                    const message: SocketMessage = JSON.parse(event.data);
                    const type = message.type;
                    if (type && listenersRef.current[type]) {
                        listenersRef.current[type].forEach(listener => listener(message));
                    }
                } catch (e) {
                    console.error('Failed to parse unified websocket message', e);
                }
            };

            ws.onclose = (event) => {
                console.log('Unified WebSocket disconnected', event.code, event.reason);
                setIsConnected(false);
                socketRef.current = null;

                if (authState?.isAuthenticated && event.code !== 1000) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, 3000);
                }
            };

            ws.onerror = (error) => {
                console.error('Unified WebSocket error:', error);
                ws.close();
            };
        } catch (err) {
            console.error('Failed to initiate unified websocket connection', err);
        }
    }, [authState?.isAuthenticated, authState?.token]);

    useEffect(() => {
        if (authState?.isAuthenticated && authState?.token) {
            connect();
        } else {
            if (socketRef.current) {
                socketRef.current.close(1000, 'User logged out');
            }
        }

        return () => {
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            if (socketRef.current) {
                socketRef.current.close(1000, 'Provider unmounting');
            }
        };
    }, [authState?.isAuthenticated, authState?.token, connect]);

    const sendAction = useCallback((action: string, data?: unknown) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const payload: SocketAction = { action, data };
            socketRef.current.send(JSON.stringify(payload));
        } else {
            console.warn('Cannot send action, WebSocket is not connected:', action);
        }
    }, []);

    const addListener = useCallback((type: string, listener: Listener) => {
        if (!listenersRef.current[type]) {
            listenersRef.current[type] = new Set();
        }
        listenersRef.current[type].add(listener);
    }, []);

    const removeListener = useCallback((type: string, listener: Listener) => {
        if (listenersRef.current[type]) {
            listenersRef.current[type].delete(listener);
        }
    }, []);

    return (
        <SocketContext.Provider value={{ isConnected, sendAction, addListener, removeListener }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
