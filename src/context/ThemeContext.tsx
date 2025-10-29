// contexts/ThemeContext.tsx
import { Theme } from '@/constants/theme';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  colors: typeof Theme.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
  };

  const colors = isDark ? Theme.dark : Theme.light;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};