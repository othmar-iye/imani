// components/ProfileSkeleton.tsx
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

interface ProfileSkeletonProps {
  colors: {
    background: string;
    card: string;
    border: string;
  };
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({
  colors,
  refreshing = false,
  onRefresh,
}) => {
  const skeletonColor = colors.background === '#000000' ? '#2A2A2A' : '#E1E9EE';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.border}
            />
          ) : undefined
        }
      >
        {/* Header Skeleton */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <View style={[
            styles.skeletonCircle, 
            { 
              width: 100, 
              height: 100, 
              backgroundColor: skeletonColor,
              marginBottom: 16,
            }
          ]} />
          
          <View style={[
            styles.skeletonBox, 
            { 
              width: 150, 
              height: 24, 
              backgroundColor: skeletonColor,
              marginBottom: 8,
            }
          ]} />
          
          <View style={[
            styles.skeletonBox, 
            { 
              width: 100, 
              height: 16, 
              backgroundColor: skeletonColor,
              marginBottom: 4,
            }
          ]} />
          
          <View style={[
            styles.skeletonBox, 
            { 
              width: 120, 
              height: 14, 
              backgroundColor: skeletonColor,
              marginBottom: 16,
            }
          ]} />
          
          <View style={[
            styles.skeletonBox, 
            { 
              width: 120, 
              height: 44, 
              backgroundColor: skeletonColor,
              borderRadius: 12,
            }
          ]} />
        </View>

        {/* Stats Skeleton */}
        <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.statItem}>
              <View style={[
                styles.skeletonBox, 
                { 
                  width: 40, 
                  height: 20, 
                  backgroundColor: skeletonColor,
                  marginBottom: 4,
                }
              ]} />
              <View style={[
                styles.skeletonBox, 
                { 
                  width: 60, 
                  height: 12, 
                  backgroundColor: skeletonColor,
                }
              ]} />
              {index < 2 && (
                <View style={[styles.statSeparator, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* Menu Items Skeleton */}
        <View style={[styles.menuSection, { backgroundColor: colors.background }]}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
            <View
              key={item}
              style={[
                styles.menuItem,
                { 
                  backgroundColor: colors.card,
                  marginBottom: index === 8 ? 0 : 8,
                }
              ]}
            >
              <View style={styles.menuItemLeft}>
                <View style={[
                  styles.skeletonBox, 
                  { 
                    width: 22, 
                    height: 22, 
                    backgroundColor: skeletonColor,
                    borderRadius: 4,
                  }
                ]} />
                <View style={[
                  styles.skeletonBox, 
                  { 
                    width: 150, 
                    height: 16, 
                    backgroundColor: skeletonColor,
                  }
                ]} />
              </View>
              
              <View style={styles.menuItemRight}>
                {index < 3 && (
                  <View style={[
                    styles.skeletonBox, 
                    { 
                      width: 20, 
                      height: 20, 
                      backgroundColor: skeletonColor,
                      borderRadius: 10,
                    }
                  ]} />
                )}
                <View style={[
                  styles.skeletonBox, 
                  { 
                    width: 16, 
                    height: 16, 
                    backgroundColor: skeletonColor,
                  }
                ]} />
              </View>
            </View>
          ))}
        </View>

        {/* Version Skeleton */}
        <View style={[
          styles.skeletonBox, 
          { 
            width: 80, 
            height: 14, 
            backgroundColor: skeletonColor,
            alignSelf: 'center',
            marginTop: 10,
          }
        ]} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    paddingTop: 60,
  },
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  statSeparator: {
    position: 'absolute',
    right: 0,
    top: '25%',
    width: 1,
    height: '50%',
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skeletonBox: {
    borderRadius: 6,
  },
  skeletonCircle: {
    borderRadius: 50,
  },
});