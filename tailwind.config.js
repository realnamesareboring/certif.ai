/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom color palette for certifications
        azure: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        security: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          900: '#7f1d1d',
        },
        aws: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          900: '#7c2d12',
        },
        gcp: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-soft': 'pulse 3s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
      }
    },
  },
  plugins: [
    // Add any additional plugins here if needed
    // require('@tailwindcss/forms') - Not installed, removed to prevent errors
  ],
  // Safelist commonly used dynamic classes
  safelist: [
    // Certification colors
    'border-blue-500',
    'bg-blue-50',
    'bg-blue-900/20',
    'border-red-500',
    'bg-red-50',
    'bg-red-900/20',
    'border-orange-500',
    'bg-orange-50',
    'bg-orange-900/20',
    'border-green-500',
    'bg-green-50',
    'bg-green-900/20',
    // Theme variations
    'text-blue-400',
    'text-red-400',
    'text-orange-400',
    'text-green-400',
    'hover:border-blue-300',
    'hover:border-red-300',
    'hover:border-orange-300',
    'hover:border-green-300',
  ]
}