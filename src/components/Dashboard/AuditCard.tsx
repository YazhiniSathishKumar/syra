import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe } from 'lucide-react';

import { ColorKey, VariantType } from '../../types/index';
import { AuditRequest } from '../../context/WorkflowContext';

interface AuditCardProps {
  audit: AuditRequest;
  onClick: () => void;
  theme: string;
  getColorClasses: (color: ColorKey, variant: VariantType) => string;
}

const AuditCard: React.FC<AuditCardProps> = ({
  audit,
  onClick,
  theme,
  getColorClasses,
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer group backdrop-blur-sm ${theme === 'dark'
        ? 'border-surface-secondary-dark/30 hover:bg-surface-secondary-dark/30 hover:border-secondary-dark/50 shadow-dark-card'
        : 'border-gray-200 hover:bg-gray-50 hover:border-blue-200'
        }`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${audit.auditType === 'network'
              ? getColorClasses('info', 'bg') + ' ' + getColorClasses('info', 'text')
              : audit.auditType === 'web'
                ? getColorClasses('success', 'bg') +
                ' ' +
                getColorClasses('success', 'text')
                : getColorClasses('secondary', 'bg') +
                ' ' +
                getColorClasses('secondary', 'text')
              }`}
          >
            {audit.auditType === 'network' ? (
              <Shield className="w-4 h-4" />
            ) : audit.auditType === 'web' ? (
              <Globe className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="font-medium">Web Audit</h4>

          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!(audit.auditType === 'web' && (audit.status === 'approved' || audit.status === 'completed')) && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${audit.status === 'completed' || audit.status === 'approved'
                ? `${getColorClasses('success', 'bg')} ${getColorClasses('success', 'text')}`
                : audit.status === 'in-progress'
                  ? `${getColorClasses('info', 'bg')} ${getColorClasses('info', 'text')}`
                  : `${getColorClasses('warning', 'bg')} ${getColorClasses('warning', 'text')}`
                }`}
            >
              {audit.status}
            </span>
          )}
          {!(audit.auditType === 'web' && audit.priority === 'high') && (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${audit.priority === 'high'
                ? getColorClasses('error', 'bg') +
                ' ' +
                getColorClasses('error', 'text')
                : audit.priority === 'medium'
                  ? getColorClasses('warning', 'bg') +
                  ' ' +
                  getColorClasses('warning', 'text')
                  : getColorClasses('success', 'bg') +
                  ' ' +
                  getColorClasses('success', 'text')
                }`}
            >
              {audit.priority}
            </span>
          )}
        </div>
      </div>
      {audit.progress > 0 && audit.progress < 100 && (
        <div
          className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-surface-secondary-dark' : 'bg-gray-200'
            }`}
        >
          <div
            className="bg-gradient-to-r from-secondary-dark to-accent-dark h-2 rounded-full transition-all duration-500"
            style={{ width: `${audit.progress}%` }}
          ></div>
        </div>
      )}
    </motion.div>
  );
};

export default AuditCard;