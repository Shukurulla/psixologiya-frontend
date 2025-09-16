/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f3ff",
          100: "#bae0ff",
          200: "#91caff",
          300: "#69b1ff",
          400: "#4096ff",
          500: "#1677ff",
          600: "#0958d9",
          700: "#003eb3",
          800: "#002c8c",
          900: "#001d66",
        },
        secondary: {
          50: "#f0f5ff",
          100: "#d6e4ff",
          200: "#adc6ff",
          300: "#85a5ff",
          400: "#597ef7",
          500: "#2f54eb",
          600: "#1d39c4",
          700: "#10239e",
          800: "#061178",
          900: "#030852",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-up": "scaleUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
