// components/ImageUploader.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OptimizedImage } from './OptimizedImage';

interface ImageUploaderProps {
  value: string | null;
  onPress: () => void;
  isProfilePicture?: boolean;
  colors: {
    border: string;
    textSecondary: string;
    tint: string;
  };
  t: (key: string) => string;
  onRemove?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  value, 
  onPress, 
  isProfilePicture = false, 
  colors,
  t,
  onRemove
}) => {
  const hasImage = value !== null;
  
  return (
    <TouchableOpacity
      style={[
        styles.uploadContainer, 
        { borderColor: colors.border },
        isProfilePicture && styles.profilePictureContainer
      ]}
      onPress={onPress}
    >
      {hasImage ? (
        <View style={[
          styles.imagePreviewContainer,
          isProfilePicture && styles.profileImageContainer
        ]}>
          <OptimizedImage 
            source={value}
            style={[
              styles.previewImage,
              isProfilePicture && styles.profileImage
            ]}
            isProfile={isProfilePicture}
            colors={colors}
            t={t}
          />
          <TouchableOpacity 
            style={[styles.removeButton, { backgroundColor: colors.tint }]}
            onPress={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
          >
            <Ionicons name="close" size={16} color="#FFF" />
          </TouchableOpacity>
          <View style={[styles.checkBadge, { backgroundColor: '#34C759' }]}>
            <Ionicons name="checkmark" size={12} color="#FFF" />
          </View>
        </View>
      ) : (
        <View style={isProfilePicture ? styles.profileUploadPlaceholder : styles.uploadPlaceholder}>
          <Ionicons 
            name="camera" 
            size={isProfilePicture ? 32 : 24} 
            color={colors.textSecondary} 
          />
          <Text style={[
            styles.uploadText, 
            { color: colors.textSecondary },
            isProfilePicture && styles.profileUploadText
          ]}>
            {isProfilePicture ? t('uploadProfilePicture') : t('uploadIdentityDocument')}
          </Text>
          {!isProfilePicture && (
            <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>
              {t('tapToUpload')}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    padding: 0,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileUploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  profileUploadText: {
    fontSize: 12,
    marginTop: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  profileImage: {
    borderRadius: 60,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});