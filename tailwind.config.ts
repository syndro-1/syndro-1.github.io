import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Syne"', '"Space Grotesk"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
        neon: {
          DEFAULT: "hsl(var(--neon))",
          blue: "hsl(var(--neon-blue))",
          purple: "hsl(var(--neon-purple))",
          pink: "hsl(var(--neon-pink))",
        },
        cat: {
          web: "hsl(var(--cat-web))",
          misc: "hsl(var(--cat-misc))",
          crypto: "hsl(var(--cat-crypto))",
          pwn: "hsl(var(--cat-pwn))",
          forensics: "hsl(var(--cat-forensics))",
          rev: "hsl(var(--cat-rev))",
        },
        diff: {
          easy: "hsl(var(--diff-easy))",
          medium: "hsl(var(--diff-medium))",
          hard: "hsl(var(--diff-hard))",
          insane: "hsl(var(--diff-insane))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
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
        "float-up": {
          from: { opacity: "0", transform: "translateY(60px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "modal-in": {
          from: { transform: "scale(0.95) translateY(-20px)", opacity: "0" },
          to: { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        glitch: {
          "0%, 100%": { textShadow: "0 0 40px hsl(155 100% 50% / 0.6)" },
          "20%": { textShadow: "-2px 0 hsl(330 100% 65%), 2px 0 hsl(195 100% 50%)" },
          "40%": { textShadow: "2px 0 hsl(330 100% 65%), -2px 0 hsl(195 100% 50%)" },
          "60%": { textShadow: "0 0 40px hsl(155 100% 50% / 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-up": "float-up 0.8s ease forwards",
        "slide-up": "slide-up 0.5s ease forwards",
        "modal-in": "modal-in 0.3s ease forwards",
        glitch: "glitch 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
