export interface SupportConversationType {
    id: string;
    user: {
        id: string;
        name: string;
        avatar?: string;
    };
    last_message: {
        content: string;
        timestamp: string;
        is_read: boolean;
    };
    unread_count: number;
}

export interface SupportConversationListResponse {
    results: SupportConversationType[];
    count: number;
    next: string | null;
    previous: string | null;
}

export interface SupportMessageType {
    id: string;
    conversation: string;
    sender: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    content: string;
    timestamp: string;
    is_read: boolean;
    is_staff: boolean;
}

export interface SendMessagePayload {
    content: string;
    conversation_id: string;
}
