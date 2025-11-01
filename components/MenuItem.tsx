// components/MenuItem.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuItemProps {
  icon: string;
  label: string;
  count?: string;
  onPress: () => void;
  isDestructive?: boolean;
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    tint: string;
  };
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  count,
  onPress,
  isDestructive = false,
  colors,
}) => {
  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons 
          name={icon as any} 
          size={22} 
          color={isDestructive ? '#FF3B30' : colors.tint} 
        />
        <Text style={[
          styles.menuText, 
          { color: isDestructive ? '#FF3B30' : colors.text }
        ]}>
          {label}
        </Text>
      </View>
      
      <View style={styles.menuItemRight}>
        {count && !isDestructive && (
          <View style={[styles.countBadge, { backgroundColor: colors.tint }]}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
        {!isDestructive && (
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color={colors.textSecondary} 
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});