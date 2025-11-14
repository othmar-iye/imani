// components/ValidationInfoCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { InfoBox } from '../InfoBox';

interface ValidationInfoCardProps {
  colors: any;
}

export const ValidationInfoCard: React.FC<ValidationInfoCardProps> = ({
  colors
}) => {
  const { t } = useTranslation();

  return (
    <InfoBox
      icon="shield-checkmark-outline"
      message={t('sell.adminValidationInfo', 'Votre annonce sera examinée par notre équipe avant d\'être publiée. Vous serez notifié une fois validée.')}
      colors={colors}
    />
  );
};