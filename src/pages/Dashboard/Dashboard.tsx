import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../../components/Dashboard/Sidebar';
import Header from '../../components/Dashboard/Header';
import StatsCard from '../../components/Dashboard/StatsCard';
import AuditCard from '../../components/Dashboard/AuditCard';
import DocumentCard from '../../components/Dashboard/DocumentCard';
import NotificationCard from '../../components/Dashboard/NotificationCard';

import NewAuditFormModal from '../../components/Dashboard/NewAuditFormModal';
import ParticleText from '../../components/effects/ParticleText';
import { useTheme } from '../../context/ThemeContext';
import { useWorkflow } from '../../context/WorkflowContext';

// Import data arrays from data.js or directly define here
import {
  statsData,
  documentsData,
  notificationsData
} from '../../data/index';
import { Filter, Plus, BellRing } from 'lucide-react';
import { ColorKey } from '../../types/index'

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const { getUserRequests } = useWorkflow();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showNewAuditForm, setShowNewAuditForm] = useState(false);

  // ✅ Add ParticleText intro state
  const [showIntro, setShowIntro] = useState(() => {
    const seenIntro = localStorage.getItem('introSeen');
    return !seenIntro; // Show intro only if not seen
  });

  const [user, setUser] = useState<{ id: string, fullName: string, email: string } | null>(null);
  const [userAudits, setUserAudits] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    document.title = 'Dashboard | syra';
  }, []);

  const navigate = useNavigate();

  const handleNavigation = (id: string) => {
    switch (id) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'projects':
        navigate('/projects');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'help':
        navigate('/help');
        break;

      default:
        navigate('/dashboard');
        break;
    }
  };

  // State for notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>(notificationsData);

  // Handlers
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

  const getColorClasses = (color: string, variant?: string): string => {
    const validColor = color as ColorKey;

    const colorMap: Record<string, Record<string, string>> = {
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
      },
      secondary: {
        bg: theme === 'dark' ? 'bg-secondary-dark/20' : 'bg-blue-50',
        text: theme === 'dark' ? 'text-secondary-dark' : 'text-blue-600',
        border: theme === 'dark' ? 'border-secondary-dark/30' : 'border-blue-200'
      }
    };

    return (
      colorMap[validColor]?.[variant || 'bg'] ||
      colorMap.info[variant || 'bg']
    );
  };

  const handleDownload = (document: any) => {
    alert(`Starting download for: ${document.name}`);
  };

  const handlePreview = (document: any) => {
    alert(`Opening preview for: ${document.name}`);
  };

  const handleStatClick = (stat: any) => {
    navigate('/projects', { state: { filter: stat.label.toLowerCase() } });
  };

  const handleAuditClick = (audit: any) => {
    navigate(`/audit/${audit.id}`);
  };

  // Load user audits when user is available
  useEffect(() => {
    if (user) {
      const audits = getUserRequests(user.id);
      // If no audits found, add a static web application audit
      if (audits.length === 0) {
        const staticAudit = {
          id: 'audit-web-001',
          name: 'Web Audit',
          contactName: 'Web Admin',
          contactEmail: 'admin@example.com',
          contactPhone: '+1234567890',
          auditType: 'web',
          targetUrl: 'https://example.com',
          description: 'Web application security assessment',
          priority: 'medium',
          methodology: 'OWASP Testing Guide',
          estimatedDuration: '3 days',
          budget: 'Standard',
          preferredStartDate: '2025-12-11',
          additionalRequirements: 'Focus on OWASP Top 10 vulnerabilities',
          status: 'in-progress',
          submittedAt: new Date('2025-12-01').toISOString(),
          progress: 65,
          testingPhase: 'Penetration Testing',
          testingPeriod: '11th Dec to 12th Dec, 2025 and 17th Dec to 22nd Dec, 2025',
          reportDelivery: '2025-12-27',
          vulnerabilities: {
            critical: 1,
            high: 3,
            medium: 5,
            low: 2,
            informational: 4,
            total: 15
          },
          findings: [],
          documents: [],
          timeline: [
            {
              id: 'timeline-001',
              phase: 'Request Submitted',
              status: 'completed',
              startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              description: 'Audit request submitted for review'
            },
            {
              id: 'timeline-002',
              phase: 'Testing',
              status: 'in-progress',
              startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              description: 'Security testing in progress'
            },
            {
              id: 'timeline-003',
              phase: 'Completed',
              status: 'pending',
              startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              description: 'Audit will be completed'
            }
          ],
          assignedTester: 'Security Team',
          testerId: 'tester-001',
          userId: user.id,
          reportUrl: '/reports/web-audit-001'
        };
        setUserAudits([staticAudit]);
        // Optionally save to localStorage if needed
        const allRequests = JSON.parse(localStorage.getItem('auditRequests') || '[]');
        localStorage.setItem('auditRequests', JSON.stringify([...allRequests, staticAudit]));
      } else {
        setUserAudits(audits);
      }
    }
  }, [user, getUserRequests]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (userDropdownOpen) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* ✅ Show ParticleText animation first */}
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


      {/* ✅ Show dashboard content after intro */}
      <AnimatePresence>
        {!showIntro && (
          <motion.div
            className={`min-h-screen transition-all duration-300 ${theme === 'dark'
              ? 'bg-background-dark text-text-dark'
              : 'bg-background-light text-text-light'
              }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background Effects for dark mode */}
            {theme === 'dark' && (
              <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-dark-mesh opacity-50" />
              </div>
            )}

            {/* Sidebar */}
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleNavigation={handleNavigation}
              theme={theme}
            />

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-[70px]' : 'lg:ml-[70px] ml-0'}`}>
              {/* Header */}
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                theme={theme}
                toggleTheme={toggleTheme}
                userDropdownOpen={userDropdownOpen}
                setUserDropdownOpen={setUserDropdownOpen}
                notifications={notifications}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                markAsRead={handleMarkRead}
                removeNotification={handleRemove}
                getColorClasses={getColorClasses}
              />

              {/* Mobile Header */}
              <div className="block sm:hidden px-6 py-4">
                <h1 className="text-xl font-bold">Welcome back</h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                  }`}>Here's an overview of your security audits</p>
              </div>

              {/* Dashboard Content */}
              <main className="px-4 lg:px-6 py-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
                  {statsData.map((stat: any, index: any) => (
                    <StatsCard
                      key={index}
                      {...stat}
                      index={index}
                      theme={theme}
                      getColorClasses={getColorClasses}
                      onClick={() => handleStatClick(stat)}
                    />
                  ))}
                </div>

                {/* Recent Audits Section */}
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
                        <h3 className="text-lg lg:text-xl font-semibold">Web Audit</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => alert('Filter clicked')}
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
                              onClick={() => handleAuditClick(audit)}
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

                  {/* Right Sidebar - Documents + Notifications + Quick Actions */}
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
                          documentsData.map((doc: any) => (
                            <DocumentCard
                              key={doc.id}
                              doc={doc}
                              onPreview={() => handlePreview(doc)}
                              onDownload={() => handleDownload(doc)}
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
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">Notifications</h3>
                          <div className="flex items-center space-x-1">
                            <BellRing className="w-4 h-4 text-secondary-dark" />
                            <span className="text-xs bg-error-dark text-white px-2 py-0.5 rounded-full">
                              {notifications.filter((n: any) => n.unread).length}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowNotifications(true)}
                          className="text-secondary-dark hover:underline text-sm font-medium"
                        >
                          See All →
                        </button>
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
              </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* New Audit Form Modal */}
            <NewAuditFormModal
              show={showNewAuditForm}
              onClose={() => setShowNewAuditForm(false)}
              theme={theme}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;