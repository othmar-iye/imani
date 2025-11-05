// components/SellSkeleton.tsx
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface SellSkeletonProps {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
  mode?: 'seller' | 'non-seller' | 'loading'; // Différents états du skeleton
}

export const SellSkeleton: React.FC<SellSkeletonProps> = ({ 
  colors, 
  mode = 'loading'
}) => {
  const isDark = useColorScheme() === 'dark';
  
  // Animation améliorée
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { 
        duration: 1200, 
        easing: Easing.inOut(Easing.ease)
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

  const AnimatedSkeletonBox = ({ 
    width, 
    height, 
    borderRadius = 8,
    style,
    variant = 'default'
  }: { 
    width: number | string; 
    height: number; 
    borderRadius?: number;
    style?: any;
    variant?: 'default' | 'strong' | 'card';
  }) => {
    const skeletonColors = {
      dark: {
        default: '#2A2A2A',
        strong: '#333333',
        card: '#2D2D2D'
      },
      light: {
        default: '#E8ECF0',
        strong: '#D1D9E0',
        card: '#F8F9FA'
      }
    };

    const colorVariant = variant === 'card' ? 'card' : (variant === 'strong' ? 'strong' : 'default');

    return (
      <Animated.View 
        style={[
          styles.skeletonBox, 
          { 
            width, 
            height, 
            borderRadius,
            backgroundColor: isDark 
              ? skeletonColors.dark[colorVariant]
              : skeletonColors.light[colorVariant],
          },
          animatedStyle,
          style
        ]}
      />
    );
  };

  // SKELETON POUR STATUT VENDEUR (écran normal de vente)
  const renderSellerSkeleton = () => (
    <View style={styles.content}>
      {/* Section photos - exactement comme le vrai design */}
      <View style={[styles.photoSection, { backgroundColor: colors.card }]}>
        {/* Titre "Photos" */}
        <AnimatedSkeletonBox 
          width={80} 
          height={22} 
          borderRadius={6} 
          style={{ marginBottom: 20 }}
          variant="strong"
        />
        
        {/* Zone de dépôt de photos - grande carte avec bordure en pointillés */}
        <View style={[styles.photoDropZone, { borderColor: colors.border }]}>
          <AnimatedSkeletonBox 
            width={60} 
            height={60} 
            borderRadius={30} 
            variant="strong"
          />
          <AnimatedSkeletonBox 
            width={180} 
            height={18} 
            borderRadius={6} 
            style={{ marginTop: 12, marginBottom: 8 }}
            variant="default"
          />
          <AnimatedSkeletonBox 
            width={220} 
            height={14} 
            borderRadius={4} 
            variant="default"
          />
        </View>
        
        {/* Bouton "Ajouter des photos" */}
        <AnimatedSkeletonBox 
          width="100%" 
          height={50} 
          borderRadius={12} 
          style={{ marginTop: 20 }}
          variant="strong"
        />
      </View>
    </View>
  );

  // SKELETON POUR STATUT NON-VENDEUR
  const renderNonSellerSkeleton = () => (
    <View style={styles.content}>
      {/* Carte de statut - reproduction exacte de SellerStatusCard */}
      <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
        {/* Icône circulaire */}
        <AnimatedSkeletonBox 
          width={70} 
          height={70} 
          borderRadius={35} 
          variant="strong"
        />
        
        {/* Titre */}
        <AnimatedSkeletonBox 
          width={200} 
          height={26} 
          borderRadius={8} 
          style={{ marginTop: 20, marginBottom: 16 }}
          variant="strong"
        />
        
        {/* Message multiligne */}
        <AnimatedSkeletonBox 
          width="100%" 
          height={14} 
          borderRadius={4} 
          style={{ marginBottom: 8 }}
          variant="default"
        />
        <AnimatedSkeletonBox 
          width="95%" 
          height={14} 
          borderRadius={4} 
          style={{ marginBottom: 8 }}
          variant="default"
        />
        <AnimatedSkeletonBox 
          width="90%" 
          height={14} 
          borderRadius={4} 
          style={{ marginBottom: 8 }}
          variant="default"
        />
        <AnimatedSkeletonBox 
          width="85%" 
          height={14} 
          borderRadius={4} 
          style={{ marginBottom: 24 }}
          variant="default"
        />
        
        {/* Bouton d'action */}
        <AnimatedSkeletonBox 
          width="100%" 
          height={48} 
          borderRadius={12} 
          variant="strong"
        />
      </View>
    </View>
  );

  // SKELETON DE CHARGEMENT GÉNÉRIQUE
  const renderLoadingSkeleton = () => (
    <View style={styles.content}>
      {/* Section avec effet de carte */}
      <View style={[styles.photoSection, { backgroundColor: colors.card }]}>
        {/* Titre */}
        <AnimatedSkeletonBox 
          width={120} 
          height={22} 
          borderRadius={6} 
          style={{ marginBottom: 16 }}
          variant="strong"
        />
        
        {/* Contenu principal */}
        <AnimatedSkeletonBox 
          width="100%" 
          height={180} 
          borderRadius={12} 
          style={{ marginBottom: 16 }}
          variant="card"
        />
        
        {/* Élément secondaire */}
        <AnimatedSkeletonBox 
          width="60%" 
          height={16} 
          borderRadius={4} 
          style={{ marginBottom: 8 }}
          variant="default"
        />
        <AnimatedSkeletonBox 
          width="40%" 
          height={16} 
          borderRadius={4} 
          variant="default"
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {mode === 'seller' && renderSellerSkeleton()}
      {mode === 'non-seller' && renderNonSellerSkeleton()}
      {mode === 'loading' && renderLoadingSkeleton()}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  photoSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photoDropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  skeletonBox: {
    borderRadius: 8,
  },
});