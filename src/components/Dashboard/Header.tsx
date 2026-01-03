// import React from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import {
//   Menu,
//   Sun,
//   Moon,
//   Search,
//   Bell,
//   User,
//   ChevronDown,
//   Settings as SettingsIcon,
//   HelpCircle as HelpIcon,
//   LogOut as LogOutIcon
// } from 'lucide-react';

// interface HeaderProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (open: boolean) => void;
//   theme: string;
//   toggleTheme: () => void;
//   userDropdownOpen: boolean;
//   setUserDropdownOpen: (open: boolean) => void;
// }

// const Header: React.FC<HeaderProps> = ({
//   sidebarOpen,
//   setSidebarOpen,
//   theme,
//   toggleTheme,
//   userDropdownOpen,
//   setUserDropdownOpen,
// }) => {
// const navigate = useNavigate();

//   return (
//     <header
//       className={`${
//         theme === 'dark'
//           ? 'bg-surface-dark/80 border-b border-surface-secondary-dark/30 shadow-dark-card'
//           : 'bg-surface-light/80 border-b border-gray-200'
//       } backdrop-blur-xl sticky top-0 z-40`}
//     >
//       <div className="flex items-center justify-between p-4 lg:p-6">
//         <div className="flex items-center space-x-4">
//           {/* Sidebar Toggle Button */}
//           <motion.button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className={`p-2 rounded-lg transition-all duration-200 ${
//               theme === 'dark'
//                 ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
//                 : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//             }`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Menu className="w-5 h-5" />
//           </motion.button>

//           {/* Logo when sidebar is closed */}
//           {!sidebarOpen && (
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="flex items-center space-x-3"
//             >
//               <div
//                 className={`w-8 h-8 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-lg flex items-center justify-center ${
//                   theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                 }`}
//               >
//                 <span className="text-white font-bold text-sm">BC</span>
//               </div>
//               <h1
//                 className="text-lg font-bold bg-gradient-to-r from-secondary-dark to-accent-dark bg-clip-text text-transparent hidden sm:block"
//                 style={{
//                   WebkitBackgroundClip: 'text',
//                   WebkitTextFillColor: 'transparent',
//                 }}
//               >
//                 BCBUZZ
//               </h1>
//             </motion.div>
//           )}

//           {/* Title for larger screens */}
//           <div className="hidden sm:block">
//             <h1 className="text-xl lg:text-2xl font-bold">Welcome back, Test</h1>
//             <p
//               className={`text-sm ${
//                 theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//               }`}
//             >
//               Here's an overview of your security audits and account
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2 lg:space-x-4">
//           {/* Theme Toggle */}
//           <motion.button
//             onClick={toggleTheme}
//             className={`p-2 rounded-lg transition-all duration-200 ${
//               theme === 'dark'
//                 ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
//                 : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//             }`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             {theme === 'dark' ? (
//               <Sun className="w-5 h-5 text-yellow-400" />
//             ) : (
//               <Moon className="w-5 h-5 text-indigo-600" />
//             )}
//           </motion.button>

//           {/* Search - Hidden on mobile */}
//           <div className="relative hidden md:block">
//             <Search
//               className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${
//                 theme === 'dark'
//                   ? 'text-text-secondary-dark'
//                   : 'text-text-secondary-light'
//               }`}
//             />
//             <input
//               type="text"
//               placeholder="Search..."
//               className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
//                 theme === 'dark'
//                   ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark placeholder:text-text-secondary-dark focus:border-secondary-dark shadow-dark-card'
//                   : 'bg-gray-50 border-gray-200 text-text-light placeholder:text-text-secondary-light focus:border-blue-300'
//               } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//             />
//           </div>

//           {/* Notifications */}
//           <motion.button
//             className={`relative p-2 rounded-lg transition-all duration-200 ${
//               theme === 'dark'
//                 ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
//                 : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//             }`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Bell className="w-5 h-5" />
//             <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-dark rounded-full animate-pulse"></span>
//           </motion.button>

//           {/* User Profile Dropdown (when sidebar is closed) */}
//           {!sidebarOpen && (
//             <div className="relative">
//               <motion.button
//                 onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                 className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
//                   theme === 'dark'
//                     ? 'hover:bg-surface-secondary-dark/50'
//                     : 'hover:bg-gray-100'
//                 }`}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <div
//                   className={`w-8 h-8 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${
//                     theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                   }`}
//                 >
//                   <User className="w-4 h-4 text-white" />
//                 </div>
//                 <div className="text-left hidden lg:block">
//                   <p className="font-medium text-sm">Test User</p>
//                   <p
//                     className={`text-xs ${
//                       theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//                     }`}
//                   >
//                     test@bcbuzz.com
//                   </p>
//                 </div>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform duration-200 hidden lg:block ${
//                     userDropdownOpen ? 'rotate-180' : ''
//                   }`}
//                 />
//               </motion.button>

//               {/* Embedded Dropdown Menu */}
//               <AnimatePresence>
//                 {userDropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className={`absolute right-0 top-full mt-2 w-64 z-50 rounded-xl backdrop-blur-xl border ${
//                       theme === 'dark'
//                         ? 'bg-surface-dark/95 border-surface-secondary-dark/30 shadow-dark-elevated'
//                         : 'bg-white border-gray-200 shadow-lg'
//                     }`}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     {/* User Info */}
//                     <div
//                       className={`p-4 border-b ${
//                         theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div
//                           className={`w-12 h-12 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${
//                             theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                           }`}
//                         >
//                           <User className="w-6 h-6 text-white" />
//                         </div>
//                         <div>
//                           <p className="font-medium">Test User</p>
//                           <p
//                             className={`text-sm ${
//                               theme === 'dark'
//                                 ? 'text-text-secondary-dark'
//                                 : 'text-text-secondary-light'
//                             }`}
//                           >
//                             test@bcbuzz.com
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Menu Items */}
//                     <div className="p-2">
//                       <button
//                         onClick={() => navigate('/settings')}
//                         className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                           theme === 'dark'
//                             ? 'hover:bg-surface-secondary-dark/50'
//                             : 'hover:bg-gray-50'
//                         }`}
//                       >
//                         <SettingsIcon className="w-4 h-4" />
//                         <span className="text-sm">Account Settings</span>
//                       </button>
//                       <button
//                         onClick={() => navigate('/help')}
//                         className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                           theme === 'dark'
//                             ? 'hover:bg-surface-secondary-dark/50'
//                             : 'hover:bg-gray-50'
//                         }`}
//                       >
//                         <HelpIcon className="w-4 h-4" />
//                         <span className="text-sm">Help & Support</span>
//                       </button>
//                     </div>

//                     {/* Logout */}
//                     <div
//                       className={`p-2 border-t ${
//                         theme === 'dark'
//                           ? 'border-surface-secondary-dark/30'
//                           : 'border-gray-200'
//                       }`}
//                     >
//                       <button
//                         onClick={() => {
//                           localStorage.removeItem('token');
//                           navigate('/');
//                         }}
//                         className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                           theme === 'dark'
//                             ? 'hover:bg-error-dark/20 text-error-dark'
//                             : 'hover:bg-red-50 text-red-600'
//                         }`}
//                       >
//                         <LogOutIcon className="w-4 h-4" />
//                         <span className="text-sm">Logout</span>
//                       </button>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;




//----------------------------------xxxxxxxxxxxxxxxxxxxxxxx-----------------------




// import React from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import {
//   Menu,
//   Sun,
//   Moon,
//   Bell,
//   ChevronDown,
//   User,
//   Search,
//   Settings,
//   HelpCircle,
//   LogOut
// } from 'lucide-react';

// import NotificationCard from './NotificationCard';

// interface HeaderProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (open: boolean) => void;
//   theme: string;
//   toggleTheme: () => void;
//   userDropdownOpen: boolean;
//   setUserDropdownOpen: (open: boolean) => void;
//   notifications: any[];
//   showNotifications: boolean;
//   setShowNotifications: (show: boolean) => void;
//   markAsRead: (id: number) => void;
//   removeNotification: (id: number) => void;
//   getColorClasses: (color: string, variant?: string) => string;
// }

// const Header: React.FC<HeaderProps> = ({
//   sidebarOpen,
//   setSidebarOpen,
//   theme,
//   toggleTheme,
//   userDropdownOpen,
//   setUserDropdownOpen,
//   notifications,
//   showNotifications,
//   setShowNotifications,
//   markAsRead,
//   removeNotification,
//   getColorClasses
// }) => {
//   // Move useNavigate hook INSIDE the component
//   const navigate = useNavigate();
//   const unreadCount = notifications.filter(n => n.unread).length;

//   return (
//     <header
//       className={`${
//         theme === 'dark'
//           ? 'bg-surface-dark/80 border-b border-surface-secondary-dark/30 shadow-dark-card'
//           : 'bg-surface-light/80 border-b border-gray-200'
//       } backdrop-blur-xl sticky top-0 z-40`}
//     >
//       <div className="flex items-center justify-between p-4 lg:p-6">
//         <div className="flex items-center space-x-4">
//           {/* Sidebar Toggle */}
//           <motion.button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className={`p-2 rounded-lg transition-all duration-200 ${
//               theme === 'dark'
//                 ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
//                 : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//             }`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Menu className="w-5 h-5" />
//           </motion.button>

//           {/* Logo when sidebar is closed */}
//           {!sidebarOpen && (
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="flex items-center space-x-3"
//             >
//               <div
//                 className={`w-8 h-8 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-lg flex items-center justify-center ${
//                   theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                 }`}
//               >
//                 <span className="text-white font-bold text-sm">BC</span>
//               </div>
//               <h1
//                 className="text-lg font-bold bg-gradient-to-r from-secondary-dark to-accent-dark bg-clip-text text-transparent hidden sm:block"
//                 style={{
//                   WebkitBackgroundClip: 'text',
//                   WebkitTextFillColor: 'transparent'
//                 }}
//               >
//                 BCBUZZ
//               </h1>
//             </motion.div>
//           )}

//           {/* Dashboard Title */}
//           <div className="hidden sm:block">
//             <h1 className="text-xl lg:text-2xl font-bold">Welcome back, Test</h1>
//             <p
//               className={`text-sm ${
//                 theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//               }`}
//             >
//               Here's an overview of your security audits and account
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2 lg:space-x-4">
//           {/* Theme Toggle */}
//           <motion.button
//             onClick={toggleTheme}
//             className={`p-2 rounded-lg transition-all duration-200 ${
//               theme === 'dark'
//                 ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
//                 : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//             }`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             {theme === 'dark' ? (
//               <Sun className="w-5 h-5 text-yellow-400" />
//             ) : (
//               <Moon className="w-5 h-5 text-indigo-600" />
//             )}
//           </motion.button>

//           {/* Search - Hidden on mobile */}
//           <div className="relative hidden md:block">
//             <input
//               type="text"
//               placeholder="Search..."
//               className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
//                 theme === 'dark'
//                   ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark placeholder:text-text-secondary-dark'
//                   : 'bg-gray-50 border-gray-200 text-text-light placeholder:text-text-secondary-light'
//               } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//             />
//             <Search
//               className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
//                 theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//               }`}
//             />
//           </div>

//           {/* Notifications Bell */}
//           <div className="relative">
//             <motion.button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className={`relative p-2 rounded-lg transition-all duration-200 ${
//                 theme === 'dark'
//                   ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
//                   : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//               }`}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Bell className="w-5 h-5" />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-dark rounded-full animate-pulse"></span>
//               )}
//             </motion.button>

//             {/* Notification Dropdown */}
//             {showNotifications && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.2 }}
//                 className={`absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 rounded-xl border backdrop-blur-xl ${
//                   theme === 'dark'
//                     ? 'bg-surface-dark/95 border-surface-secondary-dark/30 shadow-dark-card'
//                     : 'bg-white border-gray-200 shadow-lg'
//                 }`}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className={`p-4 border-b ${
//                   theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
//                 }`}>
//                   <h3 className="text-sm font-medium">Notifications</h3>
//                 </div>
//                 <div className="divide-y divide-surface-secondary-dark/20">
//                   {notifications.map(notification => (
//                     <NotificationCard
//                       key={notification.id}
//                       notification={notification}
//                       theme={theme}
//                       getColorClasses={getColorClasses}
//                       onMarkRead={() => markAsRead(notification.id)}
//                       onRemove={() => removeNotification(notification.id)}
//                     />
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => {
//                     // Mark all as read
//                     notifications.forEach(n => markAsRead(n.id));
//                   }}
//                   className={`w-full text-center py-2 text-xs ${
//                     theme === 'dark'
//                       ? 'text-secondary-dark hover:bg-secondary-dark/10'
//                       : 'text-blue-600 hover:bg-blue-50'
//                   }`}
//                 >
//                   Mark all as read
//                 </button>
//               </motion.div>
//             )}
//           </div>

//           {/* User Profile Dropdown (when sidebar is closed) */}
//           {!sidebarOpen && (
//             <div className="relative">
//               <motion.button
//                 onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                 className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
//                   theme === 'dark'
//                     ? 'hover:bg-surface-secondary-dark/50'
//                     : 'hover:bg-gray-100'
//                 }`}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <div
//                   className={`w-8 h-8 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${
//                     theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                   }`}
//                 >
//                   <User className="w-4 h-4 text-white" />
//                 </div>
//                 <div className="text-left hidden lg:block">
//                   <p className="font-medium text-sm">Test User</p>
//                   <p
//                     className={`text-xs ${
//                       theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//                     }`}
//                   >
//                     test@bcbuzz.com
//                   </p>
//                 </div>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform duration-200 hidden lg:block ${
//                     userDropdownOpen ? 'rotate-180' : ''
//                   }`}
//                 />
//               </motion.button>

//               {/* User Dropdown */}
//               <AnimatePresence>
//                 {userDropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className={`absolute right-0 top-full mt-2 w-64 z-50 rounded-xl backdrop-blur-xl border ${
//                       theme === 'dark'
//                         ? 'bg-surface-dark/95 border-surface-secondary-dark/30 shadow-dark-elevated'
//                         : 'bg-white border-gray-200 shadow-lg'
//                     }`}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <div
//                       className={`p-4 border-b ${
//                         theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div
//                           className={`w-12 h-12 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${
//                             theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                           }`}
//                         >
//                           <User className="w-6 h-6 text-white" />
//                         </div>
//                         <div>
//                           <p className="font-medium">Test User</p>
//                           <p
//                             className={`text-sm ${
//                               theme === 'dark'
//                                 ? 'text-text-secondary-dark'
//                                 : 'text-text-secondary-light'
//                             }`}
//                           >
//                             test@bcbuzz.com
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-2">
//                       <button
//                         className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                           theme === 'dark'
//                             ? 'hover:bg-surface-secondary-dark/50'
//                             : 'hover:bg-gray-50'
//                         }`}
//                       >
//                         <Settings className="w-4 h-4" />
//                         <span className="text-sm">Account Settings</span>
//                       </button>
//                       <button
//                         className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                           theme === 'dark'
//                             ? 'hover:bg-surface-secondary-dark/50'
//                             : 'hover:bg-gray-50'
//                         }`}
//                       >
//                         <HelpCircle className="w-4 h-4" />
//                         <span className="text-sm">Help & Support</span>
//                       </button>
//                     </div>
//                     <div
//                       className={`p-2 border-t ${
//                         theme === 'dark'
//                           ? 'border-surface-secondary-dark/30'
//                           : 'border-gray-200'
//                       }`}
//                     >
//                       <button
//                         onClick={() => {
//                           localStorage.removeItem('token');
//                           navigate('/');
//                         }}
//                         className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                           theme === 'dark'
//                             ? 'hover:bg-error-dark/20 text-error-dark'
//                             : 'hover:bg-red-50 text-red-600'
//                         }`}
//                       >
//                         <LogOut className="w-4 h-4" />
//                         <span className="text-sm">Logout</span>
//                       </button>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;





//---------------------------xxxxxxxxxxxxxxxxxxxxxx--------------------------






import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  User,
  Search,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import NotificationCard from './NotificationCard';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: string;
  toggleTheme: () => void;
  userDropdownOpen: boolean;
  setUserDropdownOpen: (open: boolean) => void;
  notifications: any[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  markAsRead: (id: number) => void;
  removeNotification: (id: number) => void;
  getColorClasses: (color: string, variant?: string) => string;
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  theme,
  toggleTheme,
  userDropdownOpen,
  setUserDropdownOpen,
  notifications,
  showNotifications,
  setShowNotifications,
  markAsRead,
  removeNotification,
  getColorClasses
}) => {
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => n.unread).length;
  const [user, setUser] = useState<{ id: string, fullName: string, email: string } | null>(null);

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

  return (
    <header
      className={`${theme === 'dark'
        ? 'bg-surface-dark/80 border-b border-surface-secondary-dark/30 shadow-dark-card'
        : 'bg-surface-light/80 border-b border-gray-200'
        } backdrop-blur-xl sticky top-0 z-40`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-4">
          {/* Only show Hamburger if Sidebar is CLOSED */}
          {!sidebarOpen && (
            <motion.button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                ? 'hover:bg-surface-secondary-dark/50 text-text-secondary-dark hover:text-text-dark'
                : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          )}

          {/* Logo when sidebar is closed */}
          {!sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div
                className={`w-8 h-8 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-lg flex items-center justify-center ${theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
                  }`}
              >
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <h1
                className="text-lg font-bold bg-gradient-to-r from-secondary-dark to-accent-dark bg-clip-text text-transparent hidden sm:block"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                BCBUZZ
              </h1>
            </motion.div>
          )}

          {/* Dashboard Title */}
          <div className="hidden sm:block">
            <h1 className="text-xl lg:text-2xl font-bold">Welcome back</h1>
            <p
              className={`text-sm ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                }`}
            >
              Here's an overview of your security audits and account
            </p>
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
            <input
              type="text"
              placeholder="Search..."
              className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${theme === 'dark'
                ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark placeholder:text-text-secondary-dark'
                : 'bg-gray-50 border-gray-200 text-text-light placeholder:text-text-secondary-light'
                } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
            />
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                }`}
            />
          </div>

          {/* Notifications Bell */}
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

            {/* Notification Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 rounded-xl border backdrop-blur-xl ${theme === 'dark'
                  ? 'bg-surface-dark/95 border-surface-secondary-dark/30 shadow-dark-card'
                  : 'bg-white border-gray-200 shadow-lg'
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
                  }`}>
                  <h3 className="text-sm font-medium">Notifications</h3>
                </div>
                <div className="divide-y divide-surface-secondary-dark/20">
                  {notifications.map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      theme={theme}
                      getColorClasses={getColorClasses}
                      onMarkRead={() => markAsRead(notification.id)}
                      onRemove={() => removeNotification(notification.id)}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    notifications.forEach(n => markAsRead(n.id));
                  }}
                  className={`w-full text-center py-2 text-xs ${theme === 'dark'
                    ? 'text-secondary-dark hover:bg-secondary-dark/10'
                    : 'text-blue-600 hover:bg-blue-50'
                    }`}
                >
                  Mark all as read
                </button>
              </motion.div>
            )}
          </div>

          {/* User Profile Dropdown (visible when sidebar is closed) */}
          {!sidebarOpen && (
            <div className="relative">
              <motion.button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                  ? 'hover:bg-surface-secondary-dark/50'
                  : 'hover:bg-gray-100'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`w-8 h-8 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
                    }`}
                >
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="font-medium text-sm">{user?.fullName || 'User'}</p>
                  <p
                    className={`text-xs ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                      }`}
                  >
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 hidden lg:block ${userDropdownOpen ? 'rotate-180' : ''
                    }`}
                />
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
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
                        <div
                          className={`w-12 h-12 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
                            }`}
                        >
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{user?.fullName || 'User'}</p>
                          <p
                            className={`text-sm ${theme === 'dark'
                              ? 'text-text-secondary-dark'
                              : 'text-text-secondary-light'
                              }`}
                          >
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button onClick={() => { navigate('/settings'); }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${theme === 'dark'
                          ? 'hover:bg-surface-secondary-dark/50'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Account Settings</span>
                      </button>
                      <button onClick={() => { navigate('/help'); }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${theme === 'dark'
                          ? 'hover:bg-surface-secondary-dark/50'
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-sm">Help & Support</span>
                      </button>
                    </div>
                    <div
                      className={`p-2 border-t ${theme === 'dark'
                        ? 'border-surface-secondary-dark/30'
                        : 'border-gray-200'
                        }`}
                    >
                      <button
                        onClick={() => {
                          localStorage.removeItem('token');
                          navigate('/');
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${theme === 'dark'
                          ? 'hover:bg-error-dark/20 text-error-dark'
                          : 'hover:bg-red-50 text-red-600'
                          }`}
                      >
                        <LogOut className="w-4 h-4" />
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
  );
};

export default Header;