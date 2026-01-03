import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  // Base styles
  const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-2.5 px-4',
    lg: 'text-base py-3 px-5',
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-secondary-dark to-accent-dark text-white hover:shadow-lg dark:from-secondary-light dark:to-accent-light dark:hover:shadow-glow dark:shadow-accent-light/20 focus:ring-accent-dark dark:focus:ring-accent-light',
    secondary: 'bg-gradient-to-r from-primary-dark/90 to-secondary-dark/90 text-white hover:shadow-md dark:from-primary-light/90 dark:to-secondary-light/90 dark:shadow-primary-light/20 focus:ring-secondary-dark dark:focus:ring-secondary-light',
    outline: 'border border-secondary-dark dark:border-secondary-light text-secondary-dark dark:text-secondary-light hover:bg-secondary-dark/10 dark:hover:bg-secondary-light/10 focus:ring-secondary-dark dark:focus:ring-secondary-light',
    text: 'text-secondary-dark dark:text-secondary-light hover:bg-secondary-dark/10 dark:hover:bg-secondary-light/10 focus:ring-secondary-dark dark:focus:ring-secondary-light',
  };
  
  // Disabled styles
  const disabledStyles = 'opacity-60 cursor-not-allowed';
  
  // Loading styles
  const loadingStyles = 'cursor-wait';
  
  return (
    <motion.button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${props.disabled ? disabledStyles : ''}
        ${isLoading ? loadingStyles : ''}
        ${className || ''}
      `}
      whileHover={!props.disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!props.disabled && !isLoading ? { scale: 0.98 } : {}}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;