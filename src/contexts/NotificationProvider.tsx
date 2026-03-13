"use client"
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { NotificationService } from '@/services/notification.service';
import { Notification } from '@/types/notificationType';
import { useAuth } from '@/contexts/AuthProvider';
import { useSocket, SocketMessage } from '@/contexts/SocketProvider';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  isConnected: boolean;
  inAppNotificationsEnabled: boolean;
  toggleInAppNotifications: () => void;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth();
  const { isConnected, addListener, removeListener, sendAction } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const history = await NotificationService.getNotificationHistory();
        setNotifications(history.results);
        setUnreadCount(history.stats.unread_count);
      } catch (error) {
        console.error("Failed to fetch notification history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authState?.isAuthenticated && authState.token) {
        fetchHistory();
    } else {
        setNotifications([]);
        setUnreadCount(0);
    }
  }, [authState?.isAuthenticated, authState?.token]);

  const handleNotificationActivity = useCallback((event: SocketMessage) => {
      const id = event.id as number | undefined;
      const subject = event.subject as string | undefined;
      const message = event.message as string | { message: string } | undefined;
      const content = event.content as string | undefined;
      const notificationType = event.notification_type as Notification['type'] | undefined;
      const title = event.title as string | undefined;
      const link = event.link as string | undefined;
      const isRead = event.is_read as boolean | undefined;
      const createdAt = event.created_at as string | undefined;

      if (event.type === 'notification_activity' || (id && subject && (message || notificationType))) {
          setNotifications(prev => {
              if (!id) return prev;
              if (prev.find(n => n.id === id)) {
                  return prev;
              }

              // Extract message string defensively. 
              // If event.message is an object, try to get event.message.message
              let messageContent = '';
              if (typeof message === 'string') {
                  messageContent = message;
              } else if (message && typeof message === 'object' && 'message' in message && typeof (message as { message: string }).message === 'string') {
                  messageContent = (message as { message: string }).message;
              } else if (content && typeof content === 'string') {
                  messageContent = content;
              }

              const type = (notificationType || (['info', 'success', 'alert', 'error', 'warning'].includes(event.type) ? event.type : 'info')) as Notification['type'];

              const newNotification: Notification = {
                  id: id,
                  subject: subject || title || 'Notification',
                  message: messageContent,
                  type,
                  link: link || '',
                  is_read: isRead || false,
                  created_at: createdAt || new Date().toISOString()
              };
              return [newNotification, ...prev];
          });
          setUnreadCount(prev => prev + 1);
      }
  }, []);

  useEffect(() => {
      addListener('notification_activity', handleNotificationActivity);
      addListener('info', handleNotificationActivity);
      addListener('success', handleNotificationActivity);
      addListener('alert', handleNotificationActivity);
      addListener('error', handleNotificationActivity);
      addListener('warning', handleNotificationActivity);

      return () => {
          removeListener('notification_activity', handleNotificationActivity);
          removeListener('info', handleNotificationActivity);
          removeListener('success', handleNotificationActivity);
          removeListener('alert', handleNotificationActivity);
          removeListener('error', handleNotificationActivity);
          removeListener('warning', handleNotificationActivity);
      };
  }, [addListener, removeListener, handleNotificationActivity]);

  const markAsRead = async (id: number) => {
    // Optimistic update
    setNotifications(prev => {
        const notification = prev.find(n => n.id === id);
        if (notification && !notification.is_read) {
            setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev.map(n => n.id === id ? { ...n, is_read: true } : n);
    });

    try {
        // Use WebSocket action if connected, otherwise fallback to REST
        if (isConnected) {
            sendAction('mark_notification_as_read', { notification_id: id });
        } else {
            await NotificationService.markAsRead(id);
        }
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
        await NotificationService.markAllAsRead();
    } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
    }
  };

  const clearAll = () => {
      setNotifications([]);
      setUnreadCount(0);
  }

  const toggleInAppNotifications = () => {
      setInAppNotificationsEnabled(prev => !prev);
  }

  return (
    <NotificationContext.Provider value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        isConnected,
        inAppNotificationsEnabled,
        toggleInAppNotifications,
        isLoading
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
