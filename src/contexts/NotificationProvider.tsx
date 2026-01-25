"use client"
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { NotificationService } from '@/services/notification.service';
import { Notification } from '@/types/notificationType';
import { useAuth } from '@/contexts/AuthProvider';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const serviceRef = useRef<NotificationService | null>(null);

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
        // Initialize service
        serviceRef.current = new NotificationService(
            (newNotification) => {
                setNotifications(prev => {
                    // Avoid duplicates if history fetch and WS message overlap
                    if (prev.find(n => n.id === newNotification.id)) {
                        return prev;
                    }
                    return [newNotification, ...prev];
                });
                setUnreadCount(prev => prev + 1);
            },
            (error) => {
                console.error("Notification Service Error:", error);
            },
            () => setIsConnected(true),
            () => setIsConnected(false)
        );
        serviceRef.current.connect(authState.token);
    } else {
        serviceRef.current?.disconnect();
        serviceRef.current = null;
        setNotifications([]);
        setUnreadCount(0);
        setIsConnected(false);
    }

    return () => {
        serviceRef.current?.disconnect();
    };
  }, [authState?.isAuthenticated, authState?.token]);

  const markAsRead = async (id: number) => {
    // Optimistic update
    setNotifications(prev => {
        const notification = prev.find(n => n.id === id);
        if (notification && !notification.read) {
            setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev.map(n => n.id === id ? { ...n, read: true } : n);
    });
    
    try {
        await NotificationService.markAsRead(id);
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        // Revert unread count if needed, but usually we just leave it for better UX
        // or re-fetch history if critical.
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
