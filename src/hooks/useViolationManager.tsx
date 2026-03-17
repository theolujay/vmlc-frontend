import { useState, useEffect, useCallback, useRef } from "react";
import {
  ViolationType,
  ViolationEvent,
  ViolationSummary,
  HeartbeatMeta,
} from "@/types/ViolationType";
import { ExamPortal } from "@/services/examPortal.service";
import { dataURLtoFile } from "@/utils/formatFileSize";
import { isDev } from "@/utils/isDev";

const HEARTBEAT_INTERVAL = isDev() ? 60 * 1000 : 5 * 60 * 1000; // 1 minute in dev, 5 minutes in prod

interface BatteryManager {
  level: number;
  charging: boolean;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export const useViolationManager = (examId: string, startedAt?: string) => {
  const [summary, setSummary] = useState<ViolationSummary>({
    TAB_SWITCH: 0,
    SCREENSHOT: 0,
    FULLSCREEN_EXIT: 0,
    MULTI_FACE: 0,
    NO_FACE: 0,
    ATTENTION_LAPSE: 0,
    DEVTOOLS_OPEN: 0,
  });

  const eventsRef = useRef<ViolationEvent[]>([]);
  const summaryRef = useRef<ViolationSummary>({
    TAB_SWITCH: 0,
    SCREENSHOT: 0,
    FULLSCREEN_EXIT: 0,
    MULTI_FACE: 0,
    NO_FACE: 0,
    ATTENTION_LAPSE: 0,
    DEVTOOLS_OPEN: 0,
  });

  // Get sequence - prefer persisted value, fall back to time-based calculation
  const getCurrentSequence = useCallback(() => {
    if (typeof window === "undefined") return 1;

    const storedSeq = localStorage.getItem(`vmlc_proctor_seq_${examId}`);
    if (storedSeq) {
      return Number(storedSeq);
    }

    // First heartbeat - return 1
    return 1;
  }, [examId]);

  const sequenceNumberRef = useRef<number>(getCurrentSequence());
  const lastHeartbeatTimeRef = useRef<string>(
    (typeof window !== "undefined"
      ? localStorage.getItem(`vmlc_proctor_last_time_${examId}`)
      : null) || new Date().toISOString(),
  );
  const getLatestScreenshotRef = useRef<(() => string | null) | null>(null);
  const heartbeatInProgressRef = useRef(false);

  // Store persistent state for session consistency
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `vmlc_proctor_seq_${examId}`,
        sequenceNumberRef.current.toString(),
      );
      localStorage.setItem(
        `vmlc_proctor_last_time_${examId}`,
        lastHeartbeatTimeRef.current,
      );
      if (startedAt) {
        localStorage.setItem(`vmlc_proctor_started_at_${examId}`, startedAt);
      }
    }
  }, [examId, startedAt]);

  const getMetadata = useCallback(async (): Promise<HeartbeatMeta> => {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome"))
      browser = "Safari";

    let os = "Unknown";
    if (ua.includes("Win")) os = "Windows";
    else if (ua.includes("Mac")) os = "MacOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS")) os = "iOS";

    const meta: HeartbeatMeta = {
      os,
      browser,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      is_online: navigator.onLine,
      touch_support: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      device_memory: (navigator as unknown as { deviceMemory?: number })
        .deviceMemory,
    };

    // Connection type (Network Information API)
    const nav = navigator as unknown as {
      connection?: { effectiveType?: string };
    };
    if (nav.connection?.effectiveType) {
      meta.connection_type = nav.connection.effectiveType;
    }

    // Add current question ID from localStorage
    try {
      const currentIndex = localStorage.getItem(
        `exam_current_question_${examId}`,
      );
      const savedShuffled = localStorage.getItem(`shuffled_exam_${examId}`);
      if (currentIndex !== null && savedShuffled) {
        const questions = JSON.parse(savedShuffled);
        const currentQuestion = questions[Number(currentIndex)];
        if (currentQuestion) {
          meta.current_question_id = currentQuestion.id;
        }
      }
    } catch (e) {
      console.error("Failed to parse current question for heartbeat", e);
    }

    // Simple latency check
    try {
      const start = Date.now();
      await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
      meta.network_latency_ms = Date.now() - start;
    } catch (e) {}

    // Attempt to get battery status if supported
    try {
      const nav = navigator as NavigatorWithBattery;
      if (nav.getBattery) {
        const battery = await nav.getBattery();
        meta.battery_level = battery.level;
        meta.is_charging = battery.charging;
      }
    } catch (e) {}

    return meta;
  }, [examId]);

  const reportViolation = useCallback(
    (type: ViolationType, metadata?: Record<string, unknown>) => {
      summaryRef.current = {
        ...summaryRef.current,
        [type]: summaryRef.current[type] + 1,
      };

      setSummary(summaryRef.current);

      const highFrequencyTypes: ViolationType[] = [
        "NO_FACE",
        "MULTI_FACE",
        "ATTENTION_LAPSE",
      ];
      const shouldLogDetail =
        !highFrequencyTypes.includes(type) ||
        !eventsRef.current.some(
          (e) =>
            e.type === type &&
            Date.now() - new Date(e.timestamp).getTime() < 30000,
        );

      if (shouldLogDetail) {
        // Enrich metadata with current question id
        const enrichedMetadata = { ...metadata };
        try {
          const currentIndex = localStorage.getItem(
            `exam_current_question_${examId}`,
          );
          const savedShuffled = localStorage.getItem(`shuffled_exam_${examId}`);
          if (currentIndex !== null && savedShuffled) {
            const questions = JSON.parse(savedShuffled);
            const currentQuestion = questions[Number(currentIndex)];
            if (currentQuestion) {
              enrichedMetadata.question_id = currentQuestion.id;
            }
          }
        } catch (e) {}

        eventsRef.current.push({
          type,
          timestamp: new Date().toISOString(),
          metadata: enrichedMetadata,
        });
      }
    },
    [examId],
  );

  const sendHeartbeat = useCallback(
    async (isFinal = false) => {
      if (!examId) return;
      if (heartbeatInProgressRef.current && !isFinal) return;

      heartbeatInProgressRef.current = true;

      // Refresh sequence number based on current time
      sequenceNumberRef.current = getCurrentSequence();

      const periodEnd = new Date().toISOString();
      // For first heartbeat (sequence 1), simulate a full period by backdating period_start
      // This aligns with backend expectation of ~5 min intervals
      const periodStart =
        sequenceNumberRef.current === 1
          ? new Date(Date.now() - HEARTBEAT_INTERVAL).toISOString()
          : lastHeartbeatTimeRef.current;
      const meta = await getMetadata();

      const payload = {
        sequence_number: sequenceNumberRef.current,
        client_uuid: crypto.randomUUID(),
        timestamp: periodEnd,
        period_start: periodStart,
        period_end: periodEnd,
        meta,
        summary: summaryRef.current,
        events: eventsRef.current,
      };

      let faceCaptureFile: File | undefined;
      try {
        if (getLatestScreenshotRef.current) {
          const screenshot = getLatestScreenshotRef.current();
          if (screenshot) {
            faceCaptureFile = dataURLtoFile(
              screenshot,
              `heartbeat_${sequenceNumberRef.current}_${Date.now()}.jpg`,
            );
          }
        }
      } catch (screenshotError) {
        console.error(
          "Failed to capture screenshot for heartbeat",
          screenshotError,
        );
        // Proceed without screenshot
      }

      try {
        await ExamPortal.sendHeartbeat(
          examId,
          JSON.stringify(payload),
          faceCaptureFile,
        );

        // Reset buffers and increment sequence on success
        const resetSummary = {
          TAB_SWITCH: 0,
          SCREENSHOT: 0,
          FULLSCREEN_EXIT: 0,
          MULTI_FACE: 0,
          NO_FACE: 0,
          ATTENTION_LAPSE: 0,
          DEVTOOLS_OPEN: 0,
        };
        setSummary(resetSummary);
        summaryRef.current = resetSummary;
        eventsRef.current = [];
        lastHeartbeatTimeRef.current = periodEnd;

        // Increment sequence for next heartbeat and update persistent state
        sequenceNumberRef.current += 1;
        localStorage.setItem(
          `vmlc_proctor_seq_${examId}`,
          sequenceNumberRef.current.toString(),
        );
        localStorage.setItem(
          `vmlc_proctor_last_time_${examId}`,
          lastHeartbeatTimeRef.current,
        );

        // Clear any cached failed heartbeats if we had them
        localStorage.removeItem(`failed_heartbeat_${examId}`);

        heartbeatInProgressRef.current = false;
      } catch (error) {
        console.error("Failed to send heartbeat telemetry:", error);

        const isHttpError =
          error && typeof error === "object" && "response" in error;
        const status = isHttpError
          ? (error as { response: { status: number } }).response?.status
          : 0;

        if (status === 400) {
          console.warn(
            "Validation error (400) - incrementing sequence anyway as server likely processed it",
          );
          sequenceNumberRef.current += 1;
          const resetSummary = {
            TAB_SWITCH: 0,
            SCREENSHOT: 0,
            FULLSCREEN_EXIT: 0,
            MULTI_FACE: 0,
            NO_FACE: 0,
            ATTENTION_LAPSE: 0,
            DEVTOOLS_OPEN: 0,
          };
          setSummary(resetSummary);
          summaryRef.current = resetSummary;
          eventsRef.current = [];
          lastHeartbeatTimeRef.current = periodEnd;
          localStorage.setItem(
            `vmlc_proctor_seq_${examId}`,
            sequenceNumberRef.current.toString(),
          );
          localStorage.removeItem(`failed_heartbeat_${examId}`);
          heartbeatInProgressRef.current = false;
        } else {
          localStorage.setItem(
            `failed_heartbeat_${examId}`,
            JSON.stringify({
              payload,
              timestamp: Date.now(),
            }),
          );
        }
      }
    },
    [examId, getCurrentSequence, getMetadata],
  );

  const sendHeartbeatRef = useRef(sendHeartbeat);
  sendHeartbeatRef.current = sendHeartbeat;

  useEffect(() => {
    if (!examId) return;

    const interval = setInterval(
      () => sendHeartbeatRef.current(false),
      HEARTBEAT_INTERVAL,
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sendHeartbeatRef.current(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [examId]);

  // Retry failed heartbeats on page load
  useEffect(() => {
    if (!examId || typeof window === "undefined") return;

    const retryFailedHeartbeat = async () => {
      const failedData = localStorage.getItem(`failed_heartbeat_${examId}`);
      if (!failedData) return;

      try {
        const parsed = JSON.parse(failedData);
        if (!parsed || typeof parsed !== "object" || !parsed.payload) {
          localStorage.removeItem(`failed_heartbeat_${examId}`);
          return;
        }
        const payloadObj = JSON.parse(parsed.payload);

        let faceCaptureFile: File | undefined;
        if (getLatestScreenshotRef.current) {
          const screenshot = getLatestScreenshotRef.current();
          if (screenshot) {
            faceCaptureFile = dataURLtoFile(
              screenshot,
              `heartbeat_retry_${Date.now()}.jpg`,
            );
          }
        }

        await ExamPortal.sendHeartbeat(
          examId,
          JSON.stringify(payloadObj),
          faceCaptureFile,
        );
        localStorage.removeItem(`failed_heartbeat_${examId}`);
      } catch (error) {
        const isHttpError =
          error && typeof error === "object" && "response" in error;
        const status = isHttpError
          ? (error as { response: { status: number } }).response?.status
          : 0;

        if (status === 400) {
          console.warn(
            "Retry validation error (400) - skipping failed heartbeat",
          );
          localStorage.removeItem(`failed_heartbeat_${examId}`);
        } else {
          console.error("Failed to retry heartbeat:", error);
        }
      }
    };

    retryFailedHeartbeat();
  }, [examId]);

  return {
    reportViolation,
    sendFinalHeartbeat: () => sendHeartbeat(true),
    startHeartbeats: () => {
      sendHeartbeatRef.current(false);
    },
    registerScreenshotProvider: (fn: () => string | null) => {
      getLatestScreenshotRef.current = fn;
    },
  };
};
