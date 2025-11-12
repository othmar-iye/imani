import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, RefreshControl, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Theme } from '@/constants/theme';
import { useNotifications } from '@/hooks/useNotifications';

// Import des composants
import { Header } from '@/components/Header';
import { EmptyNotifications } from '@/components/notifications/EmptyNotifications';
import { ErrorState } from '@/components/notifications/ErrorState';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { NotificationsSkeleton } from '@/components/notifications/NotificationsSkeleton';
import { NotificationStats } from '@/components/notifications/NotificationStats';
import { SelectionActionBar } from '@/components/notifications/SelectionActionBar';
import { SyncBanner } from '@/components/notifications/SyncBanner';

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedNotifications, setDisplayedNotifications] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // État local pour contrôler l'affichage du banner
  const [showSyncBanner, setShowSyncBanner] = useState(false);

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

  // Synchroniser showSyncBanner avec hasNewData
  useEffect(() => {
    setShowSyncBanner(hasNewData);
  }, [hasNewData]);

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

  const PAGE_SIZE = 10;
  const LOAD_MORE_SIZE = 10;

  const handleMarkAllAsRead = async () => {
    try {
      // Cacher immédiatement le banner
      setShowSyncBanner(false);
      
      // Si il y a de nouvelles données non synchronisées
      if (hasNewData) {
        // Synchroniser puis tout marquer comme lu
        await syncNewData(); // Récupère les nouvelles notifications
        await markAllAsRead(); // Marque tout (anciennes + nouvelles)
        ignoreNewData(); // Cache le banner côté hook
      } else {
        // Pas de nouvelles données, juste marquer tout comme lu
        await markAllAsRead();
      }
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      // En cas d'erreur, remettre le banner si nécessaire
      if (hasNewData) {
        setShowSyncBanner(true);
      }
    }
  };

  const handleSyncNewData = async () => {
    setIsSyncing(true);
    setShowSyncBanner(false); // Cacher immédiatement
    try {
      await syncNewData();
    } catch (err) {
      setError(t('notifications.syncStates.error') || 'Erreur de synchronisation');
      // En cas d'erreur, remettre le banner
      setShowSyncBanner(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleIgnoreNewData = () => {
    setShowSyncBanner(false); // Cacher immédiatement
    ignoreNewData();
  };

  // Gestion du chargement initial
  useEffect(() => {
    let timeoutId: any;
    
    if (!isLoading && isInitialLoading) {
      timeoutId = setTimeout(() => {
        setIsInitialLoading(false);
      }, 100);
    }
    
    const safetyTimeout = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(safetyTimeout);
    };
  }, [isLoading, isInitialLoading]);

  // Pagination
  useEffect(() => {
    if (notifications.length > 0) {
      const startIndex = 0;
      const endIndex = PAGE_SIZE;
      const initialNotifications = notifications.slice(startIndex, endIndex);
      
      setDisplayedNotifications(initialNotifications);
      setHasMore(endIndex < notifications.length);
      setCurrentPage(1);
    } else {
      setDisplayedNotifications([]);
      setHasMore(false);
      setCurrentPage(0);
    }
  }, [notifications]);

  const loadMoreNotifications = useCallback(async () => {
    if (!hasMore || isLoadingMore || selectionMode) return;

    setIsLoadingMore(true);
    
    setTimeout(() => {
      const startIndex = PAGE_SIZE + (currentPage - 1) * LOAD_MORE_SIZE;
      const endIndex = startIndex + LOAD_MORE_SIZE;
      const nextNotifications = notifications.slice(startIndex, endIndex);
      
      setDisplayedNotifications(prev => [...prev, ...nextNotifications]);
      setHasMore(endIndex < notifications.length);
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 800);
  }, [hasMore, isLoadingMore, notifications, currentPage, selectionMode]);

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

  const toggleSelection = useCallback((notificationId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
        if (newSet.size === 0) {
          setSelectionMode(false);
        }
      } else {
        newSet.add(notificationId);
        if (!selectionMode) {
          setSelectionMode(true);
        }
      }
      return newSet;
    });
  }, [selectionMode]);

  const selectAll = useCallback(() => {
    if (selectedIds.size === displayedNotifications.length) {
      setSelectedIds(new Set());
      setSelectionMode(false);
    } else {
      const allIds = new Set(displayedNotifications.map(item => item.id));
      setSelectedIds(allIds);
      setSelectionMode(true);
    }
  }, [displayedNotifications, selectedIds.size]);

  const cancelSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, []);

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
            setDeletingIds(prev => new Set([...prev, ...selectedIds]));
            const deletePromises = Array.from(selectedIds).map(id => deleteNotification(id));
            await Promise.all(deletePromises);
            cancelSelection();
          }
        }
      ]
    );
  }, [selectedIds, deleteNotification, cancelSelection, t]);

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

  const finalizeDelete = useCallback(async (notificationId: string) => {
    await deleteNotification(notificationId);
    setDeletingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
    
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

  const formatTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('notifications.time.justNow') || 'À l\'instant';
    if (diffInMinutes < 60) return t('notifications.time.minutesAgo', { count: diffInMinutes }) || `${diffInMinutes} min`;
    if (diffInMinutes < 1440) return t('notifications.time.hoursAgo', { count: Math.floor(diffInMinutes / 60) }) || `${Math.floor(diffInMinutes / 60)} h`;
    return t('notifications.time.daysAgo', { count: Math.floor(diffInMinutes / 1440) }) || `${Math.floor(diffInMinutes / 1440)} j`;
  };

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
        isSelected={selectedIds.has(item.id)}
        onToggleSelection={toggleSelection}
        selectionMode={selectionMode}
      />
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return <NotificationsSkeleton colors={colors} variant="loading" />;
  };

  // États de chargement
  if (isInitialLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NotificationsSkeleton colors={colors} />
      </GestureHandlerRootView>
    );
  }

  if (error && !isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorState colors={colors} t={t} error={error} onRefresh={onRefresh} />
      </GestureHandlerRootView>
    );
  }

  if (isSyncing) {
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
        
        {selectionMode && (
          <SelectionActionBar
            selectedCount={selectedIds.size}
            onDeleteSelected={deleteSelectedNotifications}
            onSelectAll={selectAll}
            onCancelSelection={cancelSelection}
            colors={colors}
            t={t}
            totalCount={displayedNotifications.length}
          />
        )}
        
        <Header
            colors={colors}
            title={t('notifications.title')}
            showBackButton={true}
            customPaddingTop={selectionMode ? 15 : 60}
            rightAction={
                unreadCount > 0 && !selectionMode 
                ? {
                    label: t('notifications.lireTout') || 'Lire tout',
                    onPress: handleMarkAllAsRead,
                    showCondition: true
                    }
                : undefined
            }
        />

        {!selectionMode && (
          <NotificationStats
            notifications={notifications}
            unreadCount={unreadCount}
            colors={colors}
            t={t}
          />
        )}

        {selectionMode && (
          <View style={styles.selectionSpacing} />
        )}

        {/* MODIFIÉ : Utiliser showSyncBanner au lieu de hasNewData */}
        {showSyncBanner && !selectionMode && (
          <SyncBanner 
            onSync={handleSyncNewData}
            onIgnore={handleIgnoreNewData}
            colors={colors}
            t={t}
          />
        )}

        <FlatList
          data={displayedNotifications.filter(item => !deletingIds.has(item.id))}
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
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreNotifications}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <EmptyNotifications colors={colors} t={t} onRefresh={onRefresh} />
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
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  selectionSpacing: {
    height: 20,
  },
});