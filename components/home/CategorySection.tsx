// components/CategorySection.tsx
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories: string[];
}

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;
  const { t } = useTranslation();

  // Mapper les icônes string vers les noms d'icônes Ionicons
  const getIconName = (icon: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'apps-outline': 'apps-outline',
      'shirt': 'shirt-outline',
      'footsteps': 'footsteps-outline',
      'glasses': 'glasses-outline',
      'ribbon': 'ribbon-outline',
      'sparkles': 'sparkles-outline',
      'home': 'home-outline',
      'ellipsis-horizontal': 'ellipsis-horizontal-outline'
    };
    return iconMap[icon] || icon;
  };

  // Rendu d'un élément de catégorie
  const renderCategoryItem = ({ item }: { item: Category }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.categoryCard,
          { backgroundColor: theme.card },
        ]}
        onPress={() => {
          // Navigation vers CategoryScreen avec le nom de la catégorie
          router.push({
            pathname: '/screens/homeOption/CategoryScreen',
            params: { 
              categoryName: item.name,
              categoryId: item.id
            }
          });
        }}
      >
        <View style={[
          styles.categoryIcon,
          { 
            backgroundColor: colorScheme === 'dark' ? '#ffffff' : '#F7F7F7',
          }
        ]}>
          <Ionicons 
            name={getIconName(item.icon)} 
            size={20} 
            color={theme.tint} 
          />
        </View>
        <Text style={[
          styles.categoryName,
          { color: theme.text }
        ]}>
          {t(`categories.${item.name}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.section, { backgroundColor: theme.background }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('home.categories')}
        </Text>
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    minWidth: 80,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CategorySection;