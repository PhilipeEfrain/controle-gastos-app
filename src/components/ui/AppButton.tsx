import React from 'react';
import { Text, Pressable, PressableProps } from 'react-native';

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
  disabled,
  children,
  ...props
}) => {
  let variantBg = 'bg-emerald-600 active:bg-emerald-700 hover:bg-emerald-500 shadow-sm shadow-emerald-950';
  let textColor = 'text-white font-semibold';

  if (variant === 'secondary') {
    variantBg = 'bg-slate-800 active:bg-slate-700 hover:bg-slate-750 border border-slate-700';
    textColor = 'text-slate-100 font-semibold';
  } else if (variant === 'danger') {
    variantBg = 'bg-red-600 active:bg-red-700 hover:bg-red-500 shadow-sm shadow-red-950';
    textColor = 'text-white font-semibold';
  } else if (variant === 'outline') {
    variantBg = 'bg-transparent border border-slate-700 active:bg-slate-800 hover:bg-slate-850';
    textColor = 'text-slate-200 font-medium';
  }

  if (disabled) {
    variantBg += ' opacity-50 cursor-not-allowed';
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`py-3 px-5 rounded-xl items-center justify-center transition-all cursor-pointer active:scale-[0.98] ${variantBg} ${className}`}
      {...props}
    >
      {children ? (
        children
      ) : (
        <Text className={`text-base tracking-wide ${textColor} ${textClassName}`}>{label}</Text>
      )}
    </Pressable>
  );
};
