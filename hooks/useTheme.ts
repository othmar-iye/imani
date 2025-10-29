// src/hooks/useTheme.js
import { useColorScheme } from 'react-native';
import { Theme } from '../constants/theme'; // relatif

export default function useTheme() {
  const colorScheme = useColorScheme(); // 'light' | 'dark'
  return Theme[colorScheme ?? 'light'];
}
