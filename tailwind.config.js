/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B1020',
          secondary: '#111A2E',
          card: '#151F35',
          cardHover: '#1B2742',
          border: '#1E2D4A',
          subtle: '#223254',
          text: '#F8FAFC',
          muted: '#94A3B8',
        },
        light: {
          bg: '#F8FAFC',
          secondary: '#F1F5F9',
          card: '#FFFFFF',
          cardHover: '#F8FAFC',
          border: '#E2E8F0',
          subtle: '#CBD5E1',
          text: '#0F172A',
          muted: '#64748B',
        },
        primary: {
          DEFAULT: '#3987FF',
          hover: '#2563EB',
          light: '#60A5FA',
          glow: 'rgba(57, 135, 255, 0.25)',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#A78BFA',
          glow: 'rgba(139, 92, 246, 0.25)',
        },
        accent: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px -3px rgba(57, 135, 255, 0.3)',
        'glow-secondary': '0 0 20px -3px rgba(139, 92, 246, 0.3)',
        'glow-success': '0 0 20px -3px rgba(34, 197, 94, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

