// components/ProfilePictureSection.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ImageUploader } from './ImageUploader';

interface ProfilePictureSectionProps {
  profilePicture: string | null;
  onImagePicker: () => void;
  onRemovePicture: () => void;
  colors: {
    card: string;
    text: string;
    border: string;
    textSecondary: string;
    tint: string;
  };
  t: (key: string) => string;
}

export const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  profilePicture,
  onImagePicker,
  onRemovePicture,
  colors,
  t
}) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('profilePicture')}
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        <ImageUploader
          value={profilePicture}
          onPress={onImagePicker}
          isProfilePicture={true}
          colors={colors}
          t={t}
          onRemove={onRemovePicture}
        />
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