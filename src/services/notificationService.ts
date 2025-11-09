// services/notificationService.ts
import { supabase } from '@/supabase';

/**
 * Fonction de base pour créer une notification
 * @param userId - ID de l'utilisateur destinataire
 * @param translationKey - Clé de traduction (ex: 'notifications.messages.welcome')
 * @param type - Type de notification
 * @param translationParams - Paramètres pour les variables de traduction
 * @param actionUrl - URL de redirection au clic
 */
export const createNotification = async (
  userId: string,
  translationKey: string,
  type: 'system' | 'seller' | 'product' | 'message' | 'promotion',
  translationParams?: Record<string, any>,
  actionUrl?: string
) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userId,
        translation_key: translationKey, // 🆕 Nouvelle colonne
        translation_params: translationParams || {}, // 🆕 Nouvelle colonne
        type,
        action_url: actionUrl,
        status: 'unread'
      }
    ])
    .select();

  if (error) {
    console.error('Erreur création notification:', error);
    return null;
  }

  return data[0];
};

export const NotificationService = {
  /**
   * Notification de bienvenue à la création de compte
   */
  async welcome(userId: string) {
    return createNotification(
      userId,
      'notifications.messages.welcome',
      'system',
      undefined,
      '/(tabs)/home'
    );
  },

  /**
   * Notification lorsque le profil est complété
   */
  async profileCompleted(userId: string) {
    return createNotification(
      userId,
      'notifications.messages.profileCompleted',
      'system',
      undefined,
      '/(tabs)/profile'
    );
  },

  /**
   * Notification de soumission de demande vendeur
   */
  async sellerSubmission(userId: string) {
    return createNotification(
      userId,
      'notifications.messages.sellerSubmission',
      'seller',
      undefined,
      '/(tabs)/profile'
    );
  },

  /**
   * Notification d'approbation de statut vendeur
   */
  async sellerApproved(userId: string) {
    return createNotification(
      userId,
      'notifications.messages.sellerApproved',
      'seller',
      undefined,
      '/(tabs)/sell'
    );
  },

  /**
   * Notification de rejet de demande vendeur
   */
  async sellerRejected(userId: string) {
    return createNotification(
      userId,
      'notifications.messages.sellerRejected',
      'seller',
      undefined,
      '/(tabs)/profile'
    );
  },

  /**
   * Notification de soumission d'article
   */
  async productPublished(userId: string, productName: string) {
    return createNotification(
      userId,
      'notifications.messages.productPublished',
      'product',
      { productName },
      '/(tabs)/profile?tab=myItems'
    );
  },

  /**
   * Notification de réussite de réinitialisation du mot de passe
   */
  async passwordResetSuccess(userId: string) {
    return createNotification(
      userId,
      'notifications.messages.passwordReset',
      'system',
      undefined,
      '/(auth)/login'
    );
  },

  /**
   * Notification de soumission d'article (en attente de validation)
   */
  async productSubmitted(userId: string, productName: string) {
    return createNotification(
      userId,
      'notifications.messages.productSubmitted', // 🆕 Nouvelle clé de traduction
      'product',
      { productName },
      '/(tabs)/profile?tab=myItems'
    );
  },

  /**
   * Notification d'approbation d'article
   */
  async productApproved(userId: string, productName: string) {
    return createNotification(
      userId,
      'notifications.messages.productApproved',
      'product',
      { productName },
      '/(tabs)/profile?tab=myItems'
    );
  },

  /**
   * Notification de rejet d'article
   */
  async productRejected(userId: string, productName: string, rejectionReason?: string) {
    return createNotification(
      userId,
      'notifications.messages.productRejected',
      'product',
      { 
        productName,
        rejectionReason: rejectionReason || 'Non spécifié'
      },
      '/(tabs)/profile?tab=myItems'
    );
  },
};