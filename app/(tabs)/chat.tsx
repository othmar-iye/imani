import SearchBar from '@/components/SearchBar';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
    gradientStart: isDark ? '#6366F1' : '#8B5CF6',
    gradientEnd: isDark ? '#EC4899' : '#F59E0B',
  };

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const conversations = [
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
      lastSeen: 'maintenant'
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
      lastSeen: '5h'
    }
  ];

  const tabs = [
    { id: 'all', label: 'Toutes', count: conversations.length },
    { id: 'unread', label: 'Non lues', count: conversations.filter(c => c.unread).length },
    { id: 'deals', label: 'Transactions', count: 2 },
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
      pending: { color: '#FF9500', icon: 'time-outline', label: 'En attente' },
      confirmed: { color: '#34C759', icon: 'checkmark-circle-outline', label: 'Confirmé' },
      available: { color: '#007AFF', icon: 'cube-outline', label: 'Disponible' },
      negotiation: { color: '#BF5AF2', icon: 'trending-up-outline', label: 'Négociation' },
    };
    return configs[status as keyof typeof configs] || configs.available;
  };

  const getSellerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleFilterPress = () => {
    console.log('Ouvrir les filtres de discussion');
    // router.push('/screens/chat/FiltersScreen');
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: fadeAnim }]}>
      {/* Header simplifié */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {conversations.filter(c => c.unread).length} messages non lus
            </Text>
          </View>
        </View>

        {/* Tabs */}
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
      </View>

      {/* Liste des discussions avec barre de recherche */}
      <ScrollView 
        style={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conversationsContent}
      >
        {/* Barre de recherche avec composant */}
        <SearchBar
          placeholder="Rechercher une discussion..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          colors={colors}
          showFilterButton={false}
        />

        {filteredConversations.map((conversation, index) => {
          const statusConfig = getStatusConfig(conversation.status);
          
          return (
            <TouchableOpacity
              key={conversation.id}
              style={[
                styles.conversationItem,
                { 
                  backgroundColor: colors.card,
                  transform: [{ translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50 + (index * 20), 0]
                  })}] 
                }
              ]}
              onPress={() => console.log('Ouvrir discussion:', conversation.id)}
            >
              {/* Avatar avec statut en ligne */}
              <View style={styles.avatarContainer}>
                <View style={[
                  styles.avatar,
                  { 
                    backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                    shadowColor: statusConfig.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }
                ]}>
                  <Text style={styles.avatarText}>
                    {getSellerInitials(conversation.seller)}
                  </Text>
                </View>
                {conversation.isOnline && (
                  <View style={[styles.onlineBadge, { backgroundColor: '#34C759' }]} />
                )}
                
                {/* Badge de statut de discussion */}
                <View style={[styles.statusIndicator, { backgroundColor: statusConfig.color }]}>
                  <Ionicons name={statusConfig.icon as any} size={10} color="#FFF" />
                </View>
              </View>

              {/* Contenu */}
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <View style={styles.sellerInfo}>
                    <Text style={[styles.sellerName, { color: colors.text }]}>
                      {conversation.seller}
                    </Text>
                    <Text style={[styles.productName, { color: colors.textSecondary }]}>
                      {conversation.product}
                    </Text>
                  </View>
                  <View style={styles.timeSection}>
                    <Text style={[styles.time, { color: colors.textSecondary }]}>
                      {conversation.time}
                    </Text>
                    {conversation.unread && (
                      <View style={[styles.unreadDot, { backgroundColor: colors.tint }]} />
                    )}
                  </View>
                </View>
                
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
                  
                  {!conversation.isOnline && (
                    <Text style={[styles.lastSeen, { color: colors.textSecondary }]}>
                      vu {conversation.lastSeen}
                    </Text>
                  )}
                </View>
              </View>

              {/* Indicateur de statut */}
              <View style={styles.statusTag}>
                <Ionicons 
                  name={statusConfig.icon as any} 
                  size={12} 
                  color={statusConfig.color} 
                />
                <Text style={[styles.statusText, { color: statusConfig.color }]}>
                  {statusConfig.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 8,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8,
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  tabsContainer: {
    marginHorizontal: -4,
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
  conversationsList: {
    flex: 1,
  },
  conversationsContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8,
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
    borderRadius: 16,
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
  statusIndicator: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
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
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
  },
  timeSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  lastSeen: {
    fontSize: 11,
    fontWeight: '500',
  },
  statusTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
});