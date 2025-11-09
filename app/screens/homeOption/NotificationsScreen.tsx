// screens/NotificationsScreen.tsx
import { Theme } from '@/constants/theme';
import { useNotifications } from '@/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    FlatList,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

// Composant pour l'action de swipe (bouton de suppression)
// Composant pour l'action de swipe (bouton de suppression)
const RightActions = ({
    onDelete,
    colors
}: {
    onDelete: () => void;
    colors: any;
}) => {
    const { t } = useTranslation();
    const handlePress = () => {
        onDelete();
    };

    return (
        <View style={[styles.deleteAction, { backgroundColor: colors.error }]}>
            <TouchableOpacity onPress={handlePress} style={styles.deleteTouchable}>
                <View style={styles.deleteContent}>
                    <Ionicons name="trash-outline" size={24} color="#FFF" />
                    <Text style={styles.deleteText}>{t('delete')}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

// Composant Skeleton intégré
const NotificationsSkeleton = ({ colors }: { colors: any }) => {
  const isDark = useColorScheme() === 'dark';
  
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { 
        duration: 1000, 
        easing: Easing.ease 
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const AnimatedSkeletonBox = ({ 
    width, 
    height, 
    borderRadius = 6,
    style,
    variant = 'default'
  }: { 
    width: number | string; 
    height: number; 
    borderRadius?: number;
    style?: any;
    variant?: 'default' | 'strong';
  }) => {
    const skeletonColors = {
      dark: {
        default: '#2A2A2A',
        strong: '#333333'
      },
      light: {
        default: '#D1D9E0',
        strong: '#B8C4CE'
      }
    };

    return (
      <Animated.View 
        style={[
          styles.skeletonBox, 
          { 
            width, 
            height, 
            borderRadius,
            backgroundColor: isDark 
              ? skeletonColors.dark[variant]
              : skeletonColors.light[variant],
          },
          animatedStyle,
          style
        ]}
      />
    );
  };

  const renderNotificationSkeleton = () => (
    <View style={[styles.notificationCard, { backgroundColor: colors.card }]}>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.titleContainer}>
            <AnimatedSkeletonBox 
              width={16} 
              height={16} 
              borderRadius={8}
              variant="strong"
            />
            <AnimatedSkeletonBox 
              width="70%" 
              height={16} 
              borderRadius={4}
              style={{ marginLeft: 8 }}
              variant="strong"
            />
          </View>
          <AnimatedSkeletonBox 
            width={8} 
            height={8} 
            borderRadius={4}
            variant="strong"
          />
        </View>
        
        <AnimatedSkeletonBox 
          width="100%" 
          height={14} 
          borderRadius={4}
          style={{ marginBottom: 8 }}
          variant="default"
        />
        <AnimatedSkeletonBox 
          width="85%" 
          height={14} 
          borderRadius={4}
          style={{ marginBottom: 12 }}
          variant="default"
        />
        
        <View style={styles.notificationFooter}>
          <AnimatedSkeletonBox 
            width={80} 
            height={12} 
            borderRadius={4}
            variant="default"
          />
          <AnimatedSkeletonBox 
            width={16} 
            height={16} 
            borderRadius={8}
            variant="default"
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Skeleton */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="chevron-back" size={24} color={colors.tint} />
          <AnimatedSkeletonBox 
            width={150} 
            height={24} 
            borderRadius={6}
            style={{ marginLeft: 12 }}
            variant="strong"
          />
        </View>
        <AnimatedSkeletonBox 
          width={80} 
          height={16} 
          borderRadius={4}
          variant="default"
        />
      </View>

      {/* Statistiques Skeleton */}
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <AnimatedSkeletonBox 
            width={40} 
            height={24} 
            borderRadius={6}
            variant="strong"
          />
          <AnimatedSkeletonBox 
            width={40} 
            height={12} 
            borderRadius={4}
            style={{ marginTop: 4 }}
            variant="default"
          />
        </View>
        <View style={[styles.statSeparator, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <AnimatedSkeletonBox 
            width={40} 
            height={24} 
            borderRadius={6}
            variant="strong"
          />
          <AnimatedSkeletonBox 
            width={50} 
            height={12} 
            borderRadius={4}
            style={{ marginTop: 4 }}
            variant="default"
          />
        </View>
      </View>

      {/* Liste des notifications Skeleton */}
      <View style={styles.notificationsList}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item}>
            {renderNotificationSkeleton()}
          </View>
        ))}
      </View>
    </View>
  );
};

// Composant pour l'indicateur de synchronisation
const SyncBanner = ({ 
  onSync, 
  onIgnore, 
  colors,
  t 
}: { 
  onSync: () => void; 
  onIgnore: () => void; 
  colors: any;
  t: any;
}) => (
  <View style={[styles.syncBanner, { backgroundColor: colors.warning }]}>
    <Ionicons name="sync" size={16} color="#FFF" />
    <Text style={styles.syncBannerText}>
      {t('notifications.syncBanner.title')}
    </Text>
    <View style={styles.syncButtons}>
      <TouchableOpacity onPress={onSync} style={styles.syncButton}>
        <Text style={styles.syncButtonText}>
          {t('notifications.syncBanner.syncButton')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onIgnore} style={styles.ignoreButton}>
        <Text style={styles.ignoreButtonText}>
          {t('notifications.syncBanner.ignoreButton')}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // États pour le contrôle intelligent
  const [refreshing, setRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const swipeableRefs = new Map(); // Pour gérer les références des swipeables

  // Utilisation du hook modifié
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    deleteNotification, // ✅ Maintenant disponible
    isLoading,
    hasNewData,
    refresh,
    syncNewData,
    ignoreNewData
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

  // FONCTION DE SUPPRESSION
  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      t('notifications.deleteTitle') || 'Supprimer la notification',
      t('notifications.deleteMessage') || 'Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible.',
      [
        {
          text: t('cancel'),
          style: 'cancel',
          onPress: () => {
            // Fermer le swipeable quand on annule
            const swipeable = swipeableRefs.get(notificationId);
            if (swipeable) {
              swipeable.close();
            }
          }
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            deleteNotification(notificationId);
            // Retirer la référence
            swipeableRefs.delete(notificationId);
          }
        }
      ]
    );
  };

  // Fermer tous les swipeables ouverts
  const closeAllSwipeables = () => {
    swipeableRefs.forEach((swipeable) => {
      if (swipeable) {
        swipeable.close();
      }
    });
  };

  // SYNCHRONISATION INTELLIGENTE des nouvelles données
  const handleSyncNewData = async () => {
    setIsSyncing(true);
    try {
      await syncNewData();
    } catch (err) {
      setError(t('notifications.syncStates.error') || 'Erreur de synchronisation');
    } finally {
      setIsSyncing(false);
    }
  };

  // Ignorer les nouvelles données
  const handleIgnoreNewData = () => {
    ignoreNewData();
  };

  // Pull-to-Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await refresh();
    } catch (err) {
      setError(t('notifications.syncStates.error') || 'Erreur de rafraîchissement');
    } finally {
      setRefreshing(false);
    }
  }, [refresh, t]);

  // Fonction pour formater la date relative avec traductions
  const formatTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('notifications.time.justNow') || 'À l\'instant';
    if (diffInMinutes < 60) return t('notifications.time.minutesAgo', { count: diffInMinutes }) || `${diffInMinutes} min`;
    if (diffInMinutes < 1440) return t('notifications.time.hoursAgo', { count: Math.floor(diffInMinutes / 60) }) || `${Math.floor(diffInMinutes / 60)} h`;
    return t('notifications.time.daysAgo', { count: Math.floor(diffInMinutes / 1440) }) || `${Math.floor(diffInMinutes / 1440)} j`;
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
    if (notification.action_url) {
      return notification.action_url;
    }

    switch (notification.type) {
      case 'system':
        return '/(tabs)/home';
      case 'seller':
        return '/(tabs)/profile';
      case 'product':
        return '/(tabs)/profile?tab=myItems';
      case 'message':
        return '/(tabs)/chat';
      case 'promotion':
        return '/(tabs)/home';
      default:
        return '/(tabs)/home';
    }
  };

  const renderNotification = ({ item }: { item: any }) => {
    const icon = getNotificationIcon(item.type);
    const isUnread = item.status === 'unread';
    
    return (
      <Swipeable
            ref={(ref) => {
                if (ref) {
                    swipeableRefs.set(item.id, ref);
                } else {
                    swipeableRefs.delete(item.id);
                }
            }}
            renderRightActions={() => (
                <RightActions
                    onDelete={() => handleDeleteNotification(item.id)}
                    colors={colors}
                />
            )}
            rightThreshold={40}
            onSwipeableWillOpen={() => {
                // Fermer les autres swipeables quand on en ouvre un
                swipeableRefs.forEach((swipeable, id) => {
                    if (id !== item.id && swipeable) {
                        swipeable.close();
                    }
                });
            }}
            containerStyle={styles.swipeableContainer}
        >
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
            if (isUnread) {
              markAsRead(item.id);
            }
            const navigationPath = getNavigationPath(item);
            router.push(navigationPath);
          }}
          activeOpacity={0.7}
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
      </Swipeable>
    );
  };

  // AFFICHAGE DES ERREURS
  if (error && !isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color={colors.tint} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {t('notifications.title')}
              </Text>
            </View>
          </View>

          <View style={styles.errorState}>
            <Ionicons name="warning" size={64} color={colors.error} />
            <Text style={[styles.errorStateText, { color: colors.text }]}>
              {t('notifications.syncStates.error') || 'Erreur'}
            </Text>
            <Text style={[styles.errorStateSubtext, { color: colors.textSecondary }]}>
              {error}
            </Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: colors.tint }]}
              onPress={onRefresh}
            >
              <Text style={styles.retryButtonText}>
                {t('retry') || 'Réessayer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    );
  }

  // AFFICHAGE DU SKELETON UNIQUEMENT PENDANT LE CHARGEMENT INITIAL OU SYNCHRONISATION
  if (isLoading || isSyncing) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NotificationsSkeleton colors={colors} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        
        {/* Header avec back button */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                closeAllSwipeables();
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={24} color={colors.tint} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {t('notifications.title')}
            </Text>
          </View>
          
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={[styles.clearAll, { color: colors.tint }]}>
                {t('notifications.lireTout') || 'Lire tout'}
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
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t('notifications.total') || 'Total'}
            </Text>
          </View>
          <View style={[styles.statSeparator, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.tint }]}>
              {unreadCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t('notifications.unread') || 'Non lues'}
            </Text>
          </View>
        </View>

        {/* BANNER DE SYNCHRONISATION - S'affiche seulement quand il y a de nouvelles données */}
        {hasNewData && (
          <SyncBanner 
            onSync={handleSyncNewData}
            onIgnore={handleIgnoreNewData}
            colors={colors}
            t={t}
          />
        )}

        {/* Liste des notifications avec Pull-to-Refresh */}
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
              colors={[colors.tint]}
            />
          }
          onScrollBeginDrag={closeAllSwipeables} // Fermer les swipeables au scroll
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                {t('notifications.emptyTitle') || 'Aucune notification'}
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                {t('notifications.emptySubtitle') || 'Vous n\'avez aucune notification pour le moment'}
              </Text>
              <TouchableOpacity 
                style={[styles.retryButton, { backgroundColor: colors.tint }]}
                onPress={onRefresh}
              >
                <Text style={styles.retryButtonText}>
                  {t('retry') || 'Réessayer'}
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </GestureHandlerRootView>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // NOUVEAUX STYLES POUR LE SWIPE
  swipeableContainer: {
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationCard: { 
    borderRadius: 12,
    overflow: 'hidden',
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
  // STYLES POUR L'ACTION DE SWIPE
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
  },
  deleteTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
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
  skeletonBox: {
    borderRadius: 6,
  },
  // NOUVEAUX STYLES POUR LE SYSTÈME INTELLIGENT
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  syncBannerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  syncButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    marginLeft: 8,
  },
  ignoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    marginLeft: 8,
  },
  syncButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ignoreButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  errorStateSubtext: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});