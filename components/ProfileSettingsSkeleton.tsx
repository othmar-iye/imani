// components/ProfileSettingsSkeleton.tsx
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header Skeleton */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={[
          styles.skeletonBox, 
          { 
            width: 40, 
            height: 40, 
            backgroundColor: skeletonColor,
            borderRadius: 8 
          }
        ]} />
        <View style={[
          styles.skeletonBox, 
          { 
            width: 150, 
            height: 24, 
            backgroundColor: skeletonColor,
            borderRadius: 4 
          }
        ]} />
        <View style={[
          styles.skeletonBox, 
          { 
            width: 60, 
            height: 24, 
            backgroundColor: skeletonColor,
            borderRadius: 4 
          }
        ]} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Photo de profil Skeleton */}
        <View style={styles.section}>
          <View style={[
            styles.skeletonBox, 
            { 
              width: 120, 
              height: 20, 
              marginBottom: 12, 
              backgroundColor: skeletonColor,
              borderRadius: 4 
            }
          ]} />
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <View style={[
              styles.skeletonCircle, 
              { 
                width: 120, 
                height: 120, 
                backgroundColor: skeletonColor,
              }
            ]} />
          </View>
        </View>

        {/* Sections Skeleton */}
        {[1, 2, 3].map((sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={[
              styles.skeletonBox, 
              { 
                width: 160, 
                height: 20, 
                marginBottom: 12, 
                backgroundColor: skeletonColor,
                borderRadius: 4 
              }
            ]} />
            
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
                    <View style={[
                      styles.skeletonBox, 
                      { 
                        width: 20, 
                        height: 20, 
                        backgroundColor: skeletonColor,
                        borderRadius: 4 
                      }
                    ]} />
                    <View style={styles.skeletonTextContainer}>
                      <View style={[
                        styles.skeletonBox, 
                        { 
                          width: 120, 
                          height: 16, 
                          marginBottom: 6, 
                          backgroundColor: skeletonColor,
                          borderRadius: 4 
                        }
                      ]} />
                      <View style={[
                        styles.skeletonBox, 
                        { 
                          width: 80, 
                          height: 14, 
                          backgroundColor: skeletonColor,
                          borderRadius: 4 
                        }
                      ]} />
                    </View>
                  </View>
                  <View style={[
                    styles.skeletonBox, 
                    { 
                      width: 16, 
                      height: 16, 
                      backgroundColor: skeletonColor,
                      borderRadius: 2 
                    }
                  ]} />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Info section Skeleton */}
        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <View style={[
            styles.skeletonBox, 
            { 
              width: 20, 
              height: 20, 
              backgroundColor: skeletonColor,
              borderRadius: 4 
            }
          ]} />
          <View style={styles.skeletonTextContainer}>
            <View style={[
              styles.skeletonBox, 
              { 
                width: '100%', 
                height: 14, 
                marginBottom: 6, 
                backgroundColor: skeletonColor,
                borderRadius: 4 
              }
            ]} />
            <View style={[
              styles.skeletonBox, 
              { 
                width: '80%', 
                height: 14, 
                backgroundColor: skeletonColor,
                borderRadius: 4 
              }
            ]} />
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
  },
  skeletonCircle: {
    borderRadius: 60,
    alignSelf: 'center',
  },
});