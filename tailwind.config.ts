import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#DB2777",
          light: "#F472B6",
          dark: "#9D174D",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#FCD34D",
          dark: "#CA8A04",
        },
        maroon: {
          DEFAULT: "#831843",
          dark: "#4A0020",
        },
        cream: "#FEF9EE",
        brand: "#FDF2F8",
      },
      fontFamily: {
        samarkan: ["Samarkan", "Playfair Display", "serif"],
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        float: "float 4s ease-in-out infinite",
        marquee: "marquee 25s linear infinite",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #CA8A04 50%, #D4AF37 100%)",
        "rose-gradient": "linear-gradient(135deg, #DB2777 0%, #9D174D 100%)",
        "heritage-gradient": "linear-gradient(180deg, #FDF2F8 0%, #FCE7F3 50%, #FDF2F8 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
