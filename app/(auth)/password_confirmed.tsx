import CustomButton from '@/components/CustomButton';
import { useCustomTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PasswordSuccessScreen = () => {
  const { colors } = useCustomTheme();
  
  // Références pour les animations
  const iconScale = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation séquentielle
    Animated.sequence([
      // Animation de l'icône (effet pop)
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      
      // Animation du titre (fade in)
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Animation du sous-titre (fade in)
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Animation du bouton (fade in + scale)
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);

  const handleLogin = () => {
    // Animation de sortie avant la navigation
    Animated.parallel([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Redirection vers l'écran de connexion après l'animation
      router.replace('/(auth)/login');
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        
        {/* Icône de succès avec animation */}
        <Animated.View 
          style={[
            styles.successIcon,
            {
              transform: [{ scale: iconScale }]
            }
          ]}
        >
          <Ionicons 
            name="checkmark-circle" 
            size={80} 
            color={colors.tint} 
          />
        </Animated.View>

        {/* Titre principal avec animation */}
        <Animated.Text 
          style={[
            styles.title,
            {
              color: colors.tint,
              opacity: titleOpacity,
              transform: [{
                translateY: titleOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        >
          Mot de passe
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.title,
            {
              color: colors.tint,
              opacity: titleOpacity,
              transform: [{
                translateY: titleOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        >
          changé avec succès
        </Animated.Text>
        
        {/* Message de confirmation avec animation */}
        <Animated.Text 
          style={[
            styles.subtitle,
            {
              color: colors.text,
              opacity: subtitleOpacity,
              transform: [{
                translateY: subtitleOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0]
                })
              }]
            }
          ]}
        >
          Ton mot de passe a été mis à jour avec succès. Tu peux maintenant te connecter avec ton nouveau mot de passe.
        </Animated.Text>

        {/* CustomButton avec animations */}
        <Animated.View
          style={{
            opacity: buttonOpacity,
            transform: [{ scale: buttonScale }]
          }}
        >
          <CustomButton
            title="Se connecter"
            onPress={handleLogin}
            variant="primary"
            size="large"
            style={styles.loginButton}
          />
        </Animated.View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successIcon: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 50,
    lineHeight: 22,
  },
  loginButton: {
    minWidth: 200,
  },
});

export default PasswordSuccessScreen;