import React from 'react';
import { motion } from 'framer-motion';


type ColorKey = 'info' | 'success' | 'warning' | 'error' | 'secondary';

interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: ColorKey; // ← Must be one of the allowed strings
  trend: string;
  description: string;
  index: number;
  theme: string;
  getColorClasses: (color: ColorKey, variant: 'bg' | 'text' | 'border') => string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  color,
  trend,
  description,
  index,
  theme,
  getColorClasses,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={`p-4 lg:p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg group cursor-pointer backdrop-blur-sm ${theme === 'dark'
        ? 'bg-gradient-to-br from-surface-dark/80 to-surface-secondary-dark/50 border-surface-secondary-dark/30 hover:border-secondary-dark/50 shadow-dark-card hover:shadow-dark-elevated'
        : 'bg-surface-light/80 border-gray-200 hover:border-blue-200 hover:shadow-blue-100/50'
        }`}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm mb-1 ${theme === 'dark'
              ? 'text-text-secondary-dark'
              : 'text-text-secondary-light'
              }`}
          >
            {label}
          </p>
          <p className="text-xl lg:text-2xl font-bold mb-1">{value}</p>
          <div className="flex items-center space-x-2">
            {trend && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${getColorClasses(
                  color,
                  'bg'
                )} ${getColorClasses(color, 'text')}`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
        <div
          className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${getColorClasses(
            color,
            'bg'
          )} ${getColorClasses(color, 'text')}`}
        >
          <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
      </div>
      <p
        className={`text-xs mt-3 ${theme === 'dark'
          ? 'text-text-secondary-dark'
          : 'text-text-secondary-light'
          }`}
      >
        {description}
      </p>
    </motion.div>
  );
};

export default StatsCard;