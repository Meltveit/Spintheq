'use client';

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles = 'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-800';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-400 text-white disabled:bg-blue-400/70',
    secondary: 'bg-purple-500 hover:bg-purple-400 text-white disabled:bg-purple-400/70',
    outline: 'bg-transparent border-2 border-blue-500 text-blue-300 hover:bg-blue-800 disabled:border-blue-400/70 disabled:text-blue-400/70'
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-sm px-3 py-1',
    md: 'px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };
  
  // Full width
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Disabled and loading state
  const stateStyles = (disabled || isLoading) ? 'cursor-not-allowed' : '';
  
  // Combined styles
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${stateStyles} ${className}`;
  
  return (
    <button
      className={buttonStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}