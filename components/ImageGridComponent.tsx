// components/ImageGridComponent.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

export const ImageGridComponent: React.FC<ImageGridProps> = ({
  images,
  onRemoveImage,
  onAddMore,
  maxImages,
  colors,
  disabled = false
}) => {
  const renderImageItem = ({ item, index }: { item: SelectedImage; index: number }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.selectedImage} />
      <TouchableOpacity 
        style={[styles.removeButton, { backgroundColor: colors.tint }]}
        onPress={() => onRemoveImage(item.id)}
        disabled={disabled}
      >
        <Ionicons name="close" size={16} color="#FFF" />
      </TouchableOpacity>
      <View style={[styles.imageNumber, { backgroundColor: colors.tint }]}>
        <Text style={styles.imageNumberText}>{index + 1}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.imagesGrid}>
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={item => item.id}
        numColumns={3}
        scrollEnabled={false}
        contentContainerStyle={styles.imagesGridContent}
        columnWrapperStyle={styles.imagesRow}
      />
      
      {images.length < maxImages && (
        <TouchableOpacity 
          style={[styles.addMoreButton, { borderColor: colors.border }]}
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
  );
};

const styles = StyleSheet.create({
  imagesGrid: {
    marginTop: 8,
  },
  imagesGridContent: {
    paddingBottom: 16,
  },
  imagesRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    width: '32%',
    aspectRatio: 1,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
    width: '32%',
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