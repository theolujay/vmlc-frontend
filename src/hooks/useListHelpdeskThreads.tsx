import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { HelpdeskSocketEvent, HelpdeskThreadType } from "@/types/HelpdeskType";
import { HelpdeskService } from "@/services/Helpdesk.service";
import { useSocket, SocketMessage } from "@/contexts/SocketProvider";
import { HelpdeskStatData } from "@/types/UserMgtType";

const playNotificationSound = () => {
  try {
    const audioContext = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    console.warn("Could not play notification sound:", e);
  }
};

/**
 * Hook to list helpdesk threads for staff using Unified WebSocket for real-time updates.
 * Prioritizes WebSocket for live updates and manages a single "live list" of threads.
 */
export default function useListHelpdeskThreads(
  filters?: Record<string, string>,
  enabled: boolean = true,
) {
  const { isConnected, addListener, removeListener, sendAction } = useSocket();
  const [results, setResults] = useState<HelpdeskThreadType[]>([]);
  const [summary, setSummary] = useState<HelpdeskStatData | null>(null);
  const [loading, setLoading] = useState(true);

  // Track what has been fetched to avoid duplicate initial calls
  const lastFiltersStringRef = useRef(JSON.stringify(filters || {}));
  const hasFetchedWsRef = useRef(false);
  const filtersRef = useRef(filters);
  const requestIdRef = useRef(0);

  const fetchThreadsSocket = useCallback(
    (f?: Record<string, string>) => {
      requestIdRef.current += 1;
      sendAction("list_threads", {
        filters: f,
        request_id: requestIdRef.current,
      });
      hasFetchedWsRef.current = true;
    },
    [sendAction],
  );

  const fetchThreadsRest = useCallback(async (f?: Record<string, string>) => {
    try {
      const res = await HelpdeskService.listThreads(1, f); // Fetch first page as baseline

      // If WebSocket already responded, don't overwrite with potentially stale REST data
      if (hasFetchedWsRef.current) return;

      setResults(res.results);
      setSummary(res.helpdesk_summary_data ?? null);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching helpdesk threads via REST:", err);
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
      setLoading(true);

      // Re-fetch immediately without clearing results to prevent flickering
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
    } else if (!hasFetchedWsRef.current) {
      // Initial fallback to REST if not connected
      fetchThreadsRest(filtersRef.current);
    }
  }, [enabled, fetchThreadsRest, fetchThreadsSocket, isConnected]);

  const handleHelpdeskList = useCallback((event: SocketMessage) => {
    const typedEvent = event as unknown as HelpdeskSocketEvent;
    if (typedEvent.type === "helpdesk.list" && typedEvent.data) {
      const responseData = typedEvent.data;

      // Validate filters match our current request to ignore stale responses
      const responseFilters = responseData.filters;
      if (responseFilters) {
        const currentFilters = filtersRef.current || {};
        const isMatchingStatus =
          (responseFilters.status || "default") ===
          (currentFilters.status || "default");
        const isMatchingSearch =
          (responseFilters.search || "") === (currentFilters.search || "");

        if (!isMatchingStatus || !isMatchingSearch) {
          // Stale response - ignore it
          return;
        }
      }

      setResults(responseData.results ?? []);
      if (responseData.helpdesk_summary_data) {
        setSummary(responseData.helpdesk_summary_data);
      }
      setLoading(false);
      hasFetchedWsRef.current = true;
    }
  }, []);

  const handleHelpdeskThread = useCallback(
    (event: SocketMessage) => {
      const typedEvent = event as unknown as HelpdeskSocketEvent;
      if (typedEvent.type === "helpdesk.thread" && typedEvent.data) {
        const {
          thread_id,
          update_type,
          message,
          thread: threadPatch,
        } = typedEvent.data;

        setResults((prev) => {
          const threadIndex = prev.findIndex((t) => t.id === thread_id);

          if (threadIndex === -1) {
            // If thread not in list, it might be new or re-opened.
            // We re-fetch the list to ensure accurate ordering and content.
            if (isConnected) fetchThreadsSocket(filtersRef.current);
            return prev;
          }

          const updatedResults = [...prev];
          let updatedThread = { ...updatedResults[threadIndex] };

          if (update_type === "message" && message) {
            updatedThread = {
              ...updatedThread,
              last_message_at: message.created_at,
              candidate_last_msg_preview:
                message.sender_type === "candidate"
                  ? message.text
                  : updatedThread.candidate_last_msg_preview,
              unread_by_staff_count:
                message.sender_type === "candidate"
                  ? (updatedThread.unread_by_staff_count || 0) + 1
                  : updatedThread.unread_by_staff_count,
            };

            if (message.sender_type === "candidate" && document.hidden) {
              playNotificationSound();
            }
          } else if (update_type === "metadata" && threadPatch) {
            updatedThread = { ...updatedThread, ...threadPatch };
          }

          updatedResults[threadIndex] = updatedThread as HelpdeskThreadType;

          // Move to top on new message
          if (update_type === "message") {
            const [removed] = updatedResults.splice(threadIndex, 1);
            updatedResults.unshift(removed);
          }

          return updatedResults;
        });
      }
    },
    [isConnected, fetchThreadsSocket],
  );

  const handleHelpdeskUpdate = useCallback(
    (event: SocketMessage) => {
      const typedEvent = event as unknown as HelpdeskSocketEvent;
      if (typedEvent.type === "helpdesk.update" && typedEvent.data) {
        if (typedEvent.data.stats) {
          setSummary(typedEvent.data.stats);
        }
        if (typedEvent.data.refresh_threads && isConnected) {
          fetchThreadsSocket(filtersRef.current);
        }
      }
    },
    [isConnected, fetchThreadsSocket],
  );

  useEffect(() => {
    if (enabled) {
      addListener("helpdesk.list", handleHelpdeskList);
      addListener("helpdesk.update", handleHelpdeskUpdate);
      addListener("helpdesk.thread", handleHelpdeskThread);
    }
    return () => {
      removeListener("helpdesk.list", handleHelpdeskList);
      removeListener("helpdesk.update", handleHelpdeskUpdate);
      removeListener("helpdesk.thread", handleHelpdeskThread);
    };
  }, [
    enabled,
    addListener,
    removeListener,
    handleHelpdeskList,
    handleHelpdeskUpdate,
    handleHelpdeskThread,
  ]);

  const refetch = useCallback(() => {
    setLoading(true);
    if (isConnected) fetchThreadsSocket(filtersRef.current);
    else fetchThreadsRest(filtersRef.current);
  }, [isConnected, fetchThreadsSocket, fetchThreadsRest]);

  return useMemo(
    () => ({
      results,
      summary,
      loading,
      connected: isConnected,
      refetch,
    }),
    [results, summary, loading, isConnected, refetch],
  );
}
