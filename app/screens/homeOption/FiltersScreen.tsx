import CustomButton from '@/components/CustomButton';
import { Header } from '@/components/Header';
import { Theme } from '@/constants/theme';
import { categories } from '@/src/data/categories';
import { allCities as allCitiesRDC, majorCities } from '@/src/data/cities';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Composant Slider personnalisé simple
const PriceSlider = ({ 
  min, 
  max, 
  value, 
  onValueChange, 
  colors 
}: { 
  min: number; 
  max: number; 
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  colors: any;
}) => {
  const percentageMin = ((value[0] - min) / (max - min)) * 100;
  const percentageMax = ((value[1] - min) / (max - min)) * 100;

  return (
    <View style={styles.sliderContainer}>
      <View style={[styles.sliderTrack, { backgroundColor: Theme.light.borderInput }]}>
        <View 
          style={[
            styles.sliderRange, 
            { 
              backgroundColor: Theme.light.tint,
              left: `${percentageMin}%`,
              width: `${percentageMax - percentageMin}%`
            }
          ]} 
        />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={[styles.sliderLabel, { color: colors.text }]}>${min}</Text>
        <Text style={[styles.sliderLabel, { color: colors.text }]}>${max}</Text>
      </View>
    </View>
  );
};

export default function FiltersScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string>('');

  // Couleurs
  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
    success: isDark ? '#30D158' : '#34C759',
    warning: isDark ? '#FF9F0A' : '#FF9500',
    error: isDark ? '#FF453A' : '#FF3B30',
  };

  // Conditions des produits
  const conditions = [
    { id: 'new', label: t('filters.condition.new'), icon: 'sparkles' },
    { id: 'like-new', label: t('filters.condition.likeNew'), icon: 'diamond' },
    { id: 'good', label: t('filters.condition.good'), icon: 'checkmark-circle' },
    { id: 'fair', label: t('filters.condition.fair'), icon: 'build' }
  ];

  // SIMPLIFICATION : Utiliser directement les noms des catégories
  const categoryNames = categories.map(cat => ({
    id: cat.id,
    name: cat.name, // Nom réel de la catégorie
  }));

  // Options de tri
  const sortOptions = [
    { id: 'popular', label: t('filters.sort.popular') },
    { id: 'newest', label: t('filters.sort.newest') },
    { id: 'price-low', label: t('filters.sort.priceLow') },
    { id: 'price-high', label: t('filters.sort.priceHigh') },
  ];

  // Filtrer les villes basé sur la recherche
  const filteredCities = allCitiesRDC.filter((city: string) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (categoryKey: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryKey)
        ? prev.filter(c => c !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const selectCity = (city: string) => {
    setSelectedCity(city);
    setSearchQuery(city);
    setShowCityDropdown(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setSelectedSort('popular');
    setSelectedCity('');
    setSearchQuery('');
    setShowCityDropdown(false);
    setSelectedCondition('');
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowCityDropdown(true);
    if (text === '') {
      setSelectedCity('');
    }
  };

  const clearCitySelection = () => {
    setSelectedCity('');
    setSearchQuery('');
    setShowCityDropdown(false);
  };

  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
  };

  const handleQuickPriceSelect = (range: [number, number]) => {
    setPriceRange(range);
  };

  // SIMPLIFICATION : Fonction pour appliquer les filtres
  const applyFilters = () => {
    // Construire les paramètres de filtre
    const filterParams: any = {
      searchType: 'filter'
    };

    // SIMPLIFICATION : Utiliser directement les noms des catégories
    if (selectedCategories.length > 0) {
      filterParams.categoryNames = selectedCategories.join(',');
    }

    // Ajouter la fourchette de prix
    filterParams.minPrice = priceRange[0].toString();
    filterParams.maxPrice = priceRange[1].toString();

    // Ajouter le tri
    filterParams.sort = selectedSort;

    // Ajouter la ville si sélectionnée
    if (selectedCity) {
      filterParams.city = selectedCity;
    }

    // Ajouter la condition si sélectionnée
    if (selectedCondition) {
      filterParams.condition = selectedCondition;
    }

    console.log('Filtres appliqués new :', filterParams);

    // Rediriger vers l'écran des résultats de filtres
    router.push({
      pathname: '/screens/homeOption/FilterResultsScreen',
      params: filterParams
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header avec back button - SANS customPaddingTop */}
      <Header
        colors={colors}
        title={t('filters.title')}
        showBackButton={true}
        rightAction={{
          label: t('filters.reset'),
          onPress: resetFilters
        }}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Localisation - Ville avec recherche */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('filters.location.title')}
            </Text>
            <Text style={[styles.locationSubtitle, { color: Theme.light.tint }]}>
              {t('filters.location.subtitle')}
            </Text>
          </View>
          
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {t('filters.location.description')}
          </Text>

          {/* Barre de recherche de ville */}
          <View style={[
            styles.searchContainer, 
            { 
              backgroundColor: colors.card,
              borderColor: showCityDropdown ? Theme.light.tint : Theme.light.borderInput,
              shadowColor: isDark ? '#000' : '#8E8E93',
            }
          ]}>
            <Ionicons 
              name="search" 
              size={20} 
              color={colors.textSecondary} 
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('filters.location.searchPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={() => setShowCityDropdown(true)}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={clearCitySelection}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Liste déroulante des villes */}
          {showCityDropdown && filteredCities.length > 0 && (
            <View style={[
              styles.dropdownContainer,
              { 
                backgroundColor: colors.card,
                borderColor: Theme.light.borderInput,
                shadowColor: isDark ? '#000' : '#8E8E93',
              }
            ]}>
              <View style={[styles.dropdownHeader, { borderBottomColor: Theme.light.borderInput }]}>
                <Text style={[styles.dropdownHeaderText, { color: colors.textSecondary }]}>
                  {t('filters.location.citiesFound', { count: filteredCities.length })}
                </Text>
              </View>
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {filteredCities.map((city: string) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.cityDropdownItem,
                      { 
                        backgroundColor: colors.card,
                        borderBottomColor: Theme.light.borderInput,
                      }
                    ]}
                    onPress={() => selectCity(city)}
                  >
                    <Ionicons 
                      name="location-outline" 
                      size={18} 
                      color={Theme.light.tint} 
                      style={styles.cityItemIcon}
                    />
                    <Text style={[styles.cityDropdownText, { color: colors.text }]}>
                      {city}
                    </Text>
                    {selectedCity === city && (
                      <Ionicons name="checkmark" size={18} color={Theme.light.tint} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Ville sélectionnée affichée */}
          {selectedCity && (
            <View style={[styles.selectedCityContainer, { backgroundColor: Theme.light.tint }]}>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={styles.selectedCityText}>
                {t('filters.location.selectedCity', { city: selectedCity })}
              </Text>
              <TouchableOpacity onPress={clearCitySelection}>
                <Ionicons name="close" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Villes populaires (suggestions) */}
          {!selectedCity && !showCityDropdown && (
            <View style={styles.popularCitiesSection}>
              <Text style={[styles.popularCitiesTitle, { color: colors.textSecondary }]}>
                {t('filters.location.popularCities')}
              </Text>
              <View style={styles.popularCitiesContainer}>
                {majorCities.slice(0, 6).map((city: string) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.popularCityChip,
                      { 
                        backgroundColor: colors.card,
                        borderColor: Theme.light.borderInput,
                      }
                    ]}
                    onPress={() => selectCity(city)}
                  >
                    <Ionicons name="location-outline" size={14} color={Theme.light.tint} />
                    <Text style={[styles.popularCityText, { color: colors.text }]}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Catégories SIMPLIFIÉES */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('filters.categories.title')}
          </Text>
          <View style={styles.categoriesContainer}>
            {categoryNames.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  { 
                    backgroundColor: selectedCategories.includes(category.name) ? Theme.light.tint : colors.card,
                    borderColor: Theme.light.borderInput,
                    shadowColor: isDark ? '#000' : '#8E8E93',
                  }
                ]}
                onPress={() => toggleCategory(category.name)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategories.includes(category.name) ? '#FFF' : colors.text }
                ]}>
                  {t(`categories.${category.name}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trier par */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('filters.sort.title')}
          </Text>
          {sortOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortOption, 
                { 
                  backgroundColor: colors.card,
                  shadowColor: isDark ? '#000' : '#8E8E93',
                }
              ]}
              onPress={() => setSelectedSort(option.id)}
            >
              <Text style={[styles.sortText, { color: colors.text }]}>{option.label}</Text>
              {selectedSort === option.id && (
                <Ionicons name="checkmark" size={20} color={Theme.light.tint} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Fourchette de prix */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('filters.price.title')}
          </Text>
          <Text style={[styles.priceRangeText, { color: Theme.light.tint, fontWeight: '700' }]}>
            ${priceRange[0]} - ${priceRange[1]}
          </Text>
          
          <PriceSlider 
            min={0}
            max={10000}
            value={priceRange}
            onValueChange={handlePriceChange}
            colors={colors}
          />
          
          <View style={styles.quickPriceContainer}>
            {[
              { label: t('filters.price.lessThan50'), range: [0, 50] as [number, number] },
              { label: t('filters.price.50to100'), range: [50, 100] as [number, number] },
              { label: t('filters.price.100to500'), range: [100, 500] as [number, number] },
              { label: t('filters.price.moreThan500'), range: [500, 10000] as [number, number] }
            ].map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickPriceButton,
                  { 
                    backgroundColor: 
                      priceRange[0] === option.range[0] && priceRange[1] === option.range[1] 
                        ? Theme.light.tint 
                        : colors.card,
                    borderColor: Theme.light.borderInput,
                  }
                ]}
                onPress={() => handleQuickPriceSelect(option.range)}
              >
                <Text style={[
                  styles.quickPriceText,
                  { 
                    color: 
                      priceRange[0] === option.range[0] && priceRange[1] === option.range[1] 
                        ? '#FFF' 
                        : colors.text 
                  }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Condition */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('filters.condition.title')}
          </Text>
          <View style={styles.conditionContainer}>
            {conditions.map(condition => (
              <TouchableOpacity
                key={condition.id}
                style={[
                  styles.conditionChip,
                  { 
                    backgroundColor: selectedCondition === condition.id ? Theme.light.tint : colors.card,
                    borderColor: Theme.light.borderInput,
                    shadowColor: isDark ? '#000' : '#8E8E93',
                  }
                ]}
                onPress={() => setSelectedCondition(condition.id)}
              >
                <Ionicons 
                  name={condition.icon as any} 
                  size={16} 
                  color={selectedCondition === condition.id ? '#FFF' : Theme.light.tint} 
                />
                <Text style={[
                  styles.conditionText,
                  { color: selectedCondition === condition.id ? '#FFF' : colors.text }
                ]}>
                  {condition.label}
                </Text>
                {selectedCondition === condition.id && (
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer avec boutons */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderColor: Theme.light.borderInput }]}>

        <CustomButton
            title={t('filters.clearAll')}
            onPress={resetFilters}
            variant="secondary"
            size="large"
        />

        <CustomButton
            title={t('filters.apply')}
            onPress={applyFilters}
            variant="primary"
            size="large"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scrollView: { 
    flex: 1, 
    padding: 20 
  },
  section: { 
    marginBottom: 30 
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600',
    marginBottom: 15, 
  },
  locationSubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 8,
  },
  dropdownContainer: {
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 200,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  dropdownList: {
    maxHeight: 150,
  },
  dropdownHeader: {
    padding: 12,
    borderBottomWidth: 1,
  },
  dropdownHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cityDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  cityItemIcon: {
    marginRight: 12,
  },
  cityDropdownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  selectedCityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 10,
  },
  selectedCityText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  popularCitiesSection: {
    marginTop: 10,
  },
  popularCitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  popularCitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularCityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  popularCityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoriesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10 
  },
  categoryChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: { 
    fontSize: 14, 
    fontWeight: '500' 
  },
  sortOption: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    
    borderColor: Theme.light.borderInput,
    borderWidth: 1,
                  
  },
  sortText: { 
    fontSize: 16 
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    marginBottom: 10,
    position: 'relative',
  },
  sliderRange: {
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 0,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  priceRangeText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  quickPriceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 15,
  },
  quickPriceButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickPriceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  conditionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  conditionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    flex: 1,
    minWidth: '45%',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  footer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20, 
    borderTopWidth: 1,
    gap: 12 
  },
});