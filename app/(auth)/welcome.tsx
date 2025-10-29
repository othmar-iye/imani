import CustomButton from '@/components/CustomButton';
import { useCustomTheme } from '@/src/context/ThemeContext';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

const Welcome = () => {
    const { colors } = useCustomTheme();

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
        Donne une nouvelle vie à tes objets
      </Text>

      {/* Sous-texte */}
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Achète et vends facilement, tout depuis ton téléphone.
      </Text>

      {/* Boutons */}
      <View style={styles.buttonContainer}>
        <CustomButton
            title="Inscription"
            onPress={handleRegister}
            variant="primary"
            size="large"
        />

        <CustomButton
            title="Connexion"
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