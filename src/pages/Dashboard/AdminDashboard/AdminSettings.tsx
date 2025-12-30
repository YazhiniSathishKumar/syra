import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  Database,
  Activity,
  Bell,
  Save,
  X,
  CheckCircle
} from 'lucide-react';

// Layout & Context
import DashboardLayout from '../../../components/Dashboard/DashboardLayout'; // Adjust path if needed
import { useTheme } from '../../../context/ThemeContext';

const AdminSettings: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('users');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [systemData, setSystemData] = useState({
    maintenanceMode: false,
    autoUpdates: true,
    logRetention: '90',
    sessionTimeout: '30'
  });

  const [securityPolicies, setSecurityPolicies] = useState({
    passwordPolicy: 'strong',
    twoFactorRequired: true,
    ipWhitelistEnabled: true,
    failedAttempts: '5',
    lockoutDuration: '15'
  });

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 'policies', label: 'Security Policies', icon: Shield, color: 'from-red-500 to-pink-500' },
    { id: 'system', label: 'System Settings', icon: Database, color: 'from-purple-500 to-indigo-500' },
    { id: 'logs', label: 'Audit Logs', icon: Activity, color: 'from-green-500 to-emerald-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-yellow-500 to-orange-500' }
  ];

  const handleSave = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <DashboardLayout userRole="admin">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`min-h-screen p-6 ${
          theme === 'dark' ? 'bg-background-dark text-text-dark' : 'bg-background-light text-text-light'
        }`}
      >
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light bg-clip-text text-transparent">
            Admin Settings
          </h1>
          <p
            className={`mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Manage system-wide configurations, policies, and user access
          </p>
        </motion.div>

        {/* Success Message */}
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl flex items-center gap-3 backdrop-blur-xl border ${
              theme === 'dark'
                ? 'bg-green-900/20 border-green-800/30 text-green-400'
                : 'bg-green-50 border-green-200 text-green-700'
            } shadow-lg`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>Settings saved successfully!</span>
            <button onClick={() => setShowSuccessMessage(false)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-1 mb-6 lg:mb-0 ${
              theme === 'dark'
                ? 'bg-surface-dark/70 rounded-xl p-4'
                : 'bg-white rounded-xl p-4 shadow-sm'
            }`}
          >
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center w-full space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-secondary-dark to-accent-dark text-white'
                        : theme === 'dark'
                          ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark'
                          : 'hover:bg-gray-100 text-text-secondary-light'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Tab Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-4 ${
              theme === 'dark'
                ? 'bg-surface-dark/70 rounded-xl p-6'
                : 'bg-white rounded-xl p-6 shadow-md'
            }`}
          >
            {/* User Management Tab */}
            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">User Management</h2>
                <div
                  className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-surface-secondary-dark/50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">User Roles & Permissions</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } text-sm font-medium`}
                    >
                      Add New Role
                    </motion.button>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr
                        className={`${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <th className="py-2">Role</th>
                        <th className="py-2">Permissions</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody
                      className="divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <tr>
                        <td className="py-3 font-medium">Admin</td>
                        <td className="py-3">All Access</td>
                        <td className="py-3">
                          <button
                            className={`mr-2 ${
                              theme === 'dark'
                                ? 'text-yellow-400'
                                : 'text-yellow-600'
                            }`}
                          >
                            Edit
                          </button>
                          <button
                            className={`${
                              theme === 'dark'
                                ? 'text-red-400'
                                : 'text-red-600'
                            }`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Tester</td>
                        <td className="py-3">Scan, Report, Dashboard</td>
                        <td className="py-3">
                          <button
                            className={`mr-2 ${
                              theme === 'dark'
                                ? 'text-yellow-400'
                                : 'text-yellow-600'
                            }`}
                          >
                            Edit
                          </button>
                          <button
                            className={`${
                              theme === 'dark'
                                ? 'text-red-400'
                                : 'text-red-600'
                            }`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">User</td>
                        <td className="py-3">View Projects, Request Audit</td>
                        <td className="py-3">
                          <button
                            className={`mr-2 ${
                              theme === 'dark'
                                ? 'text-yellow-400'
                                : 'text-yellow-600'
                            }`}
                          >
                            Edit
                          </button>
                          <button
                            className={`${
                              theme === 'dark'
                                ? 'text-red-400'
                                : 'text-red-600'
                            }`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </motion.button>
              </motion.div>
            )}

            {/* Security Policies Tab */}
            {activeTab === 'policies' && (
              <motion.div
                key="policies"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">Security Policies</h2>

                <div
                  className={`p-4 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-surface-secondary-dark/50'
                      : 'bg-gray-50'
                  } space-y-4`}
                >
                  <label className="block text-sm font-medium">
                    Password Policy
                  </label>
                  <select
                    value={securityPolicies.passwordPolicy}
                    onChange={(e) =>
                      setSecurityPolicies({
                        ...securityPolicies,
                        passwordPolicy: e.target.value
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-surface-dark/50 border-surface-secondary-dark/30 text-text-dark'
                        : 'bg-white border-gray-200 text-text-light'
                    }`}
                  >
                    <option value="basic">Basic</option>
                    <option value="medium">Medium</option>
                    <option value="strong">Strong</option>
                  </select>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      checked={securityPolicies.twoFactorRequired}
                      onChange={() =>
                        setSecurityPolicies({
                          ...securityPolicies,
                          twoFactorRequired: !securityPolicies.twoFactorRequired
                        })
                      }
                      className="mr-3"
                    />
                    <label>Require Two-Factor Authentication</label>
                  </div>

                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={securityPolicies.ipWhitelistEnabled}
                      onChange={() =>
                        setSecurityPolicies({
                          ...securityPolicies,
                          ipWhitelistEnabled: !securityPolicies.ipWhitelistEnabled
                        })
                      }
                      className="mr-3"
                    />
                    <label>Enable IP Whitelisting</label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Failed Login Attempts Allowed
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={securityPolicies.failedAttempts}
                        onChange={(e) =>
                          setSecurityPolicies({
                            ...securityPolicies,
                            failedAttempts: e.target.value
                          })
                        }
                        className={`w-full px-4 py-2 rounded-xl border ${
                          theme === 'dark'
                            ? 'bg-surface-dark/50 border-surface-secondary-dark/30'
                            : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Lockout Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={securityPolicies.lockoutDuration}
                        onChange={(e) =>
                          setSecurityPolicies({
                            ...securityPolicies,
                            lockoutDuration: e.target.value
                          })
                        }
                        className={`w-full px-4 py-2 rounded-xl border ${
                          theme === 'dark'
                            ? 'bg-surface-dark/50 border-surface-secondary-dark/30'
                            : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>Update Policies</span>
                </motion.button>
              </motion.div>
            )}

            {/* System Settings Tab */}
            {activeTab === 'system' && (
              <motion.div
                key="system"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">System Configuration</h2>

                <div
                  className={`p-4 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-surface-secondary-dark/50'
                      : 'bg-gray-50'
                  } space-y-4`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={systemData.maintenanceMode}
                      onChange={() =>
                        setSystemData({
                          ...systemData,
                          maintenanceMode: !systemData.maintenanceMode
                        })
                      }
                      className="mr-3"
                    />
                    <label>Maintenance Mode</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={systemData.autoUpdates}
                      onChange={() =>
                        setSystemData({
                          ...systemData,
                          autoUpdates: !systemData.autoUpdates
                        })
                      }
                      className="mr-3"
                    />
                    <label>Automatic System Updates</label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Log Retention (days)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="365"
                        value={systemData.logRetention}
                        onChange={(e) =>
                          setSystemData({
                            ...systemData,
                            logRetention: e.target.value
                          })
                        }
                        className={`w-full px-4 py-2 rounded-xl border ${
                          theme === 'dark'
                            ? 'bg-surface-dark/50 border-surface-secondary-dark/30'
                            : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={systemData.sessionTimeout}
                        onChange={(e) =>
                          setSystemData({
                            ...systemData,
                            sessionTimeout: e.target.value
                          })
                        }
                        className={`w-full px-4 py-2 rounded-xl border ${
                          theme === 'dark'
                            ? 'bg-surface-dark/50 border-surface-secondary-dark/30'
                            : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>Apply System Settings</span>
                </motion.button>
              </motion.div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">Audit Logs</h2>

                <div
                  className={`p-4 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-surface-secondary-dark/50'
                      : 'bg-gray-50'
                  } space-y-4`}
                >
                  <div className="flex items-center justify-between">
                    <span>Export Logs</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } text-sm font-medium`}
                    >
                      Export All
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Clear Logs Older Than</span>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="7"
                        max="365"
                        className={`w-20 px-3 py-2 rounded-xl border ${
                          theme === 'dark'
                            ? 'bg-surface-dark/50 border-surface-secondary-dark/30'
                            : 'bg-white border-gray-200'
                        }`}
                      />
                      <span>days</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-xl ${
                          theme === 'dark'
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        } text-sm font-medium`}
                      >
                        Clear Logs
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Download Last 30 Days</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-cyan-600 hover:bg-cyan-700'
                          : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      } text-sm font-medium`}
                    >
                      Download CSV
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">Notification Preferences</h2>

                <div
                  className={`p-4 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-surface-secondary-dark/50'
                      : 'bg-gray-50'
                  } space-y-4`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mr-3"
                    />
                    <label>Email Notifications</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mr-3"
                    />
                    <label>Slack Integration</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-3"
                    />
                    <label>Push Notifications</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mr-3"
                    />
                    <label>Send Weekly Reports</label>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Notification Rules</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminSettings;