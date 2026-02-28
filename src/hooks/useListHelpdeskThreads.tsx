import { useEffect, useState, useCallback, useRef } from 'react';
import { HelpdeskThreadListResponse, HelpdeskSocketEvent } from '@/types/HelpdeskType';
import { HelpdeskService } from '@/services/Helpdesk.service';
import { useSocket } from '@/contexts/SocketProvider';

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

    const handleHelpdeskList = useCallback((event: HelpdeskSocketEvent) => {
        if (event.type === 'helpdesk.list' && event.data) {
            setData(prev => ({
                ...prev,
                results: event.data.results ?? [],
                pagination: event.data.pagination ?? prev?.pagination,
                helpdesk_summary_data: prev?.helpdesk_summary_data
            } as HelpdeskThreadListResponse));
            setLoading(false);
        }
    }, []);

    const handleHelpdeskUpdate = useCallback((event: HelpdeskSocketEvent) => {
        if (event.type === 'helpdesk.update' && event.data) {
            if (event.data.stats) {
                setData(prev => ({
                    ...prev,
                    helpdesk_summary_data: event.data.stats
                } as HelpdeskThreadListResponse));
            }
            if (event.data.refresh_threads) {
                fetchThreadsSocket(pageRef.current, filtersRef.current);
            }
        }
    }, [fetchThreadsSocket]);

    useEffect(() => {
        if (enabled) {
            addListener('helpdesk.list', handleHelpdeskList as any);
            addListener('helpdesk.update', handleHelpdeskUpdate as any);
        }
        return () => {
            removeListener('helpdesk.list', handleHelpdeskList as any);
            removeListener('helpdesk.update', handleHelpdeskUpdate as any);
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
