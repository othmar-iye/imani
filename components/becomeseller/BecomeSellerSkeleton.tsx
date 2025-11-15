// components/BecomeSellerSkeleton.tsx
import React, { useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

interface ProfileSettingsSkeletonProps {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
}

export const ProfileSettingsSkeleton: React.FC<ProfileSettingsSkeletonProps> = ({ colors }) => {
  const isDark = useColorScheme() === 'dark';
  
  // Animation renforcée
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

  // VERSION FORT CONTRASTE pour le mode clair
  const AnimatedSkeletonBox = ({ 
    width, 
    height, 
    borderRadius = 6,
    style,
    variant = 'default' // 'default' | 'strong'
  }: { 
    width: number | string; 
    height: number; 
    borderRadius?: number;
    style?: any;
    variant?: 'default' | 'strong';
  }) => {
    const skeletonColors = {
      dark: {
        default: '#2A2A2A',
        strong: '#333333'
      },
      light: {
        default: '#D1D9E0',   // BEAUCOUP plus foncé - bien visible
        strong: '#B8C4CE'     // Encore plus contrasté
      }
    };

    return (
      <Animated.View 
        style={[
          styles.skeletonBox, 
          { 
            width, 
            height, 
            borderRadius,
            backgroundColor: isDark 
              ? skeletonColors.dark[variant]
              : skeletonColors.light[variant],
          },
          animatedStyle,
          style
        ]}
      />
    );
  };

  const AnimatedSkeletonCircle = ({ 
    size,
    variant = 'default'
  }: { 
    size: number;
    variant?: 'default' | 'strong';
  }) => {
    const skeletonColors = {
      dark: {
        default: '#2A2A2A',
        strong: '#333333'
      },
      light: {
        default: '#D1D9E0',
        strong: '#B8C4CE'
      }
    };

    return (
      <Animated.View 
        style={[
          styles.skeletonCircle, 
          { 
            width: size, 
            height: size,
            borderRadius: size / 2,
            backgroundColor: isDark 
              ? skeletonColors.dark[variant]
              : skeletonColors.light[variant],
          },
          animatedStyle
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header COMPLÈTEMENT EN SKELETON */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        {/* Bouton retour skeleton */}
        <AnimatedSkeletonCircle size={40} variant="default" />
        
        {/* Titre skeleton */}
        <AnimatedSkeletonBox 
          width={120} 
          height={20} 
          borderRadius={8}
          variant="strong"
        />
        
        {/* Bouton sauvegarder skeleton */}
        <AnimatedSkeletonBox 
          width={80} 
          height={32} 
          borderRadius={8}
          variant="strong"
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Avatar Simplifiée - COMPLÈTEMENT EN SKELETON */}
        <View style={[styles.avatarSection, { backgroundColor: colors.card }]}>
          {/* Titre skeleton */}
          <AnimatedSkeletonBox 
            width={120} 
            height={18} 
            borderRadius={6}
            style={{ marginBottom: 4 }}
            variant="strong"
          />
          
          {/* Sous-titre skeleton */}
          <AnimatedSkeletonBox 
            width={200} 
            height={14} 
            borderRadius={6}
            style={{ marginBottom: 20 }}
            variant="default"
          />
          
          {/* Avatar skeleton */}
          <View style={styles.avatarContainer}>
            <AnimatedSkeletonCircle size={100} variant="strong" />
          </View>

          {/* Message d'avertissement skeleton */}
          <AnimatedSkeletonBox 
            width={150} 
            height={16} 
            borderRadius={8}
            style={{ marginTop: 12 }}
            variant="default"
          />
        </View>

        {/* Section Informations personnelles - COMPLÈTEMENT EN SKELETON */}
        <View style={styles.section}>
          {/* Titre section skeleton */}
          <AnimatedSkeletonBox 
            width={160} 
            height={16} 
            borderRadius={6}
            style={{ marginBottom: 12, marginLeft: 4 }}
            variant="strong"
          />
          
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            {[1, 2].map((item) => (
              <View 
                key={item} 
                style={[
                  styles.skeletonItem,
                  { borderBottomColor: colors.border },
                  item === 2 && { borderBottomWidth: 0 }
                ]}
              >
                <View style={styles.skeletonItemLeft}>
                  {/* Icône skeleton */}
                  <AnimatedSkeletonCircle size={20} variant="default" />
                  
                  <View style={styles.skeletonTextContainer}>
                    {/* Label du champ skeleton */}
                    <AnimatedSkeletonBox 
                      width={120} 
                      height={16} 
                      borderRadius={4}
                      style={{ marginBottom: 6 }}
                      variant="default"
                    />
                    {/* Valeur du champ skeleton */}
                    <AnimatedSkeletonBox 
                      width={80} 
                      height={14} 
                      borderRadius={4} 
                      variant="default"
                    />
                  </View>
                </View>
                {/* Flèche skeleton */}
                <AnimatedSkeletonBox 
                  width={16} 
                  height={16} 
                  borderRadius={2}
                  variant="default"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Section Localisation - COMPLÈTEMENT EN SKELETON */}
        <View style={styles.section}>
          {/* Titre section skeleton */}
          <AnimatedSkeletonBox 
            width={100} 
            height={16} 
            borderRadius={6}
            style={{ marginBottom: 12, marginLeft: 4 }}
            variant="strong"
          />
          
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            {[1, 2].map((item) => (
              <View 
                key={item} 
                style={[
                  styles.skeletonItem,
                  { borderBottomColor: colors.border },
                  item === 2 && { borderBottomWidth: 0 }
                ]}
              >
                <View style={styles.skeletonItemLeft}>
                  {/* Icône skeleton */}
                  <AnimatedSkeletonCircle size={20} variant="default" />
                  
                  <View style={styles.skeletonTextContainer}>
                    {/* Label du champ skeleton */}
                    <AnimatedSkeletonBox 
                      width={120} 
                      height={16} 
                      borderRadius={4}
                      style={{ marginBottom: 6 }}
                      variant="default"
                    />
                    {/* Valeur du champ skeleton */}
                    <AnimatedSkeletonBox 
                      width={80} 
                      height={14} 
                      borderRadius={4} 
                      variant="default"
                    />
                  </View>
                </View>
                {/* Flèche skeleton */}
                <AnimatedSkeletonBox 
                  width={16} 
                  height={16} 
                  borderRadius={2}
                  variant="default"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Section Vérification d'identité - COMPLÈTEMENT EN SKELETON */}
        <View style={styles.section}>
          {/* Titre section skeleton */}
          <AnimatedSkeletonBox 
            width={140} 
            height={16} 
            borderRadius={6}
            style={{ marginBottom: 12, marginLeft: 4 }}
            variant="strong"
          />
          
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            {[1, 2, 3].map((item) => (
              <View 
                key={item} 
                style={[
                  styles.skeletonItem,
                  { borderBottomColor: colors.border },
                  item === 3 && { borderBottomWidth: 0 }
                ]}
              >
                <View style={styles.skeletonItemLeft}>
                  {/* Icône skeleton */}
                  <AnimatedSkeletonCircle size={20} variant="default" />
                  
                  <View style={styles.skeletonTextContainer}>
                    {/* Label du champ skeleton */}
                    <AnimatedSkeletonBox 
                      width={120} 
                      height={16} 
                      borderRadius={4}
                      style={{ marginBottom: 6 }}
                      variant="default"
                    />
                    {/* Statut/valeur skeleton */}
                    <AnimatedSkeletonBox 
                      width={80} 
                      height={14} 
                      borderRadius={4} 
                      variant="default"
                    />
                  </View>
                </View>
                {/* Flèche skeleton */}
                <AnimatedSkeletonBox 
                  width={16} 
                  height={16} 
                  borderRadius={2}
                  variant="default"
                />
              </View>
            ))}
            
            {/* Upload document skeleton */}
            <View style={styles.uploadItem}>
              <AnimatedSkeletonBox 
                width="100%" 
                height={100} 
                borderRadius={12} 
                variant="strong"
              />
            </View>
          </View>
        </View>

        {/* Information importante - COMPLÈTEMENT EN SKELETON */}
        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          {/* Icône information skeleton */}
          <AnimatedSkeletonCircle size={20} variant="default" />
          
          <View style={styles.infoTextContainer}>
            {/* Titre information skeleton */}
            <AnimatedSkeletonBox 
              width={120} 
              height={14} 
              borderRadius={4}
              style={{ marginBottom: 8 }}
              variant="default"
            />
            {/* Description information skeleton */}
            <AnimatedSkeletonBox 
              width="100%" 
              height={36} 
              borderRadius={4}
              variant="default"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  // Styles pour la section avatar simplifiée
  avatarSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  // Styles pour les sections classiques
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  skeletonItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  uploadItem: {
    marginTop: 16,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  skeletonBox: {
    borderRadius: 6,
  },
  skeletonCircle: {
    borderRadius: 60,
  },
});