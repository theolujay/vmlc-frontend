
export interface Notification {
  id: number;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
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
