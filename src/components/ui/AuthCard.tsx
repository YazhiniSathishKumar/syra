import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className={`relative w-full max-w-md px-6 py-8 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm
        ${theme === 'dark' 
          ? 'bg-surface-dark/80 border border-secondary-dark/30' 
          : 'bg-surface-light/80 border border-secondary-light/30'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{
        animation: 'float 6s ease-in-out infinite'
      }}
    >
      {/* Animated gradient background */}
      <motion.div 
        className={`absolute inset-0 opacity-10 z-0 bg-gradient-to-br 
          ${theme === 'dark' 
            ? 'from-secondary-dark via-primary-dark to-accent-dark' 
            : 'from-secondary-light via-primary-light to-accent-light'} 
          animate-shimmer bg-[length:200%_200%]`}
        animate={{
          scale: [1, 1.02, 1],
          rotate: [0, 1, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating animated circles */}
      <motion.div 
        className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent-dark/20 dark:bg-accent-light/20 blur-xl"
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-secondary-dark/20 dark:bg-secondary-light/20 blur-xl"
        animate={{
          y: [0, 10, 0],
          x: [0, -5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10">
        <motion.h2 
          className="text-2xl md:text-3xl font-display font-bold text-center mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
        
        {subtitle && (
          <motion.p 
            className="text-center mb-6 opacity-80 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}
        
        {children}
      </div>
    </motion.div>
  );
};

export default AuthCard;