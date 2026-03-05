import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['Cormorant', 'Georgia', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        samarkan: ['Samarkan', 'Cormorant', 'serif'],
        // Legacy aliases
        playfair: ['Cormorant', 'serif'],
        inter: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: '#031411',
        vert: '#07312A',
        bleu: '#1B2E49',
        or: '#BFA06A',
        'or-rich': '#CA8A04',
        bordeaux: '#490C1E',
        ivoire: '#F0E6C2',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'shimmer': 'shimmer 6s ease-in-out infinite alternate',
        'grain': 'grain 8s steps(10) infinite',
        'liquid': 'liquidMorph 8s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
