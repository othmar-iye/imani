// screens/AboutScreen.tsx
import { AppConfig } from '@/constants/app';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export default function AboutScreen() {
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

  const appInfo = {
    version: '1.0.0',
    build: '2025.1',
    releaseDate: 'Décembre 2025'
  };

  const features = [
    {
      icon: 'shield-checkmark',
      title: t('secure', 'Sécurisé'),
      description: t('secureDesc', 'Transactions protégées')
    },
    {
      icon: 'flash',
      title: t('fast', 'Rapide'),
      description: t('fastDesc', 'Interface fluide')
    },
    {
      icon: 'heart',
      title: t('reliable', 'Fiable'),
      description: t('reliableDesc', 'Communauté de confiance')
    },
    {
      icon: 'star',
      title: t('quality', 'Qualité'),
      description: t('qualityDesc', 'Expérience optimale')
    }
  ];

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Erreur ouverture lien:', err));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header simplifié */}
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
          {t('about', 'À propos')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Hero simplifiée */}
        <View style={[styles.heroSection, { backgroundColor: colors.card }]}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={[styles.appName, { color: colors.text }]}>
            {AppConfig.name}
          </Text>
          
          <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
            {t('appTagline', 'Votre marketplace de confiance')}
          </Text>
          
          <View style={[styles.versionBadge, { backgroundColor: colors.tint + '15' }]}>
            <Text style={[styles.versionText, { color: colors.tint }]}>
              {t('version', 'Version')} {appInfo.version}
            </Text>
          </View>
        </View>

        {/* Section Description compacte */}
        <View style={styles.contentSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('ourMission', 'Notre Mission')}
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {t('missionDescription', '{{appName}} connecte acheteurs et vendeurs dans une expérience sécurisée et intuitive. Nous simplifions le commerce en ligne avec une plateforme fiable et performante.', { appName: AppConfig.name })}
          </Text>
        </View>

        {/* Section Features en ligne */}
        <View style={styles.contentSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('ourStrengths', 'Nos Atouts')}
          </Text>
          
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <View 
                key={index} 
                style={styles.featureItem}
              >
                <View style={[styles.featureIcon, { backgroundColor: colors.tint }]}>
                  <Ionicons name={feature.icon as any} size={16} color="#FFF" />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Section Contact unifiée */}
        <View style={styles.contentSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('contact', 'Contact')}
          </Text>
          
          <View style={[styles.contactCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity 
              style={[styles.contactButton, { borderBottomColor: colors.border }]}
              onPress={() => openLink('mailto:support@imani.com')}
            >
              <Ionicons name="mail-outline" size={20} color={colors.tint} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                support@imani.com
              </Text>
              <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.contactButton, { borderBottomColor: colors.border }]}
              onPress={() => openLink('https://imani.com')}
            >
              <Ionicons name="globe-outline" size={20} color={colors.tint} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                imani.com
              </Text>
              <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.contactButton}>
              <Ionicons name="location-outline" size={20} color={colors.tint} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                {t('location', 'Lubumbashi, RDC')}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer minimaliste */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            © 2025 {AppConfig.name} • {t('madeWithLove', 'Fait avec ❤️')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Les styles restent identiques...
const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
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
    paddingBottom: 20,
  },
  heroSection: {
    alignItems: 'center',
    padding: 32,
    margin: 20,
    marginBottom: 16,
    borderRadius: 20,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  versionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  contactCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
  },
});