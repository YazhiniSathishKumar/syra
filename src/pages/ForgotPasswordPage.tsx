import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Sun, Moon, ArrowLeft } from 'lucide-react';
import AuthCard from '../components/ui/AuthCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../lib/api'; // ✅ New import

const ForgotPasswordPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Forgot Password | syra';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await apiClient.post('/auth/forgot-password', { email });
      setIsEmailSent(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset instructions';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsEmailSent(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-secondary-dark/20 dark:bg-secondary-light/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent-dark/20 dark:bg-accent-light/20 rounded-full blur-3xl animate-pulse-slow" />
      </motion.div>

      {/* Theme toggle button */}
      <motion.button
        className="fixed top-4 right-4 p-2 rounded-full bg-[#e0e0e0] dark:bg-surface-light/50 backdrop-blur-sm"
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

      <Link
        to="/"
        className="fixed top-4 left-4 p-2 rounded-full bg-[#e0e0e0] dark:bg-surface-light/50 backdrop-blur-sm"
      >
        <ArrowLeft className="w-6 h-6 text-red-800" />
      </Link>

      <AuthCard
        title={isEmailSent ? 'Check Your Email' : 'Reset Password'}
        subtitle={
          isEmailSent
            ? 'We’ve sent instructions to reset your password'
            : 'Enter your email to receive reset instructions'
        }
      >
        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}

        {!isEmailSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              leftIcon={<Mail className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Send Reset Link
            </Button>

            <p className="text-center text-sm">
              Remember your password?{' '}
              <Link
                to="/"
                className="text-secondary-dark dark:text-secondary-light hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-sm opacity-80">
              We've sent instructions to <strong>{email}</strong>. Please check your inbox (and spam/junk folder).
            </p>
            <Button
              onClick={handleResend}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              Try Another Email
            </Button>
          </div>
        )}
      </AuthCard>
    </div>
  );
};

export default ForgotPasswordPage;