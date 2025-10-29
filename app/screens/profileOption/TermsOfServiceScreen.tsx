// screens/TermsOfServiceScreen.tsx
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

export default function TermsOfServiceScreen() {
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
          {t('termsTitle', "Conditions d'utilisation")}
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
            {t('welcomeTerms', "Bienvenue sur {{appName}}. En utilisant notre application, vous acceptez les présentes conditions d'utilisation. Veuillez les lire attentivement.", { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            1. {t('acceptanceTitle', "Acceptation des conditions")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('acceptanceText', "En accédant et en utilisant {{appName}}, vous acceptez d'être lié par ces conditions d'utilisation et par notre politique de confidentialité. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre application.", { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            2. {t('userAccountTitle', "Compte utilisateur")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('userAccountText1', "Pour utiliser certaines fonctionnalités de {{appName}}, vous devez créer un compte. Vous êtes responsable de :", { appName: AppConfig.name })}
            {"\n"}• {t('userAccountItem1', "Maintenir la confidentialité de vos identifiants")}
            {"\n"}• {t('userAccountItem2', "Toutes les activités effectuées via votre compte")}
            {"\n"}• {t('userAccountItem3', "Fournir des informations exactes et à jour")}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            3. {t('allowedUseTitle', "Utilisation autorisée")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('allowedUseText1', "Vous vous engagez à utiliser {{appName}} uniquement à des fins légales et conformément à ces conditions. Vous ne devez pas :", { appName: AppConfig.name })}
            {"\n"}• {t('allowedUseItem1', "Violer les droits de propriété intellectuelle")}
            {"\n"}• {t('allowedUseItem2', "Publier du contenu illégal ou nuisible")}
            {"\n"}• {t('allowedUseItem3', "Perturber le fonctionnement de l'application")}
            {"\n"}• {t('allowedUseItem4', "Tenter d'accéder à des comptes non autorisés")}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            4. {t('userContentTitle', "Contenu des utilisateurs")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('userContentText', "Vous conservez tous les droits sur le contenu que vous publiez sur {{appName}}. En publiant du contenu, vous nous accordez une licence mondiale pour l'utiliser, le reproduire et l'afficher dans le cadre du fonctionnement de l'application.", { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            5. {t('transactionsTitle', "Transactions et paiements")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('transactionsText', "{{appName}} facilite les transactions entre acheteurs et vendeurs. Nous ne sommes pas responsables des litiges entre utilisateurs. Les paiements sont traités par des prestataires tiers sécurisés.", { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            6. {t('intellectualPropertyTitle', "Propriété intellectuelle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('intellectualPropertyText', "Tous les droits de propriété intellectuelle relatifs à l'application {{appName}}, y compris le code source, le design, et le contenu, sont la propriété exclusive de {{appName}} ou de ses concédants de licence.", { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            7. {t('liabilityTitle', "Limitation de responsabilité")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('liabilityText', "{{appName}} est fourni \"tel quel\". Nous ne garantissons pas que l'application sera ininterrompue ou exempte d'erreurs. Dans la mesure permise par la loi, notre responsabilité est limitée.", { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            8. {t('terminationTitle', "Résiliation")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('terminationText', "Nous pouvons résilier ou suspendre votre accès à {{appName}} à tout moment, sans préavis, si vous violez ces conditions d'utilisation.", { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            9. {t('modificationsTitle', "Modifications des conditions")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('modificationsText', "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication dans l'application. Votre utilisation continue de {{appName}} constitue votre acceptation des modifications.", { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            10. {t('governingLawTitle', "Loi applicable")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('governingLawText', "Ces conditions sont régies et interprétées conformément aux lois de la République Démocratique du Congo. Tout litige sera soumis à la juridiction compétente des tribunaux de Lubumbashi.")}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            11. {t('contactUsTitle', "Nous contacter")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('contactUsText1', "Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à :")}
            {"\n\n"}{t('email', "Email")} : legal@imani.com
            {"\n"}{t('website', "Site web")} : www.imani.com
          </Text>

          <Text style={[styles.footer, { color: colors.textSecondary }]}>
            {t('termsFooter', "En utilisant {{appName}}, vous reconnaissez avoir lu, compris et accepté ces conditions d'utilisation.", { appName: AppConfig.name })}
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