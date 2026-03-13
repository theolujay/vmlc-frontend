import { HelpdeskStatData } from "./UserMgtType";

export interface HelpdeskMessageType {
    id: number | string;
    sender: string | null;
    sender_name: string;
    sender_type: 'candidate' | 'staff' | 'system';
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
    status: 'open' | 'in_progress' | 'closed' | 'snoozed' | 'resolved';
    snoozed_until?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    last_message_at: string;
    messages?: HelpdeskMessageType[];
    created_at: string;
    updated_at: string;
    unread_by_staff_count?: number;
    candidate_last_msg_preview?: string;
    is_candidate_online?: boolean;
    is_candidate_typing?: boolean;
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
        type: 'helpdesk.thread';
        data: {
            thread_id: string;
            update_type: 'message' | 'metadata';
            message?: HelpdeskMessageType;
            thread?: Partial<HelpdeskThreadType>;
        }
      }
    | {
        type: 'helpdesk.thread.typing';
        data: {
            thread_id: string;
            user_id: string;
            is_typing: boolean;
        }
      }
    | { type: 'helpdesk.update'; data: { stats: HelpdeskStatData; refresh_threads: boolean } }
    | { type: 'helpdesk.list'; data: { results: HelpdeskThreadType[]; helpdesk_summary_data?: HelpdeskStatData } }
    | { type: 'notification_activity'; id: number; subject: string; message: string; notification_type: 'info' | 'success' | 'alert' | 'error' | 'warning'; link: string; is_read: boolean; created_at: string }
    | { type: 'error'; message: string };
