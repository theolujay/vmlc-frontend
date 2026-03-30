import { HelpdeskStatData } from "./UserMgtType";

export interface LiveExamStatus {
  exam: {
    id: string;
    title: string;
    status: "ongoing" | "scheduled" | "concluded" | "cancelled" | "draft";
    duration_minutes: number;
    starts_at: string;
    ends_at: string | null;
  };
  attempt: {
    status:
      | "pending"
      | "issued"
      | "started"
      | "submitted"
      | "expired"
      | "failed";
    started_at: string | null;
    deadline: string | null;
    submitted_at: string | null;
    time_remaining_seconds: number;
    time_used_seconds: number;
  };
  progress: {
    questions_attempted: number;
    questions_total: number;
    percent_complete: number;
  };
  proctoring: {
    status: "clear" | "suspicious" | "flagged" | null;
    suspicion_score: number;
    last_heartbeat_at: string | null;
    heartbeat_sequence: number;
    violations: {
      total: number;
      critical: number;
      by_type: Record<string, number>;
    };
    recent_events: Array<{
      type: string;
      timestamp: string;
      is_critical: boolean;
      metadata: Record<string, unknown>;
    }>;
  };
}

export interface HelpdeskMessageType {
  id: number | string;
  sender: string | null;
  sender_name: string;
  sender_type: "candidate" | "staff" | "system";
  text: string;
  metadata: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface HelpdeskThreadType {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  assigned_staff: number | null;
  assigned_staff_name?: string;
  participating_staff_names?: string[];
  status: "open" | "in_progress" | "closed" | "snoozed" | "resolved";
  snoozed_until?: string;
  priority: "low" | "medium" | "high" | "urgent";
  last_message_at: string;
  messages?: HelpdeskMessageType[];
  created_at: string;
  updated_at: string;
  unread_by_staff_count?: number;
  candidate_last_msg_preview?: string;
  is_candidate_online?: boolean;
  is_candidate_typing?: boolean;
  candidate_live_exam_status?: LiveExamStatus | null;
}

export interface PaginationData {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  next: string | null;
  previous: string | null;
}

export interface HelpdeskThreadListResponse {
  pagination: PaginationData;
  helpdesk_summary_data?: HelpdeskStatData;
  results: HelpdeskThreadType[];
}

export interface SendMessagePayload {
  text: string;
  thread_id: string;
  metadata?: Record<string, unknown>;
}

export type HelpdeskSocketEvent =
  | {
      type: "helpdesk.thread";
      data: {
        thread_id: string;
        update_type: "message" | "metadata";
        message?: HelpdeskMessageType;
        thread?: Partial<HelpdeskThreadType>;
      };
    }
  | {
      type: "helpdesk.thread.typing";
      data: {
        thread_id: string;
        user_id: string;
        is_typing: boolean;
      };
    }
  | {
      type: "helpdesk.thread.exam_telemetry";
      data: LiveExamStatus & { thread_id: string };
    }
  | {
      type: "helpdesk.update";
      data: { stats: HelpdeskStatData; refresh_threads: boolean };
    }
  | {
      type: "helpdesk.list";
      data: {
        results: HelpdeskThreadType[];
        helpdesk_summary_data?: HelpdeskStatData;
        filters?: Record<string, string>;
        request_id?: number;
      };
    }
  | {
      type: "notification_activity";
      id: number;
      subject: string;
      message: string;
      notification_type: "info" | "success" | "alert" | "error" | "warning";
      link: string;
      is_read: boolean;
      created_at: string;
    }
  | { type: "error"; message: string };
