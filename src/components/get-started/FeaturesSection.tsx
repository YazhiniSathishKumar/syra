import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Scan, AlertTriangle, FileText, Clock, Users } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Comprehensive Security Audits",
      description: "Deep-dive security assessments covering web applications, networks, and cloud infrastructure with detailed vulnerability analysis.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Scan,
      title: "Automated Vulnerability Scanning",
      description: "Continuous automated scanning with real-time threat detection and immediate alerts for critical security issues.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: AlertTriangle,
      title: "Risk Assessment & Prioritization",
      description: "Intelligent risk scoring and prioritization to help you focus on the most critical vulnerabilities first.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: FileText,
      title: "Detailed Reporting",
      description: "Comprehensive reports with executive summaries, technical details, and actionable remediation recommendations.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Round-the-clock security monitoring with instant notifications and rapid incident response capabilities.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Users,
      title: "Expert Consultation",
      description: "Access to certified security professionals for guidance, best practices, and strategic security planning.",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light bg-clip-text text-transparent">
            Powerful Security Features
          </h2>
          <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            Everything you need to secure your digital assets and maintain compliance with industry standards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-8 rounded-2xl bg-surface-light/60 dark:bg-surface-dark/60 backdrop-blur-sm border border-secondary-light/20 dark:border-secondary-dark/20 hover:border-secondary-light/40 dark:hover:border-secondary-dark/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold mb-4 group-hover:text-secondary-dark dark:group-hover:text-secondary-light transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary-dark/50 to-transparent dark:via-secondary-light/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;