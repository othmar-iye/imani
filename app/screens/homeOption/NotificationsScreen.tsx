// screens/NotificationsScreen.tsx
import { Theme } from '@/constants/theme';
import { useNotifications } from '@/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Utilisation du hook pour les vraies données
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
    success: isDark ? '#30D158' : '#34C759',
    warning: isDark ? '#FF9F0A' : '#FF9500',
    error: isDark ? '#FF453A' : '#FF3B30',
  };

  // Fonction pour formater la date relative
  const formatTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} jour${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''}`;
  };

  // Fonction pour obtenir l'icône selon le type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
        return { name: 'notifications', color: colors.tint };
      case 'seller':
        return { name: 'person', color: colors.success };
      case 'product':
        return { name: 'cube', color: colors.warning };
      case 'message':
        return { name: 'chatbubble', color: colors.tint };
      case 'promotion':
        return { name: 'pricetag', color: colors.tint };
      default:
        return { name: 'notifications', color: colors.tint };
    }
  };

  // Fonction pour déterminer la navigation selon le type
  const getNavigationPath = (notification: any) => {
    // Si la notification a déjà une action_url, on l'utilise
    if (notification.action_url) {
      return notification.action_url;
    }

    // Sinon, on définit des chemins par défaut selon le type
    switch (notification.type) {
      case 'system':
        return '/(tabs)/home'; // Notifications système → Home
      case 'seller':
        return '/(tabs)/profile'; // Notifications vendeur → Profil
      case 'product':
        return '/(tabs)/profile?tab=myItems'; // Notifications produit → Mes articles
      case 'message':
        return '/(tabs)/chat'; // Notifications message → Chat
      case 'promotion':
        return '/(tabs)/home'; // Notifications promotion → Home
      default:
        return '/(tabs)/home'; // Par défaut → Home
    }
  };

  const renderNotification = ({ item }: { item: any }) => {
    const icon = getNotificationIcon(item.type);
    const isUnread = item.status === 'unread';
    
    return (
      <TouchableOpacity 
        style={[
          styles.notificationCard, 
          { 
            backgroundColor: colors.card,
            borderLeftWidth: 4,
            borderLeftColor: isUnread ? icon.color : 'transparent',
          }
        ]}
        onPress={() => {
          // Marquer comme lu au clic
          if (isUnread) {
            markAsRead(item.id);
          }
          // Navigation vers le chemin approprié
          const navigationPath = getNavigationPath(item);
          router.push(navigationPath);
        }}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <View style={styles.titleContainer}>
              <Ionicons 
                name={icon.name as any} 
                size={16} 
                color={icon.color} 
                style={styles.notificationIcon}
              />
              <Text style={[styles.notificationTitle, { color: colors.text }]}>
                {item.title}
              </Text>
            </View>
            {isUnread && (
              <View style={[styles.unreadDot, { backgroundColor: colors.tint }]} />
            )}
          </View>
          
          <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
            {item.message}
          </Text>
          
          <View style={styles.notificationFooter}>
            <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
              {formatTime(item.created_at)}
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color={colors.textSecondary} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header avec back button */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={colors.tint} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Notifications
          </Text>
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={[styles.clearAll, { color: colors.tint }]}>
              Tout effacer
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Statistiques rapides avec vraies données */}
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {notifications.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
        </View>
        <View style={[styles.statSeparator, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.tint }]}>
            {unreadCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Non lues</Text>
        </View>
      </View>

      {/* Liste des notifications - Prend tout l'espace */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 20 }
        ]}
        style={styles.flatList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Aucune notification
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
              Vous serez notifié des nouvelles activités ici
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '700' 
  },
  clearAll: { 
    fontSize: 16, 
    fontWeight: '500' 
  },
  statsContainer: {
    flexDirection: 'row',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statSeparator: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    // Supprime tout paddingBottom ici
  },
  notificationCard: { 
    marginHorizontal: 20, 
    marginBottom: 12, 
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8,
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    marginRight: 8,
  },
  notificationTitle: { 
    fontSize: 16, 
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
  notificationMessage: { 
    fontSize: 14, 
    marginBottom: 12,
    lineHeight: 20,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: { 
    fontSize: 12, 
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});