// screens/NotificationsScreen.tsx
import { Theme } from '@/constants/theme';
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

// Définition des types
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'promotion' | 'order' | 'system' | 'message';
}

const notifications: Notification[] = [
  { 
    id: '1', 
    title: 'Promotion spéciale 🎉', 
    message: '50% de réduction sur toute la collection de chaussures. Offre valable jusqu\'à demain !', 
    time: 'Il y a 2 min', 
    read: false,
    type: 'promotion'
  },
  { 
    id: '2', 
    title: 'Commande expédiée 📦', 
    message: 'Votre commande #12345 a été expédiée. Suivez votre colis en temps réel.', 
    time: 'Il y a 1h', 
    read: true,
    type: 'order'
  },
  { 
    id: '3', 
    title: 'Nouvelle collection ✨', 
    message: 'Découvrez la nouvelle collection été 2024. Des styles frais pour votre garde-robe.', 
    time: 'Il y a 3h', 
    read: true,
    type: 'promotion'
  },
  { 
    id: '4', 
    title: 'Message reçu 💬', 
    message: 'Vous avez reçu un nouveau message de Jean Dupont concernant votre annonce.', 
    time: 'Il y a 5h', 
    read: false,
    type: 'message'
  },
  { 
    id: '5', 
    title: 'Maintenance système 🔧', 
    message: 'Une maintenance est prévue ce soir de 2h à 4h. Le service pourrait être temporairement indisponible.', 
    time: 'Il y a 1 jour', 
    read: true,
    type: 'system'
  },
];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'promotion':
        return { name: 'pricetag', color: colors.tint };
      case 'order':
        return { name: 'cube', color: colors.success };
      case 'message':
        return { name: 'chatbubble', color: colors.warning };
      case 'system':
        return { name: 'settings', color: colors.textSecondary };
      default:
        return { name: 'notifications', color: colors.tint };
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity 
        style={[
          styles.notificationCard, 
          { 
            backgroundColor: colors.card,
            borderLeftWidth: 4,
            borderLeftColor: item.read ? 'transparent' : icon.color,
          }
        ]}
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
            {!item.read && (
              <View style={[styles.unreadDot, { backgroundColor: colors.tint }]} />
            )}
          </View>
          
          <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
            {item.message}
          </Text>
          
          <View style={styles.notificationFooter}>
            <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
              {item.time}
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

  const markAllAsRead = () => {
    console.log('Toutes les notifications marquées comme lues');
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
        
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={[styles.clearAll, { color: colors.tint }]}>
            Tout effacer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistiques rapides */}
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>5</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
        </View>
        <View style={[styles.statSeparator, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.tint }]}>2</Text>
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
          { paddingBottom: 20 } // ← Ajuste selon besoin
        ]}
        style={styles.flatList} // ← Flex: 1 pour prendre tout l'espace
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Aucune notification
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
    paddingTop: 60, // ← Espace pour la status bar
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
    elevation: 8, // Garde elevation pour Android
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
    flex: 1, // ← Prend tout l'espace restant
  },
  listContent: {
    // Supprime tout paddingBottom ici
  },
  notificationCard: { 
    marginHorizontal: 20, 
    marginBottom: 12, 
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
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
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
});