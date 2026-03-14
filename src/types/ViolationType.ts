export type ViolationType = 
  | 'TAB_SWITCH' 
  | 'SCREENSHOT' 
  | 'FULLSCREEN_EXIT' 
  | 'MULTI_FACE' 
  | 'NO_FACE' 
  | 'ATTENTION_LAPSE';

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
}

export interface HeartbeatMeta {
  os: string;
  browser: string;
  screen_resolution: string;
  battery_level?: number;
  is_charging?: boolean;
  network_latency_ms?: number;
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
