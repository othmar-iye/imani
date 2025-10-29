import CustomButton from '@/components/CustomButton';
import { useCustomTheme } from '@/src/context/ThemeContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

const PasswordForgotScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { colors } = useCustomTheme();

  const checkIfEmailExists = async (email: string): Promise<boolean> => {
    try {
      console.log('🔍 Vérification de l\'email:', email);
      
      // Utiliser la fonction RPC pour vérifier si l'email existe
      const { data, error: rpcError } = await supabase
        .rpc('check_user_exists', { email_text: email.trim().toLowerCase() });

      console.log('📊 Résultat RPC:', data, 'Erreur:', rpcError);

      if (rpcError) {
        console.error('❌ Erreur RPC:', rpcError);
        return false;
      }

      // `data` sera true si l'utilisateur existe, false sinon
      return Boolean(data);
    } catch (error) {
      console.error('💥 Erreur lors de la vérification:', error);
      return false;
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!email) {
        setError('Veuillez entrer votre adresse email');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        setError('Veuillez entrer une adresse email valide');
        return;
    }

    setLoading(true);

    try {
        console.log('🚀 Début de la vérification...');
        
        // Vérifier si l'email existe
        const emailExists = await checkIfEmailExists(email);
        console.log('✅ Email existe:', emailExists);

        if (!emailExists) {
            setError('❌ Aucun compte trouvé avec cette adresse email');
            setLoading(false);
            return;
        }

        console.log('🔄 Tentative de connexion temporaire...');
        
        // SOLUTION POUR LE DÉVELOPPEMENT LOCAL :
        // Créer un mot de passe temporaire et se connecter
        const temporaryPassword = 'temp123456'; // Mot de passe temporaire
        
        // Essayer de se connecter (cela échouera mais créera une session si on utilise signUp)
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: temporaryPassword
        });

        if (authError) {
          // Si la connexion échoue, essayer de créer un utilisateur temporaire
          // ou utiliser une autre méthode
          console.log('❌ Connexion échouée, tentative d\'inscription temporaire...');
          
          // Pour le développement, on peut rediriger directement
          // et gérer le changement de mot de passe différemment
          console.log('🔄 Redirection vers password_new...');
          
          router.replace({
            pathname: '/(auth)/password_new',
            params: { 
              email: email.trim().toLowerCase(),
              dev_mode: 'true' // Flag pour le mode développement
            }
          });
          return;
        }

        // Si on arrive ici, la connexion a réussi (peu probable avec mauvais mot de passe)
        console.log('✅ Connexion réussie, redirection...');
        router.replace({
          pathname: '/(auth)/password_new',
          params: { 
            email: email.trim().toLowerCase()
          }
        });

    } catch (error: any) {
        console.error('💥 Erreur générale:', error);
        // En cas d'erreur, rediriger quand même pour le développement
        router.replace({
          pathname: '/(auth)/password_new',
          params: { 
            email: email.trim().toLowerCase(),
            dev_mode: 'true'
          }
        });
    } finally {
        setLoading(false);
    }
  };

  const isFormValid = email;

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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.tint} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: colors.tint }]}>Mot de passe oublié</Text>
            
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Entrez votre adresse email pour réinitialiser votre mot de passe.
            </Text>

            {/* Message pour le développement */}
            <View style={styles.devNote}>
              <Ionicons name="code-slash" size={16} color={colors.tint} />
              <Text style={[styles.devNoteText, { color: colors.tint }]}>
                Mode développement : Redirection directe
              </Text>
            </View>

            <View style={styles.section}>
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
                  placeholder="Votre adresse email"
                  placeholderTextColor={colors.tabIconDefault}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setError('');
                    setSuccess('');
                  }}
                  returnKeyType="done"
                  onSubmitEditing={handleResetPassword}
                />
              </View>

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              {success ? (
                <Text style={styles.successText}>{success}</Text>
              ) : null}
            </View>

            <View style={[styles.separator, { backgroundColor: colors.borderInput }]} />

            <CustomButton
              title={loading ? "Vérification..." : "Réinitialiser le mot de passe"}
              onPress={handleResetPassword}
              variant="primary"
              size="large"
              loading={loading}
              disabled={!isFormValid || loading}
            />

            <TouchableOpacity 
              style={styles.backToLogin} 
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={[styles.backToLoginText, { color: colors.text }]}>
                Retour à la connexion
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
    marginBottom: 20,
    padding: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 22,
  },
  devNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  devNoteText: {
    fontSize: 12,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 20,
  },
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
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  successText: {
    color: '#34C759',
    fontSize: 14,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    marginVertical: 25,
  },
  backToLogin: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 60,
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PasswordForgotScreen;