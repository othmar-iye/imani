import CustomButton from '@/components/CustomButton';
import { useCustomTheme } from '@/src/context/ThemeContext';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';

const Welcome = () => {
    const { colors } = useCustomTheme();
    const { t } = useTranslation();

    function handleRegister(): void {
        router.replace('/(auth)/register')
    }

    function handleLogin(): void {
        router.replace('/(auth)/login')
    }

    return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Illustration */}
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Titre */}
      <Text style={[styles.title, { color: colors.tint }]}>
        {t('welcome.title')}
      </Text>

      {/* Sous-texte */}
      <Text style={[styles.subtitle, { color: colors.text }]}>
        {t('welcome.subtitle')}
      </Text>

      {/* Boutons */}
      <View style={styles.buttonContainer}>
        <CustomButton
            title={t('welcome.registerButton')}
            onPress={handleRegister}
            variant="primary"
            size="large"
        />

        <CustomButton
            title={t('welcome.loginButton')}
            onPress={handleLogin}
            variant="secondary"
            size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: '50%',
    height: 250,
    marginBottom: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 30,
    position: 'absolute',
    bottom: 70,
  },
});

export default Welcome;