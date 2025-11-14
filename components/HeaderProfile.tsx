// components/HeaderProfile.tsx
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface HeaderProfileProps {
  title: string;
  onBack?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  showBackButton?: boolean;
  backgroundColor?: string;
}

export const HeaderProfile: React.FC<HeaderProfileProps> = ({
  title,
  onBack,
  rightAction,
  showBackButton = true,
  backgroundColor,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: backgroundColor || (isDark ? Theme.dark.card : Theme.light.card),
    text: isDark ? Theme.dark.text : Theme.light.text,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      {/* Bouton retour */}
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={colors.tint} 
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}

      {/* Titre centré */}
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        {title}
      </Text>

      {/* Action droite ou espaceur */}
      {rightAction ? (
        <TouchableOpacity 
          style={styles.rightButton}
          onPress={rightAction.onPress}
        >
          <Ionicons 
            name={rightAction.icon as any} 
            size={24} 
            color={colors.tint} 
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 40,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  rightButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-end',
  },
});