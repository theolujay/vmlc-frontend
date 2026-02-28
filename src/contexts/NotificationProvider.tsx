"use client"
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { NotificationService } from '@/services/notification.service';
import { Notification } from '@/types/notificationType';
import { useAuth } from '@/contexts/AuthProvider';
import { useSocket } from '@/contexts/SocketProvider';

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

  const handleNotificationActivity = useCallback((event: any) => {
      // Use any here because of the potential 'type' collision in the spec
      if (event.type === 'notification_activity' || (event.id && event.subject && (event.message || event.notification_type))) {
          setNotifications(prev => {
              const id = event.id;
              if (prev.find(n => n.id === id)) {
                  return prev;
              }

              // Extract message string defensively. 
              // If event.message is an object, try to get event.message.message
              let messageContent = '';
              if (typeof event.message === 'string') {
                  messageContent = event.message;
              } else if (event.message && typeof event.message.message === 'string') {
                  messageContent = event.message.message;
              } else if (event.content && typeof event.content === 'string') {
                  messageContent = event.content;
              }

              const newNotification: Notification = {
                  id: id,
                  subject: event.subject || event.title || 'Notification',
                  message: messageContent,
                  type: (event.notification_type || (['info', 'success', 'alert', 'error', 'warning'].includes(event.type) ? event.type : 'info')) as any,
                  link: event.link || '',
                  is_read: event.is_read || false,
                  created_at: event.created_at || new Date().toISOString()
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
