// components/SelectField.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  required?: boolean;
  disabled?: boolean;
  colors: any;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  placeholder,
  onPress,
  required = false,
  disabled = false,
  colors
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.selectButton,
        { 
          backgroundColor: colors.background,
          borderColor: colors.border,
          opacity: disabled ? 0.5 : 1
        }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.selectButtonText, 
        { color: value ? colors.text : colors.textSecondary }
      ]}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});