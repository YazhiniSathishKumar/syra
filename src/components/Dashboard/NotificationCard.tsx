// import React from 'react';
// import { motion } from 'framer-motion';
// import { Clock, X } from 'lucide-react';
// import { ColorKey, VariantType } from '../types/index';


// interface NotificationCardProps {
//   notification: any;
//   theme: string;
//   getColorClasses: (color: ColorKey, variant: VariantType) => string;
// }

// const NotificationCard: React.FC<NotificationCardProps> = ({
//   notification,
//   theme,
//   getColorClasses,
// }) => {
//   const Icon = notification.icon;

//   return (
//     <motion.div
//       key={notification.id}
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: notification.id * 0.1 }}
//       className={`relative p-4 rounded-xl transition-all duration-200 cursor-pointer group backdrop-blur-sm ${
//         notification.unread
//           ? theme === 'dark'
//             ? 'bg-gradient-to-r from-secondary-dark/10 to-accent-dark/10 border border-secondary-dark/20 shadow-inner-glow'
//             : 'bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200'
//           : theme === 'dark'
//           ? 'hover:bg-surface-secondary-dark/30'
//           : 'hover:bg-gray-50'
//       }`}
//       whileHover={{ scale: 1.01, x: 2 }}
//     >
//       <div className="flex items-start space-x-3">
//         <div
//           className={`p-2 rounded-lg mt-0.5 ${
//             notification.type === 'success'
//               ? getColorClasses('success', 'bg') + ' ' + getColorClasses('success', 'text')
//               : notification.type === 'warning'
//               ? getColorClasses('warning', 'bg') + ' ' + getColorClasses('warning', 'text')
//               : getColorClasses('info', 'bg') + ' ' + getColorClasses('info', 'text')
//           }`}
//         >
//           <Icon className="w-4 h-4" />
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
//               <p
//                 className={`text-xs leading-relaxed ${
//                   theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//                 }`}
//               >
//                 {notification.description}
//               </p>
//               <div className="flex items-center space-x-2 mt-2">
//                 <Clock
//                   className={`w-3 h-3 ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}
//                 />
//                 <span
//                   className={`text-xs ${
//                     theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//                   }`}
//                 >
//                   {notification.time}
//                 </span>
//               </div>
//             </div>
//             {notification.unread && (
//               <motion.div
//                 className="w-2 h-2 bg-secondary-dark rounded-full ml-2 mt-1"
//                 animate={{ scale: [1, 1.2, 1] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Hover actions */}
//       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//         <button
//           className={`p-1 rounded transition-colors ${
//             theme === 'dark'
//               ? 'hover:bg-surface-secondary-dark text-text-secondary-dark hover:text-text-dark'
//               : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
//           }`}
//         >
//           <X className="w-3 h-3" />
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default NotificationCard;

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, X } from 'lucide-react';



interface NotificationCardProps {
  notification: {
    id: number;
    title: string;
    description: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    unread: boolean;
    icon: React.ElementType;
  };
  theme: string;
  getColorClasses: (color: string, variant?: string) => string;
  onMarkRead: () => void; // ✅ Add these two
  onRemove: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  theme,
  getColorClasses,
  onMarkRead,
  onRemove
}) => {
  const Icon = notification.icon;

  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: notification.id * 0.1 }}
      onClick={() => notification.unread && onMarkRead()}
      className={`relative p-4 rounded-xl transition-all duration-200 cursor-pointer group backdrop-blur-sm ${notification.unread
        ? theme === 'dark'
          ? 'bg-gradient-to-r from-secondary-dark/10 to-accent-dark/10 border border-secondary-dark/20 shadow-inner-glow'
          : 'bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200'
        : theme === 'dark'
          ? 'hover:bg-surface-secondary-dark/30'
          : 'hover:bg-gray-50'
        }`}
      whileHover={{ scale: 1.01, x: 2 }}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`p-2 rounded-lg mt-0.5 ${notification.type === 'success'
            ? getColorClasses('success', 'bg') + ' ' + getColorClasses('success', 'text')
            : notification.type === 'warning'
              ? getColorClasses('warning', 'bg') + ' ' + getColorClasses('warning', 'text')
              : getColorClasses('info', 'bg') + ' ' + getColorClasses('info', 'text')
            }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
              <p
                className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                  }`}
              >
                {notification.description}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Clock
                  className={`w-3 h-3 ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}
                />
                <span
                  className={`text-xs ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
                    }`}
                >
                  {notification.time}
                </span>
              </div>
            </div>
            {notification.unread && (
              <motion.div
                className="w-2 h-2 bg-secondary-dark rounded-full ml-2 mt-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className={`p-1 rounded transition-colors ${theme === 'dark'
            ? 'hover:bg-surface-secondary-dark text-text-secondary-dark hover:text-text-dark'
            : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
            }`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationCard;


