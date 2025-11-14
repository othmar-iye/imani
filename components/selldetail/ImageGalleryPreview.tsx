// components/ImageGalleryPreview.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface SelectedImage {
  uri: string;
  id: string;
}

interface ImageGalleryPreviewProps {
  images: SelectedImage[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  colors: any;
}

export const ImageGalleryPreview: React.FC<ImageGalleryPreviewProps> = ({
  images,
  selectedImageIndex,
  onSelectImage,
  onNextImage,
  onPrevImage,
  colors
}) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('sell.photosPreview', 'Aperçu des photos')} ({images.length}/5)
      </Text>
      
      {/* Image principale avec navigation */}
      <View style={styles.mainImageContainer}>
        <Image
          source={{ uri: images[selectedImageIndex].uri }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        
        {/* Indicateur de navigation si plusieurs images */}
        {images.length > 1 && (
          <>
            {/* Bouton précédent */}
            <TouchableOpacity 
              style={[styles.navButton, styles.prevButton]}
              onPress={onPrevImage}
            >
              <Ionicons name="chevron-back" size={24} color="#FFF" />
            </TouchableOpacity>
            
            {/* Bouton suivant */}
            <TouchableOpacity 
              style={[styles.navButton, styles.nextButton]}
              onPress={onNextImage}
            >
              <Ionicons name="chevron-forward" size={24} color="#FFF" />
            </TouchableOpacity>
            
            {/* Indicateur de position */}
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1}/{images.length}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Miniatures des images */}
      {images.length > 1 && (
        <View style={styles.thumbnailsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsScroll}
          >
            {images.map((image, index) => (
              <TouchableOpacity
                key={image.id}
                style={[
                  styles.thumbnail,
                  { 
                    borderColor: index === selectedImageIndex ? colors.tint : colors.border,
                    borderWidth: index === selectedImageIndex ? 2 : 1
                  }
                ]}
                onPress={() => onSelectImage(index)}
              >
                <Image
                  source={{ uri: image.uri }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
                {index === selectedImageIndex && (
                  <View style={[styles.thumbnailOverlay, { backgroundColor: colors.tint }]}>
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Message informatif */}
      <View style={[styles.infoBox, { backgroundColor: colors.background }]}>
        <Ionicons name="information-circle-outline" size={20} color={colors.tint} />
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          {t('sell.photosInfo', 'Ces photos seront affichées dans votre annonce. La première image sera la photo principale.')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
    borderRadius: 12,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  mainImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 1,
    backgroundColor: '#f8f8f8',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 12,
  },
  nextButton: {
    right: 12,
  },
  imageCounter: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailsContainer: {
    marginTop: 12,
  },
  thumbnailsScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
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