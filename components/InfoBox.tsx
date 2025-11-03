// components/InfoBox.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

interface InfoBoxProps {
  icon: string;
  message: string;
  colors: any;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  icon,
  message,
  colors
}) => {
  return (
    <View style={[styles.infoBox, { backgroundColor: colors.background }]}>
      <Ionicons name={icon as any} size={20} color={colors.tint} />
      <Text style={[styles.infoText, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
});