// components/ImageGridComponent.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface SelectedImage {
  uri: string;
  id: string;
}

interface ImageGridProps {
  images: SelectedImage[];
  onRemoveImage: (id: string) => void;
  onAddMore: () => void;
  maxImages: number;
  colors: any;
  disabled?: boolean;
}

// Composant Skeleton pour les images en cours de chargement
const ImageSkeleton = ({ colors }: { colors: any }) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { 
        duration: 1000, 
        easing: Easing.ease 
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View 
      style={[
        styles.skeletonImage, 
        { 
          backgroundColor: colors.border,
          borderColor: colors.border 
        },
        animatedStyle
      ]} 
    />
  );
};

export const ImageGridComponent: React.FC<ImageGridProps> = ({
  images,
  onRemoveImage,
  onAddMore,
  maxImages,
  colors,
  disabled = false
}) => {
  const [loadedImages, setLoadedImages] = useState<{[key: string]: boolean}>({});

  // Fonction pour gérer le chargement de chaque image
  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => ({ ...prev, [imageId]: true }));
  };

  // Calcul simple du layout - PLUS RAPIDE que FlatList
  const imageSize = (width - 64) / 3; // 16px padding * 2 + 16px gaps

  return (
    <View style={styles.imagesGrid}>
      {/* Grille simple avec View - BEAUCOUP plus rapide */}
      <View style={styles.imagesContainer}>
        {images.map((image, index) => (
          <View key={image.id} style={[styles.imageContainer, { width: imageSize }]}>
            {/* Skeleton visible pendant le chargement */}
            {!loadedImages[image.id] && (
              <ImageSkeleton colors={colors} />
            )}
            
            {/* Image optimisée */}
            <Image 
              source={{ uri: image.uri }} 
              style={[
                styles.selectedImage,
                { opacity: loadedImages[image.id] ? 1 : 0 }
              ]}
              resizeMode="cover"
              onLoad={() => handleImageLoad(image.id)}
            />
            
            {/* Bouton supprimer */}
            <TouchableOpacity 
              style={[styles.removeButton, { backgroundColor: colors.tint }]}
              onPress={() => onRemoveImage(image.id)}
              disabled={disabled}
            >
              <Ionicons name="close" size={16} color="#FFF" />
            </TouchableOpacity>
            
            {/* Numéro de l'image */}
            <View style={[styles.imageNumber, { backgroundColor: colors.tint }]}>
              <Text style={styles.imageNumberText}>{index + 1}</Text>
            </View>
          </View>
        ))}
        
        {/* Bouton ajouter plus */}
        {images.length < maxImages && (
          <TouchableOpacity 
            style={[
              styles.addMoreButton, 
              { 
                borderColor: colors.border,
                width: imageSize
              }
            ]}
            onPress={onAddMore}
            disabled={disabled}
          >
            <Ionicons name="add" size={24} color={colors.textSecondary} />
            <Text style={[styles.addMoreText, { color: colors.textSecondary }]}>
              Ajouter
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imagesGrid: {
    marginTop: 8,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    marginBottom: 8,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  skeletonImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageNumber: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNumberText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  addMoreButton: {
    aspectRatio: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});