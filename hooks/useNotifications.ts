// hooks/useNotifications.ts
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
import { useEffect, useState } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'seller' | 'product' | 'message' | 'promotion';
  status: 'read' | 'unread';
  action_url?: string;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const loadNotifications = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement notifications:', error);
      return;
    }

    setNotifications(data || []);
    setUnreadCount(data?.filter(n => n.status === 'unread').length || 0);
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('user_id', user.id)
      .eq('status', 'unread');

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  return {
    notifications,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications
  };
};