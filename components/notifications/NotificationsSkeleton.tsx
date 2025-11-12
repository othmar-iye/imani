import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

interface NotificationsSkeletonProps {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
  variant?: 'initial' | 'loading';
}

export const NotificationsSkeleton: React.FC<NotificationsSkeletonProps> = ({ 
  colors, 
  variant = 'initial' 
}) => {
  const isDark = useColorScheme() === 'dark';
  
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

  const AnimatedSkeletonBox = ({ 
    width, 
    height, 
    borderRadius = 6,
    style,
    variant = 'default'
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
        default: '#D1D9E0',
        strong: '#B8C4CE'
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

  const renderNotificationSkeleton = () => (
    <View style={[styles.notificationCard, { backgroundColor: colors.card, marginBottom:10 }]}>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.titleContainer}>
            <AnimatedSkeletonBox 
              width={16} 
              height={16} 
              borderRadius={8}
              variant="strong"
            />
            <AnimatedSkeletonBox 
              width="70%" 
              height={16} 
              borderRadius={4}
              style={{ marginLeft: 8 }}
              variant="strong"
            />
          </View>
          <AnimatedSkeletonBox 
            width={8} 
            height={8} 
            borderRadius={4}
            variant="strong"
          />
        </View>
        
        <AnimatedSkeletonBox 
          width="100%" 
          height={14} 
          borderRadius={4}
          style={{ marginBottom: 8 }}
          variant="default"
        />
        <AnimatedSkeletonBox 
          width="85%" 
          height={14} 
          borderRadius={4}
          style={{ marginBottom: 12 }}
          variant="default"
        />
        
        <View style={styles.notificationFooter}>
          <AnimatedSkeletonBox 
            width={80} 
            height={12} 
            borderRadius={4}
            variant="default"
          />
          <AnimatedSkeletonBox 
            width={16} 
            height={16} 
            borderRadius={8}
            variant="default"
          />
        </View>
      </View>
    </View>
  );

  if (variant === 'loading') {
    return (
      <View style={styles.loadingSkeletonContainer}>
        {[1, 2, 3].map((item) => (
          <View key={item}>
            {renderNotificationSkeleton()}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Skeleton */}
      <View style={[styles.header, { borderBottomColor: colors.border, paddingTop: 60 }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="chevron-back" size={24} color={colors.tint} />
          <AnimatedSkeletonBox 
            width={150} 
            height={24} 
            borderRadius={6}
            style={{ marginLeft: 12 }}
            variant="strong"
          />
        </View>
        <AnimatedSkeletonBox 
          width={80} 
          height={16} 
          borderRadius={4}
          variant="default"
        />
      </View>

      {/* Statistiques Skeleton */}
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <AnimatedSkeletonBox 
            width={40} 
            height={24} 
            borderRadius={6}
            variant="strong"
          />
          <AnimatedSkeletonBox 
            width={40} 
            height={12} 
            borderRadius={4}
            style={{ marginTop: 4 }}
            variant="default"
          />
        </View>
        <View style={[styles.statSeparator, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <AnimatedSkeletonBox 
            width={40} 
            height={24} 
            borderRadius={6}
            variant="strong"
          />
          <AnimatedSkeletonBox 
            width={50} 
            height={12} 
            borderRadius={4}
            style={{ marginTop: 4 }}
            variant="default"
          />
        </View>
      </View>

      {/* Liste des notifications Skeleton */}
      <View style={styles.notificationsList}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item}>
            {renderNotificationSkeleton()}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statSeparator: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationCard: { 
    borderRadius: 12,
    overflow: 'hidden',
  },
  notificationContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonBox: {
    borderRadius: 6,
  },
  loadingSkeletonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});