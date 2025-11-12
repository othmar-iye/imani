import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface SearchBarProps {
  onPress: () => void;
  theme: any;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onPress, theme }) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.searchSection, { backgroundColor: theme.background }]}>
      <TouchableOpacity 
        style={[styles.searchContainer, { 
          backgroundColor: colorScheme === 'dark' ? theme.card : '#eee',
          borderColor: Theme.light.borderInput
        }]}
        onPress={onPress}
      >
        <Ionicons name="search" size={18} color={Theme.light.border} style={styles.searchIcon} />
        <Text style={[styles.searchPlaceholder, { color: Theme.light.border }]}>
          {t('home.searchPlaceholder')}
        </Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => router.push('/screens/homeOption/FiltersScreen')}
        >
          <Ionicons name="options-outline" size={22} color={Theme.light.border} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    padding: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    fontWeight: '500',
  },
  filterButton: {
    padding: 6,
  },
});