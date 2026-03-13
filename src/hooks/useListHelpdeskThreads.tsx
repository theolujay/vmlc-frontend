import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { HelpdeskSocketEvent, HelpdeskThreadType, PaginationData } from '@/types/HelpdeskType';
import { HelpdeskService } from '@/services/Helpdesk.service';
import { useSocket, SocketMessage } from '@/contexts/SocketProvider';
import { HelpdeskStatData } from '@/types/UserMgtType';

/**
 * Hook to list helpdesk threads for staff using Unified WebSocket for real-time updates.
 * Supports "streaming" by accumulating results.
 */
export default function useListHelpdeskThreads(filters?: Record<string, string>, enabled: boolean = true) {
    const { isConnected, addListener, removeListener, sendAction } = useSocket();
    const [results, setResults] = useState<HelpdeskThreadType[]>([]);
    const [summary, setSummary] = useState<HelpdeskStatData | null>(null);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);

    const filtersRef = useRef(filters);
    const lastFiltersStringRef = useRef(JSON.stringify(filters || {}));

    // Effect to handle filter changes - resets state only when stringified filters actually change
    useEffect(() => {
        const currentFiltersString = JSON.stringify(filters || {});
        if (currentFiltersString !== lastFiltersStringRef.current) {
            lastFiltersStringRef.current = currentFiltersString;
            filtersRef.current = filters;
            setResults([]);
            setPage(1);
            setLoading(true);
        }
    }, [filters]); // We can use filters here since we have an internal guard

    const fetchThreadsSocket = useCallback((p: number, f?: Record<string, string>, isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true);
        sendAction('list_threads', {
            page: p,
            filters: f
        });
    }, [sendAction]);

    const fetchThreadsRest = useCallback(async (p: number, f?: Record<string, string>, isLoadMore = false) => {
        try {
            if (isLoadMore) setLoadingMore(true);
            const res = await HelpdeskService.listThreads(p, f);
            setResults(prev => p === 1 ? res.results : [...prev, ...res.results]);
            setPagination(res.pagination);
            setSummary(res.helpdesk_summary_data ?? null);
            setLoading(false);
            setLoadingMore(false);
        } catch (err) {
            console.error('Error fetching helpdesk threads via REST:', err);
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Initial load / Refetch on connection/page change
    useEffect(() => {
        if (!enabled) return;

        if (isConnected) {
            if (page === 1 || loadingMore) {
                fetchThreadsSocket(page, filtersRef.current, page > 1);
            }
        } else if (page === 1) {
            fetchThreadsRest(1, filtersRef.current);
        }
    }, [enabled, isConnected, page, loadingMore, fetchThreadsSocket, fetchThreadsRest]);

    const handleHelpdeskList = useCallback((event: SocketMessage) => {
        const typedEvent = event as unknown as HelpdeskSocketEvent;
        if (typedEvent.type === 'helpdesk.list' && typedEvent.data) {
            const newResults = typedEvent.data.results ?? [];
            const newPagination = typedEvent.data.pagination;

            setResults(prev => {
                if (newPagination?.page === 1) {
                    return newResults;
                }
                const existingIds = new Set(prev.map(r => r.id));
                const filteredNew = newResults.filter(r => !existingIds.has(r.id));
                return [...prev, ...filteredNew];
            });

            setPagination(newPagination ?? null);
            if (typedEvent.data.helpdesk_summary_data) {
                setSummary(typedEvent.data.helpdesk_summary_data);
            }
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    const handleHelpdeskUpdate = useCallback((event: SocketMessage) => {
        const typedEvent = event as unknown as HelpdeskSocketEvent;
        if (typedEvent.type === 'helpdesk.update' && typedEvent.data) {
            if (typedEvent.data.stats) {
                setSummary(typedEvent.data.stats);
            }
            if (typedEvent.data.refresh_threads) {
                // Refresh current view
                if (isConnected) {
                    fetchThreadsSocket(1, filtersRef.current);
                } else {
                    fetchThreadsRest(1, filtersRef.current);
                }
            }
        }
    }, [isConnected, fetchThreadsSocket, fetchThreadsRest]);

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

    const loadMore = useCallback(() => {
        if (pagination?.has_next && !loadingMore) {
            setPage(prev => prev + 1);
            setLoadingMore(true);
        }
    }, [pagination, loadingMore]);

    const refetch = useCallback(() => {
        setResults([]);
        setPage(1);
        setLoading(true);
        if (isConnected) {
            fetchThreadsSocket(1, filtersRef.current);
        } else {
            fetchThreadsRest(1, filtersRef.current);
        }
    }, [isConnected, fetchThreadsSocket, fetchThreadsRest]);

    return useMemo(() => ({
        results,
        summary,
        pagination,
        loading,
        loadingMore,
        connected: isConnected,
        loadMore,
        refetch
    }), [results, summary, pagination, loading, loadingMore, isConnected, loadMore, refetch]);
}
