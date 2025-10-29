// app/(auth)/register.tsx
import CustomButton from '@/components/CustomButton';
import { useCustomTheme } from '@/src/context/ThemeContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
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

const RegisterScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { colors } = useCustomTheme();

  // Refs pour gérer le focus des champs
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  
    const handleRegister = async () => {
    // Validation des champs
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
        return;
    }

    if (formData.password.length < 6) {
        Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
        return;
    }

    setLoading(true);

    try {
        // D'ABORD essayer l'inscription directement
        const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
            data: {
            full_name: formData.fullName,
            },
        },
        });

        if (error) {
        // Gestion des erreurs spécifiques
        if (error.message.includes('already registered') || 
            error.message.includes('user_exists')) {
            Alert.alert(
            'Compte existant', 
            'Un compte avec cet email existe déjà. Veuillez vous connecter.',
            [{ text: 'Se connecter', onPress: () => router.replace('/(auth)/login') }]
            );
        } else {
            Alert.alert('Erreur d\'inscription', error.message);
        }
        return;
        }

        // Vérifier le cas où identities est vide (compte existe déjà)
        if (data.user && data.user.identities && data.user.identities.length === 0) {
        Alert.alert(
            'Compte existant', 
            'Un compte avec cet email existe déjà. Veuillez vous connecter.',
            [{ text: 'Se connecter', onPress: () => router.replace('/(auth)/login') }]
        );
        return;
        }

        // SUCCÈS - Inscription réussie
        Alert.alert(
        'Inscription réussie !',
        'Votre compte a été créé avec succès.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]
        );

    } catch (error: any) {
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
    } finally {
        setLoading(false);
    }
    };

  // Vérifier si le formulaire est valide
  const isFormValid = formData.fullName && 
                     formData.email && 
                     formData.password && 
                     formData.confirmPassword && 
                     formData.password === formData.confirmPassword &&
                     formData.password.length >= 6;

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
            <Text style={[styles.title, { color: colors.tint }]}>Rejoins-nous</Text>
            
            {/* Sous-titre */}
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Crée ton compte et commence à donner une nouvelle vie à tes objets.
            </Text>

            {/* Section Formulaire */}
            <View style={styles.section}>
              
              {/* Champ Nom complet avec icône */}
              <View style={[styles.inputContainer, { 
                backgroundColor: colors.card, 
                borderColor: colors.borderInput 
              }]}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={colors.tabIconDefault} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Nom complet"
                  placeholderTextColor={colors.tabIconDefault}
                  autoCapitalize="words"
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
              
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
                  ref={emailRef}
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Email"
                  placeholderTextColor={colors.tabIconDefault}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
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
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  blurOnSubmit={false}
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

              {/* Champ Confirmer le mot de passe avec icône et œil */}
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
                  ref={confirmPasswordRef}
                  style={[styles.inputWithIcon, { color: colors.text }]}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor={colors.tabIconDefault}
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={toggleShowConfirmPassword}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={colors.tabIconDefault} 
                  />
                </TouchableOpacity>
              </View>

              {/* Messages de validation */}
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <Text style={styles.errorText}>
                  ❌ Les mots de passe ne correspondent pas
                </Text>
              )}
              
              {formData.password && formData.password.length < 6 && (
                <Text style={styles.warningText}>
                  ⚠️ 6 caractères minimum
                </Text>
              )}
            </View>

            {/* Ligne de séparation */}
            <View style={[styles.separator, { backgroundColor: colors.borderInput }]} />

            {/* Bouton d'inscription */}
            <CustomButton
              title={loading ? "Inscription..." : "S'inscrire"}
              onPress={handleRegister}
              variant="primary"
              size="large"
              loading={loading}
              disabled={!isFormValid || loading}
            />

            {/* Lien de connexion */}
            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={[styles.loginLinkText, { color: colors.text }]}>
                Déjà un compte ? Se connecter
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    padding: 15,
    borderRadius: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 30,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 22,
  },
  section: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 45,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 45,
    paddingRight: 50,
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
  warningText: {
    color: '#ff9500',
    fontSize: 14,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    marginVertical: 25,
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 30,
  },
  loginLinkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;