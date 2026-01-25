import { Notification, ServerMessage, ClientMessage, NotificationHistoryResponse } from '../types/notificationType';
import { socketUrl } from '../constants/socketUrl';
import client from '@/utils/axios';
import { notificationUrls } from '@/constants/notificationUrls';

export class NotificationService {
  private ws: WebSocket | null = null;
  private onNotificationReceived: (notification: Notification) => void;
  private onError: (error: string) => void;
  private onConnect: () => void;
  private onDisconnect: () => void;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  static async getNotificationHistory(params?: { status?: string, page?: number }): Promise<NotificationHistoryResponse> {
    const response = await client.get(notificationUrls.history, { params });
    return response.data;
  }

  static async markAsRead(id: number) {
    const response = await client.patch(notificationUrls.markAsRead(id));
    return response.data;
  }

  static async markAllAsRead() {
    const response = await client.patch(notificationUrls.markAllAsRead);
    return response.data;
  }

  constructor(
    onNotificationReceived: (notification: Notification) => void,
    onError: (error: string) => void,
    onConnect: () => void,
    onDisconnect: () => void
  ) {
    this.onNotificationReceived = onNotificationReceived;
    this.onError = onError;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
  }

  connect(accessToken: string) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
        return;
    }

    const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
    const url = `${socketUrl}?api_key=${apiKey}&token=${accessToken}`;
    
    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('Notification WebSocket connected');
        this.onConnect();
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
            const data: ServerMessage = JSON.parse(event.data);
            if (data.type === 'notification_activity') {
                this.onNotificationReceived(data.message as Notification);
            } else if (data.type === 'error') {
                this.onError(data.message as string);
            }
        } catch (e) {
            console.error('Failed to parse websocket message', e);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.onError('Connection error');
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
        this.onDisconnect();
        
        // Reconnect logic if not clean close
        if (!event.wasClean) {
             this.reconnectTimeout = setTimeout(() => {
                 this.connect(accessToken);
             }, 5000);
        }
      };
    } catch (err) {
      this.onError('Failed to initiate connection');
    }
  }

  markAsRead(notificationId: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const payload: ClientMessage = {
        action: 'mark_as_read',
        data: {
          notification_id: notificationId
        }
      };
      this.ws.send(JSON.stringify(payload));
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}