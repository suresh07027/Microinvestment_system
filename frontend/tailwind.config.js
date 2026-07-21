/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        base: {
          950: '#07080F',
          900: '#0A0C18',
          850: '#0D0F1E',
          800: '#12142B',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          hover: 'rgba(255,255,255,0.07)',
          border: 'rgba(255,255,255,0.09)',
        },
        indigo: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        azure: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
        },
        mint: {
          400: '#4ADE80',
          500: '#34D399',
        },
        amber: {
          400: '#FBBF24',
        },
        rose: {
          400: '#FB7185',
        },
        ink: {
          50: '#F5F6FA',
          200: '#C7CBE0',
          400: '#9CA3C2',
          500: '#767E9E',
          600: '#565D78',
        },
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 20% 10%, rgba(99,102,241,0.35) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.3) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(59,130,246,0.25) 0px, transparent 50%)',
        'card-sheen': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)',
        'brand-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 55%, #3B82F6 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35)',
        'glow-indigo': '0 0 40px rgba(99,102,241,0.25)',
        'glow-violet': '0 0 40px rgba(139,92,246,0.2)',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blobFloatA: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(60px, -40px) scale(1.12)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.94)' },
        },
        blobFloatB: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-70px, 50px) scale(0.9)' },
          '66%': { transform: 'translate(40px, -30px) scale(1.08)' },
        },
        blobFloatC: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, 40px) scale(1.15)' },
        },
        coinDrop: {
          '0%': { transform: 'translateY(-140%) rotateY(0deg)', opacity: '0' },
          '15%': { opacity: '1' },
          '78%': { transform: 'translateY(0%) rotateY(720deg)', opacity: '1' },
          '86%': { transform: 'translateY(-6%) rotateY(760deg)' },
          '100%': { transform: 'translateY(0%) rotateY(800deg)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        gradientShift: 'gradientShift 16s ease infinite',
        blobFloatA: 'blobFloatA 22s ease-in-out infinite',
        blobFloatB: 'blobFloatB 26s ease-in-out infinite',
        blobFloatC: 'blobFloatC 19s ease-in-out infinite',
        coinDrop: 'coinDrop 1.6s cubic-bezier(.34,1.4,.64,1) infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        popIn: 'popIn 0.4s cubic-bezier(.34,1.56,.64,1) both',
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
}
