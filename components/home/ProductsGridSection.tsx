import ProductCard from '@/components/ProductCard';
import { Product } from '@/src/data/products';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductsGridSectionProps {
  products: Product[];
  theme: any;
  renderFooter: () => React.JSX.Element | null;
  handleLoadMore: () => void;
}

export const ProductsGridSection: React.FC<ProductsGridSectionProps> = ({
  products,
  theme,
  renderFooter,
  handleLoadMore,
}) => {
  const { t } = useTranslation();

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  return (
    <View style={[styles.section, { backgroundColor: theme.background }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('home.popularProducts')}
        </Text>
        <TouchableOpacity onPress={() => router.push('/screens/homeOption/AllProductsScreen')}>
          <Text style={[styles.seeAllText, { color: theme.tint }]}>
            {t('home.seeAll')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.productsGrid}
        columnWrapperStyle={styles.productsRow}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
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
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  productsGrid: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  productsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});