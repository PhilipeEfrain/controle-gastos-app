import React from 'react';
import { Text, Pressable, PressableProps, Platform } from 'react-native';

interface AppButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
  textClassName?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  variant = 'primary',
  className = '',
  textClassName = '',
  onPress,
  ...props
}) => {
  let variantBg = 'bg-emerald-600 active:bg-emerald-700';
  let textColor = 'text-white';

  if (variant === 'secondary') {
    variantBg = 'bg-slate-700 active:bg-slate-600';
    textColor = 'text-slate-100';
  } else if (variant === 'danger') {
    variantBg = 'bg-red-600 active:bg-red-700';
    textColor = 'text-white';
  } else if (variant === 'outline') {
    variantBg = 'bg-transparent border border-slate-600 active:bg-slate-800';
    textColor = 'text-slate-200';
  }

  return (
    <Pressable
      onPress={onPress}
      className={`py-3 px-5 rounded-xl items-center justify-center transition-all ${variantBg} ${className}`}
      {...props}
    >
      <Text className={`font-semibold text-base ${textColor} ${textClassName}`}>{label}</Text>
    </Pressable>
  );
};
