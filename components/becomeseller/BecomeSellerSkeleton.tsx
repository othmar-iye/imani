// components/BecomeSellerSkeleton.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
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
      
      {/* Header INSTANTANÉ */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Ionicons name="chevron-back" size={24} color={colors.tint} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Modifier le profil
        </Text>
        <View style={[styles.saveButton, { backgroundColor: colors.tint }]}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Avatar Simplifiée - NOUVEAU DESIGN */}
        <View style={[styles.avatarSection, { backgroundColor: colors.card }]}>
          {/* Titre instantané */}
          <Text style={[styles.avatarTitle, { color: colors.text }]}>
            Photo de profil
          </Text>
          
          {/* Sous-titre instantané */}
          <Text style={[styles.avatarSubtitle, { color: colors.textSecondary }]}>
            Obligatoire pour devenir vendeur
          </Text>
          
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

        {/* Section Informations personnelles */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Informations personnelles
          </Text>
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
                  <Ionicons name="ellipse-outline" size={20} color={colors.textSecondary} />
                  <View style={styles.skeletonTextContainer}>
                    {/* Label du champ */}
                    <AnimatedSkeletonBox 
                      width={120} 
                      height={16} 
                      borderRadius={4}
                      style={{ marginBottom: 6 }}
                      variant="default"
                    />
                    {/* Valeur du champ */}
                    <AnimatedSkeletonBox 
                      width={80} 
                      height={14} 
                      borderRadius={4} 
                      variant="default"
                    />
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </View>
            ))}
          </View>
        </View>

        {/* Section Localisation */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Localisation
          </Text>
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
                  <Ionicons name="ellipse-outline" size={20} color={colors.textSecondary} />
                  <View style={styles.skeletonTextContainer}>
                    {/* Label du champ */}
                    <AnimatedSkeletonBox 
                      width={120} 
                      height={16} 
                      borderRadius={4}
                      style={{ marginBottom: 6 }}
                      variant="default"
                    />
                    {/* Valeur du champ */}
                    <AnimatedSkeletonBox 
                      width={80} 
                      height={14} 
                      borderRadius={4} 
                      variant="default"
                    />
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </View>
            ))}
          </View>
        </View>

        {/* Section Vérification d'identité */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Vérification d'identité
          </Text>
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
                  <Ionicons name="ellipse-outline" size={20} color={colors.textSecondary} />
                  <View style={styles.skeletonTextContainer}>
                    {/* Label du champ */}
                    <AnimatedSkeletonBox 
                      width={120} 
                      height={16} 
                      borderRadius={4}
                      style={{ marginBottom: 6 }}
                      variant="default"
                    />
                    {/* Statut/valeur */}
                    <AnimatedSkeletonBox 
                      width={80} 
                      height={14} 
                      borderRadius={4} 
                      variant="default"
                    />
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
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

        {/* Information importante INSTANTANÉE */}
        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Ionicons name="information-circle" size={20} color={colors.tint} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            La vérification de votre identité est nécessaire pour devenir vendeur. Le traitement peut prendre 24-48h.
          </Text>
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
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  avatarTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  avatarSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  // Styles pour les sections classiques
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
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
  skeletonBox: {
    borderRadius: 6,
  },
  skeletonCircle: {
    borderRadius: 60,
    alignSelf: 'center',
  },
});