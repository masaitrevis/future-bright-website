import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a0e1a",
          900: "#0f1629",
          800: "#141d36",
          700: "#1a2542",
          600: "#1e2e52",
          500: "#243560",
          400: "#2c4070",
          300: "#3a5588",
          200: "#4a6a9f",
          100: "#6b8bb8",
          50:  "#e8eef5",
        },
        gold: {
          400: "#d4a84b",
          500: "#c4943f",
          600: "#a87a32",
          700: "#8c6325",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
