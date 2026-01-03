// import { useState, useRef, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Sun, Moon } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import AuthCard from '../components/ui/AuthCard';
// import Button from '../components/ui/Button';
// import { useTheme } from '../context/ThemeContext';
// import apiClient from '../lib/api';

// const OTPVerificationPage = () => {
//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     document.title = 'Verify | syra';
//   }, []);

//   const [isLoading, setIsLoading] = useState(false);
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const [id, setId] = useState(() => {
//     return localStorage.getItem('id') || '';
//   });

//   const [email, setEmail] = useState(() => {
//     const locationEmail = location.state?.email;
//     if (locationEmail) return locationEmail;
//     return localStorage.getItem('otp_email') || '';
//   });

//   useEffect(() => {
//     inputRefs.current[0]?.focus();
//   }, []);

//   const handleChange = (index: number, value: string) => {
//     if (value.length <= 1) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < 5) {
//         inputRefs.current[index + 1]?.focus();
//       }
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const code = otp.join('');

//     if (code.length !== 6) {
//       alert('Please enter all 6 digits of the OTP code.');
//       return;
//     }

//     if (!id && !email) {
//       alert('ID and email is missing. Please go back and try again.');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await apiClient.post('/auth/verify-otp', { id, email, code });
//       const token = response.data.token;
//       if (token) {
//         localStorage.setItem('token', token);
//         localStorage.removeItem('id');
//       }

//       // ✅ Role-based navigation
//       if (user.role === 'admin') navigate('/admin');
//       else if (user.role === 'tester') navigate('/tester');
//       else navigate('/dashboard'); // fallback for any other role
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Invalid or expired OTP. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     if (!id) {
//       alert('ID is missing. Please go back and try again.');
//       return;
//     }

//     try {
//       await apiClient.post('/resend-otp', { id });
//       alert('New OTP sent to your email!');
//       setOtp(['', '', '', '', '', '']);
//       inputRefs.current[0]?.focus();
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
//     }
//   };

//   return (
//     <motion.div
//       className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Animated background */}
//       <motion.div
//         className="absolute inset-0 z-0"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-secondary-dark/20 dark:bg-secondary-light/20 rounded-full blur-3xl animate-float" />
//         <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent-dark/20 dark:bg-accent-light/20 rounded-full blur-3xl animate-pulse-slow" />
//       </motion.div>

//       {/* Theme toggle */}
//       <motion.button
//         className="fixed top-4 right-4 p-2 rounded-full bg-[#e0e0e0] dark:bg-surface-light/50 backdrop-blur-sm z-50"
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={toggleTheme}
//       >
//         {theme === 'dark' ? (
//           <Sun className="w-6 h-6 text-yellow-400" />
//         ) : (
//           <Moon className="w-6 h-6 text-indigo-600" />
//         )}
//       </motion.button>

//       {/* OTP Form */}
//       <AuthCard
//         title="Verify Your Email"
//         subtitle={email 
//           ? `Enter the 6-digit code sent to ${email}`
//           : "Enter the 6-digit code sent to your email"
//         }
//       >
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex justify-center space-x-3">
//             {otp.map((digit, index) => (
//               <motion.input
//                 key={index}
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 type="text"
//                 inputMode="numeric"
//                 pattern="[0-9]*"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 className={`w-12 h-12 text-center text-lg font-semibold rounded-lg outline-none transition-all duration-300
//                   ${theme === 'dark'
//                     ? 'bg-surface-dark/50 border border-secondary-dark/30 focus:border-secondary-dark text-text-dark'
//                     : 'bg-surface-light/50 border border-secondary-light/30 focus:border-secondary-light text-text-light'
//                   }`}
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: index * 0.1 }}
//               />
//             ))}
//           </div>

//           <Button type="submit" isLoading={isLoading} className="w-full">
//             Verify
//           </Button>

//           <div className="text-center space-y-2">
//             <p className="text-sm">
//               Didn't receive the code{email ? ` at ${email}` : ''}?{' '}
//               <button
//                 type="button"
//                 className="text-secondary-dark dark:text-secondary-light hover:underline"
//                 onClick={handleResendOTP}
//               >
//                 Resend
//               </button>
//             </p>

//             <button
//               type="button"
//               className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//               onClick={() => navigate(-1)}
//             >
//               ← Go back
//             </button>
//           </div>
//         </form>
//       </AuthCard>
//     </motion.div>
//   );
// };

// export default OTPVerificationPage;






import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthCard from '../components/ui/AuthCard';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../lib/api';

const OTPVerificationPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Verify | syra';
  }, []);


  // useEffect(() => {
  //   if (!location.state?.email) {
  //     // No context, redirect to login
  //     navigate('/');
  //   }
  // }, [location]);

  // OTP state (6 digits)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch stored ID and email
  const [id, setId] = useState(() => localStorage.getItem('id') || '');
  // const [email, setEmail] = useState(() => {
  //   const locationEmail = location.state?.email;
  //   return locationEmail || localStorage.getItem('otp_email') || '';
  // });

  const [email, setEmail] = useState(() => localStorage.getItem('otp_email') || '');

  useEffect(() => {
    if (!email) {
      alert("Email not found. Please sign up again.");
      navigate('/signup'); // or '/login' if more appropriate
    }
  }, [email, navigate]);



  // Autofocus on first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle OTP digit input
  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Handle OTP Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 6) {
      alert('Please enter all 6 digits of the OTP code.');
      return;
    }

    if (!id && !email) {
      alert('ID and email are missing. Please go back and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/api/auth/verify-otp', { id, email, code });

      const { token, user } = response.data;

      if (token && user) {
        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.removeItem('id');
        localStorage.removeItem('otp_email'); // ✅ Cleanup

        // ✅ Reset introSeen so ParticleText shows
        localStorage.removeItem('introSeen');


        // 🔐 Role-based redirection (type-safe)
        type UserRole = 'admin' | 'tester' | 'user';
        const role = user.role as UserRole;

        switch (role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'tester':
            navigate('/testing');
            break;
          default:
            navigate('/dashboard'); // Normal user
        }
      } else {
        alert('Invalid response from server.');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }

  };

  // Resend OTP handler
  const handleResendOTP = async () => {
    if (!email) {
      alert('Email is missing. Please go back and try again.');
      return;
    }

    try {
      await apiClient.post('/api/auth/resend-otp', { email, type: 'signup' });
      alert('New OTP sent to your email!');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background animations */}
      <motion.div className="absolute inset-0 z-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-secondary-dark/20 dark:bg-secondary-light/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent-dark/20 dark:bg-accent-light/20 rounded-full blur-3xl animate-pulse-slow" />
      </motion.div>

      {/* Theme toggle button */}
      <motion.button
        className="fixed top-4 right-4 p-2 rounded-full bg-[#e0e0e0] dark:bg-surface-light/50 backdrop-blur-sm z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-600" />}
      </motion.button>

      {/* OTP Verification Card */}
      <AuthCard
        title="Verify Your Email"
        subtitle={email ? `Enter the 6-digit code sent to ${email}` : 'Enter the 6-digit code sent to your email'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="text" // optional, helps mobile keyboards
                pattern="[A-Za-z0-9]{1}" // ✅ Allow 1 alphanumeric character
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-lg font-semibold rounded-lg outline-none transition-all duration-300
                  ${theme === 'dark'
                    ? 'bg-surface-dark/50 border border-secondary-dark/30 focus:border-secondary-dark text-text-dark'
                    : 'bg-surface-light/50 border border-secondary-light/30 focus:border-secondary-light text-text-light'
                  }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Verify
          </Button>

          {/* Resend & Go Back */}
          <div className="text-center space-y-2">
            <p className="text-sm">
              Didn't receive the code{email ? ` at ${email}` : ''}?{' '}
              <button
                type="button"
                className="text-secondary-dark dark:text-secondary-light hover:underline"
                onClick={handleResendOTP}
              >
                Resend
              </button>
            </p>

            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => navigate(-1)}
            >
              ← Go back
            </button>
          </div>
        </form>
      </AuthCard>
    </motion.div>
  );
};

export default OTPVerificationPage;
