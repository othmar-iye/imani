import CustomButton from '@/components/CustomButton';
import { Theme } from '@/constants/theme';
import { categories } from '@/src/data/categories';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

// Composant Slider personnalisé simple - TYPES CORRIGÉS
const PriceSlider = ({ 
  min, 
  max, 
  value, 
  onValueChange, 
  colors 
}: { 
  min: number; 
  max: number; 
  value: [number, number]; // Tuple de 2 nombres
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // CORRIGÉ: Tuple
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string>('');

  // Mêmes couleurs que NotificationsScreen
 const colors = {
  background: isDark ? Theme.dark.background : Theme.light.background,
  card: isDark ? Theme.dark.card : Theme.light.card,
  text: isDark ? Theme.dark.text : Theme.light.text,
  textSecondary: isDark ? '#8E8E93' : '#666666',
  border: isDark ? Theme.dark.border : Theme.light.border,
  tint: isDark ? Theme.dark.tint : Theme.light.tint, // ✅ Maintenant cohérent
  success: isDark ? '#30D158' : '#34C759',
  warning: isDark ? '#FF9F0A' : '#FF9500',
  error: isDark ? '#FF453A' : '#FF3B30',
};

  // Villes du Haut-Katanga, RD Congo
  const allCities = [
    'Lubumbashi', 'Likasi', 'Kipushi', 'Kambove', 'Kakanda', 'Kinshasa',
    'Kasumbalesa', 'Mutoshi', 'Panda', 'Ruwe', 'Shinkolobwe', 'Goma',
    'Sakania', 'Ankoro', 'Bukama', 'Kamina', 'Malemba Nkulu', 'Matadi',
    'Nyunzu', 'Kabondo Dianda', 'Kazembe', 'Moba', 'Mwana Muyombo', 'Pweto'
  ];

  // Conditions des produits
  const conditions = [
    { id: 'new', label: 'Neuf', icon: 'sparkles' },
    { id: 'like-new', label: 'Comme neuf', icon: 'diamond' },
    { id: 'good', label: 'Bon état', icon: 'checkmark-circle' },
    { id: 'fair', label: 'État correct', icon: 'build' }
  ];

  // Filtrer les villes basé sur la recherche
  const filteredCities = allCities.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pour avoir seulement les noms des catégories principales
  const categoryNames = categories.map(cat => cat.name);
  const sortOptions = [
    { id: 'popular', label: 'Populaire' },
    { id: 'newest', label: 'Plus récent' },
    { id: 'price-low', label: 'Prix croissant' },
    { id: 'price-high', label: 'Prix décroissant' },
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const selectCity = (city: string) => {
    setSelectedCity(city);
    setSearchQuery(city);
    setShowCityDropdown(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]); // CORRIGÉ: Tuple
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

  // CORRIGÉ: Typage correct pour la fonction
  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
  };

  // CORRIGÉ: Typage correct pour les options rapides
  const handleQuickPriceSelect = (range: [number, number]) => {
    setPriceRange(range);
  };

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    // Construire les paramètres de filtre
    const filterParams: any = {
      searchType: 'filter'
    };

    // Ajouter les catégories si sélectionnées
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header avec back button */}
      <View style={[styles.header, { borderBottomColor: Theme.light.borderInput }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={Theme.light.tint} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Filtres
          </Text>
        </View>
        
        <TouchableOpacity onPress={resetFilters}>
          <Text style={[styles.clearAll, { color: Theme.light.tint }]}>
            Réinitialiser
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Localisation - Ville avec recherche */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Localisation
            </Text>
            <Text style={[styles.locationSubtitle, { color: Theme.light.tint }]}>
              Haut-Katanga, RD Congo
            </Text>
          </View>
          
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Recherchez votre ville pour voir les annonces locales
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
              placeholder="Rechercher une ville..."
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
                  {filteredCities.length} ville(s) trouvée(s)
                </Text>
              </View>
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {filteredCities.map(city => (
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
                Ville sélectionnée: {selectedCity}
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
                Villes populaires
              </Text>
              <View style={styles.popularCitiesContainer}>
                {['Lubumbashi', 'Likasi', 'Kipushi', 'Kamina'].map(city => (
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

        {/* Catégories */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Catégories</Text>
          <View style={styles.categoriesContainer}>
            {categoryNames.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  { 
                    backgroundColor: selectedCategories.includes(category) ? Theme.light.tint : colors.card,
                    borderColor: Theme.light.borderInput,
                    shadowColor: isDark ? '#000' : '#8E8E93',
                  }
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategories.includes(category) ? '#FFF' : colors.text }
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trier par */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trier par</Text>
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

        {/* Fourchette de prix FONCTIONNELLE */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Fourchette de prix
          </Text>
          <Text style={[styles.priceRangeText, { color: Theme.light.tint, fontWeight: '700' }]}>
            ${priceRange[0]} - ${priceRange[1]}
          </Text>
          
          {/* Slider personnalisé - CORRIGÉ: value est maintenant un tuple */}
          <PriceSlider 
            min={0}
            max={1000}
            value={priceRange}
            onValueChange={handlePriceChange}
            colors={colors}
          />
          
          {/* Options de prix rapides - CORRIGÉ: tuples explicites */}
          <View style={styles.quickPriceContainer}>
            {[
              { label: 'Moins de $50', range: [0, 50] as [number, number] },
              { label: '$50-$100', range: [50, 100] as [number, number] },
              { label: '$100-$500', range: [100, 500] as [number, number] },
              { label: 'Plus de $500', range: [500, 1000] as [number, number] }
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

        {/* Condition FONCTIONNELLE */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Condition</Text>
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
      <View style={[styles.footer, { backgroundColor: 'colors.card', borderColor: Theme.light.borderInput }]}>

        <CustomButton
            title="Tout effacer"
            onPress={resetFilters}
            variant="secondary"
            size="large"
        />

        <CustomButton
            title={"Appliquer"}
            onPress={applyFilters}
            variant="primary"
            size="large"
        />
      </View>
    </SafeAreaView>
  );
}

// Les styles restent identiques...
const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
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
  clearAll: { 
    fontSize: 16, 
    fontWeight: '500' 
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
  resetButton: { 
    flex: 1, 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    alignItems: 'center' 
  },
  resetText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  applyButton: { 
    flex: 2, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  applyText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});