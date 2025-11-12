import { NotificationIcon } from '@/components/NotificationIcon';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

interface HomeHeaderProps {
  theme: any;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ theme }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <View style={styles.locationContainer}>
        <Text style={[styles.locationText, { color: theme.text }]}>
          {t('home.welcome')} 
        </Text>
      </View>
      <NotificationIcon color={theme.text} size={24} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});