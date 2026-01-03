// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   darkMode: 'class',
//   theme: {
//     extend: {
//       colors: {
//         // Dark Mode Colors
//         'primary-dark': '#0A1931',
//         'secondary-dark': '#185ADB',
//         'accent-dark': '#FF2E63',
//         'text-dark': '#F1F1F1',
//         'background-dark': '#0F172A',
//         'surface-dark': '#1E293B',
        
//         // Light Mode Colors
//         'primary-light': '#3B82F6',
//         'secondary-light': '#8B5CF6',
//         'accent-light': '#EC4899',
//         'text-light': '#0F172A',
//         'background-light': '#F8FAFC',
//         'surface-light': '#FFFFFF',
        
//         // Status Colors
//         'success': '#10B981',
//         'warning': '#F59E0B',
//         'error': '#EF4444',
//       },
//       fontFamily: {
//         sans: ['"Inter"', 'sans-serif'],
//         display: ['"Poppins"', 'sans-serif'],
//       },
//       animation: {
//         'float': 'float 6s ease-in-out infinite',
//         'glow': 'glow 2s ease-in-out infinite alternate',
//         'shimmer': 'shimmer 3s linear infinite',
//         'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//       },
//       keyframes: {
//         float: {
//           '0%, 100%': { transform: 'translateY(0)' },
//           '50%': { transform: 'translateY(-20px)' },
//         },
//         glow: {
//           '0%': { boxShadow: '0 0 5px rgba(255, 46, 99, 0.5)' },
//           '100%': { boxShadow: '0 0 20px rgba(255, 46, 99, 0.8)' },
//         },
//         shimmer: {
//           '0%': { backgroundPosition: '-200% 0' },
//           '100%': { backgroundPosition: '200% 0' },
//         },
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Enhanced Dark Mode Colors
        'primary-dark': '#0A1931', // from 2nd config
        'secondary-dark': '#185ADB', // from 2nd config
        'accent-dark': '#FF2E63', // from 2nd config
        'success-dark': '#059669', // keep from 1st config
        'warning-dark': '#D97706', // keep from 1st config
        'error-dark': '#DC2626', // keep from 1st config
        'text-dark': '#F1F1F1', // from 2nd config
        'text-secondary-dark': '#CBD5E1', // from 1st config
        'background-dark': '#0F172A', // same both configs
        'surface-dark': '#1E293B', // same both configs
        'surface-secondary-dark': '#334155', // from 1st config

        // Enhanced Light Mode Colors
        'primary-light': '#3B82F6', // from 2nd config
        'secondary-light': '#8B5CF6', // from 2nd config
        'accent-light': '#EC4899', // from 2nd config
        'success-light': '#10B981', // from 1st config
        'warning-light': '#F59E0B', // from 1st config
        'error-light': '#EF4444', // from 1st config
        'text-light': '#0F172A', // from 2nd config
        'text-secondary-light': '#64748B', // from 1st config
        'background-light': '#F8FAFC', // same both configs
        'surface-light': '#FFFFFF', // same both configs
        'surface-secondary-light': '#F1F5F9', // from 1st config

        // Semantic Colors
        'info': '#0EA5E9', // from 1st config
        'neutral': '#6B7280', // from 1st config

        // Status Colors (explicit)
        'success': '#10B981', // from 2nd config
        'warning': '#F59E0B', // from 2nd config
        'error': '#EF4444', // from 2nd config
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Poppins"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'], // from 1st config
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out', // from 1st config
        'slide-out': 'slideOut 0.3s ease-in', // from 1st config
        'fade-in': 'fadeIn 0.2s ease-out', // from 1st config
        'scale-in': 'scaleIn 0.2s ease-out', // from 1st config
        'gradient-shift': 'gradientShift 8s ease-in-out infinite', // from 1st config
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          // use glow from 2nd config for red-pink accent
          '0%': { boxShadow: '0 0 5px rgba(255, 46, 99, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 46, 99, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '70': '17.5rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(59, 130, 246, 0.1)',
        'dark-glow': '0 0 30px rgba(219, 39, 119, 0.3), 0 0 60px rgba(59, 130, 246, 0.2)',
        'dark-card': '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'dark-elevated': '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, rgba(219, 39, 119, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        'dark-mesh': 'radial-gradient(circle at 20% 80%, rgba(219, 39, 119, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
};
