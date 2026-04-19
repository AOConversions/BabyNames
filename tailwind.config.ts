import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: "#fff4ee",
          100: "#ffe6d6",
          300: "#ffb88f",
          500: "#ff8a5c",
          700: "#e25a2a",
        },
        mint: {
          100: "#d7f7e8",
          300: "#8ee6b7",
          500: "#3fc987",
          700: "#1d9a5f",
        },
        lavender: {
          100: "#ece4ff",
          300: "#c3b0ff",
          500: "#8e72ff",
          700: "#5e42d1",
        },
        sunshine: {
          100: "#fff5c2",
          300: "#ffe070",
          500: "#ffc73b",
          700: "#d19600",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(80, 50, 120, 0.25)",
        pop: "0 20px 60px -20px rgba(255, 120, 90, 0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSlow: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        pulseSlow: "pulseSlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
