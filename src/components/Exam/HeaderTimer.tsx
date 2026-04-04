"use client";
import { useExamContext } from "@/contexts/ExamNavigationProvider";
import { formatExamTitle } from "@/utils/generalUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ExamPortal } from "@/services/examPortal.service";

export default function HeaderTimer({
  timer,
  deadline,
  onTimeUp,
  title,
  examId,
}: {
  timer: number;
  deadline?: string;
  onTimeUp?: () => Promise<void> | void;
  title?: string;
  examId: string;
}) {
  const { showNav, setShowNav, timeLeft, setTimeLeft } = useExamContext();

  const [isSyncing, setIsSyncing] = useState(false);
  const serverDeadlineRef = useRef<string | null>(deadline || null);
  const serverTimeOffsetRef = useRef<number>(0);
  const hasSubmitted = useRef(false);
  const isInitialized = useRef(false);

  const syncWithServer = useCallback(async () => {
    if (!examId) return null;

    try {
      setIsSyncing(true);
      const data = await ExamPortal.getExamTime(examId);

      if (data.deadline) {
        serverDeadlineRef.current = data.deadline;
      }

      // Calculate offset: ServerTime - LocalTime
      if (data.server_time) {
        const serverTime = new Date(data.server_time).getTime();
        const localTime = Date.now();
        serverTimeOffsetRef.current = serverTime - localTime;
      }

      return data.remaining_seconds;
    } catch (error) {
      console.error("Failed to sync with server time:", error);
      return null;
    } finally {
      setIsSyncing(false);
    }
  }, [examId]);

  // Fetch initial time and set up local countdown
  useEffect(() => {
    if (!examId) return;

    let countdownInterval: NodeJS.Timeout;

    const startLocalCountdown = () => {
      if (countdownInterval) clearInterval(countdownInterval);
      countdownInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) return 0;
          return prev - 1;
        });
      }, 1000);
    };

    const initTime = async () => {
      const serverRemaining = await syncWithServer();

      if (serverRemaining !== null) {
        // Direct server truth
        setTimeLeft(serverRemaining);
        isInitialized.current = true;
        startLocalCountdown();
      } else if (deadline) {
        // Fallback using calculated offset if possible, otherwise raw diff
        const serverNow = Date.now() + serverTimeOffsetRef.current;
        const remaining = Math.floor(
          (new Date(deadline).getTime() - serverNow) / 1000,
        );
        const finalRemaining = Math.max(0, remaining);
        setTimeLeft(finalRemaining);
        isInitialized.current = true;
        startLocalCountdown();
      } else {
        // Last resort fallback
        setTimeLeft(timer * 60);
        isInitialized.current = true;
        startLocalCountdown();
      }
    };

    initTime();

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [examId, deadline, timer, syncWithServer, setTimeLeft]);

  // Server sync every 30 seconds to update time and deadline reference
  useEffect(() => {
    if (!examId) return;

    const syncInterval = setInterval(async () => {
      const serverRemaining = await syncWithServer();
      if (serverRemaining !== null) {
        setTimeLeft(serverRemaining);
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [examId, syncWithServer, setTimeLeft]);

  useEffect(() => {
    // CRITICAL: Don't submit until we've successfully initialized with server time
    if (!isInitialized.current) return;

    // Use a small buffer or check that this isn't the very first render cycle
    // to avoid race conditions with context initialization
    if (timeLeft <= 0) {
      if (!hasSubmitted.current) {
        hasSubmitted.current = true;
        (async () => {
          try {
            await onTimeUp?.();
          } catch (err) {
            console.error("Error submitting exam:", err);
            // Allow retry if submission fails
            hasSubmitted.current = false;
          }
        })();
      }
    }
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const isLowTime = timeLeft < 300;

  return (
    <div className="flex bg-white justify-between px-10 py-6 items-center border-b border-gray-100 z-40 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-[#3E4095]/5 rounded-xl flex items-center justify-center text-[#3E4095]">
          <i className="fas fa-graduation-cap text-lg"></i>
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none">
            {formatExamTitle(title) || "Examination Session"}
          </h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Verboheit MLC Portal
          </span>
        </div>
      </div>

      <div
        className={clsx(
          "flex flex-col items-center px-6 py-2 rounded-2xl border transition-all duration-500",
          isLowTime
            ? "bg-red-50 border-red-100 animate-pulse"
            : "bg-gray-50/50 border-gray-100",
        )}
      >
        <span
          className={clsx(
            "text-[9px] font-black uppercase tracking-widest mb-0.5",
            isLowTime ? "text-red-500" : "text-gray-400",
          )}
        >
          Time Remaining
          {isSyncing && <span className="ml-1 text-[8px]">⚡</span>}
        </span>
        <span
          className={clsx(
            "font-black text-xl tabular-nums tracking-tighter leading-none",
            isLowTime ? "text-red-600" : "text-[#3E4095]",
          )}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => setShowNav(!showNav)}
          className={clsx(
            "flex items-center space-x-3 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border",
            showNav
              ? "bg-[#3E4095] text-white border-[#3E4095] shadow-lg shadow-[#3E4095]/20"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50",
          )}
        >
          <i
            className={clsx(
              "fas transition-transform duration-300",
              showNav ? "fa-times" : "fa-th-large",
            )}
          ></i>
          <span>Quiz Navigation</span>
        </button>
      </div>
    </div>
  );
}
