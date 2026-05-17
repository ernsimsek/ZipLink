/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: {
          50: "#e2f0ff",
          100: "#c8e0ff",
          200: "#99c4ff",
          300: "#66a8ff",
          400: "#3d8bff",
          500: "#1a6ee6",
          600: "#0d4fa3",
          700: "#0a3570",
          800: "#061d42",
          900: "#030f20",
          950: "#020b18",
        },
        acid: {
          DEFAULT: "#00d4ff",
          dark: "#0099cc",
          light: "#66e5ff",
        },
        ember: {
          DEFAULT: "#ff2d78",
          dark: "#cc0055",
          light: "#ff6aa0",
        },
        neon: {
          DEFAULT: "#7c3aed",
          dark: "#5b21b6",
          light: "#a78bfa",
        },
        frost: {
          DEFAULT: "#e8f4fd",
          dark: "#b8d9f5",
        },
      },
      animation: {
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "spin-slow": "spin 3s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "pulse-glow-pink": "pulseGlowPink 2s ease-in-out infinite",
        ticker: "ticker 30s linear infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "float-fast": "floatFast 4s ease-in-out infinite",
        "rotate-slow": "rotateSlow 20s linear infinite",
        "electric-pulse": "electricPulse 1.5s ease-in-out infinite",
        "scan-line": "scanLine 3s ease-in-out infinite",
        "grid-move": "gridMove 10s linear infinite",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.85)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(0, 212, 255, 0.8), 0 0 100px rgba(0, 212, 255, 0.4)" },
        },
        pulseGlowPink: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 45, 120, 0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(255, 45, 120, 0.8)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        floatFast: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        rotateSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        electricPulse: {
          "0%, 100%": { opacity: "1", transform: "scaleX(1)" },
          "50%": { opacity: "0.5", transform: "scaleX(0.98)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(400%)", opacity: "0" },
        },
        gridMove: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "60px 60px" },
        },
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
