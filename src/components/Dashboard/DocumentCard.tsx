import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Download, Eye, FileText, MoreVertical, Pencil, Archive, Trash2 } from 'lucide-react';
import { ColorKey, VariantType, DocumentItem } from '../../types/index';


interface DocumentCardProps {
  doc: DocumentItem;
  onPreview: () => void;
  onDownload: () => void;
  theme: string;
  getColorClasses: (color: ColorKey, variant: VariantType) => string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  onPreview,
  onDownload,
  theme,
  getColorClasses,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleAction = (action: string) => {
    setShowDropdown(false);
    alert(`${action} triggered for ${doc.name}`);
  };

  return (
    <motion.div
      className={`p-3 rounded-lg border transition-all duration-200 group backdrop-blur-sm ${theme === 'dark'
        ? 'border-surface-secondary-dark/30 hover:bg-surface-secondary-dark/30 shadow-dark-card'
        : 'border-gray-200 hover:bg-gray-50'
        }`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`p-2 rounded-lg ${getColorClasses('info', 'bg')} ${getColorClasses('info', 'text')}`}>
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{doc.name}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}>
                {doc.size}
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}>
                •
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}>
                {doc.type}
              </span>
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <Calendar
                className={`w-3 h-3 ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}
              />
              <span className={`text-xs ${theme === 'dark' ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}>
                {doc.uploadDate} at {doc.uploadTime}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 relative">
          <motion.button
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
            className={`p-1.5 rounded transition-colors ${theme === 'dark'
              ? 'hover:bg-surface-secondary-dark text-text-secondary-dark hover:text-text-dark'
              : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
              }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Preview"
          >
            <Eye className="w-3 h-3" />
          </motion.button>
          <motion.button
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
            className={`p-1.5 rounded transition-colors ${theme === 'dark'
              ? 'hover:bg-surface-secondary-dark text-text-secondary-dark hover:text-text-dark'
              : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
              }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Download"
          >
            <Download className="w-3 h-3" />
          </motion.button>
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className={`p-1.5 rounded transition-colors ${theme === 'dark'
                ? 'hover:bg-surface-secondary-dark text-text-secondary-dark hover:text-text-dark'
                : 'hover:bg-gray-100 text-text-secondary-light hover:text-text-light'
                } ${showDropdown ? (theme === 'dark' ? 'bg-surface-secondary-dark text-text-dark' : 'bg-gray-100 text-text-light') : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="More options"
            >
              <MoreVertical className="w-3 h-3" />
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className={`absolute right-0 top-full mt-2 w-36 z-50 rounded-lg border shadow-xl backdrop-blur-xl ${theme === 'dark'
                    ? 'bg-surface-dark/95 border-surface-secondary-dark/30'
                    : 'bg-white border-gray-100'
                    }`}
                >
                  <div className="p-1">
                    <button
                      onClick={() => handleAction('Rename')}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-xs transition-colors ${theme === 'dark' ? 'hover:bg-surface-secondary-dark/50' : 'hover:bg-gray-50'
                        }`}
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Rename</span>
                    </button>
                    <button
                      onClick={() => handleAction('Archive')}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-xs transition-colors ${theme === 'dark' ? 'hover:bg-surface-secondary-dark/50' : 'hover:bg-gray-50'
                        }`}
                    >
                      <Archive className="w-3 h-3" />
                      <span>Archive</span>
                    </button>
                    <div className={`my-1 border-t ${theme === 'dark' ? 'border-surface-secondary-dark/20' : 'border-gray-100'}`} />
                    <button
                      onClick={() => handleAction('Delete')}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-xs transition-colors text-red-500 ${theme === 'dark' ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                        }`}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {doc.status === 'processing' && (
        <div className="mt-2">
          <div className={`w-full rounded-full h-1 ${theme === 'dark' ? 'bg-surface-secondary-dark' : 'bg-gray-200'}`}>
            <div className="bg-gradient-to-r from-secondary-dark to-accent-dark h-1 rounded-full w-3/4 animate-pulse"></div>
          </div>
          <span className={`text-xs mt-1 ${getColorClasses('warning', 'text')}`}>Processing...</span>
        </div>
      )}
    </motion.div>
  );
};

export default DocumentCard;