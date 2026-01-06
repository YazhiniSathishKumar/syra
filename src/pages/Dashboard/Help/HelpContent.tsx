import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  Star,
  CheckCircle,
  ArrowRight,
  Bookmark
} from 'lucide-react';

const HelpContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // FAQ data and other content would be here...
  const faqs = [
    {
      id: '1',
      question: 'How do I start my first security audit?',
      answer: 'To start your first security audit, navigate to the Dashboard and click on "Request New Audit". Fill in the required information including target URL, audit type, and priority level. Our team will review your request and begin the audit process within 24 hours.',
      category: 'getting-started',
      helpful: 45
    },
    // ... more FAQs
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light bg-clip-text text-transparent mb-4">
          Help & Support Center
        </h1>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto mb-8">
          Find answers to your questions, learn from our comprehensive guides, and get the support you need
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles, FAQs, tutorials, or topics..."
            className="w-full pl-16 pr-6 py-5 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Live Chat Support',
            description: 'Get instant help from our expert support team',
            icon: MessageCircle,
            color: 'from-blue-500 to-cyan-500',
            action: 'Start Chat'
          },
          {
            title: 'Email Support',
            description: 'Send us a detailed message for complex issues',
            icon: Mail,
            color: 'from-green-500 to-emerald-500',
            action: 'Send Email'
          },
          {
            title: 'Schedule a Call',
            description: 'Book a consultation with our security experts',
            icon: Phone,
            color: 'from-purple-500 to-indigo-500',
            action: 'Book Call'
          }
        ].map((action, index) => (
          <motion.div
            key={index}
            className="group relative bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer overflow-hidden"
            whileHover={{ scale: 1.02, y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="relative z-10">
              <div className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white mb-4 w-fit`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{action.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Starting: ${action.title}`);
                }}
                className={`flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${action.color} bg-clip-text text-transparent group-hover:text-white transition-all duration-300`}
              >
                {action.action}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700/30"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                className="border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-gray-50/30 dark:bg-gray-800/30 backdrop-blur-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-300"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{faq.question}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {faq.helpful} people found this helpful
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  </motion.div>
                </button>
                {expandedFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={() => alert('Thanks for your feedback!')}
                          className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Helpful
                        </button>
                        <button
                          onClick={() => alert('FAQ saved to your bookmarks')}
                          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          <Bookmark className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200/50 dark:border-gray-700/50 rounded-2xl">
              <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                We couldn't find any FAQs matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HelpContent;