// hooks/useNotifications.ts
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useRef, useState } from 'react';
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
  const [hasNewData, setHasNewData] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  
  // 🆕 CRITIQUE : Utiliser useRef pour éviter les re-renders
  const userActionInProgress = useRef(false);
  const lastActionTimestamp = useRef<number>(0);
  
  const { user } = useAuth();
  const { t } = useTranslation();

  // 🆕 Fonction pour vérifier la connexion réseau
  const checkNetworkConnection = async (): Promise<boolean> => {
    try {
      const netState = await NetInfo.fetch();
      const isConnected = netState.isConnected === true;
      
      if (!isConnected) {
        setNetworkError('network.checkConnection');
        return false;
      }
      
      setNetworkError(null);
      return true;
    } catch (error) {
      setNetworkError('network.unknownError');
      return false;
    }
  };

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
    // 🆕 Vérifier la connexion réseau avant de charger
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      setIsLoading(false);
      return;
    }

    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      setNetworkError(null);
      return;
    }
    
    setIsLoading(true);
    setNetworkError(null);
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur chargement notifications:', error);
        
        if (error.message?.includes('Network') || 
            error.message?.includes('fetch') ||
            error.message?.includes('connection') ||
            error.code === 'PGRST116' ||
            error.code === 'PGRST301') {
          setNetworkError('network.gatewayError');
        } else {
          setNetworkError('network.unknownError');
        }
        
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const validData = data || [];
      
      const validatedData = validData.map(notification => ({
        ...notification,
        status: notification.status === 'read' ? 'read' : 'unread'
      }));

      const translatedNotifications = validatedData.map(translateNotification);
      
      setNotifications(translatedNotifications);
      
      const calculatedUnreadCount = validatedData.filter(n => n.status === 'unread').length;
      setUnreadCount(calculatedUnreadCount);
      
      setNetworkError(null);
      
    } catch (error: any) {
      console.error('Erreur inattendue:', error);
      
      if (error.message?.includes('Network') || 
          error.message?.includes('fetch') ||
          error.name === 'TypeError') {
        setNetworkError('network.connectionLost');
      } else {
        setNetworkError('network.unknownError');
      }
      
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // 🆕 Fonction pour démarrer une action utilisateur
  const startUserAction = () => {
    userActionInProgress.current = true;
    lastActionTimestamp.current = Date.now();
  };

  // 🆕 Fonction pour terminer une action utilisateur
  const endUserAction = () => {
    // Petit délai pour s'assurer que tous les événements realtime sont passés
    setTimeout(() => {
      userActionInProgress.current = false;
    }, 1000);
  };

  const markAsRead = async (notificationId: string) => {
    const isConnected = await checkNetworkConnection();
    if (!isConnected) return;

    // 🆕 CRITIQUE : Marquer le début de l'action
    startUserAction();

    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } else {
      if (error.message?.includes('Network')) {
        setNetworkError('network.gatewayError');
      }
    }

    // 🆕 CRITIQUE : Marquer la fin de l'action
    endUserAction();
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const isConnected = await checkNetworkConnection();
    if (!isConnected) return;

    // 🆕 CRITIQUE : Marquer le début de l'action
    startUserAction();

    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('user_id', user.id)
      .eq('status', 'unread');

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
      setUnreadCount(0);
    } else {
      if (error.message?.includes('Network')) {
        setNetworkError('network.gatewayError');
      }
    }

    // 🆕 CRITIQUE : Marquer la fin de l'action
    endUserAction();
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user) return false;

    const isConnected = await checkNetworkConnection();
    if (!isConnected) return false;

    // 🆕 CRITIQUE : Marquer le début de l'action
    startUserAction();

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur suppression notification:', error);
        
        if (error.message?.includes('Network')) {
          setNetworkError('network.gatewayError');
        }
        
        return false;
      }

      const notificationToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (notificationToDelete?.status === 'unread') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      return true;
    } catch (error: any) {
      console.error('Erreur inattendue lors de la suppression:', error);
      
      if (error.message?.includes('Network')) {
        setNetworkError('network.connectionLost');
      }
      
      return false;
    } finally {
      // 🆕 CRITIQUE : Marquer la fin de l'action
      endUserAction();
    }
  };

  // 🆕 REALTIME SUBSCRIPTION - FILTRER SEULEMENT LES INSERT
  useEffect(() => {
    if (!user) {
      return;
    }

    checkNetworkConnection().then(isConnected => {
      if (!isConnected) {
        console.log('🔴 Subscription realtime annulée: pas de connexion réseau');
        return;
      }

      console.log('🔔 🚀 Démarrage subscription realtime pour user:', user.id);

      const subscription = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*', // 🆕 CRITIQUE : SEULEMENT les nouvelles insertions
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('🎯 NOUVELLE NOTIFICATION REÇUE:', payload.new);
            
            // 🆕 CRITIQUE : Vérifier si c'est une action utilisateur
            const now = Date.now();
            const timeSinceLastAction = now - lastActionTimestamp.current;
            
            // Si une action utilisateur s'est produite récemment, ignorer
            if (userActionInProgress.current || timeSinceLastAction < 2000) {
              console.log('🔕 Notification ignorée - Action utilisateur récente');
              return;
            }
            
            console.log('🔔 NOUVELLE NOTIFICATION EN TEMPS RÉEL - Banner affiché');
            setHasNewData(true);
          }
        )
        .subscribe((status) => {
          console.log('🔔 📡 STATUT SUBSCRIPTION:', status);
          
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setNetworkError('network.gatewayError');
          }
        });

      return () => {
        subscription.unsubscribe();
      };
    });
  }, [user]);

  // 🆕 Recharger les notifications quand la langue change
  useEffect(() => {
    if (notifications.length > 0) {
      const retranslatedNotifications = notifications.map(translateNotification);
      setNotifications(retranslatedNotifications);
    }
  }, [t]);

  // 🆕 Chargement initial avec gestion réseau
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      if (isMounted) {
        await loadNotifications();
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // 🆕 Fonction pour synchroniser et récupérer les nouvelles données
  const syncNewData = async () => {
    if (hasNewData) {
      await loadNotifications();
      setHasNewData(false);
    }
  };

  // 🆕 Fonction pour ignorer les nouvelles données
  const ignoreNewData = () => {
    setHasNewData(false);
  };

  // 🆕 Fonction pour retenter la connexion
  const retryConnection = async () => {
    setNetworkError(null);
    await loadNotifications();
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    hasNewData,
    networkError,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications,
    syncNewData,
    ignoreNewData,
    retryConnection
  };
};