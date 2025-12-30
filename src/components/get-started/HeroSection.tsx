import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Users } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/20 via-secondary-dark/10 to-accent-dark/20 dark:from-primary-light/20 dark:via-secondary-light/10 dark:to-accent-light/20" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-secondary-dark/20 dark:bg-secondary-light/20 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-accent-dark/20 dark:bg-accent-light/20 rounded-full blur-xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-secondary-dark via-accent-dark to-primary-dark dark:from-secondary-light dark:via-accent-light dark:to-primary-light bg-clip-text text-transparent">
            Secure Your Digital Future
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto leading-relaxed">
            Advanced cybersecurity solutions powered by cutting-edge technology. 
            Protect your business with comprehensive security audits and real-time monitoring.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Audit
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border-2 border-secondary-dark dark:border-secondary-light text-secondary-dark dark:text-secondary-light rounded-xl font-semibold text-lg hover:bg-secondary-dark/10 dark:hover:bg-secondary-light/10 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {[
            {
              icon: Shield,
              title: "Advanced Protection",
              description: "Multi-layered security protocols"
            },
            {
              icon: Zap,
              title: "Real-time Monitoring",
              description: "24/7 threat detection and response"
            },
            {
              icon: Users,
              title: "Expert Support",
              description: "Dedicated security professionals"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl bg-surface-light/50 dark:bg-surface-dark/50 backdrop-blur-sm border border-secondary-light/20 dark:border-secondary-dark/20"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-secondary-dark dark:text-secondary-light" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;