import React, { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    const { theme } = useTheme();
    
    return (
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <label className="block text-sm font-medium mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </span>
          )}
          
          <input
            ref={ref}
            className={`
              w-full px-4 py-2 rounded-lg outline-none transition-all duration-300
              ${leftIcon ? 'pl-10' : ''} 
              ${rightIcon ? 'pr-10' : ''}
              ${theme === 'dark' 
                ? 'bg-surface-dark/50 border border-secondary-dark/30 focus:border-secondary-dark text-text-dark placeholder:text-text-dark/50' 
                : 'bg-surface-light/50 border border-secondary-light/30 focus:border-secondary-light text-text-light placeholder:text-text-light/50'}
              ${error ? 'border-error' : ''}
              ${className || ''}
            `}
            {...props}
          />
          
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </span>
          )}
        </div>
        
        {error && (
          <motion.p 
            className="mt-1 text-sm text-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export default Input;