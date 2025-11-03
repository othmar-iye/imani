// components/ImagePickerModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseFromGallery: () => void;
  colors: any;
  disabled?: boolean;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onTakePhoto,
  onChooseFromGallery,
  colors,
  disabled = false
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
        <Text style={[styles.modalTitle, { color: colors.text }]}>
          Ajouter une photo
        </Text>
        
        <TouchableOpacity 
          style={[styles.modalOption, { borderBottomColor: colors.border }]}
          onPress={onTakePhoto}
          disabled={disabled}
        >
          <Ionicons name="camera" size={24} color={colors.tint} />
          <Text style={[styles.modalOptionText, { color: colors.text }]}>
            Prendre une photo
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.modalOption, { borderBottomColor: colors.border }]}
          onPress={onChooseFromGallery}
          disabled={disabled}
        >
          <Ionicons name="images" size={24} color={colors.tint} />
          <Text style={[styles.modalOptionText, { color: colors.text }]}>
            Choisir depuis la galerie
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.modalCancel}
          onPress={onClose}
          disabled={disabled}
        >
          <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>
            Annuler
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  modalCancel: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});