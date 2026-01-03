import React from 'react';
import { motion } from 'framer-motion';
import { ColorKey, VariantType } from '../types/index';


interface QuickActionCardProps {
  action: any;
  theme: string;
  getColorClasses: (color: ColorKey, variant: VariantType) => string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ action, theme, getColorClasses }) => {
  const Icon = action.icon;

  return (
    <motion.button
      className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center space-y-2 group backdrop-blur-sm ${
        theme === 'dark'
          ? 'border-surface-secondary-dark/30 hover:bg-surface-secondary-dark/30 hover:border-secondary-dark/50 shadow-dark-card hover:shadow-dark-elevated'
          : 'border-gray-200 hover:bg-gray-50 hover:border-blue-200'
      }`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
          getColorClasses(action.color, 'bg')
        } ${getColorClasses(action.color, 'text')}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-center">
        <span className="text-xs font-medium block">{action.label}</span>
        <span
          className={`text-xs ${
            theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
          }`}
        >
          {action.description}
        </span>
      </div>
    </motion.button>
  );
};

export default QuickActionCard;