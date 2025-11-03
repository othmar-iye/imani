// components/ValidationInfoCard.tsx
import React from 'react';
import { InfoBox } from './InfoBox';

interface ValidationInfoCardProps {
  colors: any;
}

export const ValidationInfoCard: React.FC<ValidationInfoCardProps> = ({
  colors
}) => {
  return (
    <InfoBox
      icon="shield-checkmark-outline"
      message="Votre annonce sera examinée par notre équipe avant d'être publiée. Vous serez notifié une fois validée."
      colors={colors}
    />
  );
};