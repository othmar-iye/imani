// components/CustomButton.tsx
import { useCustomTheme } from '@/src/context/ThemeContext';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  shadowColor?: string;
  style?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  backgroundColor,
  textColor,
  shadowColor,
  style,
}) => {
  const { colors } = useCustomTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size
    const sizeStyles: { [key: string]: ViewStyle } = {
      small: { paddingHorizontal: 16, paddingVertical: 8 },
      medium: { paddingHorizontal: 20, paddingVertical: 12 },
      large: { paddingHorizontal: 24, paddingVertical: 16 },
    };

    // Variant
    const variantStyles: { [key: string]: ViewStyle } = {
      primary: {
        backgroundColor: backgroundColor || colors.tint,
      },
      secondary: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.card,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.tint,
      },
    };

    // Shadow
    const shadowStyle: ViewStyle = {
      shadowColor: shadowColor || colors.card,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...shadowStyle,
      ...style,
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 16,
      fontWeight: '600',
    };

    const sizeStyles: { [key: string]: TextStyle } = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantTextStyles: { [key: string]: TextStyle } = {
      primary: {
        color: textColor || '#ffffff',
      },
      secondary: {
        color: colors.text,
      },
      outline: {
        color: colors.tint,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#ffffff' : colors.tint} 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;