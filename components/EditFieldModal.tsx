// components/EditFieldModal.tsx
import CustomButton from '@/components/CustomButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface EditFieldModalProps {
  editingField: string | null;
  tempValue: string;
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
  onTextChange: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditFieldModal: React.FC<EditFieldModalProps> = ({
  editingField,
  tempValue,
  colors,
  onTextChange,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();

  if (!editingField) return null;

  const getPlaceholder = () => {
    switch (editingField) {
      case 'phoneNumber': return t('phonePlaceholder', '+243 81 234 5678');
      case 'birthDate': return t('datePlaceholder', 'JJ/MM/AAAA');
      case 'address': return t('enterAddress', 'Votre adresse complète');
      case 'identityNumber': return t('enterIdentityNumber', 'Numéro de la pièce');
      default: return '';
    }
  };

  const getKeyboardType = () => {
    switch (editingField) {
      case 'phoneNumber': return 'phone-pad';
      case 'birthDate': return 'numeric';
      default: return 'default';
    }
  };

  const getMaxLength = () => {
    switch (editingField) {
      case 'phoneNumber': return 17;
      case 'birthDate': return 10;
      default: return undefined;
    }
  };

  const getEditTitle = () => {
    switch (editingField) {
      case 'phoneNumber': return t('editPhoneNumber', 'Modifier le numéro de téléphone');
      case 'birthDate': return t('editBirthDate', 'Modifier la date de naissance');
      case 'address': return t('editAddress', 'Modifier l\'adresse');
      case 'identityNumber': return t('editIdentityNumber', 'Modifier le numéro de pièce');
      default: return '';
    }
  };

  return (
    <View style={[styles.editModal, { backgroundColor: colors.background }]}>
      <View style={[styles.editContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.editTitle, { color: colors.text }]}>
          {getEditTitle()}
        </Text>
        
        <TextInput
          style={[styles.editInput, { 
            color: colors.text, 
            borderColor: colors.border,
            backgroundColor: colors.background 
          }]}
          value={tempValue}
          onChangeText={onTextChange}
          placeholder={getPlaceholder()}
          placeholderTextColor={colors.textSecondary}
          keyboardType={getKeyboardType()}
          maxLength={getMaxLength()}
          autoFocus
        />

        {editingField === 'phoneNumber' && (
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t('phoneFormat', 'Format: +243 XX XXX XXXX (13 caractères)')}
          </Text>
        )}

        {editingField === 'birthDate' && (
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t('dateFormat', 'Format: JJ/MM/AAAA')}
          </Text>
        )}
        
        <View style={styles.editButtons}>
          <CustomButton
            title={t('cancel', 'Annuler')}
            onPress={onCancel}
            variant="primary"
            size="medium"
            style={StyleSheet.flatten([
                  styles.editButton, 
                  { backgroundColor: colors.border }
              ])}
          />
          <CustomButton
            title={t('save', 'Enregistrer')}
            onPress={onSave}
            variant="primary"
            size="medium"
            style={styles.editButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  editContainer: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
});