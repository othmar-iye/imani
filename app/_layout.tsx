// app/_layout.tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/src/context/AuthContext';
import { CustomThemeProvider } from '@/src/context/ThemeContext';
import '@/src/libs/i18n';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 1. Import pour la détection réseau
import NetInfo from '@react-native-community/netinfo';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Empêcher le splash screen automatique
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  
  // 2. États SIMPLES pour la gestion réseau
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerColor, setBannerColor] = useState('#4ECDC4');
  
  // 3. Récupérer les insets Safe Area pour iPhone
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function prepare() {
      try {
        // Simuler un temps de chargement
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // 4. Détection de la connexion réseau - VERSION SIMPLE
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      
      if (isConnected !== connected) {
        setIsConnected(connected);
        
        if (connected === false) {
          // Perte de connexion
          setBannerMessage("📡 Vérifiez votre connexion internet");
          setBannerColor('#FF6B6B');
          setShowBanner(true);
        } else {
          // Connexion rétablie
          setBannerMessage("✅ Connexion rétablie");
          setBannerColor('#4ECDC4');
          
          // Cacher après 3 secondes
          setTimeout(() => {
            setShowBanner(false);
          }, 3000);
        }
      }
    });

    return () => unsubscribe();
  }, [isConnected]);

  // Afficher le splash screen personnalisé pendant le chargement
  if (!appIsReady) {
    return (
      <View style={[
        styles.container,
        colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer
      ]}>
        <Image 
          source={require('@/assets/images/logo.png')} 
          style={styles.logo}
        />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CustomThemeProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <View style={styles.fullScreen}>
              
              {/* Bannière réseau - SIMPLE et EFFICACE */}
              {showBanner && (
                <View 
                  style={[
                    styles.networkBanner,
                    { 
                      backgroundColor: bannerColor,
                      paddingTop: insets.top,
                      height: 50 + insets.top,
                    }
                  ]}
                >
                  <Text style={styles.bannerText}>
                    {bannerMessage}
                  </Text>
                </View>
              )}
              
              {/* Contenu principal */}
              <View style={[
                styles.mainContent,
                showBanner && styles.contentWithBanner
              ]}>
                <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="index" />
                </Stack>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              </View>
              
            </View>
          </ThemeProvider>
        </CustomThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  // Bannière réseau - SIMPLE
  networkBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 15, // Beaucoup d'espace
  },
  mainContent: {
    flex: 1,
  },
  contentWithBanner: {
    paddingTop: 50, // Décale tout le contenu quand bannière visible
  },
});