import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "bg-gradient-dark": "var(--background-gradient-dark)",
        "bg-gradient-light": "var(--background-gradient-light)",
        "auth-background": "var(--auth-background)",
        "classic-button": "var(--classic-button)",
        "classic-button-hover": "var(--classic-button-hover)",
        dashboard: "var(--dashboard)",
        sidebar: "var(--sidebar)",
        item: "var(--item)",
        "item-border": "var(--item-border)",
        "sidebar-button-active": "var(--sidebar-button-active)",
        "sidebar-button-hover": "var(--sidebar-button-hover)",
        highlight: "var(--highlight)",
        "less-highlight": "var(--less-highlight)",
        "less-highlight-chip": "var(--less-highlight-chip)",
        avatar: "var(--avatar)",
        "nonfocus-text": "var(--non-focus-text)",
        "focus-text": "var(--focus-text)",
        "focus-text-hover": "var(--focus-text-hover)",
        "dropdown-menu": "var(--dropdown-menu)",
        "dropdown-menu-hover": "var(--dropdown-menu-hover)",
        divider: "var(--divider)",
        secondary: "var(--secondary)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontSize: {
        hx: "13px",
      },
      fontFamily: {
        deacon: ["var(--font-deacon)"],
        inter: ["var(--font-inter)"],
        mono: ["var(--font-roboto-mono)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} satisfies Config;

export default config;
