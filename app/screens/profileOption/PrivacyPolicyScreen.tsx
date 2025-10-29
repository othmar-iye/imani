// screens/PrivacyPolicyScreen.tsx
import { AppConfig } from '@/constants/app';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header harmonisé avec AboutScreen */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={colors.tint} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('privacyTitle', "Politique de confidentialité")}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
            {t('lastUpdated', "Dernière mise à jour : Décembre 2025")}
          </Text>

          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('privacyIntro', "{{appName}} (\"nous\", \"notre\", \"nos\") s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles.", { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            1. {t('infoCollectionTitle', "Informations que nous collectons")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('infoCollectionText', "Nous collectons les informations que vous nous fournissez directement, telles que votre nom, adresse e-mail, numéro de téléphone, et les informations de votre profil lorsque vous créez un compte sur {{appName}}.", { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            2. {t('infoUsageTitle', "Utilisation des informations")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('infoUsageText1', "Nous utilisons vos informations pour :")}
            {"\n"}• {t('infoUsageItem1', "Fournir et améliorer nos services")}
            {"\n"}• {t('infoUsageItem2', "Personnaliser votre expérience utilisateur")}
            {"\n"}• {t('infoUsageItem3', "Communiquer avec vous concernant votre compte")}
            {"\n"}• {t('infoUsageItem4', "Assurer la sécurité de notre plateforme")}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            3. {t('infoSharingTitle', "Partage des informations")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('infoSharingText', "Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles à des tiers sans votre consentement, sauf dans les cas prévus par la loi ou pour fournir nos services.")}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            4. {t('dataProtectionTitle', "Protection des données")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('dataProtectionText', "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos informations personnelles contre tout accès non autorisé, modification, divulgation ou destruction.")}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            5. {t('yourRightsTitle', "Vos droits")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('yourRightsText', "Vous avez le droit d'accéder à vos informations personnelles, de les rectifier, de les supprimer, ou de vous opposer à leur traitement. Vous pouvez exercer ces droits en nous contactant à privacy@imani.com.")}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            6. {t('cookiesTitle', "Cookies et technologies similaires")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('cookiesText', "Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, analyser l'utilisation de notre application et personnaliser le contenu.")}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            7. {t('dataRetentionTitle', "Conservation des données")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('dataRetentionText', "Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales.")}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            8. {t('policyChangesTitle', "Modifications de la politique")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('policyChangesText', "Nous pouvons modifier cette politique de confidentialité. Nous vous informerons de tout changement important en publiant la nouvelle politique sur cette page.")}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            9. {t('contactPrivacyTitle', "Nous contacter")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('contactPrivacyText1', "Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à :")}
            {"\n\n"}{t('email', "Email")} : privacy@imani.com
            {"\n"}{t('website', "Site web")} : www.imani.com
          </Text>

          <Text style={[styles.footer, { color: colors.textSecondary }]}>
            {t('privacyFooter', "En utilisant {{appName}}, vous acceptez les termes de cette politique de confidentialité.", { appName: AppConfig.name })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  // Header harmonisé avec AboutScreen
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    margin: 20,
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
    overflow: 'hidden',
  },
  lastUpdated: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    lineHeight: 24,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'justify',
  },
  footer: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 30,
    textAlign: 'center',
    lineHeight: 20,
  },
});