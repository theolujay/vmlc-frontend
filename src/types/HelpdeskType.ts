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
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    last_message_at: string;
    messages?: HelpdeskMessageType[];
    created_at: string;
    updated_at: string;
    unread_by_staff_count?: number;
    candidate_last_msg_preview?: string;
    is_online?: boolean;
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
    helpdesk_summary_data?: {
        total_threads: number;
        open_threads: number;
        in_progress_threads: number;
        resolved_threads: number;
        unassigned_threads: number;
        unread_messages: number;
        public_requests: number;
    };
    results: HelpdeskThreadType[];
}

export interface SendMessagePayload {
    text: string;
    thread_id: string;
    metadata?: Record<string, unknown>;
}

export interface HelpdeskSocketEvent {
    type: 'chat.message' | 'chat.typing';
    message?: HelpdeskMessageType;
    user_id?: string;
    is_typing?: boolean;
}
