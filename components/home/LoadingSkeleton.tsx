import { Theme } from '@/constants/theme';
import { Dimensions, StyleSheet, View, useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

export const LoadingSkeleton: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;

  return (
    <View style={styles.loadingSkeletonContainer}>
      {[1, 2].map((item) => (
        <View key={item} style={[styles.skeletonProductCard, { backgroundColor: theme.card }]}>
          <View style={[styles.skeletonImage, { backgroundColor: theme.border }]} />
          <View style={styles.skeletonContent}>
            <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
            <View style={[styles.skeletonTitle, { backgroundColor: theme.border }]} />
            <View style={[styles.skeletonPrice, { backgroundColor: theme.border }]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingSkeletonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  skeletonProductCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  skeletonImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonText: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
    width: '60%',
  },
  skeletonTitle: {
    height: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: '90%',
  },
  skeletonPrice: {
    height: 14,
    borderRadius: 7,
    width: '40%',
  },
});