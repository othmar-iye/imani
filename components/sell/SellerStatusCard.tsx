// components/SellerStatusCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SellerStatusCardProps {
  title: string;
  message: string;
  action: string;
  onPress: () => void;
  iconName: any;
  colors: any;
}

export const SellerStatusCard: React.FC<SellerStatusCardProps> = ({
  title,
  message,
  action,
  onPress,
  iconName,
  colors
}) => (
  <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
    <Ionicons name={iconName} size={48} color={colors.textSecondary} />
    <Text style={[styles.statusTitle, { color: colors.text }]}>
      {title}
    </Text>
    <Text style={[styles.statusMessage, { color: colors.textSecondary }]}>
      {message}
    </Text>
    
    {/* Afficher le bouton seulement si action n'est pas vide */}
    {action && action.trim() !== '' && (
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: colors.tint }]}
        onPress={onPress}
      >
        <Text style={styles.actionButtonText}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  statusCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  statusMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});