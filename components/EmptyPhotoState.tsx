// components/EmptyPhotoState.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface EmptyPhotoStateProps {
  onAddPhoto: () => void;
  colors: any;
  disabled?: boolean;
}

export const EmptyPhotoState: React.FC<EmptyPhotoStateProps> = ({
  onAddPhoto,
  colors,
  disabled = false
}) => (
  <TouchableOpacity 
    style={[styles.addPhotoButton, { borderColor: colors.border }]}
    onPress={onAddPhoto}
    disabled={disabled}
  >
    <Ionicons name="camera" size={48} color={colors.textSecondary} />
    <Text style={[styles.addPhotoText, { color: colors.textSecondary }]}>
      Ajouter une photo
    </Text>
    <Text style={[styles.addPhotoSubtext, { color: colors.textSecondary }]}>
      Maximum 5 photos
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  addPhotoButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  addPhotoSubtext: {
    fontSize: 14,
  },
});