import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuditCard from '../../components/Dashboard/AuditCard';
import DocumentCard from '../../components/Dashboard/DocumentCard';
import NewAuditFormModal from '../../components/Dashboard/NewAuditFormModal';
import NotificationCard from '../../components/Dashboard/NotificationCard';
import StatsCard from '../../components/Dashboard/StatsCard';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import ParticleText from '../../components/effects/ParticleText';
import { useTheme } from '../../context/ThemeContext';
import { useWorkflow } from '../../context/WorkflowContext';
import { documentsData, notificationsData, statsData } from '../../data/index';
import { ColorKey, VariantType } from '../../types/index';

const Dashboard = () => {
  const { theme } = useTheme();
  const { getUserRequests, currentUser } = useWorkflow();
  const navigate = useNavigate();

  const [showNewAuditForm, setShowNewAuditForm] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    const seenIntro = localStorage.getItem('introSeen');
    return !seenIntro;
  });

  const [notifications, setNotifications] = useState(notificationsData);
  const userAudits = getUserRequests(currentUser.id);

  const handleMarkRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleRemove = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getColorClasses = (color: ColorKey, variant: VariantType = 'bg'): string => {
    const colorMap: Record<ColorKey, Record<VariantType, string>> = {
      primary: {
        bg: theme === 'dark' ? 'bg-primary/20' : 'bg-blue-50',
        text: theme === 'dark' ? 'text-primary' : 'text-blue-600',
        border: theme === 'dark' ? 'border-primary/30' : 'border-blue-200'
      },
      secondary: {
        bg: theme === 'dark' ? 'bg-secondary-dark/20' : 'bg-blue-50',
        text: theme === 'dark' ? 'text-secondary-dark' : 'text-blue-600',
        border: theme === 'dark' ? 'border-secondary-dark/30' : 'border-blue-200'
      },
      accent: {
        bg: theme === 'dark' ? 'bg-accent-dark/20' : 'bg-purple-50',
        text: theme === 'dark' ? 'text-accent-dark' : 'text-purple-600',
        border: theme === 'dark' ? 'border-accent-dark/30' : 'border-purple-200'
      },
      info: {
        bg: theme === 'dark' ? 'bg-info/20' : 'bg-sky-50',
        text: theme === 'dark' ? 'text-info' : 'text-sky-600',
        border: theme === 'dark' ? 'border-info/30' : 'border-sky-200'
      },
      success: {
        bg: theme === 'dark' ? 'bg-success-dark/20' : 'bg-emerald-50',
        text: theme === 'dark' ? 'text-success-dark' : 'text-emerald-600',
        border: theme === 'dark' ? 'border-success-dark/30' : 'border-emerald-200'
      },
      warning: {
        bg: theme === 'dark' ? 'bg-warning-dark/20' : 'bg-amber-50',
        text: theme === 'dark' ? 'text-warning-dark' : 'text-amber-600',
        border: theme === 'dark' ? 'border-warning-dark/30' : 'border-amber-200'
      },
      error: {
        bg: theme === 'dark' ? 'bg-error-dark/20' : 'bg-red-50',
        text: theme === 'dark' ? 'text-error-dark' : 'text-red-600',
        border: theme === 'dark' ? 'border-error-dark/30' : 'border-red-200'
      }
    };

    return colorMap[color]?.[variant] || colorMap.info[variant];
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <ParticleText
            onComplete={() => {
              localStorage.setItem('introSeen', 'true');
              setShowIntro(false);
            }}
          />
        )}
      </AnimatePresence>

      <DashboardLayout>
        <AnimatePresence>
          {!showIntro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Dashboard Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
                {statsData.map((stat, index) => (
                  <StatsCard
                    key={index}
                    {...stat}
                    index={index}
                    theme={theme}
                    getColorClasses={getColorClasses}
                    onClick={() => navigate('/projects', { state: { filter: stat.label.toLowerCase() } })}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`p-4 lg:p-6 rounded-2xl border backdrop-blur-sm ${theme === 'dark'
                      ? 'bg-gradient-to-br from-surface-dark/80 to-surface-secondary-dark/50 border-surface-secondary-dark/30 shadow-dark-card'
                      : 'bg-surface-light/80 border-gray-200'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg lg:text-xl font-semibold">Security Audits</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => { }}
                          className={`p-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                            ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
                            : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
                            }`}>
                          <Filter className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate('/projects')}
                          className="text-secondary-dark hover:underline text-sm font-medium"
                        >
                          View All →
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {userAudits.length > 0 ? (
                        userAudits.map((audit) => (
                          <AuditCard
                            key={audit.id}
                            audit={audit}
                            onClick={() => navigate(`/audit/${audit.id}`)}
                            theme={theme}
                            getColorClasses={getColorClasses}
                          />
                        ))
                      ) : (
                        <div className={`p-8 text-center border-2 border-dashed rounded-xl ${theme === 'dark' ? 'border-surface-secondary-dark/30 text-text-secondary-dark' : 'border-gray-200 text-gray-500'}`}>
                          <p className="font-medium">No audits found</p>
                          <p className="text-sm mt-1">Start by requesting your first security audit</p>
                        </div>
                      )}
                    </div>
                    <motion.button
                      onClick={() => setShowNewAuditForm(true)}
                      className={`w-full mt-4 p-3 border-2 border-dashed rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group ${theme === 'dark'
                        ? 'border-secondary-dark/30 text-secondary-dark hover:bg-secondary-dark/10 hover:border-secondary-dark/50'
                        : 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
                      <span className="font-medium">Request New Audit</span>
                    </motion.button>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  {/* Documents */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`p-4 lg:p-6 rounded-2xl border backdrop-blur-sm ${theme === 'dark'
                      ? 'bg-gradient-to-br from-surface-dark/80 to-surface-secondary-dark/50 border-surface-secondary-dark/30 shadow-dark-card'
                      : 'bg-surface-light/80 border-gray-200'
                      }`}
                  >
                    <h3 className="text-lg font-semibold mb-4">Documents</h3>
                    <div className="space-y-3">
                      {documentsData.length > 0 ? (
                        documentsData.map((doc) => (
                          <DocumentCard
                            key={doc.id}
                            doc={doc}
                            onPreview={() => alert('Previewing ' + doc.name)}
                            onDownload={() => alert('Downloading ' + doc.name)}
                            theme={theme}
                            getColorClasses={getColorClasses}
                          />
                        ))
                      ) : (
                        <div className={`p-6 text-center border-2 border-dashed rounded-xl ${theme === 'dark' ? 'border-surface-secondary-dark/30 text-text-secondary-dark' : 'border-gray-200 text-gray-500'}`}>
                          <p className="text-sm font-medium">No documents yet</p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Notifications */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className={`p-4 lg:p-6 rounded-2xl border backdrop-blur-sm ${theme === 'dark'
                      ? 'bg-gradient-to-br from-surface-dark/80 to-surface-secondary-dark/50 border-surface-secondary-dark/30 shadow-dark-card'
                      : 'bg-surface-light/80 border-gray-200'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Recent Notifications</h3>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            theme={theme}
                            getColorClasses={getColorClasses}
                            onMarkRead={() => handleMarkRead(notification.id)}
                            onRemove={() => handleRemove(notification.id)}
                          />
                        ))
                      ) : (
                        <div className={`p-6 text-center border-2 border-dashed rounded-xl ${theme === 'dark' ? 'border-surface-secondary-dark/30 text-text-secondary-dark' : 'border-gray-200 text-gray-500'}`}>
                          <p className="text-sm font-medium">No new notifications</p>
                        </div>
                      )}
                    </div>
                    <motion.button
                      onClick={markAllAsRead}
                      className={`w-full mt-4 p-2 text-sm rounded-lg transition-all duration-200 ${theme === 'dark'
                        ? 'text-secondary-dark hover:bg-secondary-dark/10'
                        : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Mark all as read
                    </motion.button>
                  </motion.div>
                </div>
              </div>

              {/* New Audit Form Modal */}
              <NewAuditFormModal
                show={showNewAuditForm}
                onClose={() => setShowNewAuditForm(false)}
                theme={theme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;