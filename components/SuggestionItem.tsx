// components/SuggestionItem.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SearchSuggestion {
  id: string;
  type: 'recent' | 'trending' | 'category' | 'personal';
  title: string;
  subtitle?: string;
  icon?: string;
}

interface SuggestionItemProps {
  item: SearchSuggestion;
  onPress: (item: SearchSuggestion) => void;
  theme: {
    text: string;
    card: string;
    tabIconDefault: string;
    tint: string;
  };
  colorScheme: 'light' | 'dark';
}

// Composant optimisé avec React.memo pour éviter les re-rendus inutiles
const SuggestionItem = React.memo(({ 
  item, 
  onPress, 
  theme,
  colorScheme 
}: SuggestionItemProps) => {
  
  // Fonction pour déterminer la couleur de l'icône selon le type
  const getIconColor = () => {
    switch (item.type) {
      case 'recent':
        return theme.tabIconDefault;
      case 'trending':
        return '#FF3B30';
      case 'category':
        return '#34C759';
      case 'personal':
        return theme.tint;
      default:
        return theme.tabIconDefault;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.suggestionItem,
        { backgroundColor: theme.card }
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.suggestionIconContainer,
        { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
      ]}>
        <Ionicons 
          name={item.icon as any} 
          size={22} 
          color={getIconColor()} 
        />
      </View>
      
      <View style={styles.suggestionContent}>
        <Text style={[styles.suggestionTitle, { color: theme.text }]}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={[styles.suggestionSubtitle, { color: theme.tabIconDefault }]}>
            {item.subtitle}
          </Text>
        )}
      </View>
      
      <Ionicons 
        name="chevron-forward" 
        size={16} 
        color={theme.tabIconDefault} 
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginVertical: 2,
    borderRadius: 12,
  },
  suggestionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  suggestionSubtitle: {
    fontSize: 13,
    fontWeight: '400',
  },
});

export default SuggestionItem;