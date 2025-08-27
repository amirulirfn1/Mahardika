import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const preset = require("../../packages/config/tailwind/preset.cjs");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [preset as any],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        md: "2rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        heading: ["var(--font-manrope)", "ui-sans-serif", "system-ui"],
      },
      colors: {
        accent: "hsl(var(--accent))",
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        premium:
          "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 8px 24px -16px rgba(0,0,0,0.8)",
      },
      ringColor: {
        DEFAULT: "hsl(var(--accent))",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 300ms ease-out both",
        "fade-up": "fade-up 400ms ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
