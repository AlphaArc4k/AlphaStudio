import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'disabled';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  icon,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-all disabled:opacity-50";
  
  const variantStyles = {
    primary: "bg-purple-500 hover:bg-purple-600 disabled:hover:bg-purple-500",
    secondary: "border border-gray-800 hover:bg-gray-800/50 disabled:hover:bg-transparent",
    disabled: "cursor-not-allowed hover:bg-gray-800/50",
  };
  variant = disabled ? 'disabled' : variant;

  return (
    <button
      className={
        disabled
        ? (
          `${baseStyles} ${className} ${variantStyles[variant]}`
        )
        : className || `${baseStyles} ${variantStyles[variant]}`
      }
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

