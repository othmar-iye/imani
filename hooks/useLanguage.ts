// hooks/useLanguage.ts
import { changeAppLanguage, getCurrentLanguage, resetToAutoLanguage } from '@/src/libs/i18n';
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await changeAppLanguage(lng);
  };

  const resetLanguage = async () => {
    await resetToAutoLanguage();
  };

  const currentLanguage = getCurrentLanguage();

  return {
    currentLanguage,
    changeLanguage,
    resetLanguage,
    isFrench: currentLanguage === 'fr',
    isEnglish: currentLanguage === 'en',
  };
};