// components/ProfileFormItem.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileFormItemProps {
  item: any;
  isLast: boolean;
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    tint: string;
    border: string;
  };
  onPress: () => void;
}

export const ProfileFormItem: React.FC<ProfileFormItemProps> = ({
  item,
  isLast,
  colors,
  onPress,
}) => {
  const { t } = useTranslation();

  if (item.type === 'upload') {
    return null; // Les uploads sont gérés séparément
  }

  return (
    <TouchableOpacity
      style={[
        styles.profileItem,
        { 
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          borderBottomWidth: isLast ? 0 : 1,
        },
        item.style
      ]}
      onPress={onPress}
    >
      <View style={styles.profileItemLeft}>
        <Ionicons 
          name={item.icon as any} 
          size={20} 
          color={colors.tint} 
        />
        <View style={styles.profileItemText}>
          <Text style={[styles.profileLabel, { color: colors.text }]}>
            {item.label}
          </Text>
          {item.value ? (
            <Text style={[styles.profileValue, { color: colors.textSecondary }]}>
              {item.value}
            </Text>
          ) : (
            <Text style={[styles.profilePlaceholder, { color: colors.textSecondary }]}>
              {item.placeholder}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.profileItemRight}>
        {item.type === 'select' && (
          <View style={styles.selectValue}>
            <Text style={[styles.selectText, { color: colors.textSecondary }]}>
              {item.value || t('notSelected', 'Non sélectionné')}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </View>
        )}
        
        {item.type === 'input' && (
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    minHeight: 60,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  profileItemText: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileValue: {
    fontSize: 14,
  },
  profilePlaceholder: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '500',
  },
});