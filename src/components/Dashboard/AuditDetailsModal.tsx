import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Globe,
  Calendar,
  FileText,
  Target,
  Activity,
  CheckCircle,
  X,
  RefreshCw
} from 'lucide-react';

import { ColorKey, VariantType } from '../types/index';
// Import AuditRequest type
import { AuditRequest } from '../../context/WorkflowContext';

interface AuditDetailsModalProps {
  show: boolean;
  onClose: () => void;
  // Use correct type
  audit: AuditRequest | null;
  theme: string;
  getColorClasses: (color: ColorKey, variant: VariantType) => string;
}

const AuditDetailsModal: React.FC<AuditDetailsModalProps> = ({
  show,
  onClose,
  audit,
  theme,
  getColorClasses,
}) => {
  if (!audit) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-xl ${theme === 'dark'
              ? 'bg-surface-dark/95 border border-surface-secondary-dark/30 shadow-dark-elevated'
              : 'bg-surface-light/95 border border-gray-200'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`p-6 border-b ${theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-xl ${audit.auditType === 'network'
                      ? getColorClasses('info', 'bg') + ' ' + getColorClasses('info', 'text')
                      : audit.auditType === 'web'
                        ? getColorClasses('success', 'bg') + ' ' + getColorClasses('success', 'text')
                        : getColorClasses('secondary', 'bg') + ' ' + getColorClasses('secondary', 'text')
                      }`}
                  >
                    {audit.auditType === 'network' ? (
                      <Shield className="w-6 h-6" />
                    ) : audit.auditType === 'web' ? (
                      <Globe className="w-6 h-6" />
                    ) : (
                      <Shield className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    {/* Fixed property name: name -> companyName or name depending on context, using companyName based on schema */}
                    <h2 className="text-2xl font-bold">{audit.companyName || 'Audit Details'}</h2>
                    <p
                      className={`${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                        }`}
                    >
                      Detailed audit information and results
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-surface-secondary-dark/50' : 'hover:bg-gray-100'
                    }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-surface-secondary-dark/30' : 'bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-secondary-dark" />
                    <span className="text-sm font-medium">Testing Period</span>
                  </div>
                  <p className="font-semibold">{audit.testingPeriod || 'N/A'}</p>
                  <p
                    className={`text-xs ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                      }`}
                  >
                    {audit.completedAt ? 'Completed' : 'Scheduled'}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-surface-secondary-dark/30' : 'bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-secondary-dark" />
                    <span className="text-sm font-medium">Report Delivery</span>
                  </div>
                  <p className="font-semibold">{audit.reportDelivery || 'N/A'}</p>
                  <p
                    className={`text-xs ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                      }`}
                  >
                    {audit.reportUrl ? 'Delivered' : 'Pending'}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-surface-secondary-dark/30' : 'bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-secondary-dark" />
                    <span className="text-sm font-medium">Methodology</span>
                  </div>
                  <p className="font-semibold">{audit.methodology || 'Standard'}</p>
                </div>
                <div
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-surface-secondary-dark/30' : 'bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-secondary-dark" />
                    <span className="text-sm font-medium">Testing Progress</span>
                  </div>
                  {/* Fixed property name: testingProgress -> progress */}
                  <p className="font-semibold">{audit.progress}% of tests complete</p>
                  <div
                    className={`w-full rounded-full h-2 mt-2 ${theme === 'dark' ? 'bg-surface-secondary-dark' : 'bg-gray-200'
                      }`}
                  >
                    <div
                      className="bg-gradient-to-r from-secondary-dark to-accent-dark h-2 rounded-full"
                      style={{ width: `${audit.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Status and Vulnerabilities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status */}
                <div
                  className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-surface-secondary-dark/30' : 'bg-gray-50'
                    }`}
                >
                  <h3 className="text-lg font-semibold mb-4">Status</h3>
                  <div className="space-y-3">
                    {[
                      { status: 'Draft', description: 'Bugcrowd is setting up your pen test', completed: true },
                      { status: 'Launching', description: 'Your pen test is scheduled for launch', completed: true },
                      { status: 'In progress', description: 'Pen testers are testing and validating', completed: audit.progress > 0 },
                      {
                        status: 'Finalizing',
                        description: 'Bugcrowd is preparing reports',
                        // Fixed status check to be case insensitive or match schema
                        completed: audit.status === 'reporting' || audit.status === 'completed',
                      },
                      {
                        status: 'Completed',
                        description: 'Your report is ready for review',
                        completed: audit.status === 'completed',
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${item.completed
                            ? 'bg-success-dark text-white'
                            : theme === 'dark'
                              ? 'bg-surface-secondary-dark'
                              : 'bg-gray-200'
                            }`}
                        >
                          {item.completed && <CheckCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{item.status}</p>
                          <p
                            className={`text-sm ${theme === 'dark'
                              ? 'text-text-secondary-dark'
                              : 'text-text-secondary-light'
                              }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="text-secondary-dark hover:underline text-sm mt-4">View reports</button>
                </div>

                {/* Vulnerabilities */}
                <div
                  className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-surface-secondary-dark/30' : 'bg-gray-50'
                    }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Reported Vulnerabilities</h3>
                    <button className="text-secondary-dark hover:underline text-sm">View all</button>
                  </div>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={theme === 'dark' ? '#334155' : '#e5e7eb'}
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="3"
                          strokeDasharray="30, 70"
                          strokeLinecap="round"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3"
                          strokeDasharray="30, 70"
                          strokeDashoffset="-30"
                          strokeLinecap="round"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeDasharray="40, 60"
                          strokeDashoffset="-60"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm font-medium">Reported</p>
                          <p className="text-2xl font-bold">{audit.vulnerabilities.total}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: 'Critical', count: audit.vulnerabilities.critical, color: 'bg-red-500' },
                      { label: 'High', count: audit.vulnerabilities.high, color: 'bg-orange-500' },
                      { label: 'Medium', count: audit.vulnerabilities.medium, color: 'bg-yellow-500' },
                      { label: 'Low', count: audit.vulnerabilities.low, color: 'bg-green-500' },
                      {
                        label: 'Info',
                        count: audit.vulnerabilities.informational,
                        color: 'bg-blue-500',
                      },
                    ].map((vuln, index) => (
                      <div key={index} className="text-center">
                        <div className={`${vuln.color} text-white text-xs px-2 py-1 rounded mb-1`}>
                          {vuln.label}
                        </div>
                        <p className="text-xl font-bold">{vuln.count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Remediation Section */}
              <div
                className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-surface-secondary-dark/30' : 'bg-gray-50'
                  }`}
              >
                <h3 className="text-lg font-semibold mb-4">Remediation Recommendations</h3>
                <div className="space-y-4">
                  {audit.findings && audit.findings.length > 0 ? (
                    audit.findings.slice(0, 3).map((finding, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-l-4 ${finding.severity === 'critical' ? 'border-red-500 ' + (theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50') :
                          finding.severity === 'high' ? 'border-orange-500 ' + (theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50') :
                            finding.severity === 'medium' ? 'border-yellow-500 ' + (theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50') :
                              'border-green-500 ' + (theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50')
                          }`}
                      >
                        <h4 className={`font-medium ${finding.severity === 'critical' ? 'text-red-600 dark:text-red-400' :
                          finding.severity === 'high' ? 'text-orange-600 dark:text-orange-400' :
                            finding.severity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                              finding.severity === 'low' ? 'text-green-600 dark:text-green-400' :
                                'text-blue-600 dark:text-blue-400'
                          }`}>
                          {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}: {finding.title}
                        </h4>
                        <p
                          className={`text-sm mt-1 ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                            }`}
                        >
                          {finding.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No findings available.</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  onClick={onClose}
                  className={`px-6 py-2 rounded-lg transition-colors ${theme === 'dark'
                    ? 'bg-surface-secondary-dark/50 hover:bg-surface-secondary-dark text-text-dark'
                    : 'bg-gray-100 hover:bg-gray-200 text-text-light'
                    }`}
                >
                  Close
                </button>
                <motion.button
                  className="px-6 py-2 bg-gradient-to-r from-secondary-dark to-accent-dark text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-audit</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuditDetailsModal;