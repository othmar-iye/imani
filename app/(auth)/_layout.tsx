// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="welcome">
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="password_forgot" />
      <Stack.Screen name="password_new" />
      <Stack.Screen name="password_confirmed" />
    </Stack>
  );
}