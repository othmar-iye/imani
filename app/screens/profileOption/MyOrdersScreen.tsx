// screens/MyOrdersScreen.tsx
import CustomButton from '@/components/CustomButton';
import SearchBar from '@/components/SearchBar';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface Order {
  id: string;
  productName: string;
  productImage: string;
  price: number;
  status: 'delivered' | 'in_progress' | 'pending' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  sellerName: string;
  trackingNumber?: string;
  description: string;
}

export default function MyOrdersScreen() {
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
    info: isDark ? '#0A84FF' : '#007AFF',
  };

  const [searchQuery, setSearchQuery] = useState('');

  // Données simulées des commandes
  const orders: Order[] = [
    {
      id: '1',
      productName: 'Vélo de course professionnel',
      productImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
      price: 103890,
      status: 'delivered',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-20',
      sellerName: 'Sports Pro',
      trackingNumber: 'TRK123456789',
      description: 'Vélo de course professionnel avec cadre en carbone, freins à disque et 21 vitesses. Parfait pour les compétitions et entraînements intensifs.'
    },
    {
      id: '2',
      productName: 'Smart TV 55" 4K UHD',
      productImage: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
      price: 201399,
      status: 'pending',
      orderDate: '2024-01-12',
      sellerName: 'Electro Home',
      description: 'Téléviseur intelligent 55 pouces avec résolution 4K UHD, HDR10+ et Android TV. Expérience cinématographique à la maison.'
    },
    {
      id: '3',
      productName: 'Montre connectée Carter',
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      price: 54999,
      status: 'in_progress',
      orderDate: '2024-01-10',
      sellerName: 'Tech Watch',
      trackingNumber: 'TRK987654321',
      description: 'Montre connectée élégante avec suivi d\'activité, notifications smartphone et autonomie de 7 jours.'
    },
    {
      id: '4',
      productName: 'Smartphone Galaxy S24',
      productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      price: 289999,
      status: 'cancelled',
      orderDate: '2024-01-08',
      sellerName: 'Mobile Store',
      description: 'Dernier flagship Samsung avec appareil photo avancé, écran Dynamic AMOLED et processeur dernier cri.'
    },
    {
      id: '5',
      productName: 'Casque audio sans fil',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      price: 75900,
      status: 'delivered',
      orderDate: '2024-01-05',
      deliveryDate: '2024-01-09',
      sellerName: 'Audio Pro',
      trackingNumber: 'TRK456789123',
      description: 'Casque audio premium avec réduction de bruit active, autonomie 30h et qualité sonore exceptionnelle.'
    }
  ];

  const filteredOrders = orders.filter(order => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.productName.toLowerCase().includes(query) ||
        order.sellerName.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      delivered: { 
        color: colors.success, 
        label: 'Livrée',
        bgColor: isDark ? '#1C3B2A' : '#E8F5E8'
      },
      in_progress: { 
        color: colors.info, 
        label: 'En cours',
        bgColor: isDark ? '#1A2A3A' : '#E8F0FE'
      },
      pending: { 
        color: colors.warning, 
        label: 'En attente',
        bgColor: isDark ? '#3A2A1A' : '#FFF8E1'
      },
      cancelled: { 
        color: colors.error, 
        label: 'Annulée',
        bgColor: isDark ? '#3A1A1A' : '#FFE8E8'
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR') + ' CDF';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('fr-FR', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}. ${year}`;
  };

  const handleContactSeller = (sellerName: string) => {
    Alert.alert('Contacter le vendeur', `Ouvrir la conversation avec ${sellerName}`);
  };

  const handleTrackOrder = (orderId: string, trackingNumber?: string) => {
    if (trackingNumber) {
      Alert.alert('Suivi de commande', `Suivre la commande ${orderId}\nNuméro de suivi: ${trackingNumber}`);
    } else {
      Alert.alert('Suivi indisponible', 'Aucun numéro de suivi disponible pour cette commande');
    }
  };

  const handleFilterPress = () => {
    console.log('Ouvrir les filtres des commandes');
    // router.push('/screens/orders/FiltersScreen');
  };

  const renderOrderItem = (order: Order) => {
    const statusConfig = getStatusConfig(order.status);
    
    return (
      <View key={order.id} style={[styles.orderCard, { 
        backgroundColor: colors.card,
        borderColor: colors.card,
      }]}>
        {/* En-tête avec statut */}
        <View style={styles.orderHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
            {formatDate(order.orderDate)}
          </Text>
        </View>

        {/* Contenu principal */}
        <View style={styles.orderContent}>
          <Image 
            source={{ uri: order.productImage }} 
            style={styles.productImage}
            resizeMode="cover"
          />
          
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
              {order.productName}
            </Text>
            <Text style={[styles.productDescription, { color: colors.textSecondary }]} numberOfLines={2}>
              {order.description}
            </Text>
            <Text style={[styles.productPrice, { color: colors.tint }]}>
              {formatPrice(order.price)}
            </Text>
            
            {/* Indicateur de livraison */}
            {order.status === 'delivered' && order.deliveryDate && (
              <View style={styles.deliveryInfo}>
                <Text style={[styles.deliveryText, { color: colors.success }]}>
                  Livrée le {formatDate(order.deliveryDate)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Actions avec CustomButton */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="Discuter"
            onPress={() => handleContactSeller(order.sellerName)}
            variant="outline"
            size="medium"
            style={styles.actionButton}
          />
          
          <CustomButton
            title="Traquer"
            onPress={() => handleTrackOrder(order.id, order.trackingNumber)}
            variant="primary"
            size="medium"
            style={styles.actionButton}
            disabled={!order.trackingNumber}
          />
        </View>
      </View>
    );
  };

  const EmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
        <Ionicons name="receipt-outline" size={48} color={colors.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucune commande
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Vos commandes apparaîtront ici après vos achats
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header - Style AboutScreen */}
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
          Mes commandes
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Barre de recherche avec composant SearchBar */}
        <View style={styles.searchWrapper}>
          <SearchBar
            placeholder="Rechercher une commande..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            showFilterButton={false}
            colors={colors}
          />
        </View>

        {/* Liste des commandes */}
        {filteredOrders.length > 0 ? (
          <View style={styles.ordersList}>
            {filteredOrders.map(renderOrderItem)}
          </View>
        ) : (
          <EmptyOrders />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header - Style AboutScreen
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  // Search Wrapper
  searchWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  // Orders List
  ordersList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  orderCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderContent: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  deliveryInfo: {
    marginTop: 4,
  },
  deliveryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Actions avec CustomButton
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});