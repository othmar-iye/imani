// screens/ChatScreen.tsx
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
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
}

interface ChatHeaderProps {
  sellerName: string;
  productName: string;
  productPrice: string;
  productImage?: string;
  isOnline: boolean;
  lastSeen?: string;
  onBack: () => void;
  onViewProduct: () => void;
}

// Header Épuré
const ChatHeader: React.FC<ChatHeaderProps> = ({
  sellerName,
  productName,
  productPrice,
  productImage,
  isOnline,
  lastSeen,
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
      {/* Top Bar - Navigation */}
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
            onPress={onBack}
          >
            <Ionicons 
              name="chevron-back" 
              size={22} 
              color={colors.tint} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Messages
          </Text>
        </View>
      </View>

      {/* Seller & Product Info */}
      <TouchableOpacity 
        style={styles.headerBottom}
        onPress={onViewProduct}
        activeOpacity={0.7}
      >
        <View style={styles.sellerInfo}>
          {/* Product Image */}
          <View style={styles.productImageContainer}>
            {productImage ? (
              <Image 
                source={{ uri: productImage }} 
                style={styles.productImage}
              />
            ) : (
              <View style={[styles.productImagePlaceholder, { backgroundColor: colors.tint }]}>
                <Ionicons name="cube-outline" size={20} color="#FFF" />
              </View>
            )}
          </View>
          
          {/* Seller Details */}
          <View style={styles.sellerDetails}>
            <View style={styles.sellerNameRow}>
              <Text style={[styles.sellerName, { color: colors.text }]}>
                {sellerName}
              </Text>
              <View style={[styles.statusIndicator, { 
                backgroundColor: isOnline ? '#34C759' : '#8E8E93' 
              }]} />
            </View>
            
            <Text style={[styles.productName, { color: colors.textSecondary }]}>
              {productName}
            </Text>
            
            <View style={styles.productInfoRow}>
              <Text style={[styles.productPrice, { color: colors.tint }]}>
                {productPrice}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: colors.tint }]}>
                <Text style={styles.statusBadgeText}>
                  {isOnline ? 'En ligne' : lastSeen || 'Hors ligne'}
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

// Message Bubble Component
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
        <Text style={[
          styles.messageText,
          { color: message.isMe ? '#FFF' : colors.text }
        ]}>
          {message.text}
        </Text>
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

// Input Bar Simple
const MessageInput: React.FC<{
  message: string;
  onMessageChange: (text: string) => void;
  onSend: () => void;
  colors: any;
}> = ({ message, onMessageChange, onSend, colors }) => {
  return (
    <View style={[styles.inputContainer, { 
      backgroundColor: colors.background, 
      borderTopColor: colors.border 
    }]}>
      <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
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
              backgroundColor: message.trim() ? colors.tint : colors.textSecondary,
              transform: [{ scale: message.trim() ? 1 : 0.8 }]
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
      text: 'J\'ai laissé un commentaire, je voudrais commander. Est-ce un ensemble ?', 
      isMe: false, 
      timestamp: '1 FEB 12:00', 
      read: true 
    },
    { 
      id: '2', 
      text: 'Oui et il m\'en reste quelques-uns. Quand en avez-vous besoin ?', 
      isMe: true, 
      timestamp: '1 FEB 12:05', 
      read: true 
    },
    { 
      id: '3', 
      text: 'Demain ?', 
      isMe: false, 
      timestamp: '08:12', 
      read: true 
    },
    { 
      id: '4', 
      text: 'Oui demain. Est-ce possible de livrer en avant-midi', 
      isMe: false, 
      timestamp: '08:43', 
      read: true 
    },
    { 
      id: '5', 
      text: 'Cela me va !', 
      isMe: true, 
      timestamp: '08:45', 
      read: true 
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
      };
      setMessages(prev => [newMessage, ...prev]);
      setMessage('');
      
      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  };

  const handleViewProduct = () => {
    router.push('/screens/ProductDetailScreen');
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} colors={colors} />
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header Épuré */}
      <ChatHeader
        sellerName="Danny Hopkins"
        productName="Mini Table"
        productPrice="4 590 CDF"
        isOnline={true}
        lastSeen="Vu à 09:15"
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

      {/* Input Bar Simple */}
      <MessageInput
        message={message}
        onMessageChange={setMessage}
        onSend={sendMessage}
        colors={colors}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header Styles
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
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
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
  productImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  // Input Styles
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
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
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