import ConversationItem from '@/components/ConversationItem';
import SearchBar from '@/components/SearchBar';
import { Theme } from '@/constants/theme';
import { router } from 'expo-router';
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
    success: isDark ? '#34C759' : '#30D158',
    warning: isDark ? '#FFD60A' : '#FFD60A',
    error: isDark ? '#FF453A' : '#FF3B30',
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

  const handleConversationPress = (conversationId: string) => {
    console.log('Ouvrir discussion:', conversationId);
    router.push({
      pathname: '/screens/ChatDetailScreen',
      params: { conversationId }
    });
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

        {/* Liste des conversations avec le composant ConversationItem */}
        {filteredConversations.map((conversation, index) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            colors={colors}
            onPress={handleConversationPress}
            getStatusConfig={getStatusConfig}
            getSellerInitials={getSellerInitials}
            index={index}
            fadeAnim={fadeAnim}
          />
        ))}
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
});