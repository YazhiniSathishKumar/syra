// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Settings as SettingsIcon,
//   HelpCircle as HelpIcon,
//   LogOut as LogOutIcon,
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// interface UserDropdownProps {
//   userDropdownOpen: boolean;
//   theme: string;
// }

// const UserDropdown: React.FC<UserDropdownProps> = ({ userDropdownOpen, theme }) => {
//   const [user, setUser] = useState<{ id: string, fullName: string, email: string } | null>(null);
//
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (e) {
//         console.error('Failed to parse user from localStorage', e);
//       }
//     }
//   }, []);
//   return (
//     <AnimatePresence>
//       {userDropdownOpen && (
//         <motion.div
//           initial={{ opacity: 0, y: -10, scale: 0.95 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0, y: -10, scale: 0.95 }}
//           transition={{ duration: 0.2 }}
//           className={`absolute right-0 top-full mt-2 w-64 z-50 rounded-xl backdrop-blur-xl border ${
//             theme === 'dark'
//               ? 'bg-surface-dark/95 border-surface-secondary-dark/30 shadow-dark-elevated'
//               : 'bg-white border-gray-200 shadow-lg'
//           }`}
//         >
//           {/* User Info */}
//           <div
//             className={`p-4 border-b ${
//               theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
//             }`}
//           >
//             <div className="flex items-center space-x-3">
//               <div
//                 className={`w-12 h-12 bg-gradient-to-br from-secondary-dark to-accent-dark rounded-full flex items-center justify-center ${
//                   theme === 'dark' ? 'shadow-glow' : 'shadow-lg'
//                 }`}
//               >
//                 <span className="text-white font-bold text-sm">BC</span>
//               </div>
//               <div>
//                 <p className="font-medium">{user?.fullName || 'User'}</p>
//                 <p
//                   className={`text-sm ${
//                     theme === 'dark'
//                       ? 'text-text-secondary-dark'
//                       : 'text-text-secondary-light'
//                   }`}
//                 >
//                   {user?.email || 'user@example.com'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Menu Items */}
//           <div className="p-2">
//             <button
//               className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                 theme === 'dark'
//                   ? 'hover:bg-surface-secondary-dark/50'
//                   : 'hover:bg-gray-50'
//               }`}
//             >
//               <SettingsIcon className="w-4 h-4" />
//               <span className="text-sm">Account Settings</span>
//             </button>
//             <button
//               className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                 theme === 'dark'
//                   ? 'hover:bg-surface-secondary-dark/50'
//                   : 'hover:bg-gray-50'
//               }`}
//             >
//               <HelpIcon className="w-4 h-4" />
//               <span className="text-sm">Help & Support</span>
//             </button>
//           </div>

//           {/* Logout */}
//           <div
//             className={`p-2 border-t ${
//               theme === 'dark'
//                 ? 'border-surface-secondary-dark/30'
//                 : 'border-gray-200'
//             }`}
//           >
//             <button
//               className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
//                 theme === 'dark'
//                   ? 'hover:bg-error-dark/20 text-error-dark'
//                   : 'hover:bg-red-50 text-red-600'
//               }`}
//             >
//               <LogOutIcon className="w-4 h-4" />
//                 <Link className="font-medium" to={'/'}>Logout</Link>
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default UserDropdown;