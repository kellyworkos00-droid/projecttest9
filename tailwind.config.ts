import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0B3B2E",
          light: "#0F5340",
          dark: "#081F1A",
        },
        accent: {
          DEFAULT: "#F5A300",
          light: "#FFB833",
          dark: "#CC8800",
        },
        clay: {
          DEFAULT: "#D56B46",
          light: "#E08862",
          dark: "#B85535",
        },
        sand: {
          DEFAULT: "#F4E9D7",
          light: "#FAF3E8",
          dark: "#E8D9C3",
        },
        charcoal: "#1D1D1B",
      },
      fontFamily: {
        sans: ["var(--font-mulish)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
