import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  X,
  FolderOpen,
  User as UserIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType; // Lucide icon type
  path?: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleNavigation: (id: string) => void;
  theme: string;
  navItems?: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  handleNavigation,
  theme,
  navItems
}) => {
  const [user, setUser] = useState<{ id: string, fullName: string, email: string } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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

  const defaultSidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const itemsToRender = navItems || defaultSidebarItems;

  const handleLogout = () => {
    localStorage.removeItem('introSeen');
    localStorage.removeItem('token'); // if you store token
  };

  const showLabels = isHovered || (window.innerWidth < 1024 && sidebarOpen);

  return (
    <AnimatePresence>
      {(sidebarOpen || window.innerWidth >= 1024) && (
        <motion.div
          initial={window.innerWidth < 1024 ? { x: -280, width: 280 } : { width: 70 }}
          animate={window.innerWidth < 1024 ? { x: 0, width: 280 } : { width: isHovered ? 280 : 70 }}
          exit={window.innerWidth < 1024 ? { x: -280, width: 280 } : { width: 70 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`fixed left-0 top-0 h-full z-50 backdrop-blur-xl ${theme === 'dark'
            ? `bg-surface-dark/40 ${isHovered ? 'shadow-2xl' : 'border-r border-surface-secondary-dark/20'}`
            : `bg-white/90 ${isHovered ? 'shadow-2xl' : 'border-r border-gray-200'}`
            }`}
          style={{
            background:
              theme === 'dark'
                ? isHovered ? 'rgba(15, 23, 42, 0.95)' : 'rgba(30, 41, 59, 0.4)'
                : isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo */}
          <div
            className={`p-3 border-b ${theme === 'dark'
              ? 'border-surface-secondary-dark/20'
              : 'border-gray-200/20'
              }`}
          >
            <div className={`flex items-center ${showLabels ? 'justify-between' : 'justify-center'}`}>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 min-w-[40px] bg-gradient-to-br from-secondary-dark to-accent-dark rounded-xl flex items-center justify-center ${theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
                    }`}
                >
                  <span className="text-white font-bold text-lg">BC</span>
                </div>
                <motion.div
                  animate={{
                    opacity: showLabels ? 1 : 0,
                    width: showLabels ? 'auto' : '0px',
                    marginLeft: showLabels ? '12px' : '0px'
                  }}
                  className="whitespace-nowrap overflow-hidden"
                  transition={{ duration: 0.3 }}
                >
                  <h1
                    className={`text-xl font-bold bg-gradient-to-r from-secondary-dark to-accent-dark bg-clip-text text-transparent`}
                  >
                    BCBUZZ
                  </h1>
                  <p
                    className={`text-xs ${theme === 'dark'
                      ? 'text-text-secondary-dark'
                      : 'text-text-secondary-light'
                      }`}
                  >
                    Security Platform
                  </p>
                </motion.div>
              </div>
              {/* Close Button - Only on mobile or when expanded */}
              {window.innerWidth < 1024 && (
                <motion.button
                  onClick={() => setSidebarOpen(false)}
                  className={`p-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                    ? 'hover:bg-surface-secondary-dark/30 text-text-secondary-dark hover:text-text-dark'
                    : 'hover:bg-gray-100/50 text-text-secondary-light hover:text-text-light'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Navigation */}
            <nav className="p-2 flex-grow overflow-x-hidden">
              <div className="space-y-2">
                {itemsToRender.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        handleNavigation(item.id);
                      }}
                      className={`w-full flex items-center rounded-xl transition-all duration-200 group ${isActive
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-secondary-dark/30 to-accent-dark/30 text-secondary-dark border border-secondary-dark/30 shadow-inner-glow backdrop-blur-sm'
                          : 'bg-gradient-to-r from-secondary-dark/30 to-accent-dark/30 text-blue-600 border border-blue-200/70 shadow-sm backdrop-blur-sm'
                        : theme === 'dark'
                          ? 'hover:bg-surface-secondary-dark/20 text-text-secondary-dark hover:text-text-dark backdrop-blur-sm'
                          : 'hover:bg-gray-50/50 text-text-secondary-light hover:text-text-light backdrop-blur-sm'
                        } ${showLabels ? 'px-4 py-3' : 'p-[9px] justify-center'}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon
                        className={`w-5 h-5 min-w-[20px] transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'
                          }`}
                      />
                      <motion.span
                        animate={{
                          opacity: showLabels ? 1 : 0,
                          width: showLabels ? 'auto' : '0px',
                          marginLeft: showLabels ? '12px' : '0px'
                        }}
                        className="font-medium whitespace-nowrap overflow-hidden"
                        transition={{ duration: 0.3 }}
                      >
                        {item.label}
                      </motion.span>
                      {isActive && showLabels && (
                        <motion.div
                          layoutId="activeTab"
                          className="ml-auto w-2 h-2 bg-secondary-dark rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </nav>

            {/* User Profile & Logout */}
            <div
              className={`p-2 border-t ${theme === 'dark'
                ? 'border-surface-secondary-dark/20'
                : 'border-gray-200/20'
                }`}
            >
              <div
                className={`flex items-center rounded-xl transition-all duration-300 ${showLabels
                  ? `backdrop-blur-sm ${theme === 'dark'
                    ? 'bg-gradient-to-r from-secondary-dark/20 to-accent-dark/20 border border-secondary-dark/20 shadow-dark-card p-2'
                    : 'bg-gradient-to-r from-blue-50/50 to-sky-50/50 border border-blue-100/50 p-2'
                  }`
                  : 'bg-transparent border-none p-[7px] justify-center'
                  }`}
              >
                <div
                  className={`w-10 h-10 min-w-[40px] bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
                    }`}
                >
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <motion.div
                  animate={{
                    opacity: showLabels ? 1 : 0,
                    width: showLabels ? 'auto' : '0px',
                    marginLeft: showLabels ? '12px' : '0px'
                  }}
                  className="flex-1 overflow-hidden"
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-medium text-sm whitespace-nowrap">{user?.fullName || 'User'}</p>
                  <p
                    className={`text-xs whitespace-nowrap ${theme === 'dark'
                      ? 'text-text-secondary-dark'
                      : 'text-text-secondary-light'
                      }`}
                  >
                    {user?.email || 'user@example.com'}
                  </p>
                </motion.div>
              </div>

              {/* Logout Button */}
              <Link to={'/'} onClick={handleLogout} className="block w-full">
                <motion.button
                  className={`w-full flex items-center mt-3 rounded-xl transition-all duration-200 ${theme === 'dark'
                    ? 'hover:bg-error-dark/20 text-error-dark hover:text-red-300 border border-transparent hover:border-error-dark/30'
                    : 'hover:bg-red-50 text-red-600 hover:text-red-700 border border-transparent hover:border-red-200'
                    } ${showLabels ? 'px-4 py-3' : 'p-[9px] justify-center'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5 min-w-[20px]" />
                  <motion.span
                    animate={{
                      opacity: showLabels ? 1 : 0,
                      width: showLabels ? 'auto' : '0px',
                      marginLeft: showLabels ? '12px' : '0px'
                    }}
                    className="font-medium whitespace-nowrap overflow-hidden"
                    transition={{ duration: 0.3 }}
                  >
                    Logout
                  </motion.span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

  );
};

export default Sidebar;