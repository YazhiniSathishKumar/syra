import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  error?: string;
  required?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium  mb-10 mt-10 text-surface-dark/80 dark:text-surface-light/80">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <motion.div
          className={`relative w-full cursor-pointer `}
          whileTap={{ scale: 0.995 }}
        >
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-4 py-3 bg-surface-light/10 dark:bg-surface-dark/10 border rounded-xl transition-all duration-300 flex items-center justify-between hover:shadow-lg ${
              isOpen
                ? 'border-accent-dark dark:border-accent-light ring-2 ring-accent-dark/20 dark:ring-accent-light/20 shadow-lg'
                : error
                ? 'border-red-500'
                : 'border-surface-light/20 dark:border-surface-dark/20 hover:border-surface-light/40 dark:hover:border-surface-dark/40'
            }`}
          >
            <div className="flex items-center space-x-3">
              {selectedOption?.icon && (
                <motion.span 
                  className="text-accent-dark dark:text-accent-light"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {selectedOption.icon}
                </motion.span>
              )}
              <span className={`${
                selectedOption 
                  ? 'text-surface-dark dark:text-surface-light font-medium' 
                  : 'text-surface-dark/50 dark:text-surface-light/50'
              }`}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-surface-dark/60 dark:text-surface-light/60" />
            </motion.div>
          </div>

          {error && (
            <motion.p 
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 -mt-6 bg-black/50 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Modal Content */}
            <motion.div
              className={`relative w-full max-w-md max-h-[80vh] -mt-5 rounded-2xl  border shadow-2xl overflow-hidden ${
                theme === 'dark'
                  ? 'bg-surface-dark/90 border-surface-dark/30'
                  : 'bg-surface-light/90 border-surface-secondary-light/30'
              }`}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-surface-dark/20 dark:border-surface-light/20">
                <div>
                  <h3 className="text-lg font-semibold text-surface-dark dark:text-surface-light">
                    {label}
                  </h3>
                  <p className="text-sm text-surface-dark/60 dark:text-surface-light/60 mt-1">
                    Choose an option from the list below
                  </p>
                </div>
                <motion.button
                  onClick={handleClose}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    theme === 'dark'
                      ? 'hover:bg-surface-dark text-text-secondary-dark hover:text-text-dark'
                      : 'hover:bg-surface-secondary-light text-text-secondary-light hover:text-text-light'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Search Input */}
              {options.length > 6 && (
                <div className="p-4 border-b border-surface-dark/20 dark:border-surface-light/20">
                  <motion.input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-surface-dark/50 border-surface-dark/30 focus:border-accent-dark text-text-dark placeholder:text-text-dark/50'
                        : 'bg-surface-light/50 border-surface-secondary-light/30 focus:border-accent-light text-text-light placeholder:text-text-light/50'
                    } focus:outline-none focus:ring-2 focus:ring-accent-dark/20 dark:focus:ring-accent-light/20`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    autoFocus
                  />
                </div>
              )}

              {/* Options List */}
              <div className="max-h-96 overflow-y-auto p-2">
                {filteredOptions.length === 0 ? (
                  <motion.div 
                    className="px-4 py-8 text-center text-surface-dark/50 dark:text-surface-light/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-4xl mb-2">🔍</div>
                    <p>No options found</p>
                    <p className="text-sm mt-1">Try adjusting your search</p>
                  </motion.div>
                ) : (
                  <div className="space-y-1">
                    {filteredOptions.map((option, index) => (
                      <motion.div
                        key={option.value}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => handleSelect(option.value)}
                        className={`px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between group ${
                          value === option.value
                            ? 'bg-gradient-to-r from-accent-dark/20 to-secondary-dark/20 dark:from-accent-light/20 dark:to-secondary-light/20 text-accent-dark dark:text-accent-light border border-accent-dark/30 dark:border-accent-light/30'
                            : theme === 'dark'
                            ? 'hover:bg-surface-dark/50 text-surface-light hover:shadow-md'
                            : 'hover:bg-surface-secondary-light/50 text-surface-dark hover:shadow-md'
                        }`}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          {option.icon && (
                            <motion.span 
                              className={`transition-all duration-300 ${
                                value === option.value
                                  ? 'text-accent-dark dark:text-accent-light scale-110'
                                  : 'text-surface-dark/60 dark:text-surface-light/60 group-hover:text-surface-dark dark:group-hover:text-surface-light group-hover:scale-110'
                              }`}
                              whileHover={{ rotate: 5 }}
                            >
                              {option.icon}
                            </motion.span>
                          )}
                          <span className="font-medium">{option.label}</span>
                        </div>
                        
                        {value === option.value && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="w-5 h-5 text-accent-dark dark:text-accent-light" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-surface-dark/20 dark:border-surface-light/20 bg-surface-light/30 dark:bg-surface-dark/30">
                <div className="flex items-center justify-between text-sm text-surface-dark/60 dark:text-surface-light/60">
                  <span>{filteredOptions.length} option{filteredOptions.length !== 1 ? 's' : ''} available</span>
                  <span className="text-xs">Press ESC to close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomDropdown;