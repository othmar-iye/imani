import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

interface SearchSuggestion {
  id: string;
  type: 'recent' | 'trending' | 'category' | 'personal';
  title: string;
  subtitle?: string;
  icon?: string;
}

interface SearchSpotlightModalProps {
  visible: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredSuggestions: SearchSuggestion[];
  theme: any;
  colorScheme: 'light' | 'dark';
  handleCancelPress: () => void;
  handleSearchSubmit: () => void;
  handleSuggestionPress: (suggestion: SearchSuggestion) => void;
  renderSuggestionItem: ({ item }: { item: SearchSuggestion }) => React.JSX.Element;
}

export const SearchSpotlightModal: React.FC<SearchSpotlightModalProps> = ({
  visible,
  searchQuery,
  setSearchQuery,
  filteredSuggestions,
  theme,
  colorScheme,
  handleCancelPress,
  handleSearchSubmit,
  handleSuggestionPress,
  renderSuggestionItem,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancelPress}
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={handleCancelPress}>
          <View style={[
            styles.overlay,
            { 
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(0,0,0,0.85)' 
                : 'rgba(0,0,0,0.7)',
            }
          ]} />
        </TouchableWithoutFeedback>
        
        <View style={styles.spotlightContainer}>
          <View style={styles.spotlightHeader}>
            <View style={[
              styles.spotlightSearchContainer,
              { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF' }
            ]}>
              <Ionicons name="search" size={20} color={theme.tint} style={styles.spotlightSearchIcon} />
              
              <TextInput
                style={[styles.spotlightSearchInput, { color: theme.text }]}
                placeholder={t('home.searchPlaceholder')}
                placeholderTextColor={theme.tabIconDefault}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />
              
              <TouchableOpacity onPress={handleCancelPress} style={styles.cancelButton}>
                <Text style={[styles.cancelText, { color: theme.tint }]}>
                  {t('home.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[
            styles.suggestionsContainer,
            { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' }
          ]}>
            {filteredSuggestions.length > 0 ? (
              <FlatList
                data={filteredSuggestions}
                renderItem={renderSuggestionItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={48} color={theme.tabIconDefault} />
                <Text style={[styles.noResultsText, { color: theme.tabIconDefault }]}>
                  {t('home.noResults')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  spotlightContainer: {
    flex: 1,
    paddingTop: 60,
  },
  spotlightHeader: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  spotlightSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  spotlightSearchIcon: {
    marginRight: 12,
  },
  spotlightSearchInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    paddingVertical: 4,
  },
  cancelButton: {
    marginLeft: 12,
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '500',
  },
  suggestionsContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  suggestionsList: {
    paddingVertical: 8,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
  },
});