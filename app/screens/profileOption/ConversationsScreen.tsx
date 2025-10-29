import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

interface Conversation {
  id: string;
  product: string;
  seller: string;
  time: string;
  message: string;
  unread: boolean;
  productImage: string;
  status: 'pending' | 'confirmed' | 'available' | 'negotiation';
  isOnline: boolean;
  lastSeen: string;
  unreadCount?: number;
}

export default function ConversationsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
    success: isDark ? '#34C759' : '#30D158',
    warning: isDark ? '#FFD60A' : '#FFD60A',
    error: isDark ? '#FF453A' : '#FF3B30',
    borderInput: isDark ? Theme.light.borderInput : Theme.light.borderInput,
  };

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      product: 'Mini Table',
      seller: 'Didier Seller',
      time: '09:32',
      message: 'Toujours dispo ?',
      unread: true,
      productImage: 'https://example.com/minitable.jpg',
      status: 'pending',
      isOnline: true,
      lastSeen: 'maintenant',
      unreadCount: 3
    },
    {
      id: '2',
      product: 'AirPod Max',
      seller: 'Daniella Seller',
      time: 'Hier',
      message: 'Je confirme l\'achat',
      unread: false,
      productImage: 'https://example.com/airpods.jpg',
      status: 'confirmed',
      isOnline: false,
      lastSeen: '2h'
    },
    {
      id: '3',
      product: 'Pull Collection Hiver',
      seller: 'Charles Seller',
      time: '12/10',
      message: 'C\'est disponible en noir aussi',
      unread: false,
      productImage: 'https://example.com/pull.jpg',
      status: 'available',
      isOnline: true,
      lastSeen: 'maintenant'
    },
    {
      id: '4',
      product: 'iPhone 15 Pro',
      seller: 'Sophie Tech',
      time: '11/10',
      message: 'Je suis intéressé par votre offre',
      unread: true,
      productImage: 'https://example.com/iphone.jpg',
      status: 'negotiation',
      isOnline: false,
      lastSeen: '5h',
      unreadCount: 2
    },
    {
      id: '5',
      product: 'Chaussures Sport',
      seller: 'Mike Sport',
      time: '10/10',
      message: 'Quelle est votre taille ?',
      unread: false,
      productImage: 'https://example.com/shoes.jpg',
      status: 'pending',
      isOnline: true,
      lastSeen: 'maintenant'
    }
  ];

  const tabs = [
    { id: 'all', label: t('conversations:tabs.all', 'Toutes'), count: conversations.length },
    { id: 'unread', label: t('conversations:tabs.unread', 'Non lues'), count: conversations.filter(c => c.unread).length },
    { id: 'deals', label: t('conversations:tabs.deals', 'Transactions'), count: conversations.filter(c => c.status === 'confirmed' || c.status === 'negotiation').length },
  ];

  const filteredConversations = conversations.filter(conv => {
    if (activeTab === 'unread') return conv.unread;
    if (activeTab === 'deals') return conv.status === 'confirmed' || conv.status === 'negotiation';
    
    // Filtre de recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        conv.product.toLowerCase().includes(query) ||
        conv.seller.toLowerCase().includes(query) ||
        conv.message.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { color: '#FF9500', icon: 'time-outline', label: t('conversations:status.pending', 'En attente') },
      confirmed: { color: '#34C759', icon: 'checkmark-circle-outline', label: t('conversations:status.confirmed', 'Confirmé') },
      available: { color: '#007AFF', icon: 'cube-outline', label: t('conversations:status.available', 'Disponible') },
      negotiation: { color: '#BF5AF2', icon: 'trending-up-outline', label: t('conversations:status.negotiation', 'Négociation') },
    };
    return configs[status as keyof typeof configs] || configs.available;
  };

  const getSellerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const navigateToChat = (conversationId: string) => {
    // router.push({
    //   pathname: '/screens/ChatDetailScreen',
    //   params: { conversationId }
    // });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header - IDENTIQUE À WALLET */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
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
          {t('conversations:title', 'Mes discussions')}
        </Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons 
            name="help-circle-outline" 
            size={24} 
            color={colors.tint} 
          />
        </TouchableOpacity>
      </View>

      {/* Reste du contenu inchangé */}
      <ScrollView 
        style={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conversationsContent}
      >
        {/* Tabs - Style identique à Chat */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                { 
                  backgroundColor: activeTab === tab.id ? colors.tint : 'transparent',
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                { 
                  color: activeTab === tab.id ? '#FFF' : colors.textSecondary,
                }
              ]}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={[
                  styles.tabBadge,
                  { backgroundColor: activeTab === tab.id ? '#FFF' : colors.tint }
                ]}>
                  <Text style={[
                    styles.tabBadgeText,
                    { color: activeTab === tab.id ? colors.tint : '#FFF' }
                  ]}>
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Barre de recherche - Style identique à Chat */}
        <View style={[styles.searchContainer, { 
          backgroundColor: colors.card,
          borderColor: colors.borderInput 
        }]}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('conversations:searchPlaceholder', 'Rechercher une discussion...')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Liste des conversations */}
        <View style={styles.conversationsSection}>
          {filteredConversations.map((conversation, index) => {
            const statusConfig = getStatusConfig(conversation.status);
            
            return (
              <TouchableOpacity
                key={conversation.id}
                style={[
                  styles.conversationItem,
                  { 
                    backgroundColor: colors.card,
                  }
                ]}
                onPress={() => navigateToChat(conversation.id)}
              >
                {/* Avatar avec statut en ligne - Style identique à Chat */}
                <View style={styles.avatarContainer}>
                  <View style={[
                    styles.avatar,
                    { 
                      backgroundColor: colors.tint,
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                      elevation: 8, // Garde elevation pour Android
                      overflow: 'hidden',
                    }
                  ]}>
                    <Text style={styles.avatarText}>
                      {getSellerInitials(conversation.seller)}
                    </Text>
                  </View>
                  {conversation.isOnline && (
                    <View style={[styles.onlineBadge, { backgroundColor: colors.success }]} />
                  )}
                </View>

                {/* Contenu de la conversation */}
                <View style={styles.conversationContent}>
                  {/* En-tête avec nom du vendeur et produit */}
                  <View style={styles.conversationHeader}>
                    <View style={styles.headerMain}>
                      <Text style={[styles.sellerName, { color: colors.text }]}>
                        {conversation.seller}
                      </Text>
                      <View style={styles.productBadge}>
                        <Text style={[styles.productName, { color: colors.tint }]}>
                          {conversation.product}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.timeSection}>
                      <Text style={[styles.time, { color: colors.textSecondary }]}>
                        {conversation.time}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Message et badge non lus */}
                  <View style={styles.messageSection}>
                    <Text 
                      style={[
                        styles.messageText, 
                        { 
                          color: conversation.unread ? colors.text : colors.textSecondary,
                          fontWeight: conversation.unread ? '600' : '400'
                        }
                      ]}
                      numberOfLines={2}
                    >
                      {conversation.message}
                    </Text>
                    
                    {conversation.unreadCount && conversation.unreadCount > 0 && (
                      <View style={[styles.unreadBadge, { backgroundColor: colors.tint }]}>
                        <Text style={styles.unreadBadgeText}>
                          {conversation.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Statut de la discussion */}
                  <View style={styles.statusSection}>
                    <View style={[styles.statusTag, { backgroundColor: statusConfig.color + '20' }]}>
                      <Ionicons 
                        name={statusConfig.icon as any} 
                        size={12} 
                        color={statusConfig.color} 
                      />
                      <Text style={[styles.statusText, { color: statusConfig.color }]}>
                        {statusConfig.label}
                      </Text>
                    </View>
                    
                    {!conversation.isOnline && (
                      <Text style={[styles.lastSeen, { color: colors.textSecondary }]}>
                        {t('conversations:lastSeen', 'vu')} {conversation.lastSeen}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {filteredConversations.length === 0 && (
            <View style={styles.emptyConversations}>
              <Ionicons 
                name="chatbubble-outline" 
                size={48} 
                color={colors.textSecondary} 
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('conversations:noConversations', 'Aucune discussion trouvée')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header IDENTIQUE À WALLET
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700',
  },
  helpButton: {
    padding: 8,
  },
  // Reste des styles inchangés
  conversationsList: {
    flex: 1,
  },
  conversationsContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  tabsContainer: {
    marginHorizontal: -4,
    marginTop: 25,
    marginBottom: 16,
  },
  tabsContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  searchContainer: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    shadowColor: '#000',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
    overflow: 'hidden',
    marginTop: 8,
    borderWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 8,
  },
  conversationsSection: {
    gap: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
    overflow: 'hidden',
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28, // Changé pour être complètement rond
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  conversationContent: {
    flex: 1,
    gap: 6,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerMain: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  productBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
  },
  messageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
    lineHeight: 18,
  },
  unreadBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  lastSeen: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyConversations: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
});