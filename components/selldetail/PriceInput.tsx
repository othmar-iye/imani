// components/PriceInput.tsx
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

interface PriceInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  colors: any;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChangeText,
  placeholder,
  colors
}) => {
  const formatPrice = (text: string) => {
    // Remplacer les virgules par des points
    let formatted = text.replace(',', '.');
    
    // Garder seulement les chiffres et un point décimal
    formatted = formatted.replace(/[^0-9.]/g, '');
    
    // Éviter plusieurs points décimaux
    const parts = formatted.split('.');
    if (parts.length > 2) {
      formatted = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limiter à 2 décimales
    if (parts.length === 2 && parts[1].length > 2) {
      formatted = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return formatted;
  };

  return (
    <View style={styles.priceContainer}>
      <TextInput
        style={[
          styles.priceInput,
          { 
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.text 
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={(text) => onChangeText(formatPrice(text))}
        keyboardType="decimal-pad"
      />
      <Text style={[styles.currency, { color: colors.textSecondary }]}>
        USD
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
  },
});