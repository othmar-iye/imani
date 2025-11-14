// components/FormInputGroup.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { useTranslation } from 'react-i18next';

interface FormInputGroupProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
  maxLength?: number;
  colors: any;
  characterCount?: boolean;
}

export const FormInputGroup: React.FC<FormInputGroupProps> = ({
  
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  multiline = false,
  maxLength,
  colors,
  characterCount = false
}) => {

  const { t } = useTranslation();
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
        {required && <Text style={[styles.requiredStar, { color: colors.tint }]}>*</Text>}
      </View>
      <TextInput
        style={[
          multiline ? styles.textArea : styles.textInput,
          { 
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.text 
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 6 : 1}
        textAlignVertical={multiline ? "top" : "center"}
        maxLength={maxLength}
      />
      {characterCount && maxLength && (
        <Text style={[styles.charCount, { color: colors.textSecondary }]}>
          {value.length}/{maxLength} {t('sell.characters', 'caractères')}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  requiredStar: {
    fontSize: 16,
    fontWeight: '700',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
});