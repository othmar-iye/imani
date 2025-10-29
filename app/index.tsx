// app/index.tsx
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Index = () => {
  const { user, loading } = useAuth();

  // Pendant le chargement, afficher un indicateur
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Theme.light.tint} />
      </View>
    );
  }

  // Si l'utilisateur est connecté, rediriger vers la home
  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers le welcome
  return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Index;