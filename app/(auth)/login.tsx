import CustomButton from '@/components/CustomButton';
import { useCustomTheme } from '@/src/context/ThemeContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { colors } = useCustomTheme();

  // Refs pour gérer le focus des champs
  const passwordRef = useRef<TextInput>(null);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    // Réinitialiser l'erreur
    setError('');

    // Validation des champs
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (loginError) {
        // Afficher l'erreur directement dans l'interface
        if (loginError.message === 'Invalid login credentials') {
          setError('❌ Email ou mot de passe incorrect');
        } else if (loginError.message.includes('Email not confirmed')) {
          setError('❌ Veuillez confirmer votre email avant de vous connecter');
        } else {
          setError(`❌ ${loginError.message}`);
        }
        return;
      }

      if (data.user) {
        // ✅ Redirection directe vers la home
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      setError('❌ Une erreur est survenue lors de la connexion');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si le formulaire est valide
  const isFormValid = email && password;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Titre principal */}
            <Text style={[styles.title, { color: colors.tint }]}>Heureux de te revoir</Text>
            
            {/* Sous-titre */}
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Accède à ton compte et reprends tes échanges en toute simplicité.
            </Text>

            {/* Section Formulaire */}
            <View style={styles.section}>
              
              {/* Champ Email avec icône */}
              <View style={[styles.inputContainer, { 
                backgroundColor: colors.card, 
                borderColor: colors.borderInput 
              }]}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={colors.tabIconDefault} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Email"
                  placeholderTextColor={colors.tabIconDefault}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setError(''); // Effacer l'erreur quand l'utilisateur tape
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
              
              {/* Champ Mot de passe avec icône et œil */}
              <View style={[styles.inputContainer, { 
                backgroundColor: colors.card, 
                borderColor: colors.borderInput 
              }]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={colors.tabIconDefault} 
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={passwordRef}
                  style={[styles.inputWithIcon, { color: colors.text }]}
                  placeholder="Mot de passe"
                  placeholderTextColor={colors.tabIconDefault}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setError(''); // Effacer l'erreur quand l'utilisateur tape
                  }}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={toggleShowPassword}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={colors.tabIconDefault} 
                  />
                </TouchableOpacity>
              </View>

              {/* Message d'erreur */}
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
              
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => router.push('/(auth)/password_forgot')}
              >
                <Text style={[styles.forgotPasswordText, { color: colors.tint }]}>
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Ligne de séparation */}
            <View style={[styles.separator, { backgroundColor: colors.borderInput }]} />

            {/* Bouton de connexion */}
            <CustomButton
              title={loading ? "Connexion..." : "Se connecter"}
              onPress={handleLogin}
              variant="primary"
              size="large"
              loading={loading}
              disabled={!isFormValid || loading}
            />

            {/* Lien de création de compte */}
            <TouchableOpacity 
              style={styles.createAccount} 
              onPress={() => router.replace('/(auth)/register')}
            >
              <Text style={[styles.createAccountText, { color: colors.text }]}>
                Créez un nouveau compte
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 22,
  },
  section: {
    marginBottom: 20,
  },
  // Container pour les champs avec icônes
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 35,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 45,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 45,
    paddingRight: 50, // Espace pour l'icône œil
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 0,
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 15,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    marginVertical: 25,
  },
  createAccount: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 60,
  },
  createAccountText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;