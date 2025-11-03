// components/CategorySelectorModal.tsx
import { Category } from '@/src/data/categories';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface CategorySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  colors: any;
}

export const CategorySelectorModal: React.FC<CategorySelectorModalProps> = ({
  visible,
  onClose,
  categories,
  onSelectCategory,
  colors
}) => {
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.modalItem, { borderBottomColor: colors.border }]}
      onPress={() => onSelectCategory(item)}
    >
      <Ionicons name={item.icon as any} size={24} color={colors.tint} />
      <Text style={[styles.modalItemText, { color: colors.text }]}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Choisir une catégorie
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          style={styles.modalList}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalList: {
    flex: 1,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  modalItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});