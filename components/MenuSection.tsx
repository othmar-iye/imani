// components/MenuSection.tsx
import React from 'react';
import { View } from 'react-native';

interface MenuSectionProps {
  children: React.ReactNode;
  backgroundColor: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  children,
  backgroundColor,
}) => {
  return (
    <View style={[{ backgroundColor }, { paddingHorizontal: 20, marginBottom: 20 }]}>
      {children}
    </View>
  );
};