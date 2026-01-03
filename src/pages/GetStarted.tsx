// src/components/GetStarted.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../lib/api';
import {
  CheckCircle,
  AlertCircle,
  Lock,
  Shield,
  Server,
  Globe,
  Cloud,
  Smartphone,
  Cpu,
  Sun,
  Moon,
  Briefcase,
  Building,
  Factory,
  GraduationCap,
  Landmark,
  ShoppingBag,
  Stethoscope,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CustomDropdown from '../components/ui/CustomDropdown';
import {
  submitCompanyDetails,
  getCompanyDetails,
} from '../utils/api';

// Define interfaces
interface FormData {
  id?: string;
  companyName: string;
  contactName: string;
  jobRole: string;
  contactEmail: string;
  contactPhone: string;
  companySize: string;
  industry: string;
  auditServices: string[];
  additionalDetails: string;
}

interface ValidationErrors {
  companyName?: string;
  contactName?: string;
  jobRole?: string;
  contactEmail?: string;
  contactPhone?: string;
  companySize?: string;
  industry?: string;
  auditServices?: string;
  consent?: string;
}

const GetStarted = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [consentChecked, setConsentChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [formData, setFormData] = useState<FormData>({
    id: '',
    companyName: '',
    contactName: '',
    jobRole: '',
    contactEmail: '',
    contactPhone: '',
    companySize: '',
    industry: '',
    auditServices: [],
    additionalDetails: '',
  });

  // Company size options with icons
  const companySizeOptions = [
    { value: '1-10', label: '1-10 employees', icon: <Users className="w-4 h-4" /> },
    { value: '11-50', label: '11-50 employees', icon: <Users className="w-4 h-4" /> },
    { value: '51-200', label: '51-200 employees', icon: <Building className="w-4 h-4" /> },
    { value: '201-500', label: '201-500 employees', icon: <Building className="w-4 h-4" /> },
    { value: '501-1000', label: '501-1000 employees', icon: <Factory className="w-4 h-4" /> },
    { value: '1000+', label: '1000+ employees', icon: <Factory className="w-4 h-4" /> },
  ];

  // Industry options with icons
  const industryOptions = [
    { value: 'Technology', label: 'Technology', icon: <Cpu className="w-4 h-4" /> },
    { value: 'Finance', label: 'Finance', icon: <Briefcase className="w-4 h-4" /> },
    { value: 'Healthcare', label: 'Healthcare', icon: <Stethoscope className="w-4 h-4" /> },
    { value: 'Retail', label: 'Retail', icon: <ShoppingBag className="w-4 h-4" /> },
    { value: 'Manufacturing', label: 'Manufacturing', icon: <Factory className="w-4 h-4" /> },
    { value: 'Education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'Government', label: 'Government', icon: <Landmark className="w-4 h-4" /> },
    { value: 'Energy', label: 'Energy', icon: <Zap className="w-4 h-4" /> },
    { value: 'Transportation', label: 'Transportation', icon: <Truck className="w-4 h-4" /> },
    { value: 'Other', label: 'Other', icon: <Building className="w-4 h-4" /> },
  ];

  // Load existing data when component mounts
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const data = await getCompanyDetails();
        if (data) {
          setFormData({
            id: localStorage.getItem('id') || '',
            companyName: data.companyName || '',
            contactName: data.contactName || '',
            jobRole: data.jobRole || '',
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            companySize: data.companySize || '',
            industry: data.industry || '',
            auditServices: data.auditServices || [],
            additionalDetails: data.additionalDetails || '',
          });
          if (data.status === 'completed') {
            setIsSuccess(true);
            try {

              navigate('/verify');
            } catch (err) {
              console.error('Error loading company data:', err);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    document.title = 'Get Started | syra';
    loadCompanyData();
  }, [navigate]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(phone);
  };

  const getValidationErrorsStep1 = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.contactName.trim()) errors.contactName = 'Contact name is required';
    if (!formData.jobRole.trim()) errors.jobRole = 'Job role is required';
    if (!formData.contactEmail.trim()) errors.contactEmail = 'Email is required';
    else if (!validateEmail(formData.contactEmail)) errors.contactEmail = 'Please enter a valid email address';
    if (!formData.contactPhone.trim()) errors.contactPhone = 'Phone number is required';
    else if (!validatePhone(formData.contactPhone)) errors.contactPhone = 'Please enter a valid phone number (7–15 digits)';
    return errors;
  };

  const getValidationErrorsStep2 = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!formData.companySize) errors.companySize = 'Company size is required';
    if (!formData.industry) errors.industry = 'Industry is required';
    return errors;
  };

  const getValidationErrorsStep3 = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (formData.auditServices.length === 0) errors.auditServices = 'Please select at least one audit service';
    return errors;
  };

  const getValidationErrorsStep4 = (): ValidationErrors => {
    const errors = {
      ...getValidationErrorsStep1(),
      ...getValidationErrorsStep2(),
      ...getValidationErrorsStep3(),
    };
    if (!consentChecked) errors.consent = 'Please agree to the privacy policy';
    return errors;
  };

  const checkCurrentStepValidity = (step: number): boolean => {
    let errors: ValidationErrors = {};
    switch (step) {
      case 1:
        errors = getValidationErrorsStep1();
        break;
      case 2:
        errors = getValidationErrorsStep2();
        break;
      case 3:
        errors = getValidationErrorsStep3();
        break;
      case 4:
        errors = getValidationErrorsStep4();
        break;
      default:
        return false;
    }
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    setError('');
  };

  const nextStep = () => {
    const errors =
      currentStep === 1
        ? getValidationErrorsStep1()
        : currentStep === 2
          ? getValidationErrorsStep2()
          : currentStep === 3
            ? getValidationErrorsStep3()
            : {};
    if (Object.keys(errors).length === 0 && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      setValidationErrors({});
    } else {
      setValidationErrors(errors);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setValidationErrors({});
    }
  };

  const handleServiceChange = (service: string) => {
    setFormData((prev) => {
      const isSelected = prev.auditServices.includes(service);
      const newServices = isSelected
        ? prev.auditServices.filter((s) => s !== service)
        : [...prev.auditServices, service];
      return {
        ...prev,
        auditServices: newServices,
      };
    });
    if (validationErrors.auditServices) {
      setValidationErrors((prev) => ({
        ...prev,
        auditServices: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errors = getValidationErrorsStep4();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please ensure all required fields are filled correctly and consent is given.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      const response = await submitCompanyDetails({ ...payload, id: localStorage.getItem('id') });
      await apiClient.post('/api/auth/completeSignup', { id: localStorage.getItem('id') });

      if (response?.id) {
        localStorage.setItem('id', response.id);
      }

      setIsSuccess(true);
      setShowCountdown(true);

      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);


            navigate('/verify');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit request. Please try again.';
      setError(errorMsg);
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };






  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-background-dark' : 'bg-gray-300'}`}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          ></motion.div>
          <p className="text-gray-600 dark:text-gray-300">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-background-dark' : 'bg-gray-300'
      }`}>
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-1/4 right-1/3 w-64 h-64 bg-secondary-dark/20 dark:bg-secondary-light/20 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent-dark/20 dark:bg-accent-light/20 rounded-full blur-3xl"
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
      </motion.div>

      {/* Theme toggle button */}
      <motion.button
        className={`fixed top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${theme === 'dark'
            ? 'bg-surface-dark/50 border border-secondary-dark/30'
            : 'bg-surface-light/50 border border-secondary-light/30'
          }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-indigo-600" />
        )}
      </motion.button>

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <motion.div
          className={`relative p-8 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm transition-all duration-300 ${theme === 'dark'
              ? 'bg-surface-dark/80 border border-secondary-dark/30'
              : 'bg-surface-light/80 border border-secondary-light/30'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            animation: 'float 6s ease-in-out infinite'
          }}
        >
          {/* Animated gradient background */}
          <motion.div
            className={`absolute inset-0 opacity-10 z-0 bg-gradient-to-br 
              ${theme === 'dark'
                ? 'from-secondary-dark via-primary-dark to-accent-dark'
                : 'from-secondary-light via-primary-light to-accent-light'} 
              animate-shimmer bg-[length:200%_200%]`}
            animate={{
              scale: [1, 1.02, 1],
              rotate: [0, 1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Floating animated circles */}
          <motion.div
            className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent-dark/20 dark:bg-accent-light/20 blur-xl"
            animate={{
              y: [0, -10, 0],
              x: [0, 5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-secondary-dark/20 dark:bg-secondary-light/20 blur-xl"
            animate={{
              y: [0, 10, 0],
              x: [0, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="relative z-10">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-display font-bold mb-4">Get Started with BCBUZZ</h1>
              <p className="opacity-80">
                Complete the form below to begin your security audit journey.
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-10 relative">
              <div className={`h-1 w-full rounded-full ${theme === 'dark' ? 'bg-surface-dark/20' : 'bg-surface-secondary-light/20'
                }`}>
                <motion.div
                  className="h-1 bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light rounded-full transition-all duration-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / (isSuccess ? 5 : 4)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex justify-between -mt-2.5">
                {[1, 2, 3, 4].map(step => (
                  <motion.div
                    key={step}
                    className={`w-5 h-5 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${currentStep >= step
                        ? 'bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light'
                        : theme === 'dark' ? 'bg-surface-dark/20' : 'bg-surface-secondary-light/20'
                      }`}
                    whileHover={{ scale: 1.1 }}
                    animate={{ scale: currentStep >= step ? 1.1 : 1 }}
                  >
                    {currentStep > step && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between mt-2 text-xs opacity-60">
                <span>Company Details</span>
                <span>Business Info</span>
                <span>Audit Selection</span>
                <span>Review</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="bg-red-500/10 text-red-500 dark:text-red-400 p-4 rounded-lg mb-6 flex items-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {isSuccess ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Request Submitted Successfully!</h2>
                <p className="opacity-70 mb-4">
                  Your request has been successfully received and our team has been notified.
                </p>

                {showCountdown && (
                  <div className="mb-6">
                    <p className="text-lg font-medium mb-2">
                      Preparing your verification...
                    </p>
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="w-12 h-12 bg-secondary-dark/10 dark:bg-secondary-light/10 rounded-full flex items-center justify-center mr-3"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <span className="text-xl font-bold">{countdown}</span>
                      </motion.div>
                      <span>seconds remaining</span>
                    </div>
                  </div>
                )}

                <motion.button
                  onClick={() => {
                    if (countdown <= 0) {
                      navigate('/verify');
                    }
                  }}
                  className={`px-6 py-2 bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light text-white rounded-md hover:shadow-lg transition-all duration-300 ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  whileHover={countdown <= 0 ? { scale: 1.05 } : {}}
                  whileTap={countdown <= 0 ? { scale: 0.95 } : {}}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? 'Please wait...' : 'Proceed to Verification'}
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Step 1: Company Details */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-medium mb-4">Company Details</h2>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label htmlFor="companyName" className="block text-sm font-medium mb-1 opacity-80">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg outline-none transition-all duration-300 ${theme === 'dark'
                            ? 'bg-surface-dark/50 border border-secondary-dark/30 focus:border-secondary-dark text-text-dark placeholder:text-text-dark/50'
                            : 'bg-surface-light/50 border border-secondary-light/30 focus:border-secondary-light text-text-light placeholder:text-text-light/50'
                          } ${validationErrors.companyName
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                          }`}
                      />
                      {validationErrors.companyName && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {validationErrors.companyName}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <label htmlFor="contactName" className="block text-sm font-medium mb-1 opacity-80">
                        Contact Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg outline-none transition-all duration-300 ${theme === 'dark'
                            ? 'bg-surface-dark/50 border border-secondary-dark/30 focus:border-secondary-dark text-text-dark placeholder:text-text-dark/50'
                            : 'bg-surface-light/50 border border-secondary-light/30 focus:border-secondary-light text-text-light placeholder:text-text-light/50'
                          } ${validationErrors.contactName
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                          }`}
                      />
                      {validationErrors.contactName && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {validationErrors.contactName}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <label htmlFor="jobRole" className="block text-sm font-medium mb-1 opacity-80">
                        Job Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="jobRole"
                        name="jobRole"
                        value={formData.jobRole}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg outline-none transition-all duration-300 ${theme === 'dark'
                            ? 'bg-surface-dark/50 border border-secondary-dark/30 focus:border-secondary-dark text-text-dark placeholder:text-text-dark/50'
                            : 'bg-surface-light/50 border border-secondary-light/30 focus:border-secondary-light text-text-light placeholder:text-text-light/50'
                          } ${validationErrors.jobRole
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                          }`}
                      />
                      {validationErrors.jobRole && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {validationErrors.jobRole}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <label htmlFor="contactEmail" className="block text-sm font-medium mb-1 opacity-80">
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg outline-none transition-all duration-300 ${theme === 'dark'
                            ? 'bg-surface-dark/50 border border-secondary-dark/30 focus:border-secondary-dark text-text-dark placeholder:text-text-dark/50'
                            : 'bg-surface-light/50 border border-secondary-light/30 focus:border-secondary-light text-text-light placeholder:text-text-light/50'
                          } ${validationErrors.contactEmail
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                          }`}
                      />
                      {validationErrors.contactEmail && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {validationErrors.contactEmail}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <label htmlFor="contactPhone" className="block text-sm font-medium mb-1 opacity-80">
                        Contact Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/\D/g, '');
                          handleChange({
                            ...e,
                            target: {
                              ...e.target,
                              name: 'contactPhone',
                              value: onlyNums
                            }
                          });
                        }}
                        inputMode="numeric"
                        pattern="[0-9]{7,15}"
                        className={`w-full px-4 py-2 rounded-lg outline-none transition-all duration-300 ${theme === 'dark'
                            ? 'bg-surface-dark/50 border border-secondary-dark/30 focus:border-secondary-dark text-text-dark placeholder:text-text-dark/50'
                            : 'bg-surface-light/50 border border-secondary-light/30 focus:border-secondary-light text-text-light placeholder:text-text-light/50'
                          } ${validationErrors.contactPhone
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                          }`}
                      />
                      {validationErrors.contactPhone && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {validationErrors.contactPhone}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 2: Business Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-medium mb-4 text-surface-dark dark:text-surface-light">Business Information</h2>

                    <CustomDropdown
                      options={companySizeOptions}
                      value={formData.companySize}
                      onChange={(value) => handleDropdownChange('companySize', value)}
                      placeholder="Select company size"
                      label="Company Size"
                      error={validationErrors.companySize}
                      required
                    />

                    <CustomDropdown
                      options={industryOptions}
                      value={formData.industry}
                      onChange={(value) => handleDropdownChange('industry', value)}
                      placeholder="Select industry"
                      label="Industry"
                      error={validationErrors.industry}
                      required
                    />
                  </motion.div>
                )}

                {/* Step 3: Audit Services */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-medium mb-4">Select Audit Services</h2>
                    <p className="opacity-70 mb-6">
                      Choose the security audit services you're interested in. You can select multiple options. <span className="text-red-500">*</span>
                    </p>

                    {validationErrors.auditServices && (
                      <motion.div
                        className="bg-red-500/10 text-red-500 dark:text-red-400 p-3 rounded-lg mb-4 flex items-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
                        <span>{validationErrors.auditServices}</span>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'network', icon: Shield, label: 'Network Audit', description: 'Comprehensive assessment of your network infrastructure and security.', color: 'from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light' },
                        { id: 'web', icon: Globe, label: 'Web App Audit', description: 'Security assessment of your web applications and APIs.', color: 'from-green-500 to-emerald-500' },
                        { id: 'cloud', icon: Cloud, label: 'Cloud Audit', description: 'Security assessment of your cloud infrastructure and configurations.', color: 'from-blue-500 to-cyan-500' },
                        { id: 'mobile', icon: Smartphone, label: 'Mobile Audit', description: 'Security assessment of your mobile applications.', color: 'from-yellow-500 to-orange-500' },
                        { id: 'iot', icon: Cpu, label: 'IoT Audit', description: 'Security assessment of your IoT devices and infrastructure.', color: 'from-red-500 to-pink-500' },
                        { id: 'api', icon: Server, label: 'API Audit', description: 'Security assessment of your application programming interfaces.', color: 'from-violet-500 to-purple-500' }
                      ].map((service, index) => (
                        <motion.div
                          key={service.id}
                          className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${formData.auditServices.includes(service.id)
                              ? theme === 'dark'
                                ? 'border-secondary-dark bg-secondary-dark/10'
                                : 'border-secondary-light bg-secondary-light/10'
                              : theme === 'dark'
                                ? 'border-surface-dark/20 hover:border-surface-dark/40'
                                : 'border-surface-secondary-light/20 hover:border-surface-secondary-light/40'
                            }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <label className="flex items-start cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.auditServices.includes(service.id)}
                              onChange={() => handleServiceChange(service.id)}
                              className="h-5 w-5 rounded border-gray-300 text-secondary-dark dark:text-secondary-light focus:ring-secondary-dark dark:focus:ring-secondary-light mt-1"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex items-center mb-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${service.color} p-1.5 mr-3`}>
                                  <service.icon className="w-full h-full text-white" />
                                </div>
                                <span className="font-medium">{service.label}</span>
                              </div>
                              <p className="text-sm opacity-70">
                                {service.description}
                              </p>
                            </div>
                          </label>

                          {/* Selection indicator */}
                          {formData.auditServices.includes(service.id) && (
                            <motion.div
                              className="absolute top-2 right-2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <CheckCircle className="w-5 h-5 text-secondary-dark dark:text-secondary-light" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <label htmlFor="additionalDetails" className="block text-sm font-medium mb-1 opacity-80">
                        Additional Details
                      </label>
                      <textarea
                        id="additionalDetails"
                        name="additionalDetails"
                        value={formData.additionalDetails}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-2 rounded-lg outline-none transition-all duration-300 resize-none ${theme === 'dark'
                            ? 'bg-surface-dark/50 border border-secondary-dark/30 focus:border-secondary-dark text-text-dark placeholder:text-text-dark/50'
                            : 'bg-surface-light/50 border border-secondary-light/30 focus:border-secondary-light text-text-light placeholder:text-text-light/50'
                          }`}
                        placeholder="Please provide any additional information about your security requirements..."
                      />
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-medium mb-4">Review Your Information</h2>
                    <p className="opacity-70 mb-6">
                      Please review your information before submitting.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-surface-dark/20' : 'border-surface-secondary-light/20'
                          }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="font-medium mb-3 flex items-center">
                          <Shield className="h-5 w-5 text-secondary-dark dark:text-secondary-light mr-2" />
                          Company Details
                        </h3>
                        <ul className="space-y-2 text-sm opacity-80">
                          <li><span className="opacity-60">Company:</span> {formData.companyName}</li>
                          <li><span className="opacity-60">Contact:</span> {formData.contactName}</li>
                          <li><span className="opacity-60">Job Role:</span> {formData.jobRole}</li>
                          <li><span className="opacity-60">Email:</span> {formData.contactEmail}</li>
                          <li><span className="opacity-60">Phone:</span> {formData.contactPhone}</li>
                        </ul>
                      </motion.div>

                      <motion.div
                        className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-surface-dark/20' : 'border-surface-secondary-light/20'
                          }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <h3 className="font-medium mb-3 flex items-center">
                          <Shield className="h-5 w-5 text-secondary-dark dark:text-secondary-light mr-2" />
                          Business Information
                        </h3>
                        <ul className="space-y-2 text-sm opacity-80">
                          <li><span className="opacity-60">Company Size:</span> {formData.companySize}</li>
                          <li><span className="opacity-60">Industry:</span> {formData.industry}</li>
                        </ul>
                      </motion.div>
                    </div>

                    <motion.div
                      className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-surface-dark/20' : 'border-surface-secondary-light/20'
                        }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <h3 className="font-medium mb-3 flex items-center">
                        <Shield className="h-5 w-5 text-secondary-dark dark:text-secondary-light mr-2" />
                        Selected Audit Services
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.auditServices.map((service, index) => {
                          const serviceConfig = {
                            network: { icon: Server, label: 'Network Audit', color: 'bg-secondary-dark/10 text-secondary-dark dark:bg-secondary-light/10 dark:text-secondary-light' },
                            web: { icon: Globe, label: 'Web App Audit', color: 'bg-green-500/10 text-green-500 dark:bg-green-400/10 dark:text-green-400' },
                            cloud: { icon: Cloud, label: 'Cloud Audit', color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400' },
                            mobile: { icon: Smartphone, label: 'Mobile Audit', color: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-400/10 dark:text-yellow-400' },
                            iot: { icon: Cpu, label: 'IoT Audit', color: 'bg-red-500/10 text-red-500 dark:bg-red-400/10 dark:text-red-400' },
                            api: { icon: Server, label: 'API Audit', color: 'bg-violet-500/10 text-violet-500 dark:bg-violet-400/10 dark:text-violet-400' }
                          }[service] || { icon: Shield, label: service, color: 'bg-gray-500/10 text-gray-500' };

                          return (
                            <motion.span
                              key={service}
                              className={`px-3 py-1 rounded-full flex items-center ${serviceConfig.color}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <serviceConfig.icon className="w-4 h-4 mr-2" />
                              <span>{serviceConfig.label}</span>
                            </motion.span>
                          );
                        })}
                      </div>

                      {formData.additionalDetails && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 opacity-80">Additional Details:</h4>
                          <p className="opacity-70">{formData.additionalDetails}</p>
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-surface-dark/20' : 'border-surface-secondary-light/20'
                        }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <div className="flex items-start mb-4">
                        <Lock className="h-5 w-5 text-secondary-dark dark:text-secondary-light mr-3 shrink-0 mt-0.5" />
                        <p className="opacity-80">
                          Your information will be securely stored using our proprietary technology.
                          This ensures data integrity throughout the audit process.
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="consent"
                          checked={consentChecked}
                          onChange={(e) => setConsentChecked(e.target.checked)}
                          className="h-4 w-4 text-secondary-dark dark:text-secondary-light border-gray-300 rounded focus:ring-secondary-dark dark:focus:ring-secondary-light"
                        />
                        <label htmlFor="consent" className="ml-2 text-sm opacity-80">
                          I agree to the processing of my data as described in the{' '}
                          <a href="#" className="text-secondary-dark dark:text-secondary-light hover:opacity-80">Privacy Policy</a> <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {validationErrors.consent && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {validationErrors.consent}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      className={`px-6 py-2 text-red-400 rounded-md transition-all duration-300 ${theme === 'dark'
                          ? 'bg-surface-dark/20 hover:bg-surface-dark/30'
                          : 'bg-surface-secondary-light/20 hover:bg-surface-secondary-light/30'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                  )}

                  {currentStep < 4 ? (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!checkCurrentStepValidity(currentStep)}
                      className={`px-6 py-2 rounded-md transition-all duration-300 ml-auto ${checkCurrentStepValidity(currentStep)
                          ? 'bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light text-white hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      whileHover={checkCurrentStepValidity(currentStep) ? { scale: 1.02 } : {}}
                      whileTap={checkCurrentStepValidity(currentStep) ? { scale: 0.98 } : {}}
                    >
                      Next
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !checkCurrentStepValidity(currentStep)}
                      className={`px-6 py-2 rounded-md transition-all duration-300 ml-auto flex items-center ${checkCurrentStepValidity(currentStep) && !isSubmitting
                          ? 'bg-gradient-to-r from-secondary-dark to-accent-dark dark:from-secondary-light dark:to-accent-light text-white hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      whileHover={checkCurrentStepValidity(currentStep) && !isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={checkCurrentStepValidity(currentStep) && !isSubmitting ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.svg
                            className="animate-spin h-5 w-5 text-white mr-2"
                            viewBox="0 0 24 24"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </motion.svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </motion.button>
                  )}
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GetStarted;