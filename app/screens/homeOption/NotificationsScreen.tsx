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
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

// 🆕 COMPOSANT POUR LA BARRE D'ACTIONS DE SÉLECTION
const SelectionActionBar = ({ 
  selectedCount, 
  onDeleteSelected, 
  onSelectAll, 
  onCancelSelection,
  colors,
  t,
  totalCount 
}: { 
  selectedCount: number;
  onDeleteSelected: () => void;
  onSelectAll: () => void;
  onCancelSelection: () => void;
  colors: any;
  t: any;
  totalCount: number;
}) => {
  const isAllSelected = selectedCount === totalCount;

  return (
    <View style={[styles.selectionBar, { backgroundColor: colors.tint }]}>
      <View style={styles.selectionLeft}>
        <TouchableOpacity onPress={onCancelSelection} style={styles.selectionButton}>
          <Ionicons name="close" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.selectionCount}>
          {t('notifications.selected', { count: selectedCount }) || `${selectedCount} sélectionné(s)`}
        </Text>
      </View>
      
      <View style={styles.selectionRight}>
        <TouchableOpacity onPress={onSelectAll} style={styles.selectionButton}>
          <Text style={styles.selectionActionText}>
            {isAllSelected 
              ? t('notifications.unselectAll') || 'Tout désélectionner'
              : t('notifications.selectAll') || 'Tout sélectionner'
            }
          </Text>
        </TouchableOpacity>
        
        {selectedCount > 0 && (
          <TouchableOpacity onPress={onDeleteSelected} style={styles.selectionButton}>
            <Ionicons name="trash-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

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

// 🆕 MODIFICATION DU COMPOSANT NOTIFICATIONITEM POUR AJOUTER LA SÉLECTION
const NotificationItem = ({ 
    item, 
    onDelete, 
    colors, 
    markAsRead, 
    getNotificationIcon, 
    getNavigationPath,
    formatTime,
    isSelected, // 🆕 Nouvelle prop
    onToggleSelection, // 🆕 Nouvelle prop
    selectionMode // 🆕 Nouvelle prop
}: any) => {
    const icon = getNotificationIcon(item.type);
    const isUnread = item.status === 'unread';
    
    // Animations de sortie seulement
    const opacity = useSharedValue(1);
    const height = useSharedValue<number | undefined>(undefined);
    const marginBottom = useSharedValue(8);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            height: height.value,
            marginBottom: marginBottom.value,
        };
    });

    const handleDelete = () => {
        opacity.value = withTiming(0, { duration: 300 });
        height.value = withTiming(0, { duration: 300 });
        marginBottom.value = withTiming(0, { duration: 300 }, (finished) => {
            if (finished) {
                runOnJS(onDelete)(item.id);
            }
        });
    };

    const handlePress = () => {
        if (selectionMode) {
          // 🆕 En mode sélection, toggle la sélection
          onToggleSelection(item.id);
        } else {
          // Comportement normal
          if (isUnread) {
              markAsRead(item.id);
          }
          const navigationPath = getNavigationPath(item);
          router.push(navigationPath);
        }
    };

    const handleLongPress = () => {
        if (!selectionMode) {
          // 🆕 Active le mode sélection au long press
          onToggleSelection(item.id);
        }
    };

    return (
        <Animated.View style={[styles.swipeableContainer, animatedStyle]}>
            <Swipeable
                renderRightActions={() => !selectionMode ? ( // 🆕 Désactive le swipe en mode sélection
                    <RightActions
                        onDelete={handleDelete}
                        colors={colors}
                    />
                ) : undefined}
                rightThreshold={40}
                containerStyle={styles.swipeableContainer}
                enabled={!selectionMode} // 🆕 Désactive le swipe en mode sélection
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
                    onPress={handlePress}
                    onLongPress={handleLongPress}
                    activeOpacity={selectionMode ? 0.6 : 0.7} // 🆕 Feedback différent en mode sélection
                    delayLongPress={500} // 🆕 Délai pour le long press
                >
                    <View style={styles.notificationContent}>
                        {/* 🆕 AJOUT DE LA CASE À COCHER */}
                        {selectionMode && (
                          <TouchableOpacity 
                            style={[
                              styles.checkbox,
                              { 
                                borderColor: colors.tint,
                                backgroundColor: isSelected ? colors.tint : 'transparent'
                              }
                            ]}
                            onPress={() => onToggleSelection(item.id)}
                          >
                            {isSelected && (
                              <Ionicons name="checkmark" size={16} color="#FFF" />
                            )}
                          </TouchableOpacity>
                        )}
                        
                        <View style={[
                          styles.notificationMainContent,
                          { marginLeft: selectionMode ? 12 : 0 } // 🆕 Ajustement de l'espacement
                        ]}>
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
                              {isUnread && !selectionMode && ( // 🆕 Cache le point en mode sélection
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
                              {!selectionMode && ( // 🆕 Cache la flèche en mode sélection
                                <Ionicons 
                                    name="chevron-forward" 
                                    size={16} 
                                    color={colors.textSecondary} 
                                />
                              )}
                          </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </Animated.View>
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
    <View style={[styles.notificationCard, { backgroundColor: colors.card, marginBottom:10 }]}>
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
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // 🆕 ÉTATS POUR LA SÉLECTION MULTIPLE
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Utilisation du hook modifié
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
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

  // 🆕 FONCTIONS POUR LA GESTION DE LA SÉLECTION
  const toggleSelection = useCallback((notificationId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
        // Si plus aucune sélection, on quitte le mode sélection
        if (newSet.size === 0) {
          setSelectionMode(false);
        }
      } else {
        newSet.add(notificationId);
        // Active le mode sélection au premier élément sélectionné
        if (!selectionMode) {
          setSelectionMode(true);
        }
      }
      return newSet;
    });
  }, [selectionMode]);

  const selectAll = useCallback(() => {
    if (selectedIds.size === notifications.length) {
      // Tout désélectionner
      setSelectedIds(new Set());
      setSelectionMode(false);
    } else {
      // Tout sélectionner
      const allIds = new Set(notifications.map(item => item.id));
      setSelectedIds(allIds);
      setSelectionMode(true);
    }
  }, [notifications, selectedIds.size]);

  const cancelSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, []);

  // 🆕 SUPPRESSION DES NOTIFICATIONS SÉLECTIONNÉES
  const deleteSelectedNotifications = useCallback(async () => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      t('notifications.deleteMultipleTitle') || 'Supprimer les notifications',
      t('notifications.deleteMultipleMessage', { count: selectedIds.size }) || 
        `Êtes-vous sûr de vouloir supprimer ${selectedIds.size} notification(s) ? Cette action est irréversible.`,
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            // Marquer toutes les notifications sélectionnées comme en cours de suppression
            setDeletingIds(prev => new Set([...prev, ...selectedIds]));
            
            // Supprimer chaque notification sélectionnée
            const deletePromises = Array.from(selectedIds).map(id => deleteNotification(id));
            await Promise.all(deletePromises);
            
            // Réinitialiser la sélection
            cancelSelection();
          }
        }
      ]
    );
  }, [selectedIds, deleteNotification, cancelSelection, t]);

  // FONCTION DE SUPPRESSION (existante)
  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      t('notifications.deleteTitle') || 'Supprimer la notification',
      t('notifications.deleteMessage') || 'Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible.',
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            setDeletingIds(prev => new Set(prev).add(notificationId));
          }
        }
      ]
    );
  };

  // 🆕 Finaliser la suppression avec gestion de la sélection
  const finalizeDelete = useCallback(async (notificationId: string) => {
    await deleteNotification(notificationId);
    setDeletingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
    
    // Retirer aussi de la sélection si nécessaire
    setSelectedIds(prev => {
      if (prev.has(notificationId)) {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        if (newSet.size === 0) {
          setSelectionMode(false);
        }
        return newSet;
      }
      return prev;
    });
  }, [deleteNotification]);

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
    // Ne pas rendre les notifications en cours de suppression
    if (deletingIds.has(item.id)) {
      return null;
    }

    return (
      <NotificationItem
        item={item}
        onDelete={finalizeDelete}
        colors={colors}
        markAsRead={markAsRead}
        getNotificationIcon={getNotificationIcon}
        getNavigationPath={getNavigationPath}
        formatTime={formatTime}
        // 🆕 NOUVELLES PROPS POUR LA SÉLECTION
        isSelected={selectedIds.has(item.id)}
        onToggleSelection={toggleSelection}
        selectionMode={selectionMode}
      />
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
        
        {/* 🆕 BARRE D'ACTIONS DE SÉLECTION */}
        {selectionMode && (
          <SelectionActionBar
            selectedCount={selectedIds.size}
            onDeleteSelected={deleteSelectedNotifications}
            onSelectAll={selectAll}
            onCancelSelection={cancelSelection}
            colors={colors}
            t={t}
            totalCount={notifications.length}
          />
        )}
        
        {/* Header avec back button */}
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
          
          {unreadCount > 0 && !selectionMode && ( // 🆕 Cache "Lire tout" en mode sélection
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={[styles.clearAll, { color: colors.tint }]}>
                {t('notifications.lireTout') || 'Lire tout'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Statistiques rapides (cachées en mode sélection) */}
        {!selectionMode && (
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
        )}

        {/* 🆕 AJOUTER UN ESPACE CONDITIONNEL QUAND EN MODE SÉLECTION */}
        {selectionMode && (
          <View style={styles.selectionSpacing} />
        )}

        {/* BANNER DE SYNCHRONISATION (caché en mode sélection) */}
        {hasNewData && !selectionMode && (
          <SyncBanner 
            onSync={handleSyncNewData}
            onIgnore={handleIgnoreNewData}
            colors={colors}
            t={t}
          />
        )}

        {/* Liste des notifications */}
        <FlatList
          data={notifications.filter(item => !deletingIds.has(item.id))}
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
  // STYLES POUR LE SWIPE
  swipeableContainer: {
    marginBottom: 8,
    borderRadius: 12,
  },
  notificationCard: { 
    borderRadius: 12,
    overflow: 'hidden',
  },
  notificationContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationMainContent: {
    flex: 1,
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
  // STYLES POUR LE SYSTÈME INTELLIGENT
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
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
  // 🆕 NOUVEAUX STYLES POUR LA SÉLECTION
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40, // Pour éviter le chevauchement avec la status bar
  },
  selectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  selectionCount: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  selectionActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  // 🆕 NOUVEAU STYLE POUR L'ESPACEMENT EN MODE SÉLECTION
  selectionSpacing: {
    height: 20, // ← Ajuste cette valeur selon l'espace que tu veux
  },
});