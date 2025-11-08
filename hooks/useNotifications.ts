// hooks/useNotifications.ts
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface Notification {
  id: string;
  user_id: string;
  translation_key: string;
  translation_params: Record<string, any>;
  type: 'system' | 'seller' | 'product' | 'message' | 'promotion';
  status: 'read' | 'unread';
  action_url?: string;
  created_at: string;
  title: string;
  message: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useTranslation();

  // 🆕 Fonction pour traduire une notification
  const translateNotification = (notification: any): Notification => {
    const baseKey = notification.translation_key;
    
    return {
      ...notification,
      title: t(`${baseKey}.title`, notification.translation_params || {}),
      message: t(`${baseKey}.message`, notification.translation_params || {})
    };
  };

  const loadNotifications = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur chargement notifications:', error);
        return;
      }

      // Traduire toutes les notifications
      const translatedNotifications = (data || []).map(translateNotification);
      
      setNotifications(translatedNotifications);
      setUnreadCount(data?.filter(n => n.status === 'unread').length || 0);
    } catch (error) {
      console.error('Erreur inattendue:', error);
    } finally {
      setIsLoading(false);
    }
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

  // 🆕 REALTIME SUBSCRIPTION AVEC LOGS DÉTAILLÉS
  useEffect(() => {
    if (!user) {
      return;
    }

    console.log('🔔 🚀 Démarrage subscription realtime pour user:', user.id);

    // S'abonner aux changements de la table notifications
    const subscription = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*', // 👈 Écoute TOUS les événements pour debug
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🎯 REALTIME EVENT REÇU:', {
            event: payload.eventType,
            table: payload.table,
            new: payload.new,
            old: payload.old
          });
          
          // Recharger les notifications pour tous les événements
          loadNotifications();
        }
      )
      .subscribe((status) => {
        // console.log('🔔 📡 STATUT SUBSCRIPTION:', status);
        
        // if (status === 'SUBSCRIBED') {
        //   console.log('✅ ✅ ABONNEMENT REALTIME RÉUSSI!');
        // }
        // if (status === 'CHANNEL_ERROR') {
        //   console.log('❌ ❌ ERREUR ABONNEMENT REALTIME');
        // }
        // if (status === 'TIMED_OUT') {
        //   console.log('⏰ ⏰ TIMEOUT ABONNEMENT REALTIME');
        // }
      });

    // 🆕 FALLBACK: Polling toutes les 15 secondes au cas où realtime échoue
    const pollingInterval = setInterval(() => {
      loadNotifications();
    }, 15000);

    // Nettoyage
    return () => {
      subscription.unsubscribe();
      clearInterval(pollingInterval);
    };
  }, [user]);

  // 🆕 Recharger les notifications quand la langue change
  useEffect(() => {
    if (notifications.length > 0) {
      const retranslatedNotifications = notifications.map(translateNotification);
      setNotifications(retranslatedNotifications);
    }
  }, [t]);

  // Chargement initial
  useEffect(() => {
    loadNotifications();
  }, [user]);

  return {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications
  };
};