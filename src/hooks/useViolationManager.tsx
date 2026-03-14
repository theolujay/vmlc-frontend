import { useState, useEffect, useCallback, useRef } from 'react';
import { ViolationType, ViolationEvent, ViolationSummary, HeartbeatMeta } from '@/types/ViolationType';
import { ExamPortal } from '@/services/examPortal.service';
import { dataURLtoFile } from '@/utils/formatFileSize';

const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutes

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
  });
  
  const eventsRef = useRef<ViolationEvent[]>([]);
  
  // Calculate current expected sequence based on elapsed time since startedAt
  const getCurrentSequence = useCallback(() => {
    if (!startedAt) return Number(localStorage.getItem(`vmlc_proctor_seq_${examId}`) || 1);
    
    const startTime = new Date(startedAt).getTime();
    const now = Date.now();
    const elapsedMs = now - startTime;
    
    // sequence 1 is [0-5min], sequence 2 is [5-10min], etc.
    return Math.floor(elapsedMs / HEARTBEAT_INTERVAL) + 1;
  }, [examId, startedAt]);

  const sequenceNumberRef = useRef<number>(getCurrentSequence());
  const clientUuidRef = useRef<string>(
    (typeof window !== 'undefined' 
      ? (localStorage.getItem('vmlc_proctor_uuid') || crypto.randomUUID()) 
      : '') as string
  );
  const lastHeartbeatTimeRef = useRef<string>(
    (typeof window !== 'undefined'
      ? localStorage.getItem(`vmlc_proctor_last_time_${examId}`)
      : null) || new Date().toISOString()
  );
  const getLatestScreenshotRef = useRef<(() => string | null) | null>(null);

  // Store persistent state for session consistency
  useEffect(() => {
    if (clientUuidRef.current && typeof window !== 'undefined') {
      localStorage.setItem('vmlc_proctor_uuid', clientUuidRef.current);
      localStorage.setItem(`vmlc_proctor_seq_${examId}`, sequenceNumberRef.current.toString());
      localStorage.setItem(`vmlc_proctor_last_time_${examId}`, lastHeartbeatTimeRef.current);
    }
  }, [examId]);

  const getMetadata = useCallback(async (): Promise<HeartbeatMeta> => {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";

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
    };

    // Add current question ID from localStorage
    try {
      const currentIndex = localStorage.getItem(`exam_current_question_${examId}`);
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
      await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
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
  }, []);

  const reportViolation = useCallback((type: ViolationType, metadata?: Record<string, unknown>) => {
    setSummary(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));

    const highFrequencyTypes: ViolationType[] = ['NO_FACE', 'MULTI_FACE', 'ATTENTION_LAPSE'];
    const shouldLogDetail = !highFrequencyTypes.includes(type) || 
      !eventsRef.current.some(e => e.type === type && 
        (Date.now() - new Date(e.timestamp).getTime()) < 30000
      );

    if (shouldLogDetail) {
      // Enrich metadata with current question id
      const enrichedMetadata = { ...metadata };
      try {
        const currentIndex = localStorage.getItem(`exam_current_question_${examId}`);
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
        metadata: enrichedMetadata
      });
    }
  }, [examId]);

  const sendHeartbeat = useCallback(async (isFinal = false) => {
    if (!examId) return;

    // Refresh sequence number based on current time
    sequenceNumberRef.current = getCurrentSequence();

    const periodEnd = new Date().toISOString();
    const meta = await getMetadata();
    
    const payload = {
      sequence_number: sequenceNumberRef.current,
      client_uuid: clientUuidRef.current as string,
      timestamp: periodEnd,
      period_start: lastHeartbeatTimeRef.current,
      period_end: periodEnd,
      meta,
      summary: summary,
      events: eventsRef.current
    };

    let faceCaptureFile: File | undefined;
    try {
      if (getLatestScreenshotRef.current) {
        const screenshot = getLatestScreenshotRef.current();
        if (screenshot) {
          faceCaptureFile = dataURLtoFile(screenshot, `heartbeat_${sequenceNumberRef.current}_${Date.now()}.jpg`);
        }
      }
    } catch (screenshotError) {
      console.error("Failed to capture screenshot for heartbeat", screenshotError);
      // Proceed without screenshot
    }

    try {
      await ExamPortal.sendHeartbeat(examId, JSON.stringify(payload), faceCaptureFile);
      
      // Reset buffers and increment sequence on success
      setSummary({
        TAB_SWITCH: 0,
        SCREENSHOT: 0,
        FULLSCREEN_EXIT: 0,
        MULTI_FACE: 0,
        NO_FACE: 0,
        ATTENTION_LAPSE: 0,
      });
      eventsRef.current = [];
      lastHeartbeatTimeRef.current = periodEnd;
      
      // Update persistent state
      localStorage.setItem(`vmlc_proctor_seq_${examId}`, sequenceNumberRef.current.toString());
      localStorage.setItem(`vmlc_proctor_last_time_${examId}`, lastHeartbeatTimeRef.current);
      
      // Clear any cached failed heartbeats if we had them
      localStorage.removeItem(`failed_heartbeat_${examId}`);
    } catch (error) {
      console.error("Failed to send heartbeat telemetry:", error);
      // Persistent storage for retry
      localStorage.setItem(`failed_heartbeat_${examId}`, JSON.stringify({
        payload,
        timestamp: Date.now()
      }));
    }
  }, [examId, summary, getMetadata]);

  useEffect(() => {
    if (!examId) return;
    const interval = setInterval(() => sendHeartbeat(false), HEARTBEAT_INTERVAL);
    return () => clearInterval(interval);
  }, [examId, sendHeartbeat]);

  return {
    reportViolation,
    sendFinalHeartbeat: () => sendHeartbeat(true),
    registerScreenshotProvider: (fn: () => string | null) => {
      getLatestScreenshotRef.current = fn;
    }
  };
};
