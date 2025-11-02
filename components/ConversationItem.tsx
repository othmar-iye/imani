// components/ConversationItem.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ConversationItemProps {
  conversation: {
    id: string;
    product: string;
    seller: string;
    time: string;
    message: string;
    unread: boolean;
    productImage?: string;
    status: string;
    isOnline: boolean;
    lastSeen: string;
  };
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
    success: string;
    warning: string;
    error: string;
  };
  onPress?: (conversationId: string) => void;
  getStatusConfig: (status: string) => {
    color: string;
    icon: string;
    label: string;
  };
  getSellerInitials: (name: string) => string;
  index?: number;
  fadeAnim?: any;
}

export default function ConversationItem({
  conversation,
  colors,
  onPress,
  getStatusConfig,
  getSellerInitials,
  index = 0,
  fadeAnim
}: ConversationItemProps) {
  const statusConfig = getStatusConfig(conversation.status);

  const handlePress = () => {
    onPress?.(conversation.id);
  };

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
      onPress={handlePress}
    >
      {/* Avatar avec statut en ligne - IDENTIQUE À L'ORIGINAL */}
      <View style={styles.avatarContainer}>
        <View style={[
          styles.avatar,
          { 
            backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
          }
        ]}>
          <Text style={styles.avatarText}>
            {getSellerInitials(conversation.seller)}
          </Text>
        </View>
        {conversation.isOnline && (
          <View style={[styles.onlineBadge, { backgroundColor: '#34C759' }]} />
        )}
        
        {/* Badge de statut de discussion - IDENTIQUE À L'ORIGINAL */}
        <View style={[styles.statusIndicator, { backgroundColor: statusConfig.color }]}>
          <Ionicons name={statusConfig.icon as any} size={10} color="#FFF" />
        </View>
      </View>

      {/* Contenu - IDENTIQUE À L'ORIGINAL */}
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

      {/* Indicateur de statut - IDENTIQUE À L'ORIGINAL */}
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
}

const styles = StyleSheet.create({
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
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