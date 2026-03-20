import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef3e2",
          100: "#fde4b9",
          200: "#fcd38c",
          300: "#fbc25f",
          400: "#fab53d",
          500: "#f9a825",
          600: "#f59b21",
          700: "#ef8b1b",
          800: "#e97c17",
          900: "#df600e",
        },
        dark: {
          bg: "#1a1a2e",
          card: "#16213e",
          accent: "#0f3460",
        },
      },
    },
  },
  plugins: [],
};
export default config;
