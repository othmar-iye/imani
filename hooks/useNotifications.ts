// hooks/useNotifications.ts
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
import NetInfo from '@react-native-community/netinfo';
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
  const [hasNewData, setHasNewData] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null); // 🆕 Erreur réseau spécifique
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
    setNetworkError(null); // 🆕 Reset l'erreur réseau
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // 🆕 Gestion spécifique des erreurs réseau Supabase
      if (error) {
        console.error('Erreur chargement notifications:', error);
        
        // Détection des erreurs réseau
        if (error.message?.includes('Network') || 
            error.message?.includes('fetch') ||
            error.message?.includes('connection') ||
            error.code === 'PGRST116' || // Timeout Supabase
            error.code === 'PGRST301') { // Gateway error
          setNetworkError('network.gatewayError');
        } else {
          setNetworkError('network.unknownError');
        }
        
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      // 🆕 VALIDATION DES DONNÉES
      const validData = data || [];
      
      // S'assurer que chaque notification a un statut valide
      const validatedData = validData.map(notification => ({
        ...notification,
        status: notification.status === 'read' ? 'read' : 'unread'
      }));

      // Traduire toutes les notifications
      const translatedNotifications = validatedData.map(translateNotification);
      
      setNotifications(translatedNotifications);
      
      // 🆕 CALCUL EXPLICITE ET VALIDÉ
      const calculatedUnreadCount = validatedData.filter(n => n.status === 'unread').length;
      setUnreadCount(calculatedUnreadCount);
      
      // 🆕 Reset l'erreur en cas de succès
      setNetworkError(null);
      
    } catch (error: any) {
      console.error('Erreur inattendue:', error);
      
      // 🆕 Gestion des erreurs réseau dans le catch
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

  const markAsRead = async (notificationId: string) => {
    // 🆕 Vérifier la connexion avant l'action
    const isConnected = await checkNetworkConnection();
    if (!isConnected) return;

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
      // 🆕 Gestion erreur réseau pour markAsRead
      if (error.message?.includes('Network')) {
        setNetworkError('network.gatewayError');
      }
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    // 🆕 Vérifier la connexion avant l'action
    const isConnected = await checkNetworkConnection();
    if (!isConnected) return;

    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('user_id', user.id)
      .eq('status', 'unread');

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
      setUnreadCount(0);
    } else {
      // 🆕 Gestion erreur réseau pour markAllAsRead
      if (error.message?.includes('Network')) {
        setNetworkError('network.gatewayError');
      }
    }
  };

  // 🆕 FONCTION POUR SUPPRIMER UNE NOTIFICATION
  const deleteNotification = async (notificationId: string) => {
    if (!user) return false;

    // 🆕 Vérifier la connexion avant l'action
    const isConnected = await checkNetworkConnection();
    if (!isConnected) return false;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur suppression notification:', error);
        
        // 🆕 Gestion erreur réseau pour delete
        if (error.message?.includes('Network')) {
          setNetworkError('network.gatewayError');
        }
        
        return false;
      }

      // Mettre à jour l'état local
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (notificationToDelete?.status === 'unread') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      return true;
    } catch (error: any) {
      console.error('Erreur inattendue lors de la suppression:', error);
      
      // 🆕 Gestion erreur réseau
      if (error.message?.includes('Network')) {
        setNetworkError('network.connectionLost');
      }
      
      return false;
    }
  };

  // 🆕 REALTIME SUBSCRIPTION INTELLIGENTE avec gestion réseau
  useEffect(() => {
    if (!user) {
      return;
    }

    // 🆕 Vérifier la connexion avant de démarrer la subscription
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
            event: '*',
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
            
            setHasNewData(true);
          }
        )
        .subscribe((status) => {
          console.log('🔔 📡 STATUT SUBSCRIPTION:', status);
          
          // 🆕 Gestion des erreurs de subscription réseau
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setNetworkError('network.gatewayError');
          }
        });

      // Nettoyage
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
    networkError, // 🆕 Ajout de l'erreur réseau dans le retour
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications,
    syncNewData,
    ignoreNewData,
    retryConnection // 🆕 Fonction pour retenter
  };
};