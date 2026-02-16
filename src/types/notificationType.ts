
export interface Notification {
  id: number;
  subject: string;
  message: string;
  is_read_by_recipient: boolean;
  created_at: string;
  type?: 'info' | 'success' | 'alert' | 'error' | 'warning';
}

export interface NotificationHistoryResponse {
  stats: {
    total_count: number;
    unread_count: number;
    read_count: number;
  };
  results: Notification[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
    next: string | null;
    previous: string | null;
  };
}

export type WSMessageType = 'notification_activity' | 'error' | 'mark_as_read';

export interface ServerMessage {
  type: 'notification_activity' | 'error';
  message: Notification | string;
}

export interface ClientMessage {
  action: 'mark_as_read';
  data: {
    notification_id: number;
  };
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isModalOpen: boolean;
  settingsOpen: boolean;
  inAppNotificationsEnabled: boolean;
}
