// screens/ChatScreen.tsx
import { Theme } from '@/constants/theme';
import { featuredProducts, Product } from '@/src/data/products';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Types pour les messages
interface Message {
  id: string;
  text: string;
  isMe: boolean;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image';
  imageUrl?: string;
}

// Prendre un produit spécifique (exemple avec l'ID 10 - Canapé d'Angle)
const currentProduct: Product = featuredProducts.find(product => product.id === '10') || featuredProducts[0];

interface ChatHeaderProps {
  product: Product;
  onBack: () => void;
  onViewProduct: (product: Product) => void;
}

// Header avec nom du vendeur et photo
const ChatHeader: React.FC<ChatHeaderProps> = ({
  product,
  onBack,
  onViewProduct,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.header, 
        { 
          borderBottomColor: colors.border, 
          backgroundColor: colors.background,
          opacity: fadeAnim,
        }
      ]}
    >
      {/* Top Bar - Avec photo et nom du vendeur */}
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={colors.tint} 
            />
          </TouchableOpacity>
          
          {/* Photo du vendeur */}
          <View style={styles.sellerPhotoContainer}>
            <Image 
              source={{ uri: product.seller.photo }} 
              style={styles.sellerPhoto}
            />
            {/* Indicateur de statut en ligne */}
            <View style={[styles.onlineIndicator, { 
              backgroundColor: product.seller.verified ? '#34C759' : '#8E8E93' 
            }]} />
          </View>
          
          {/* Nom du vendeur */}
          <View style={styles.sellerInfoHeader}>
            <Text style={[styles.sellerNameHeader, { color: colors.text }]}>
              {product.seller.name}
            </Text>
            <Text style={[styles.sellerStatus, { color: colors.textSecondary }]}>
              {product.seller.verified ? 'En ligne' : 'Hors ligne'}
            </Text>
          </View>
        </View>
      </View>

      {/* Seller & Product Info */}
      <TouchableOpacity 
        style={styles.headerBottom}
        onPress={() => onViewProduct(product)}
        activeOpacity={0.7}
      >
        <View style={styles.sellerInfo}>
          {/* Product Image */}
          <View style={styles.productImageContainer}>
            <Image 
              source={{ uri: product.image }} 
              style={styles.productImage}
            />
          </View>
          
          {/* Seller Details */}
          <View style={styles.sellerDetails}>
            <View style={styles.sellerNameRow}>
              <Text style={[styles.productName, { color: colors.textSecondary }]}>
                {product.name}
              </Text>
            </View>
            
            <View style={styles.productInfoRow}>
              <Text style={[styles.productPrice, { color: colors.tint }]}>
                ${product.price.toLocaleString()}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: colors.tint }]}>
                <Text style={styles.statusBadgeText}>
                  Voir
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <Ionicons 
          name="chevron-forward" 
          size={18} 
          color={colors.textSecondary} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Message Bubble Component avec support des images
const MessageBubble: React.FC<{ message: Message; colors: any }> = ({ message, colors }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.messageContainer,
        message.isMe ? styles.myMessageContainer : styles.theirMessageContainer,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <View style={[
        styles.messageBubble,
        { 
          backgroundColor: message.isMe ? colors.tint : colors.card,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }
      ]}>
        {message.type === 'image' && message.imageUrl ? (
          <TouchableOpacity 
            style={styles.imageMessageContainer}
            activeOpacity={0.9}
            onPress={() => {
              // Ici tu pourrais ouvrir une modal pour voir l'image en grand
              Alert.alert('Image', 'Ouvrir l\'image en plein écran?');
            }}
          >
            <Image 
              source={{ uri: message.imageUrl }} 
              style={styles.messageImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <Ionicons name="expand" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={[
            styles.messageText,
            { color: message.isMe ? '#FFF' : colors.text }
          ]}>
            {message.text}
          </Text>
        )}
      </View>
      <View style={styles.messageFooter}>
        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
          {message.timestamp}
        </Text>
        {message.isMe && (
          <Ionicons 
            name={message.read ? "checkmark-done" : "checkmark"} 
            size={14} 
            color={message.read ? colors.tint : colors.textSecondary} 
          />
        )}
      </View>
    </Animated.View>
  );
};

// Input Bar Simple avec bouton d'upload
const MessageInput: React.FC<{
  message: string;
  onMessageChange: (text: string) => void;
  onSend: () => void;
  onSendImage: (imageUri: string) => void;
  colors: any;
}> = ({ message, onMessageChange, onSend, onSendImage, colors }) => {

  const pickImage = async () => {
    try {
      // Demander la permission d'accéder à la galerie
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à vos photos.');
        return;
      }

      // Ouvrir la galerie
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onSendImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const takePhoto = async () => {
    try {
      // Demander la permission d'accéder à la caméra
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à votre caméra.');
        return;
      }

      // Prendre une photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onSendImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre une photo');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Ajouter une image',
      'Choisissez une option',
      [
        {
          text: 'Prendre une photo',
          onPress: takePhoto,
        },
        {
          text: 'Choisir depuis la galerie',
          onPress: pickImage,
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={[styles.inputContainer, { 
      backgroundColor: colors.background, 
      borderTopColor: colors.border 
    }]}>
      <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
        {/* Bouton d'ajout d'image */}
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={showImageOptions}
        >
          <Ionicons 
            name="add" 
            size={22} 
            color={colors.tint} 
          />
        </TouchableOpacity>
        
        <TextInput
          style={[styles.textInput, { color: colors.text }]}
          value={message}
          onChangeText={onMessageChange}
          placeholder="Tapez votre message..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { 
              backgroundColor: message.trim() ? colors.tint : colors.tint,
              opacity: message.trim() ? 1 : 0.5,
            }
          ]}
          onPress={onSend}
          disabled={!message.trim()}
        >
          <Ionicons 
            name="send" 
            size={18} 
            color="#FFF" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: 'Bonjour ! Je suis intéressé par votre canapé. Est-il toujours disponible ?', 
      isMe: false, 
      timestamp: '1 FEB 12:00', 
      read: true,
      type: 'text'
    },
    { 
      id: '2', 
      text: 'Oui, il est toujours disponible ! Il est en excellent état comme sur les photos.', 
      isMe: true, 
      timestamp: '1 FEB 12:05', 
      read: true,
      type: 'text'
    },
    { 
      id: '3', 
      text: 'Super ! Pourriez-vous me donner les dimensions exactes ?', 
      isMe: false, 
      timestamp: '08:12', 
      read: true,
      type: 'text'
    },
    { 
      id: '4', 
      text: 'Bien sûr : 280cm de large, 180cm de profondeur, hauteur d\'assise 45cm.', 
      isMe: true, 
      timestamp: '08:15', 
      read: true,
      type: 'text'
    },
    { 
      id: '5', 
      text: 'Parfait, cela correspond à mon salon. Puis-je venir le voir demain ?', 
      isMe: false, 
      timestamp: '08:20', 
      read: true,
      type: 'text'
    },
  ]);

  const flatListRef = useRef<FlatList>(null);

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isMe: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'text'
      };
      setMessages(prev => [newMessage, ...prev]);
      setMessage('');
      
      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  };

  const sendImage = (imageUri: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: '',
      isMe: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'image',
      imageUrl: imageUri
    };
    setMessages(prev => [newMessage, ...prev]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const handleViewProduct = (product: Product) => {
    // Navigation vers ProductDetail avec le produit
    router.push({
      pathname: '/screens/ProductDetailScreen',
      params: { productId: product.id }
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} colors={colors} />
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header avec photo et nom du vendeur */}
      <ChatHeader
        product={currentProduct}
        onBack={() => router.back()}
        onViewProduct={handleViewProduct}
      />

      {/* Liste des Messages Inversée */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        inverted
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      />

      {/* Input Bar avec bouton d'upload */}
      <MessageInput
        message={message}
        onMessageChange={setMessage}
        onSend={sendMessage}
        onSendImage={sendImage}
        colors={colors}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header Styles - Avec photo du vendeur
  header: {
    paddingTop: 60,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  // Nouveaux styles pour la photo du vendeur
  sellerPhotoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  sellerPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  sellerInfoHeader: {
    flex: 1,
  },
  sellerNameHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  sellerStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 4,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  // Messages Styles
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 0,
    borderRadius: 20,
    marginBottom: 4,
    overflow: 'hidden',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.3,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // Styles pour les messages image
  imageMessageContainer: {
    position: 'relative',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 20,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  // Input Styles avec bouton d'upload
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 10,
    lineHeight: 20,
  },
  sendButton: {
    width: 36, 
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
});