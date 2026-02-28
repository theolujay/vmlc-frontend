import { NotificationHistoryResponse } from '../types/notificationType';
import client from '@/utils/axios';
import { notificationUrls } from '@/constants/notificationUrls';

export class NotificationService {
  /**
   * Fetch notification history with optional status and pagination.
   */
  static async getNotificationHistory(params?: { status?: string, page?: number }): Promise<NotificationHistoryResponse> {
    try {
      const response = await client.get(notificationUrls.history, { params });
      return response.data;
    } catch (error) {
      console.error('Error getting notification history:', error);
      throw error;
    }
  }

  /**
   * Mark a specific notification as read via REST API.
   */
  static async markAsRead(id: number) {
    try {
      const response = await client.patch(notificationUrls.markAsRead(id));
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read via REST API.
   */
  static async markAllAsRead() {
    try {
      const response = await client.patch(notificationUrls.markAllAsRead);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}
