// services/notificationService.ts
import { supabase } from '@/supabase';

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'system' | 'seller' | 'product' | 'message' | 'promotion',
  actionUrl?: string
) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userId,
        title,
        message,
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

// Fonctions spécifiques
export const NotificationService = {
  async welcome(userId: string) {
    return createNotification(
      userId,
      '🎉 Bienvenue sur Imani !',
      'Votre compte a été créé avec succès. Commencez à explorer notre marketplace.',
      'system',
      '/(tabs)/home'
    );
  },

  // AJOUT : Notification pour profil complété
  async profileCompleted(userId: string) {
    return createNotification(
      userId,
      '✅ Profil complété avec succès !',
      'Vos informations ont été sauvegardées. Votre profil est maintenant actif et visible.',
      'system',
      '/(tabs)/profile'
    );
  },

  async sellerSubmission(userId: string) {
    return createNotification(
      userId,
      '📋 Demande de vendeur soumise',
      'Votre demande pour devenir vendeur a été reçue. Notre équipe la traitera sous 24-48h.',
      'seller',
      '/(tabs)/profile'
    );
  },

  async sellerApproved(userId: string) {
    return createNotification(
      userId,
      '✅ Félicitations ! Vous êtes maintenant vendeur',
      'Votre demande a été approuvée. Vous pouvez maintenant publier des annonces.',
      'seller',
      '/(tabs)/sell'
    );
  },

  async sellerRejected(userId: string) {
    return createNotification(
      userId,
      '❌ Demande de vendeur rejetée',
      'Votre demande nécessite des modifications. Consultez vos emails pour plus de détails.',
      'seller',
      '/(tabs)/profile'
    );
  },

  async productPublished(userId: string, productName: string) {
    return createNotification(
      userId,
      '📦 Votre article a été publié !',
      `"${productName}" est maintenant visible par tous les acheteurs.`,
      'product',
      '/(tabs)/profile?tab=myItems'
    );
  }
};