// components/ProductFormSection.tsx
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

interface ProductFormSectionProps {
  title: string;
  children: React.ReactNode;
  colors: any;
}

export const ProductFormSection: React.FC<ProductFormSectionProps> = ({
  title,
  children,
  colors
}) => {
  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
    borderRadius: 12,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
});