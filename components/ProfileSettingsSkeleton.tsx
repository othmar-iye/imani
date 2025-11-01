// components/ProfileSettingsSkeleton.tsx
import React, { useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

interface ProfileSettingsSkeletonProps {
  colors: {
    background: string;
    card: string;
    border: string;
  };
}

export const ProfileSettingsSkeleton: React.FC<ProfileSettingsSkeletonProps> = ({ colors }) => {
  const isDark = useColorScheme() === 'dark';
  const skeletonColor = isDark ? '#2A2A2A' : '#E1E9EE';
  const highlightColor = isDark ? '#3A3A3A' : '#F0F4F8';
  
  // Animation value
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { 
        duration: 1500, 
        easing: Easing.ease 
      }),
      -1, // Infinite repetition
      true // Reverse animation
    );
  }, []);

  // Style animé pour l'effet shimmer
  const animatedShimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmer.value,
      [0, 1],
      [-100, 100]
    );

    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.8, 0.3]
    );

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  // Style animé pour le background
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      shimmer.value,
      [0, 0.5, 1],
      [skeletonColor, highlightColor, skeletonColor]
    );

    return {
      backgroundColor,
    };
  });

  // Composant Skeleton animé
  const AnimatedSkeletonBox = ({ 
    width, 
    height, 
    borderRadius = 6,
    style 
  }: { 
    width: number | string; 
    height: number; 
    borderRadius?: number;
    style?: any;
  }) => (
    <Animated.View 
      style={[
        styles.skeletonBox, 
        { 
          width, 
          height, 
          borderRadius,
          overflow: 'hidden',
        },
        animatedBackgroundStyle,
        style
      ]}
    >
      <Animated.View 
        style={[
          styles.shimmer,
          animatedShimmerStyle,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
          }
        ]} 
      />
    </Animated.View>
  );

  const AnimatedSkeletonCircle = ({ 
    size 
  }: { 
    size: number;
  }) => (
    <Animated.View 
      style={[
        styles.skeletonCircle, 
        { 
          width: size, 
          height: size,
          overflow: 'hidden',
        },
        animatedBackgroundStyle
      ]}
    >
      <Animated.View 
        style={[
          styles.shimmer,
          animatedShimmerStyle,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
          }
        ]} 
      />
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header Skeleton */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <AnimatedSkeletonBox width={40} height={40} borderRadius={8} />
        <AnimatedSkeletonBox width={150} height={24} borderRadius={4} />
        <AnimatedSkeletonBox width={60} height={24} borderRadius={4} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Photo de profil Skeleton */}
        <View style={styles.section}>
          <AnimatedSkeletonBox 
            width={120} 
            height={20} 
            borderRadius={4}
            style={{ marginBottom: 12 }}
          />
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <AnimatedSkeletonCircle size={120} />
          </View>
        </View>

        {/* Sections Skeleton */}
        {[1, 2, 3].map((sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <AnimatedSkeletonBox 
              width={160} 
              height={20} 
              borderRadius={4}
              style={{ marginBottom: 12 }}
            />
            
            <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
              {[1, 2, 3].map((itemIndex) => (
                <View 
                  key={itemIndex} 
                  style={[
                    styles.skeletonItem,
                    { borderBottomColor: colors.border },
                    itemIndex === 3 && { borderBottomWidth: 0 }
                  ]}
                >
                  <View style={styles.skeletonItemLeft}>
                    <AnimatedSkeletonBox width={20} height={20} borderRadius={4} />
                    <View style={styles.skeletonTextContainer}>
                      <AnimatedSkeletonBox 
                        width={120} 
                        height={16} 
                        borderRadius={4}
                        style={{ marginBottom: 6 }}
                      />
                      <AnimatedSkeletonBox width={80} height={14} borderRadius={4} />
                    </View>
                  </View>
                  <AnimatedSkeletonBox width={16} height={16} borderRadius={2} />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Info section Skeleton */}
        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <AnimatedSkeletonBox width={20} height={20} borderRadius={4} />
          <View style={styles.skeletonTextContainer}>
            <AnimatedSkeletonBox 
              width="100%" 
              height={14} 
              borderRadius={4}
              style={{ marginBottom: 6 }}
            />
            <AnimatedSkeletonBox width="80%" height={14} borderRadius={4} />
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
    marginTop: 25,
  },
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
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  skeletonBox: {
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  skeletonCircle: {
    borderRadius: 60,
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ skewX: '-20deg' }],
  },
});