/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        rotate: {
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeEffect: {
          '0%': { opacity: '0.2' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'wave-01': 'rotate 13s linear infinite',
        'wave-02': 'rotate 12s linear infinite',
        'wave-03': 'rotate 10s linear infinite',
        'fadeEffect': 'fadeEffect 2s ease-in-out ',
      }

    },


  },
  plugins: [],
}

