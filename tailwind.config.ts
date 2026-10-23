import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  corePlugins: {
    container: false,
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        border: "var(--border, #e7e2ee)",
        input: "var(--input, #e7e2ee)",
        ring: "var(--ring, #7c5cfc)",
        background: "var(--background, #ffffff)",
        foreground: "var(--foreground, #1c1825)",
        primary: {
          DEFAULT: "var(--primary, #7c5cfc)",
          foreground: "var(--primary-foreground, #ffffff)",
        },
        secondary: {
          DEFAULT: "var(--secondary, #f4f2f8)",
          foreground: "var(--secondary-foreground, #1c1825)",
        },
        muted: {
          DEFAULT: "var(--muted, #f4f2f8)",
          foreground: "var(--muted-foreground, #6e677c)",
        },
        accent: {
          DEFAULT: "var(--accent, #f4f2f8)",
          foreground: "var(--accent-foreground, #1c1825)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
