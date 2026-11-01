/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          primary: '#101d35',
          secondary: '#1d3557',
        },
        slate: {
          muted: '#526782',
        },
        'blue-grey': {
          light: '#e9eef4',
        },
        app: {
          bg: '#f7f8fa',
          card: '#ffffff',
          border: '#e2e7ee',
        },
        body: {
          primary: '#172235',
          secondary: '#667085',
        },
        // Meaningful status colors:
        status: {
          success: {
            text: '#1b6e41',
            bg: '#edf7f0',
            border: '#c5e6d0',
          },
          warning: {
            text: '#92540c',
            bg: '#fef7ed',
            border: '#fbdab2',
          },
          danger: {
            text: '#a32626',
            bg: '#fdf2f2',
            border: '#f8c8c8',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      maxWidth: {
        site: '1440px',
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [],
};

