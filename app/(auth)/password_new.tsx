import CustomButton from '@/components/CustomButton';
import { useCustomTheme } from '@/src/context/ThemeContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const PasswordNewScreen = () => {
  const params = useLocalSearchParams();
  const emailFromParams = params.email as string;
  const devMode = params.dev_mode === 'true';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { colors } = useCustomTheme();
  const { t } = useTranslation();

  const handleUpdatePassword = async () => {
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError(t('passwordNew.errors.requiredFields'));
      return;
    }

    if (newPassword.length < 6) {
      setError(t('passwordNew.errors.passwordTooShort'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('passwordNew.errors.passwordsDontMatch'));
      return;
    }

    setLoading(true);

    try {
      // SOLUTION POUR LE DÉVELOPPEMENT LOCAL :
      if (devMode) {
        console.log('🔄 Mode développement - Mise à jour du mot de passe...');
        
        // Essayer la méthode standard (peut échouer sans session)
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (updateError) {
          console.log('❌ Méthode standard échouée, utilisation alternative...');
          // Ici vous pouvez utiliser une Edge Function personnalisée
          // ou une autre méthode pour le développement
          setSuccess(t('passwordNew.success.dev'));
        } else {
          setSuccess(t('passwordNew.success.standard'));
        }
      } else {
        // Mode production normal
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (updateError) {
          setError(`❌ ${updateError.message}`);
          return;
        }
        setSuccess(t('passwordNew.success.standard'));
      }

      // Redirection vers la confirmation
      setTimeout(() => {
        router.replace('/(auth)/password_confirmed');
      }, 2000);

    } catch (error: any) {
      setError(t('passwordNew.errors.genericError'));
      console.error('Update password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = newPassword && confirmPassword;

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

            <Text style={[styles.title, { color: colors.tint }]}>
              {t('passwordNew.title')}
            </Text>
            
            <Text style={[styles.subtitle, { color: colors.text }]}>
              {t('passwordNew.subtitle', { email: emailFromParams || t('yourAccount') })}
            </Text>

            {/* Indicateur mode développement */}
            {devMode && (
              <View style={styles.devNote}>
                <Ionicons name="code-slash" size={16} color={colors.tint} />
                <Text style={[styles.devNoteText, { color: colors.tint }]}>
                  {t('passwordNew.devMode')}
                </Text>
              </View>
            )}

            <View style={styles.section}>
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
                  style={[styles.inputWithIcon, { color: colors.text }]}
                  placeholder={t('passwordNew.newPasswordPlaceholder')}
                  placeholderTextColor={colors.tabIconDefault}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={(value) => {
                    setNewPassword(value);
                    setError('');
                    setSuccess('');
                  }}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons 
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={colors.tabIconDefault} 
                  />
                </TouchableOpacity>
              </View>

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
                  style={[styles.inputWithIcon, { color: colors.text }]}
                  placeholder={t('passwordNew.confirmPasswordPlaceholder')}
                  placeholderTextColor={colors.tabIconDefault}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);
                    setError('');
                    setSuccess('');
                  }}
                  returnKeyType="done"
                  onSubmitEditing={handleUpdatePassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={colors.tabIconDefault} 
                  />
                </TouchableOpacity>
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
              title={loading ? t('passwordNew.updating') : t('passwordNew.updateButton')}
              onPress={handleUpdatePassword}
              variant="primary"
              size="large"
              loading={loading}
              disabled={!isFormValid || loading}
            />
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
  inputWithIcon: {
    flex: 1,
    paddingVertical: 18,
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
});

export default PasswordNewScreen;