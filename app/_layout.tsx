// app/_layout.tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/src/context/AuthContext';
import { CustomThemeProvider } from '@/src/context/ThemeContext';
import '@/src/libs/i18n';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// 1. Import React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. Créer le client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // Cache de 5 minutes
      gcTime: 10 * 60 * 1000, // Garbage collection après 10 minutes
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // 3. Ajouter QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CustomThemeProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="index" />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </CustomThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}