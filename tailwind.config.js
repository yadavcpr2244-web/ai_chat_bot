/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  safelist: [
    'bg-blue-50', 'bg-purple-50', 'bg-green-50', 'bg-orange-50',
    'border-blue-200', 'border-purple-200', 'border-green-200', 'border-orange-200',
    'text-blue-600', 'text-purple-600', 'text-green-600', 'text-orange-600',
    'text-blue-700', 'text-purple-700', 'text-green-700', 'text-orange-700'
  ],
  plugins: [],
};
