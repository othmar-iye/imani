// components/OptimizedImage.tsx
import { getSignedUrl } from '@/src/services/ImageService';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';

interface OptimizedImageProps {
  source: string;
  style: any;
  isProfile?: boolean;
  colors: {
    textSecondary: string;
    tint: string;
  };
  t: (key: string) => string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  source, 
  style, 
  isProfile = false, 
  colors,
  t 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSource, setImageSource] = useState(source);

  const refreshUrl = async () => {
    if (source && source.includes('supabase.co')) {
      const newUrl = await getSignedUrl(source);
      if (newUrl && newUrl !== source) {
        setImageSource(newUrl);
        setHasError(false);
        setIsLoading(true);
      }
    }
  };

  useEffect(() => {
    setImageSource(source);
    setIsLoading(true);
    setHasError(false);
  }, [source]);

  if (hasError) {
    return (
      <View style={[style, styles.imageErrorContainer]}>
        <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
        <Text style={[styles.imageErrorText, { color: colors.textSecondary }]}>
          {t('imageNotLoaded')}
        </Text>
        <CustomButton
          title={t('retry')}
          onPress={refreshUrl}
          variant="primary"
          size="small"
        />
      </View>
    );
  }

  return (
    <View style={style}>
      {isLoading && (
        <View style={[styles.imagePlaceholder, style]}>
          <Ionicons name="image" size={20} color={colors.textSecondary} />
        </View>
      )}
      <Image 
        source={{ uri: imageSource }} 
        style={[
          style, 
          { 
            position: 'absolute',
            opacity: isLoading ? 0 : 1 
          }
        ]}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => {
          console.log('✅ Image chargée:', imageSource);
          setIsLoading(false);
        }}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          console.log('❌ Erreur chargement image:', imageSource);
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  imageErrorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  imageErrorText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 8,
  },
});