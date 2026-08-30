import React from 'react';
import { View, ViewProps } from 'react-native';

interface AppCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const AppCard: React.FC<AppCardProps> = ({ children, className = '', style, ...props }) => {
  return (
    <View
      className={`bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg shadow-black/30 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};
