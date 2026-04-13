/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#D4A574",
        "on-primary": "#FFFFFF",
        "primary-container": "#FFE0B2",
        secondary: "#8D6E63",
        "on-secondary": "#FFFFFF",
        surface: "#FFFBF5",
        background: "#FFF8F0",
        error: "#BA1A1A",
        success: "#2E7D32",
        warning: "#F57C00",
        "on-surface": "#1C1B1F",
        "on-surface-variant": "#49454F",
        outline: "#79747E",
      },
    },
  },
  plugins: [],
};
