// components/Header.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  colors: {
    border: string;
    tint: string;
    text: string;
  };
  title: string;
  showBackButton?: boolean;
  rightAction?: {
    label: string;
    onPress: () => void;
    showCondition?: boolean;
  };
  customPaddingTop?: number;
}

export const Header: React.FC<HeaderProps> = ({
  colors,
  title,
  showBackButton = true,
  rightAction,
  customPaddingTop
}) => (
  <View style={[
    styles.header, 
    { 
      borderBottomColor: colors.border,
      paddingTop: customPaddingTop !== undefined ? customPaddingTop : 60
    }
  ]}>
    <View style={styles.headerLeft}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.tint} />
        </TouchableOpacity>
      )}
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        {title}
      </Text>
    </View>
    
    {rightAction && (rightAction.showCondition === undefined || rightAction.showCondition) && (
      <TouchableOpacity onPress={rightAction.onPress}>
        <Text style={[styles.rightAction, { color: colors.tint }]}>
          {rightAction.label}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  rightAction: { 
    fontSize: 16, 
    fontWeight: '500' 
  },
});