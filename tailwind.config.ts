
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Black theme with grey words
        background: {
          DEFAULT: '#000000', // Deep black
          foreground: '#121212', // Slightly lighter black for contrast
        },
        foreground: {
          DEFAULT: '#8A8A8A', // Medium grey for text
          muted: '#555555',   // Darker grey for less important text
        },
        primary: {
          DEFAULT: '#00A3FF', // Bright blue for highlights
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1E1E1E', // Dark grey
          foreground: '#999999',
        },
        card: {
          DEFAULT: '#0A0A0A', // Almost black card background
          foreground: '#CCCCCC', // Light grey text on cards
        },
        border: '#2A2A2A', // Dark grey border
      },
      backgroundColor: {
        dark: {
          100: '#0A0A0A',
          200: '#121212',
          300: '#1E1E1E',
        }
      },
      borderColor: {
        dark: {
          100: '#2A2A2A',
          200: '#3A3A3A',
        }
      },
      boxShadow: {
        'dark-lg': '0 10px 15px -3px rgba(255,255,255,0.05), 0 4px 6px -2px rgba(255,255,255,0.03)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
