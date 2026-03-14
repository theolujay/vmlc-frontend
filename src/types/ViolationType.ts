export type ViolationType =
  | "TAB_SWITCH"
  | "SCREENSHOT"
  | "FULLSCREEN_EXIT"
  | "MULTI_FACE"
  | "NO_FACE"
  | "ATTENTION_LAPSE";

export type ProctoringStatus = "clear" | "suspicious" | "flagged" | null;

export interface ViolationEvent {
  type: ViolationType;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ViolationSummary {
  TAB_SWITCH: number;
  SCREENSHOT: number;
  FULLSCREEN_EXIT: number;
  MULTI_FACE: number;
  NO_FACE: number;
  ATTENTION_LAPSE: number;
  DEVTOOLS_OPEN: number;
}

export interface HeartbeatMeta {
  os: string;
  browser: string;
  screen_resolution: string;
  viewport_width: number;
  viewport_height: number;
  timezone: string;
  connection_type?: string;
  language?: string;
  is_online?: boolean;
  touch_support?: boolean;
  device_memory?: number;
  battery_level?: number;
  is_charging?: boolean;
  network_latency_ms?: number;
  current_question_id?: number | null;
}

export interface HeartbeatPayload {
  sequence_number: number;
  client_uuid: string;
  timestamp: string;
  period_start: string;
  period_end: string;
  meta: HeartbeatMeta;
  summary: ViolationSummary;
  events: ViolationEvent[];
}

export interface ProctoringSummary {
  total_heartbeats: number;
  total_violations: number;
  critical_violations: number;
  integrity_score: number;
  average_suspicion: number;
  auto_status: ProctoringStatus;
  status: ProctoringStatus;
  is_manually_reviewed: boolean;
}

export interface TimelineHeartbeat {
  type: "heartbeat";
  sequence_number: number;
  timestamp: string;
  face_capture_url: string;
  suspicion_score: number;
  meta?: HeartbeatMeta;
  summary: Partial<ViolationSummary>;
  events: ViolationEvent[];
}

export interface TimelineSequenceGap {
  type: "sequence_gap";
  expected_sequence: number;
  message: string;
}

export interface TimelineTimeGap {
  type: "time_gap";
  expected_duration_seconds: number;
  actual_duration_seconds: number;
  message: string;
}

export type TimelineGap = TimelineSequenceGap | TimelineTimeGap;

export type TimelineEntry = TimelineHeartbeat | TimelineGap;

export interface IntegrityAuditResponse {
  candidate: {
    id: string;
    name: string;
  };
  attempt_summary: {
    started_at: string;
    submitted_at: string;
    total_duration: string;
  };
  proctoring_summary: ProctoringSummary;
  timeline: TimelineEntry[];
}
