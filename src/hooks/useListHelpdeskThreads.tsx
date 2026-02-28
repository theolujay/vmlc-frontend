import { useEffect, useState, useCallback, useRef } from 'react';
import { HelpdeskThreadListResponse, HelpdeskSocketEvent } from '@/types/HelpdeskType';
import { HelpdeskService } from '@/services/Helpdesk.service';
import { useSocket, SocketMessage } from '@/contexts/SocketProvider';

/**
 * Hook to list helpdesk threads for staff using Unified WebSocket for real-time updates.
 */
export default function useListHelpdeskThreads(page: number, filters?: Record<string, string>, enabled: boolean = true) {
    const { isConnected, addListener, removeListener, sendAction } = useSocket();
    const [data, setData] = useState<HelpdeskThreadListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    
    const pageRef = useRef(page);
    const filtersRef = useRef(filters);

    useEffect(() => {
        pageRef.current = page;
        filtersRef.current = filters;
    }, [page, filters]);

    const fetchThreadsSocket = useCallback((p: number, f?: Record<string, string>) => {
        sendAction('list_threads', {
            page: p,
            filters: f
        });
    }, [sendAction]);

    const fetchThreadsRest = useCallback(async (p: number, f?: Record<string, string>) => {
        try {
            const res = await HelpdeskService.listThreads(p, f);
            setData(res);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching helpdesk threads via REST:', err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (enabled && !isConnected) {
            fetchThreadsRest(page, filters);
        }
    }, [enabled, page, filters, isConnected, fetchThreadsRest]);

    const handleHelpdeskList = useCallback((event: SocketMessage) => {
        const typedEvent = event as unknown as HelpdeskSocketEvent;
        if (typedEvent.type === 'helpdesk.list' && typedEvent.data) {
            setData(prev => ({
                ...prev,
                results: typedEvent.data.results ?? [],
                pagination: typedEvent.data.pagination ?? prev?.pagination,
                helpdesk_summary_data: prev?.helpdesk_summary_data
            } as HelpdeskThreadListResponse));
            setLoading(false);
        }
    }, []);

    const handleHelpdeskUpdate = useCallback((event: SocketMessage) => {
        const typedEvent = event as unknown as HelpdeskSocketEvent;
        if (typedEvent.type === 'helpdesk.update' && typedEvent.data) {
            if (typedEvent.data.stats) {
                setData(prev => ({
                    ...prev,
                    helpdesk_summary_data: typedEvent.data.stats
                } as HelpdeskThreadListResponse));
            }
            if (typedEvent.data.refresh_threads) {
                fetchThreadsSocket(pageRef.current, filtersRef.current);
            }
        }
    }, [fetchThreadsSocket]);

    useEffect(() => {
        if (enabled) {
            addListener('helpdesk.list', handleHelpdeskList);
            addListener('helpdesk.update', handleHelpdeskUpdate);
        }
        return () => {
            removeListener('helpdesk.list', handleHelpdeskList);
            removeListener('helpdesk.update', handleHelpdeskUpdate);
        };
    }, [enabled, addListener, removeListener, handleHelpdeskList, handleHelpdeskUpdate]);

    useEffect(() => {
        if (enabled && isConnected) {
            fetchThreadsSocket(page, filters);
        }
    }, [enabled, page, filters, isConnected, fetchThreadsSocket]);

    return { 
        data, 
        loading, 
        connected: isConnected, 
        error: null,
        refetch: () => isConnected ? fetchThreadsSocket(page, filters) : fetchThreadsRest(page, filters)
    };
}
