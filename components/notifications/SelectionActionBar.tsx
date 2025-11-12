import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectionActionBarProps {
  selectedCount: number;
  onDeleteSelected: () => void;
  onSelectAll: () => void;
  onCancelSelection: () => void;
  colors: {
    tint: string;
  };
  t: any;
  totalCount: number;
}

export const SelectionActionBar: React.FC<SelectionActionBarProps> = ({
  selectedCount,
  onDeleteSelected,
  onSelectAll,
  onCancelSelection,
  colors,
  t,
  totalCount
}) => {
  const isAllSelected = selectedCount === totalCount;

  return (
    <View style={[styles.selectionBar, { backgroundColor: colors.tint }]}>
      <View style={styles.selectionLeft}>
        <TouchableOpacity onPress={onCancelSelection} style={styles.selectionButton}>
          <Ionicons name="close" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.selectionCount}>
          {t('notifications.selected', { count: selectedCount }) || `${selectedCount} sélectionné(s)`}
        </Text>
      </View>
      
      <View style={styles.selectionRight}>
        <TouchableOpacity onPress={onSelectAll} style={styles.selectionButton}>
          <Text style={styles.selectionActionText}>
            {isAllSelected 
              ? t('notifications.unselectAll') || 'Tout désélectionner'
              : t('notifications.selectAll') || 'Tout sélectionner'
            }
          </Text>
        </TouchableOpacity>
        
        {selectedCount > 0 && (
          <TouchableOpacity onPress={onDeleteSelected} style={styles.selectionButton}>
            <Ionicons name="trash-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40,
  },
  selectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  selectionCount: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  selectionActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});