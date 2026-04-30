import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#fcfcfc",
        "bg-white": "#ffffff",
        "border-secondary": "#e8eaec",
        "border-primary": "#d2d6db",
        "border-brand": "#97abff",
        "border-disabled": "#e8eaec",
        "text-primary": "#12171d",
        "text-secondary": "#343b44",
        "text-tertiary": "#4c535c",
        "text-disabled": "#a0a6ad",
        "text-white": "#ffffff",
        "text-brand": "#2724ed",
        "entrada-bg": "#10b681",
        "brand": "#2724ed",
        "brand-light": "#f2f4ff",
        "surface-primary": "#fcfcfc",
        "surface-disabled": "#f8f8f9",
        "menu-selected": "#f2f4ff",
        "blue-light": "#eff8ff",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        "xs": ["12px", { lineHeight: "18px" }],
        "sm": ["14px", { lineHeight: "20px" }],
        "base": ["16px", { lineHeight: "24px" }],
        "lg": ["18px", { lineHeight: "28px" }],
      },
    },
  },
  plugins: [],
};

export default config;
