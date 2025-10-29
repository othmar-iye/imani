// src/constants/theme.js
import { AppColors } from './colors';

export const Theme = {
  light: {
    text: AppColors.grayDark,
    textBlack: AppColors.black,
    background: AppColors.white,
    tint: AppColors.primary,
    card: AppColors.grayLight,
    border: AppColors.grayMedium,
    borderInput: AppColors.grayInter,
    tabIconDefault: AppColors.grayMedium,
    tabIconSelected: AppColors.primary,
  },
  dark: {
    text: AppColors.white,
    background: AppColors.black,
    tint: AppColors.primary,
    card: AppColors.grayDark,
    border: AppColors.grayMedium,
    tabIconDefault: AppColors.grayMedium,
    tabIconSelected: AppColors.primary,
  },
};
