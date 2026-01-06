// Move the existing Settings.tsx content here and rename the component
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Key,
  Moon,
  Sun,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  AlertTriangle,
  CheckCircle,
  X,
  Palette,
  Database,
  Download,
  Upload,
  Trash2,
  Zap
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const SettingsContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: 'Test User',
    email: 'scomode@gmail.com',
    company: 'BCBUZZ Technologies',
    phone: '+1 (555) 123-4567',
    timezone: 'UTC-5 (Eastern Time)',
    language: 'English',
    avatar: null as File | null
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginAlerts: true,
    sessionTimeout: '30',
    ipWhitelist: true,
    deviceTracking: true
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    scanCompleted: true,
    vulnerabilityFound: true,
    weeklyReports: true,
    securityAlerts: true,
    maintenanceUpdates: false,
    marketingEmails: false,
    auditReminders: true,
    teamUpdates: true
  });

  const [apiData, setApiData] = useState({
    apiKey: 'bcbuzz_sk_1234567890abcdef',
    webhookUrl: 'https://your-app.com/webhook',
    rateLimitEnabled: true,
    ipWhitelist: '192.168.1.0/24, 10.0.0.0/8',
    apiVersion: 'v2',
    maxRequests: '1000'
  });

  const [appearanceData, setAppearanceData] = useState({
    theme: theme,
    accentColor: 'blue',
    fontSize: 'medium',
    compactMode: false,
    animations: true,
    highContrast: false
  });

  const handleSave = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const generateNewApiKey = () => {
    const newKey = 'bcbuzz_sk_' + Math.random().toString(36).substring(2, 18);
    setApiData({ ...apiData, apiKey: newKey });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData({ ...profileData, avatar: file });
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'security', label: 'Security', icon: Shield, color: 'from-red-500 to-pink-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-yellow-500 to-orange-500' },
    { id: 'api', label: 'API & Integrations', icon: Key, color: 'from-purple-500 to-indigo-500' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'from-green-500 to-emerald-500' },
    { id: 'data', label: 'Data & Privacy', icon: Database, color: 'from-gray-500 to-slate-500' }
  ];

  const accentColors = [
    { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
    { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
    { name: 'Green', value: 'green', color: 'bg-green-500' },
    { name: 'Red', value: 'red', color: 'bg-red-500' },
    { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
    { name: 'Pink', value: 'pink', color: 'bg-pink-500' }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light bg-clip-text text-transparent mb-4">
          Settings
        </h1>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
          Customize your experience and manage your account preferences
        </p>
      </motion.div>

      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 right-4 z-50 bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-4 rounded-xl flex items-center gap-3 backdrop-blur-xl"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Settings saved successfully!</span>
          <button onClick={() => setShowSuccessMessage(false)}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 sticky top-6">
            <nav className="space-y-3">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${isActive
                      ? 'bg-gradient-to-r from-secondary-dark/20 to-accent-dark/20 text-blue-700 dark:text-white border border-secondary-dark/30 dark:border-secondary-light/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/30 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBg"
                        className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-10 rounded-xl`}
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className={`p-2 rounded-lg transition-all duration-300 relative z-10 ${isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                      }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium relative z-10">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="ml-auto w-2 h-2 bg-secondary-dark dark:bg-secondary-light rounded-full"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage your personal information and preferences</p>
                  </div>
                </div>

                {/* Avatar Upload */}
                <div className="flex items-center gap-6 p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profileData.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <button className="absolute -bottom-1 -right-1 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Profile Picture</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Upload a new avatar for your profile</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company
                    </label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Timezone
                    </label>
                    <select
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                    >
                      <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                      <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                      <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                      <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Language
                    </label>
                    <select
                      value={profileData.language}
                      onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleSave()}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </motion.button>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
                    <p className="text-gray-600 dark:text-gray-400">Control your account security and authentication methods</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                    <h3 className="font-semibold text-lg mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={securityData.currentPassword}
                            onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                          />
                          <button
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={securityData.newPassword}
                            onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                          />
                          <button
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      onClick={() => setSecurityData({ ...securityData, twoFactorEnabled: !securityData.twoFactorEnabled })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${securityData.twoFactorEnabled ? 'bg-secondary-dark' : 'bg-gray-400'}`}
                    >
                      <motion.div
                        animate={{ x: securityData.twoFactorEnabled ? 26 : 2 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleSave()}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  Save Security Preferences
                </motion.button>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email & Push Notifications</h2>
                    <p className="text-gray-600 dark:text-gray-400">Choose what you want to be notified about</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', icon: Mail },
                    { key: 'pushNotifications', label: 'Push Notifications', icon: Smartphone },
                    { key: 'scanCompleted', label: 'Scan Completed', icon: CheckCircle },
                    { key: 'vulnerabilityFound', label: 'New Vulnerability Alert', icon: AlertTriangle }
                  ].map((item) => (
                    <div key={item.key} className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <button
                        onClick={() => setNotificationData({ ...notificationData, [item.key]: !notificationData[item.key as keyof typeof notificationData] })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${notificationData[item.key as keyof typeof notificationData] ? 'bg-secondary-dark' : 'bg-gray-400'}`}
                      >
                        <motion.div
                          animate={{ x: notificationData[item.key as keyof typeof notificationData] ? 20 : 2 }}
                          className="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full"
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <motion.button
                  onClick={() => handleSave()}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  Save Notifications
                </motion.button>
              </motion.div>
            )}

            {/* API & Integrations Tab */}
            {activeTab === 'api' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API & Integrations</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage your API keys and webhook configurations</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">API Key</h3>
                      <button
                        onClick={generateNewApiKey}
                        className="text-sm text-secondary-dark hover:underline flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        Generate New Key
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={apiData.apiKey}
                        readOnly
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100/50 dark:bg-gray-700/50"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                    <h3 className="font-semibold mb-4">Webhook URL</h3>
                    <input
                      type="url"
                      value={apiData.webhookUrl}
                      onChange={(e) => setApiData({ ...apiData, webhookUrl: e.target.value })}
                      placeholder="https://your-domain.com/webhook"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                    />
                  </div>
                </div>

                <motion.button
                  onClick={() => handleSave()}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  Save API Settings
                </motion.button>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance</h2>
                    <p className="text-gray-600 dark:text-gray-400">Customize look and feel of your dashboard</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Interface Theme</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => theme !== 'light' && toggleTheme()}
                        className={`p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-secondary-dark bg-secondary-dark/5' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                        <span className="text-sm font-medium">Light Mode</span>
                      </button>
                      <button
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        className={`p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-secondary-dark bg-secondary-dark/5' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        <Moon className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                        <span className="text-sm font-medium">Dark Mode</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Accent Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {accentColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setAppearanceData({ ...appearanceData, accentColor: color.value })}
                          className={`w-10 h-10 rounded-full ${color.color} relative border-2 ${appearanceData.accentColor === color.value ? 'border-white ring-2 ring-secondary-dark' : 'border-transparent'}`}
                        >
                          {appearanceData.accentColor === color.value && <CheckCircle className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleSave()}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  Save Appearance
                </motion.button>
              </motion.div>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === 'data' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-gray-500 to-slate-500 text-white">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data & Privacy</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage your data and privacy preferences</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                    <h3 className="font-semibold mb-2">Export Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Download all your audit reports and account activity in JSON or CSV format.</p>
                    <button
                      onClick={() => alert('Exporting data...')}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Export
                    </button>
                  </div>

                  <div className="p-6 bg-red-500/5 rounded-xl border border-red-500/20">
                    <h3 className="font-semibold text-red-500 mb-2">Delete Account</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <button
                      onClick={() => confirm('Are you sure you want to delete your account?') && alert('Account deleted')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete My Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsContent;