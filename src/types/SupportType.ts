export interface SupportMessageType {
    id: number | string;
    sender: string | null;
    sender_name: string;
    sender_type: 'candidate' | 'staff' | 'system';
    text: string;
    metadata: Record<string, unknown> | null;
    is_read: boolean;
    created_at: string;
}

export interface SupportThreadType {
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
    messages?: SupportMessageType[];
    created_at: string;
    updated_at: string;
    unread_by_staff_count?: number;
    candidate_last_msg_preview?: string;
    is_online?: boolean;
}

export interface SupportThreadListResponse {
    count: number;
    total_pages: number;
    previous: string | null;
    next: string | null;
    has_previous: boolean;
    has_next: boolean;
    page_size: number;
    page: number;
    results: SupportThreadType[];
}

export interface SendMessagePayload {
    text: string;
    thread_id: string;
    metadata?: Record<string, unknown>;
}

export interface SupportSocketEvent {
    type: 'chat.message' | 'chat.typing';
    message?: SupportMessageType;
    user_id?: string;
    is_typing?: boolean;
}
