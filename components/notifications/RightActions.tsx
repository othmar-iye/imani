import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RightActionsProps {
  onDelete: () => void;
  colors: {
    error: string;
  };
}

export const RightActions: React.FC<RightActionsProps> = ({ onDelete, colors }) => {
  const { t } = useTranslation();
  
  const handlePress = () => {
    onDelete();
  };

  return (
    <View style={[styles.deleteAction, { backgroundColor: colors.error }]}>
      <TouchableOpacity onPress={handlePress} style={styles.deleteTouchable}>
        <View style={styles.deleteContent}>
          <Ionicons name="trash-outline" size={24} color="#FFF" />
          <Text style={styles.deleteText}>{t('delete')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
  },
  deleteTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});