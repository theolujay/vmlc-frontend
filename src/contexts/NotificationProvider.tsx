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
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(true);
  const serviceRef = useRef<NotificationService | null>(null);

  useEffect(() => {
    if (authState?.isAuthenticated && authState.token) {
        // Initialize service
        serviceRef.current = new NotificationService(
            (newNotification) => {
                setNotifications(prev => [newNotification, ...prev]);
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
        setIsConnected(false);
    }

    return () => {
        serviceRef.current?.disconnect();
    };
  }, [authState?.isAuthenticated, authState?.token]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    serviceRef.current?.markAsRead(id);
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    unreadIds.forEach(id => serviceRef.current?.markAsRead(id));
  };
  
  const clearAll = () => {
      setNotifications([]);
  }

  const toggleInAppNotifications = () => {
      setInAppNotificationsEnabled(prev => !prev);
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        clearAll, 
        isConnected,
        inAppNotificationsEnabled,
        toggleInAppNotifications
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
