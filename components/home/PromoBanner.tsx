import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PromoBannerProps {
  theme: any;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ theme }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.promoBanner, { backgroundColor: theme.tint }]}>
      <View style={styles.promoContent}>
        <Text style={styles.promoTitle}>{t('home.summerSales')}</Text>
        <Text style={styles.promoSubtitle}>{t('home.upToDiscount')}</Text>
        <TouchableOpacity 
          style={[styles.promoButton, { backgroundColor: 'white' }]}
          onPress={() => router.push('/screens/homeOption/SalesScreen')}
        >
          <Text style={[styles.promoButtonText, { color: theme.tint }]}>
            {t('home.discover')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.promoImageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=300&h=300&fit=crop' }}
          style={styles.promoImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  promoBanner: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    zIndex: 2,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  promoSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
    fontWeight: '500',
  },
  promoButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  promoImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 16,
    zIndex: 1,
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
});