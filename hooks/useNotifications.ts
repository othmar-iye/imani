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
  const [hasNewData, setHasNewData] = useState(false); // 🆕 Flag pour nouvelles données
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

      // 🆕 VALIDATION DES DONNÉES
      const validData = data || [];
      
      // S'assurer que chaque notification a un statut valide
      const validatedData = validData.map(notification => ({
        ...notification,
        status: notification.status === 'read' ? 'read' : 'unread' // Force la valeur
      }));

      // Traduire toutes les notifications
      const translatedNotifications = validatedData.map(translateNotification);
      
      setNotifications(translatedNotifications);
      
      // 🆕 CALCUL EXPLICITE ET VALIDÉ
      const calculatedUnreadCount = validatedData.filter(n => n.status === 'unread').length;
      setUnreadCount(calculatedUnreadCount);
      
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

  // 🆕 REALTIME SUBSCRIPTION INTELLIGENTE
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
          event: '*', // Écoute TOUS les événements
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
          
          // 🆕 Marquer qu'il y a de nouvelles données disponibles
          setHasNewData(true);
        }
      )
      .subscribe((status) => {
        console.log('🔔 📡 STATUT SUBSCRIPTION:', status);
      });

    // Nettoyage
    return () => {
      subscription.unsubscribe();
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

  // 🆕 Fonction pour synchroniser et récupérer les nouvelles données
  const syncNewData = async () => {
    if (hasNewData) {
      await loadNotifications();
      setHasNewData(false); // Reset le flag après synchronisation
    }
  };

  // 🆕 Fonction pour ignorer les nouvelles données
  const ignoreNewData = () => {
    setHasNewData(false);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    hasNewData, // 🆕 Nouvelles données disponibles
    loadNotifications,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications,
    syncNewData, // 🆕 Synchroniser les nouvelles données
    ignoreNewData // 🆕 Ignorer les nouvelles données
  };
};