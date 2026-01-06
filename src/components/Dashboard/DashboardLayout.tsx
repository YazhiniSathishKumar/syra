// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   Menu,
//   Sun,
//   Moon,
//   Bell,
//   User,
//   ChevronDown,
//   Settings as SettingsIcon,
//   HelpCircle as HelpIcon,
//   LogOut as LogOutIcon,
//   Search,
//   X,
//   BarChart3,
//   FolderOpen,
//   Scan,
//   Settings,
//   HelpCircle,
//   Shield,
//   Users,
//   TestTube
// } from 'lucide-react';
// import { useTheme } from '../../context/ThemeContext';

// interface DashboardLayoutProps {
//   children: React.ReactNode;
//   userRole?: 'user' | 'admin' | 'tester';
// }

// const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole = 'user' }) => {
//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       title: 'Audit Request Approved',
//       description: 'Your security audit request has been approved and assigned to a tester',
//       time: '2 hours ago',
//       type: 'success',
//       unread: true
//     },
//     {
//       id: 2,
//       title: 'New Vulnerability Found',
//       description: 'Critical vulnerability detected in your web application',
//       time: '1 day ago',
//       type: 'warning',
//       unread: true
//     }
//   ]);

//   // Define navigation items based on user role
//   const getNavigationItems = () => {
//     const baseItems = [
// { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' }
//     ];

//     switch (userRole) {
//       case 'admin':
//         return [
//           ...baseItems,
//           { id: 'admin', label: 'Admin Panel', icon: Shield, path: '/admin' },
//           { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
//           { id: 'audit-requests', label: 'Audit Requests', icon: FolderOpen, path: '/admin/requests' },
//           { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
//           { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
//         ];
//       case 'tester':
//         return [
//           ...baseItems,
//           { id: 'testing', label: 'Testing Dashboard', icon: TestTube, path: '/testing' },
//           { id: 'assigned-audits', label: 'Assigned Audits', icon: FolderOpen, path: '/testing/audits' },
//           { id: 'tools', label: 'Testing Tools', icon: Scan, path: '/testing/tools' },
//           { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
//           { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
//         ];
//       default: // user
//         return [
//           ...baseItems,
//           { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/projects' },
//           { id: 'scan', label: 'Request Audit', icon: Scan, path: '/request-audit' },
//           { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
//           { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
//         ];
//     }
//   };

//   const navigationItems = getNavigationItems();
//   const currentPath = location.pathname;
//   const activeItem = navigationItems.find(item => item.path === currentPath)?.id || 'dashboard';

//   const handleNavigation = (path: string) => {
//     navigate(path);
//     if (window.innerWidth < 1024) {
//       setSidebarOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userRole');
//     navigate('/');
//   };

//   const markAsRead = (id: number) => {
//     setNotifications(prev =>
//       prev.map(n => (n.id === id ? { ...n, unread: false } : n))
//     );
//   };

//   const removeNotification = (id: number) => {
//     setNotifications(prev => prev.filter(n => n.id !== id));
//   };

//   const unreadCount = notifications.filter(n => n.unread).length;

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => {
//       setUserDropdownOpen(false);
//       setShowNotifications(false);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Responsive sidebar handling
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setSidebarOpen(false);
//       } else {
//         setSidebarOpen(true);
//       }
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div className={`min-h-screen transition-all duration-300 ${
//       theme === 'dark'
//         ? 'bg-background-dark text-text-dark'
//         : 'bg-background-light text-text-light'
//     }`}>
//       {/* Sidebar */}
//       <AnimatePresence>
//         {sidebarOpen && (
//           <motion.div
//             initial={{ x: -280 }}
//             animate={{ x: 0 }}
//             exit={{ x: -280 }}
//             transition={{ duration: 0.3, ease: 'easeInOut' }}
//             className={`fixed left-0 top-0 h-full w-70 z-50 backdrop-blur-xl ${
//               theme === 'dark'
//                 ? 'bg-surface-dark/95 border-surface-secondary-dark/30 shadow-dark-elevated'
//                 : 'bg-surface-light/95 border-gray-200 shadow-xl'
//             } border-r`}
//           >
//             {/* Logo */}
//             <div className={`p-6 border-b ${
//               theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
//             }`}>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className={`w-10 h-10 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-xl flex items-center justify-center ${
//                     theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                   }`}>
//                     <span className="text-white font-bold text-lg">BC</span>
//                   </div>
//                   <div>
//                     <h1 className="text-xl font-bold bg-gradient-to-r from-secondary-dark to-accent-dark bg-clip-text text-transparent">
//                       BCBUZZ
//                     </h1>
//                     <p className={`text-xs ${
//                       theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//                     }`}>
//                       Security Platform
//                     </p>
//                   </div>
//                 </div>
//                 <motion.button
//                   onClick={() => setSidebarOpen(false)}
//                   className={`p-2 rounded-lg transition-all duration-200 lg:hidden ${
//                     theme === 'dark'
//                       ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
//                       : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//                   }`}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <X className="w-5 h-5" />
//                 </motion.button>
//               </div>
//             </div>

//             {/* Navigation */}
//             <nav className="p-4 flex-1">
//               <div className="space-y-2">
//                 {navigationItems.map((item) => {
//                   const Icon = item.icon;
//                   const isActive = activeItem === item.id;

//                   return (
//                     <motion.button
//                       key={item.id}
//                       onClick={() => handleNavigation(item.path)}
//                       className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
//                         isActive
//                           ? theme === 'dark'
//                             ? 'bg-gradient-to-r from-secondary-dark/30 to-accent-dark/30 text-secondary-dark border border-secondary-dark/30 shadow-inner-glow'
//                             : 'bg-gradient-to-r from-blue-50 to-sky-50 text-blue-600 border border-blue-200'
//                           : theme === 'dark'
//                             ? 'hover:bg-surface-secondary-dark/30 text-text-secondary-dark hover:text-text-dark'
//                             : 'hover:bg-gray-50 text-text-secondary-light hover:text-text-light'
//                       }`}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       <Icon className={`w-5 h-5 transition-transform duration-200 ${
//                         isActive ? 'scale-110' : 'group-hover:scale-105'
//                       }`} />
//                       <span className="font-medium">{item.label}</span>
//                       {isActive && (
//                         <motion.div
//                           layoutId="activeTab"
//                           className="ml-auto w-2 h-2 bg-secondary-dark rounded-full"
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           transition={{ duration: 0.2 }}
//                         />
//                       )}
//                     </motion.button>
//                   );
//                 })}
//               </div>
//             </nav>

//             {/* User Profile */}
//             <div className={`p-4 border-t ${
//               theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
//             }`}>
//               <div className={`flex items-center space-x-3 p-3 rounded-xl ${
//                 theme === 'dark'
//                   ? 'bg-gradient-to-r from-secondary-dark/20 to-accent-dark/20 border border-secondary-dark/30'
//                   : 'bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100'
//               }`}>
//                 <div className={`w-10 h-10 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${
//                   theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                 }`}>
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium text-sm">Test User</p>
//                   <p className={`text-xs capitalize ${
//                     theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//                   }`}>
//                     {userRole}
//                   </p>
//                 </div>
//               </div>

//               <motion.button
//                 onClick={handleLogout}
//                 className={`w-full flex items-center space-x-3 px-4 py-3 mt-3 rounded-xl transition-all duration-200 ${
//                   theme === 'dark'
//                     ? 'hover:bg-error-dark/20 text-error-dark hover:text-red-300'
//                     : 'hover:bg-red-50 text-red-600 hover:text-red-700'
//                 }`}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <LogOutIcon className="w-5 h-5" />
//                 <span className="font-medium">Logout</span>
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header */}
//       <header className={`${
//         theme === 'dark'
//           ? 'bg-surface-dark/80 border-b border-surface-secondary-dark/30 shadow-dark-card'
//           : 'bg-surface-light/80 border-b border-gray-200'
//       } backdrop-blur-xl sticky top-0 z-40 ${sidebarOpen ? 'lg:ml-70' : 'ml-0'} transition-all duration-300`}>
//         <div className="flex items-center justify-between p-4 lg:p-6">
//           <div className="flex items-center space-x-4">
//             <motion.button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className={`p-2 rounded-lg transition-all duration-200 ${
//                 theme === 'dark'
//                   ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
//                   : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//               }`}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Menu className="w-5 h-5" />
//             </motion.button>

//             {!sidebarOpen && (
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="flex items-center space-x-3"
//               >
//                 <div className={`w-8 h-8 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-lg flex items-center justify-center ${
//                   theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                 }`}>
//                   <span className="text-white font-bold text-sm">BC</span>
//                 </div>
//                 <h1 className="text-lg font-bold bg-gradient-to-r from-secondary-dark to-accent-dark bg-clip-text text-transparent hidden sm:block">
//                   BCBUZZ
//                 </h1>
//               </motion.div>
//             )}
//           </div>

//           <div className="flex items-center space-x-2 lg:space-x-4">
//             {/* Theme Toggle */}
//             <motion.button
//               onClick={toggleTheme}
//               className={`p-2 rounded-lg transition-all duration-200 ${
//                 theme === 'dark'
//                   ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
//                   : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//               }`}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               {theme === 'dark' ? (
//                 <Sun className="w-5 h-5 text-yellow-400" />
//               ) : (
//                 <Moon className="w-5 h-5 text-indigo-600" />
//               )}
//             </motion.button>

//             {/* Search - Hidden on mobile */}
//             <div className="relative hidden md:block">
//               <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${
//                 theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//               }`} />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
//                   theme === 'dark'
//                     ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark placeholder:text-text-secondary-dark'
//                     : 'bg-gray-50 border-gray-200 text-text-light placeholder:text-text-secondary-light'
//                 } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//               />
//             </div>

//             {/* Notifications */}
//             <div className="relative">
//               <motion.button
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className={`relative p-2 rounded-lg transition-all duration-200 ${
//                   theme === 'dark'
//                     ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
//                     : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//                 }`}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Bell className="w-5 h-5" />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-dark rounded-full animate-pulse"></span>
//                 )}
//               </motion.button>

//               {showNotifications && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className={`absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 rounded-xl border backdrop-blur-xl ${
//                     theme === 'dark'
//                       ? 'bg-surface-dark/95 border-surface-secondary-dark/30 shadow-dark-card'
//                       : 'bg-white border-gray-200 shadow-lg'
//                   }`}
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className={`p-4 border-b ${
//                     theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
//                   }`}>
//                     <h3 className="text-sm font-medium">Notifications</h3>
//                   </div>
//                   <div className="divide-y divide-surface-secondary-dark/20">
//                     {notifications.map(notification => (
//                       <div key={notification.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <h4 className="font-medium text-sm">{notification.title}</h4>
//                             <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.description}</p>
//                             <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">{notification.time}</span>
//                           </div>
//                           {notification.unread && (
//                             <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </div>

//             {/* User Dropdown */}
//             {!sidebarOpen && (
//               <div className="relative">
//                 <motion.button
//                   onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                   className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
//                     theme === 'dark'
//                       ? 'hover:bg-surface-secondary-dark/50'
//                       : 'hover:bg-gray-100'
//                   }`}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <div className={`w-8 h-8 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${
//                     theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                   }`}>
//                     <User className="w-4 h-4 text-white" />
//                   </div>
//                   <div className="text-left hidden lg:block">
//                     <p className="font-medium text-sm">Test User</p>
//                     <p className={`text-xs capitalize ${
//                       theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//                     }`}>
//                       {userRole}
//                     </p>
//                   </div>
//                   <ChevronDown className={`w-4 h-4 transition-transform duration-200 hidden lg:block ${
//                     userDropdownOpen ? 'rotate-180' : ''
//                   }`} />
//                 </motion.button>

//                 <AnimatePresence>
//                   {userDropdownOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                       className={`absolute right-0 top-full mt-2 w-64 z-50 rounded-xl backdrop-blur-xl border ${
//                         theme === 'dark'
//                           ? 'bg-surface-dark/95 border-surface-secondary-dark/30 shadow-dark-elevated'
//                           : 'bg-white border-gray-200 shadow-lg'
//                       }`}
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <div className={`p-4 border-b ${
//                         theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
//                       }`}>
//                         <div className="flex items-center space-x-3">
//                           <div className={`w-12 h-12 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${
//                             theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                           }`}>
//                             <User className="w-6 h-6 text-white" />
//                           </div>
//                           <div>
//                             <p className="font-medium">Test User</p>
//                             <p className={`text-sm capitalize ${
//                               theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//                             }`}>
//                               {userRole}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="p-2">
//                         <button
//                           onClick={() => navigate('/settings')}
//                           className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                             theme === 'dark'
//                               ? 'hover:bg-surface-secondary-dark/50'
//                               : 'hover:bg-gray-50'
//                           }`}
//                         >
//                           <SettingsIcon className="w-4 h-4" />
//                           <span className="text-sm">Settings</span>
//                         </button>
//                         <button
//                           onClick={() => navigate('/help')}
//                           className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                             theme === 'dark'
//                               ? 'hover:bg-surface-secondary-dark/50'
//                               : 'hover:bg-gray-50'
//                           }`}
//                         >
//                           <HelpIcon className="w-4 h-4" />
//                           <span className="text-sm">Help</span>
//                         </button>
//                       </div>
//                       <div className={`p-2 border-t ${
//                         theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
//                       }`}>
//                         <button
//                           onClick={handleLogout}
//                           className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                             theme === 'dark'
//                               ? 'hover:bg-error-dark/20 text-error-dark'
//                               : 'hover:bg-red-50 text-red-600'
//                           }`}
//                         >
//                           <LogOutIcon className="w-4 h-4" />
//                           <span className="text-sm">Logout</span>
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className={`${sidebarOpen ? 'lg:ml-70' : 'ml-0'} transition-all duration-300 ease-in-out`}>
//         {children}
//       </main>

//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default DashboardLayout;






//---------------------------------------xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx----------------------------







import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  User,
  ChevronDown,
  Settings as SettingsIcon,
  HelpCircle as HelpIcon,
  LogOut as LogOutIcon,
  Search,
  X,
  BarChart3,
  FolderOpen,
  Settings,
  HelpCircle,
  Shield,
  Users,
  TestTube
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: 'user' | 'admin' | 'tester';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole = 'user' }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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

  const showLabels = isHovered || (window.innerWidth < 1024 && sidebarOpen);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Audit Request Approved',
      description: 'Your security audit request has been approved and assigned to a tester',
      time: '2 hours ago',
      type: 'success',
      unread: true
    },
    {
      id: 2,
      title: 'New Vulnerability Found',
      description: 'Critical vulnerability detected in your web application',
      time: '1 day ago',
      type: 'warning',
      unread: true
    }
  ]);

  // Define navigation items based on user role
  const getNavigationItems = () => {

    switch (userRole) {
      case 'admin':
        return [

          { id: 'admin', label: 'Admin Panel', icon: Shield, path: '/admin' },
          { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
          { id: 'audit-requests', label: 'Audit Requests', icon: FolderOpen, path: '/admin/requests' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
          { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
        ];
      case 'tester':
        return [

          { id: 'testing', label: 'Testing Dashboard', icon: TestTube, path: '/testing' },
          { id: 'assigned-audits', label: 'Assigned Audits', icon: FolderOpen, path: '/testing/audits' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
          { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
          { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/projects' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
          { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
        ];
    }
  };

  const navigationItems = getNavigationItems();
  const currentPath = location.pathname;
  const activeItem = navigationItems.find(item => item.path === currentPath)?.id || 'dashboard';

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setUserDropdownOpen(false);
      setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div
      className={`min-h-screen transition-all duration-300 ${theme === 'dark'
        ? 'bg-background-dark text-text-dark'
        : 'bg-background-light text-text-light'
        }`}
    >
      {/* Sidebar */}
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
              } border-r`}
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
              className={`p-3 border-b ${theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
                }`}
            >
              <div className={`flex items-center ${showLabels ? 'justify-between' : 'justify-center'}`}>
                <div className="flex items-center overflow-hidden">
                  <div
                    className={`w-10 h-10 min-w-[40px] bg-gradient-to-br from-secondary-dark to-accent-dark rounded-xl flex items-center justify-center ${theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
                      }`}
                  >
                    <span className="text-white font-bold text-lg">BC</span>
                  </div>
                  <motion.div
                    animate={{
                      opacity: showLabels ? 1 : 0,
                      width: showLabels ? 'auto' : 0,
                      marginLeft: showLabels ? 12 : 0
                    }}
                    className="whitespace-nowrap overflow-hidden"
                    transition={{ duration: 0.3 }}
                  >
                    <h1 className="text-xl font-bold bg-gradient-to-r from-secondary-dark to-accent-dark bg-clip-text text-transparent">
                      BCBUZZ
                    </h1>
                    <p
                      className={`text-xs ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
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
                    className={`p-2 rounded-lg transition-all duration-200  ${theme === 'dark'
                      ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
                      : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 flex-1">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-3 rounded-xl transition-all duration-200 group ${isActive
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-secondary-dark/30 to-accent-dark/30 text-secondary-dark border border-secondary-dark/30 shadow-inner-glow backdrop-blur-sm'
                          : 'bg-gradient-to-r from-blue-50 to-sky-50 text-blue-600 border border-blue-200'
                        : theme === 'dark'
                          ? 'hover:bg-surface-secondary-dark/30 text-text-secondary-dark hover:text-text-dark backdrop-blur-sm'
                          : 'hover:bg-gray-50 text-text-secondary-light hover:text-text-light backdrop-blur-sm'
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
                          width: showLabels ? 'auto' : 0,
                          marginLeft: showLabels ? 12 : 0
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

            {/* User Profile */}
            <div
              className={`p-4 border-t ${theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
                }`}
            >
              <div
                className={`flex items-center space-x-3 p-3 rounded-xl ${theme === 'dark'
                  ? 'bg-gradient-to-r from-secondary-dark/20 to-accent-dark/20 border border-secondary-dark/30'
                  : 'bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100'
                  }`}
              >
                <div
                  className={`w-10 h-10 min-w-[40px] bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
                    }`}
                >
                  <User className="w-5 h-5 text-white" />
                </div>
                <motion.div
                  animate={{
                    opacity: showLabels ? 1 : 0,
                    width: showLabels ? 'auto' : 0,
                    marginLeft: showLabels ? 12 : 0
                  }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="font-medium text-sm whitespace-nowrap">{user?.fullName || 'User'}</p>
                  <p
                    className={`text-xs capitalize whitespace-nowrap ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                      }`}
                  >
                    {user?.email || userRole}
                  </p>
                </motion.div>
              </div>
              <motion.button
                onClick={handleLogout}
                className={`w-full flex items-center rounded-xl transition-all duration-200 mt-3 group ${theme === 'dark'
                  ? 'hover:bg-error-dark/20 text-error-dark hover:text-red-300'
                  : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                  } ${showLabels ? 'px-4 py-3 space-x-3' : 'p-[9px] justify-center'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOutIcon className="w-5 h-5 min-w-[20px]" />
                <motion.span
                  animate={{
                    opacity: showLabels ? 1 : 0,
                    width: showLabels ? 'auto' : 0
                  }}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        className={`${theme === 'dark'
          ? 'bg-surface-dark/80 border-b border-surface-secondary-dark/30 shadow-dark-card'
          : 'bg-surface-light/80 border-b border-gray-200'
          } backdrop-blur-xl sticky top-0 z-40 transition-all duration-300 ${window.innerWidth >= 1024 ? 'ml-[70px]' : 'ml-0'
          }`}
      >
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="flex items-center space-x-4">
            {/* Show Hamburger Only On Mobile */}
            <motion.button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-lg transition-all duration-200 lg:hidden ${theme === 'dark'
                ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
                : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
            </div>
          </div>

          {/* Right-side controls */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
                : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </motion.button>

            {/* Search - Hidden on mobile */}
            <div className="relative hidden md:block">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                  }`}
              />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${theme === 'dark'
                  ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark placeholder:text-text-secondary-dark'
                  : 'bg-gray-50 border-gray-200 text-text-light placeholder:text-text-secondary-light'
                  } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                  ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
                  : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-dark rounded-full animate-pulse"></span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 rounded-xl border backdrop-blur-xl ${theme === 'dark'
                      ? 'bg-surface-dark/95 border-surface-secondary-dark/30 shadow-dark-card'
                      : 'bg-white border-gray-200 shadow-lg'
                      }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`p-4 border-b ${theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
                        }`}
                    >
                      <h3 className="text-sm font-medium">Notifications</h3>
                    </div>
                    <div className="divide-y divide-surface-secondary-dark/20">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 transition-colors cursor-pointer group relative ${notification.unread
                            ? theme === 'dark' ? 'bg-secondary-dark/5 shadow-inner' : 'bg-blue-50/50'
                            : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/30'
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`font-medium text-sm ${notification.unread ? 'text-blue-500' : ''}`}>{notification.title}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {notification.description}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
                                {notification.time}
                              </span>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 text-red-500 rounded-full transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Dropdown (only shown when sidebar is closed) */}
            {!sidebarOpen && (
              <div className="relative">
                <motion.button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                    ? 'hover:bg-surface-secondary-dark/50'
                    : 'hover:bg-gray-100'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-8 h-8 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
                    }`}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="font-medium text-sm">{user?.fullName || 'User'}</p>
                    <p className={`text-xs capitalize ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                      }`}>
                      {user?.email || userRole}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 hidden lg:block ${userDropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute right-0 top-full mt-2 w-64 z-50 rounded-xl backdrop-blur-xl border ${theme === 'dark'
                        ? 'bg-surface-dark/95 border-surface-secondary-dark/30 shadow-dark-elevated'
                        : 'bg-white border-gray-200 shadow-lg'
                        }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className={`p-4 border-b ${theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
                            }`}>
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{user?.fullName || 'User'}</p>
                            <p
                              className={`text-sm capitalize ${theme === 'dark'
                                ? 'text-text-secondary-dark'
                                : 'text-text-secondary-light'
                                }`}
                            >
                              {user?.email || userRole}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => navigate('/settings')}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${theme === 'dark'
                            ? 'hover:bg-surface-secondary-dark/50'
                            : 'hover:bg-gray-50'
                            }`}
                        >
                          <SettingsIcon className="w-4 h-4" />
                          <span className="text-sm">Settings</span>
                        </button>
                        <button
                          onClick={() => navigate('/help')}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${theme === 'dark'
                            ? 'hover:bg-surface-secondary-dark/50'
                            : 'hover:bg-gray-50'
                            }`}
                        >
                          <HelpIcon className="w-4 h-4" />
                          <span className="text-sm">Help</span>
                        </button>
                      </div>
                      <div
                        className={`p-2 border-t ${theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
                          }`}
                      >
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${theme === 'dark'
                            ? 'hover:bg-error-dark/20 text-error-dark'
                            : 'hover:bg-red-50 text-red-600'
                            }`}
                        >
                          <LogOutIcon className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${window.innerWidth >= 1024 ? 'ml-[70px]' : 'ml-0'
        }`}>
        {children}
      </main>

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
    </div>
  );
};

export default DashboardLayout;