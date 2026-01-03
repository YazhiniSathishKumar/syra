// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Plus,
//   X,
//   Send
// } from 'lucide-react';

// interface NewAuditFormModalProps {
//   show: boolean;
//   onClose: () => void;
//   theme: string;
// }

// const NewAuditFormModal: React.FC<NewAuditFormModalProps> = ({
//   show,
//   onClose,
//   theme
// }) => {
//   const [form, setForm] = React.useState({
//     auditType: '',
//     targetUrl: '',
//     description: '',
//     priority: 'medium',
//     methodology: '',
//     contactEmail: '',
//     companyName: '',
//     estimatedDuration: ''
//   });

//   const handleChange = (field: string, value: string) => {
//     setForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('New audit request:', form);
//     onClose();
//     setForm({
//       auditType: '',
//       targetUrl: '',
//       description: '',
//       priority: 'medium',
//       methodology: '',
//       contactEmail: '',
//       companyName: '',
//       estimatedDuration: ''
//     });
//   };

//   return (
//     <AnimatePresence>
//       {show && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-xl ${
//               theme === 'dark'
//                 ? 'bg-surface-dark/95 border border-surface-secondary-dark/30 shadow-dark-elevated'
//                 : 'bg-surface-light/95 border border-gray-200'
//             }`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className={`p-6 border-b ${
//               theme === 'dark' ? 'border-surface-secondary-dark/30' : 'border-gray-200'
//             }`}>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-3 rounded-xl bg-gradient-to-r from-secondary-dark to-accent-dark text-white">
//                     <Plus className="w-6 h-6" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold">Request New Audit</h2>
//                     <p className={`${
//                       theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'
//                     }`}>Fill out the form to request a new security audit</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={onClose}
//                   className={`p-2 rounded-lg transition-colors ${
//                     theme === 'dark' 
//                       ? 'hover:bg-surface-secondary-dark/50' 
//                       : 'hover:bg-gray-100'
//                   }`}
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Audit Type */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Audit Type</label>
//                   <select
//                     value={form.auditType}
//                     onChange={(e) => handleChange('auditType', e.target.value)}
//                     className={`w-full px-4 py-2 rounded-lg border transition-colors ${
//                       theme === 'dark'
//                         ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark'
//                         : 'bg-gray-50 border-gray-200 text-text-light'
//                     } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//                     required
//                   >
//                     <option value="">Select audit type</option>
//                     <option value="web">Web Application</option>
//                     <option value="network">Network Security</option>
//                     <option value="cloud">Cloud Infrastructure</option>
//                     <option value="mobile">Mobile Application</option>
//                   </select>
//                 </div>

//                 {/* Priority */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Priority</label>
//                   <select
//                     value={form.priority}
//                     onChange={(e) => handleChange('priority', e.target.value)}
//                     className={`w-full px-4 py-2 rounded-lg border transition-colors ${
//                       theme === 'dark'
//                         ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark'
//                         : 'bg-gray-50 border-gray-200 text-text-light'
//                     } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//                   >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Target URL */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">Target URL/IP</label>
//                 <input
//                   type="text"
//                   value={form.targetUrl}
//                   onChange={(e) => handleChange('targetUrl', e.target.value)}
//                   placeholder="https://example.com  or 192.168.1.1"
//                   className={`w-full px-4 py-2 rounded-lg border transition-colors ${
//                     theme === 'dark'
//                       ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark placeholder:text-text-secondary-dark'
//                       : 'bg-gray-50 border-gray-200 text-text-light placeholder:text-text-secondary-light'
//                   } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Company Name */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Company Name</label>
//                   <input
//                     type="text"
//                     value={form.companyName}
//                     onChange={(e) => handleChange('companyName', e.target.value)}
//                     placeholder="Your company name"
//                     className={`w-full px-4 py-2 rounded-lg border transition-colors ${
//                       theme === 'dark'
//                         ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark placeholder:text-text-secondary-dark'
//                         : 'bg-gray-50 border-gray-200 text-text-light placeholder:text-text-secondary-light'
//                     } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//                     required
//                   />
//                 </div>

//                 {/* Contact Email */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Contact Email</label>
//                   <input
//                     type="email"
//                     value={form.contactEmail}
//                     onChange={(e) => handleChange('contactEmail', e.target.value)}
//                     placeholder="contact@company.com"
//                     className={`w-full px-4 py-2 rounded-lg border transition-colors ${
//                       theme === 'dark'
//                         ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark placeholder:text-text-secondary-dark'
//                         : 'bg-gray-50 border-gray-200 text-text-light placeholder:text-text-secondary-light'
//                     } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Methodology */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Preferred Methodology</label>
//                   <select
//                     value={form.methodology}
//                     onChange={(e) => handleChange('methodology', e.target.value)}
//                     className={`w-full px-4 py-2 rounded-lg border transition-colors ${
//                       theme === 'dark'
//                         ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark'
//                         : 'bg-gray-50 border-gray-200 text-text-light'
//                     } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//                   >
//                     <option value="">Select methodology</option>
//                     <option value="owasp">OWASP Testing Guide</option>
//                     <option value="nist">NIST Framework</option>
//                     <option value="pci">PCI DSS</option>
//                     <option value="iso27001">ISO 27001</option>
//                   </select>
//                 </div>

//                 {/* Estimated Duration */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Estimated Duration</label>
//                   <select
//                     value={form.estimatedDuration}
//                     onChange={(e) => handleChange('estimatedDuration', e.target.value)}
//                     className={`w-full px-4 py-2 rounded-lg border transition-colors ${
//                       theme === 'dark'
//                         ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark'
//                         : 'bg-gray-50 border-gray-200 text-text-light'
//                     } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//                   >
//                     <option value="">Select duration</option>
//                     <option value="1-2 weeks">1-2 weeks</option>
//                     <option value="3-4 weeks">3-4 weeks</option>
//                     <option value="1-2 months">1-2 months</option>
//                     <option value="3+ months">3+ months</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">Description & Requirements</label>
//                 <textarea
//                   value={form.description}
//                   onChange={(e) => handleChange('description', e.target.value)}
//                   placeholder="Describe your audit requirements, scope, and any specific concerns..."
//                   rows={4}
//                   className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
//                     theme === 'dark'
//                       ? 'bg-surface-secondary-dark/50 border-surface-secondary-dark text-text-dark placeholder:text-text-secondary-dark'
//                       : 'bg-gray-50 border-gray-200 text-text-light placeholder:text-text-secondary-light'
//                   } focus:outline-none focus:ring-2 focus:ring-secondary-dark/20`}
//                   required
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center justify-end space-x-4 pt-4">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className={`px-6 py-2 rounded-lg transition-colors ${
//                     theme === 'dark'
//                       ? 'bg-surface-secondary-dark/50 hover:bg-surface-secondary-dark text-text-dark'
//                       : 'bg-gray-100 hover:bg-gray-200 text-text-light'
//                   }`}
//                 >
//                   Cancel
//                 </button>
//                 <motion.button
//                   type="submit"
//                   className="px-6 py-2 bg-gradient-to-r from-secondary-dark to-accent-dark text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Send className="w-4 h-4" />
//                   <span>Submit Request</span>
//                 </motion.button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default NewAuditFormModal;













import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Send,
  Globe,
  Shield
} from 'lucide-react';
import CustomDropdown from '../ui/CustomDropdown'; // Make sure this path is correct

interface NewAuditFormModalProps {
  show: boolean;
  onClose: () => void;
  theme: string;
}

// Define Option type directly here
interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const NewAuditFormModal: React.FC<NewAuditFormModalProps> = ({
  show,
  onClose,
  theme
}) => {
  const [form, setForm] = React.useState({
    auditType: '',
    targetUrl: '',
    description: '',
    methodology: '',
    contactEmail: '',
    companyName: '',
    estimatedDuration: ''
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New audit request:', form);
    onClose();
    setForm({
      auditType: '',
      targetUrl: '',
      description: '',
      methodology: '',
      contactEmail: '',
      companyName: '',
      estimatedDuration: ''
    });
  };

  const auditTypeOptions: Option[] = [
    { value: 'web', label: 'Web Application', icon: <Globe className="w-5 h-5" /> },
    { value: 'network', label: 'Network Security', icon: <Shield className="w-5 h-5" /> },
    { value: 'cloud', label: 'Cloud Infrastructure', icon: <CloudIcon className="w-5 h-5" /> },
    { value: 'mobile', label: 'Mobile Application', icon: <MobileIcon className="w-5 h-5" /> }
  ];

  const methodologyOptions: Option[] = [
    { value: 'owasp', label: 'OWASP Testing Guide' },
    { value: 'nist', label: 'NIST Framework' },
    { value: 'pci', label: 'PCI DSS' },
    { value: 'iso27001', label: 'ISO 27001' }
  ];

  const durationOptions: Option[] = [
    { value: '1-2 weeks', label: '1-2 Weeks' },
    { value: '3-4 weeks', label: '3-4 Weeks' },
    { value: '1-2 months', label: '1-2 Months' },
    { value: '3+ months', label: '3+ Months' }
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-slate-900/80 via-indigo-900/60 to-purple-900/80 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.form
            onSubmit={handleSubmit}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl backdrop-blur-xl border-2 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-indigo-900/95 border-indigo-500/30'
                : 'bg-gradient-to-br from-white/95 via-blue-50/95 to-indigo-50/95 border-indigo-200/50'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b backdrop-blur-sm ${
                theme === 'dark' 
                  ? 'border-indigo-500/20 bg-gradient-to-r from-slate-800/50 to-indigo-800/50' 
                  : 'border-indigo-200/30 bg-gradient-to-r from-blue-50/50 to-indigo-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl"
                    whileHover={{ scale: 1.05, rotate: 360 }}
transition={{ 
    scale: { type: "spring", stiffness: 600, damping: 15 },
    rotate: { duration: 0.5 } // Fast 360° in 0.3 seconds
  }}                  >
                    <Plus className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h2 className={`text-2xl font-bold bg-gradient-to-r ${
                      theme === 'dark' 
                        ? 'from-white via-blue-100 to-indigo-200' 
                        : 'from-slate-800 via-indigo-700 to-purple-700'
                    } bg-clip-text text-transparent`}>
                      Request New Audit
                    </h2>
                    <p
                      className={`mt-1 ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      Fill out the form to request a new security audit
                    </p>
                  </div>
                </div>
                <motion.button
                  type="button"
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    theme === 'dark'
                      ? 'hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-transparent hover:border-red-500/30'
                      : 'hover:bg-red-50 text-slate-600 hover:text-red-600 border border-transparent hover:border-red-200'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-8">
              {/* Audit Type Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CustomDropdown
                  options={auditTypeOptions}
                  value={form.auditType}
                  onChange={(val) => handleChange('auditType', val)}
                  placeholder="Select an audit type"
                  label="Audit Type"
                  required
                />
              </motion.div>

              {/* Target URL */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className={`block text-sm font-semibold mb-3 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  Target URL/IP
                </label>
                <input
                  type="text"
                  value={form.targetUrl}
                  onChange={(e) => handleChange('targetUrl', e.target.value)}
                  placeholder="https://example.com  or 192.168.1.1"
                  className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:bg-slate-700/70'
                      : 'bg-white/70 border-indigo-200/50 text-slate-800 placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white'
                  } focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:shadow-lg backdrop-blur-sm`}
                  required
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className={`block text-sm font-semibold mb-3 ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    placeholder="Your company name"
                    className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:bg-slate-700/70'
                        : 'bg-white/70 border-indigo-200/50 text-slate-800 placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white'
                    } focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:shadow-lg backdrop-blur-sm`}
                    required
                  />
                </motion.div>

                {/* Contact Email */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className={`block text-sm font-semibold mb-3 ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="contact@company.com"
                    className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:bg-slate-700/70'
                        : 'bg-white/70 border-indigo-200/50 text-slate-800 placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white'
                    } focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:shadow-lg backdrop-blur-sm`}
                    required
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Methodology Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <CustomDropdown
                    options={methodologyOptions}
                    value={form.methodology}
                    onChange={(val) => handleChange('methodology', val)}
                    placeholder="Select methodology"
                    label="Preferred Methodology"
                  />
                </motion.div>

                {/* Duration Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <CustomDropdown
                    options={durationOptions}
                    value={form.estimatedDuration}
                    onChange={(val) => handleChange('estimatedDuration', val)}
                    placeholder="Select duration"
                    label="Estimated Duration"
                  />
                </motion.div>
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className={`block text-sm font-semibold mb-3 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  Description & Requirements
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your audit requirements, scope, and any specific concerns..."
                  rows={4}
                  className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 resize-none ${
                    theme === 'dark'
                      ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:bg-slate-700/70'
                      : 'bg-white/70 border-indigo-200/50 text-slate-800 placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white'
                  } focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:shadow-lg backdrop-blur-sm`}
                  required
                />
              </motion.div>

              {/* Submit Buttons */}
              <motion.div 
                className="flex items-center justify-end space-x-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  type="button"
                  onClick={onClose}
                  className={`px-8 py-3 rounded-2xl transition-all duration-300 font-medium ${
                    theme === 'dark'
                      ? 'bg-slate-700/50 hover:bg-slate-600/60 text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500'
                      : 'bg-white/70 hover:bg-gray-50 text-slate-700 hover:text-slate-800 border border-slate-200 hover:border-slate-300'
                  } backdrop-blur-sm hover:shadow-lg`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-medium shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 group backdrop-blur-sm border border-white/20"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.div>
                  <span>Submit Request</span>
                  <motion.div
                    className="w-0 h-0.5 bg-white/50 group-hover:w-4 transition-all duration-300"
                  />
                </motion.button>
              </motion.div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Optional: Create reusable icons if needed
const CloudIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M11.75 21a6.751 6.751 0 0 0-6.742-6.75H3v-1.5A2.25 2.25 0 0 1 5.25 10.5h13.5A2.25 2.25 0 0 1 21 12.75v1.5h-1.995A6.75 6.75 0 0 0 11.75 21z" />
  </svg>
);

const MobileIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M14 13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2zm5 0a2 2 0 0 0-2-2h-1v1.5a1.5 1.5 0 1 0 3 0V11h-1z" />
    <path d="M10 3h4a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 0-1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h1V5a2 2 0 0 1 2-2z" />
  </svg>
);

export default NewAuditFormModal;