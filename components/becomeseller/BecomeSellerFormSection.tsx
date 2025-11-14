// components/BecomeSellerFormSection.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProfileFormSectionProps {
  section: {
    title: string;
    items: any[];
  };
  colors: {
    text: string;
    card: string;
  };
  renderProfileItem: (item: any, index: number, isLast: boolean) => React.ReactNode;
}

export const ProfileFormSection: React.FC<ProfileFormSectionProps> = ({
  section,
  colors,
  renderProfileItem,
}) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {section.title}
      </Text>
      
      <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        {section.items.map((item, itemIndex) => 
          renderProfileItem(item, itemIndex, itemIndex === section.items.length - 1)
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
  },
});