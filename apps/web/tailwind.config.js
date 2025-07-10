/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './local-ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mahardika Brand Colors
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#0d1b2a', // Primary navy
          950: '#081420',
        },
        gold: {
          50: '#fefdf8',
          100: '#fdf8e8',
          200: '#fbf0c4',
          300: '#f8e5a0',
          400: '#f5d97c',
          500: '#f4b400', // Primary gold
          600: '#e6a500',
          700: '#cc8f00',
          800: '#b37a00',
          900: '#806600',
          950: '#4d3300',
        },
        // Semantic colors
        primary: {
          50: '#f0f4f8',
          500: '#0d1b2a',
          600: '#081420',
        },
        secondary: {
          50: '#fefdf8',
          500: '#f4b400',
          600: '#e6a500',
        },
        // UI colors
        background: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          dark: '#0d1b2a',
        },
        surface: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#e2e8f0',
        },
        text: {
          primary: '#0d1b2a',
          secondary: '#475569',
          tertiary: '#64748b',
          inverse: '#ffffff',
        },
        border: {
          primary: '#e2e8f0',
          secondary: '#cbd5e1',
          focus: '#f4b400',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '3/4': '75%',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'brand-sm': '0 1px 2px 0 rgba(13, 27, 42, 0.05)',
        'brand': '0 4px 6px -1px rgba(13, 27, 42, 0.1), 0 2px 4px -1px rgba(13, 27, 42, 0.06)',
        'brand-md': '0 10px 15px -3px rgba(13, 27, 42, 0.1), 0 4px 6px -2px rgba(13, 27, 42, 0.05)',
        'brand-lg': '0 20px 25px -5px rgba(13, 27, 42, 0.1), 0 10px 10px -5px rgba(13, 27, 42, 0.04)',
        'brand-xl': '0 25px 50px -12px rgba(13, 27, 42, 0.25)',
        'brand-2xl': '0 50px 100px -20px rgba(13, 27, 42, 0.25)',
        'gold-glow': '0 0 20px rgba(244, 180, 0, 0.3)',
        'navy-glow': '0 0 20px rgba(13, 27, 42, 0.3)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0d1b2a 0%, #f4b400 100%)',
        'gradient-navy': 'linear-gradient(135deg, #0d1b2a 0%, #243b53 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f4b400 0%, #e6a500 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(13, 27, 42, 0.95) 0%, rgba(244, 180, 0, 0.05) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#0d1b2a',
            a: {
              color: '#f4b400',
              '&:hover': {
                color: '#e6a500',
              },
            },
            h1: {
              color: '#0d1b2a',
            },
            h2: {
              color: '#0d1b2a',
            },
            h3: {
              color: '#0d1b2a',
            },
            h4: {
              color: '#0d1b2a',
            },
            blockquote: {
              borderLeftColor: '#f4b400',
              color: '#475569',
            },
            code: {
              color: '#0d1b2a',
              backgroundColor: '#f1f5f9',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
  ],
}; 