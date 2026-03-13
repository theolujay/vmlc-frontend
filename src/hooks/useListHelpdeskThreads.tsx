import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { HelpdeskSocketEvent, HelpdeskThreadType } from '@/types/HelpdeskType';
import { HelpdeskService } from '@/services/Helpdesk.service';
import { useSocket, SocketMessage } from '@/contexts/SocketProvider';
import { HelpdeskStatData } from '@/types/UserMgtType';

/**
 * Hook to list helpdesk threads for staff using Unified WebSocket for real-time updates.
 * Prioritizes WebSocket for live updates and manages a single "live list" of threads.
 */
export default function useListHelpdeskThreads(filters?: Record<string, string>, enabled: boolean = true) {
    const { isConnected, addListener, removeListener, sendAction } = useSocket();
    const [results, setResults] = useState<HelpdeskThreadType[]>([]);
    const [summary, setSummary] = useState<HelpdeskStatData | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Track what has been fetched to avoid duplicate initial calls
    const lastFiltersStringRef = useRef(JSON.stringify(filters || {}));
    const hasFetchedWsRef = useRef(false);
    const filtersRef = useRef(filters);

    const fetchThreadsSocket = useCallback((f?: Record<string, string>) => {
        sendAction('list_threads', { filters: f });
        hasFetchedWsRef.current = true;
    }, [sendAction]);

    const fetchThreadsRest = useCallback(async (f?: Record<string, string>) => {
        try {
            const res = await HelpdeskService.listThreads(1, f); // Fetch first page as baseline
            
            // If WebSocket already responded, don't overwrite with potentially stale REST data
            if (hasFetchedWsRef.current) return;

            setResults(res.results);
            setSummary(res.helpdesk_summary_data ?? null);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching helpdesk threads via REST:', err);
            setLoading(false);
        }
    }, []);

    // Effect to handle filter changes
    useEffect(() => {
        const currentFiltersString = JSON.stringify(filters || {});
        if (currentFiltersString !== lastFiltersStringRef.current) {
            lastFiltersStringRef.current = currentFiltersString;
            filtersRef.current = filters;
            hasFetchedWsRef.current = false;
            setResults([]);
            setLoading(true);
            
            // Re-fetch immediately
            if (isConnected) {
                fetchThreadsSocket(filters);
            } else {
                fetchThreadsRest(filters);
            }
        }
    }, [filters, isConnected, fetchThreadsSocket, fetchThreadsRest]);

    // Initial load / Transition to WebSocket
    useEffect(() => {
        if (!enabled) return;

        if (isConnected) {
            // Always fetch via WS when connection is established or becomes available
            fetchThreadsSocket(filtersRef.current);
        } else if (results.length === 0 && !hasFetchedWsRef.current) {
            // Initial fallback to REST if not connected
            fetchThreadsRest(filtersRef.current);
        }
    }, [enabled, isConnected]); // Stable deps to prevent loops

    const handleHelpdeskList = useCallback((event: SocketMessage) => {
        const typedEvent = event as unknown as HelpdeskSocketEvent;
        if (typedEvent.type === 'helpdesk.list' && typedEvent.data) {
            setResults(typedEvent.data.results ?? []);
            if (typedEvent.data.helpdesk_summary_data) {
                setSummary(typedEvent.data.helpdesk_summary_data);
            }
            setLoading(false);
            hasFetchedWsRef.current = true;
        }
    }, []);

    const handleHelpdeskThread = useCallback((event: SocketMessage) => {
        const typedEvent = event as unknown as HelpdeskSocketEvent;
        if (typedEvent.type === 'helpdesk.thread' && typedEvent.data) {
            const { thread_id, update_type, message, thread: threadPatch } = typedEvent.data;
            
            setResults(prev => {
                const threadIndex = prev.findIndex(t => t.id === thread_id);
                
                if (threadIndex === -1) {
                    // If thread not in list, it might be new or re-opened.
                    // We re-fetch the list to ensure accurate ordering and content.
                    if (isConnected) fetchThreadsSocket(filtersRef.current);
                    return prev;
                }

                const updatedResults = [...prev];
                let updatedThread = { ...updatedResults[threadIndex] };

                if (update_type === 'message' && message) {
                    updatedThread = {
                        ...updatedThread,
                        last_message_at: message.created_at,
                        candidate_last_msg_preview: message.sender_type === 'candidate' ? message.text : updatedThread.candidate_last_msg_preview,
                        unread_by_staff_count: message.sender_type === 'candidate' ? (updatedThread.unread_by_staff_count || 0) + 1 : updatedThread.unread_by_staff_count,
                    };
                } else if (update_type === 'metadata' && threadPatch) {
                    updatedThread = { ...updatedThread, ...threadPatch };
                }

                updatedResults[threadIndex] = updatedThread as HelpdeskThreadType;

                // Move to top on new message
                if (update_type === 'message') {
                    const [removed] = updatedResults.splice(threadIndex, 1);
                    updatedResults.unshift(removed);
                }

                return updatedResults;
            });
        }
    }, [isConnected, fetchThreadsSocket]);

    const handleHelpdeskUpdate = useCallback((event: SocketMessage) => {
        const typedEvent = event as unknown as HelpdeskSocketEvent;
        if (typedEvent.type === 'helpdesk.update' && typedEvent.data) {
            if (typedEvent.data.stats) {
                setSummary(typedEvent.data.stats);
            }
            if (typedEvent.data.refresh_threads && isConnected) {
                fetchThreadsSocket(filtersRef.current);
            }
        }
    }, [isConnected, fetchThreadsSocket]);

    useEffect(() => {
        if (enabled) {
            addListener('helpdesk.list', handleHelpdeskList);
            addListener('helpdesk.update', handleHelpdeskUpdate);
            addListener('helpdesk.thread', handleHelpdeskThread);
        }
        return () => {
            removeListener('helpdesk.list', handleHelpdeskList);
            removeListener('helpdesk.update', handleHelpdeskUpdate);
            removeListener('helpdesk.thread', handleHelpdeskThread);
        };
    }, [enabled, addListener, removeListener, handleHelpdeskList, handleHelpdeskUpdate, handleHelpdeskThread]);

    const refetch = useCallback(() => {
        setLoading(true);
        if (isConnected) fetchThreadsSocket(filtersRef.current);
        else fetchThreadsRest(filtersRef.current);
    }, [isConnected, fetchThreadsSocket, fetchThreadsRest]);

    return useMemo(() => ({
        results,
        summary,
        loading,
        connected: isConnected,
        refetch
    }), [results, summary, loading, isConnected, refetch]);
}
