export interface SupportConversationType {
    id: number;
    user_name: string;
    email: string;
    phone?: string;
    organization?: string;
    support_type: string;
    status: string;
    last_message: {
        text: string;
        created_at: string;
        sender_profile: string;
    };
    unread_count: number;
    created_at: string;
    updated_at: string;
    messages?: SupportMessageType[];
}

export interface SupportConversationListResponse {
    results: SupportConversationType[];
    pagination: {
        count: number;
        page: number;
        page_size: number;
        total_pages: number;
        has_next: boolean;
        has_previous: boolean;
        next: string | null;
        previous: string | null;
    }
}

export interface SupportMessageType {
    id: string | number;
    text: string;
    created_at: string;
    sender_profile: 'user' | 'staff';
    sender?: {
        id?: string | number;
        name?: string;
        email?: string;
        avatar?: string;
    };
    is_read?: boolean;
}

export interface SendMessagePayload {
    text: string;
    conversation_id: string;
}
