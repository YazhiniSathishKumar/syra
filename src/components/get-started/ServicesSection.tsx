import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Server, Cloud, Smartphone, Database, Wifi } from 'lucide-react';

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: Globe,
      title: "Web Application Security",
      description: "Comprehensive testing of web applications for OWASP Top 10 vulnerabilities, SQL injection, XSS, and authentication flaws.",
      features: ["OWASP Top 10 Testing", "SQL Injection Detection", "XSS Vulnerability Assessment", "Authentication Testing"],
      price: "Starting at $2,999"
    },
    {
      icon: Server,
      title: "Network Security Audit",
      description: "In-depth network infrastructure assessment including firewall configuration, intrusion detection, and network segmentation.",
      features: ["Firewall Assessment", "Port Scanning", "Network Mapping", "Intrusion Testing"],
      price: "Starting at $4,999"
    },
    {
      icon: Cloud,
      title: "Cloud Security Review",
      description: "Cloud infrastructure security assessment for AWS, Azure, and GCP including configuration review and compliance checking.",
      features: ["Cloud Configuration Review", "IAM Assessment", "Data Encryption Audit", "Compliance Checking"],
      price: "Starting at $3,999"
    },
    {
      icon: Smartphone,
      title: "Mobile App Security",
      description: "Mobile application security testing for iOS and Android apps including static and dynamic analysis.",
      features: ["Static Code Analysis", "Dynamic Testing", "API Security Testing", "Data Storage Review"],
      price: "Starting at $2,499"
    },
    {
      icon: Database,
      title: "Database Security",
      description: "Database security assessment including access controls, encryption, and vulnerability identification.",
      features: ["Access Control Review", "Encryption Assessment", "Privilege Escalation Testing", "Data Leakage Prevention"],
      price: "Starting at $1,999"
    },
    {
      icon: Wifi,
      title: "Wireless Security",
      description: "Wireless network security assessment including WiFi penetration testing and rogue access point detection.",
      features: ["WiFi Penetration Testing", "Rogue AP Detection", "Encryption Analysis", "Guest Network Review"],
      price: "Starting at $1,499"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-surface-light/50 to-background-light/50 dark:from-surface-dark/50 dark:to-background-dark/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light bg-clip-text text-transparent">
            Our Security Services
          </h2>
          <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            Comprehensive security solutions tailored to your specific needs and industry requirements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl p-8 border border-secondary-light/20 dark:border-secondary-dark/20 hover:border-secondary-light/40 dark:hover:border-secondary-dark/40 transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light p-3 mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-full h-full text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-4 group-hover:text-secondary-dark dark:group-hover:text-secondary-light transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <div className="w-2 h-2 rounded-full bg-secondary-dark dark:bg-secondary-light mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="border-t border-secondary-light/20 dark:border-secondary-dark/20 pt-6">
                <p className="text-lg font-semibold text-secondary-dark dark:text-secondary-light mb-4">
                  {service.price}
                </p>
                
                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-dark/5 to-accent-dark/5 dark:from-secondary-light/5 dark:to-accent-light/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;