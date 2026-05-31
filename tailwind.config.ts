import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Surface
        surface: {
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
          overlay: "var(--surface-overlay)",
          contrast: "var(--surface-contrast)",
        },
        // On-surface (text/icon on surface)
        "on-surface": {
          primary: "var(--on-surface-primary)",
          secondary: "var(--on-surface-secondary)",
          tertiary: "var(--on-surface-tertiary)",
          disabled: "var(--on-surface-disabled)",
          contrast: "var(--on-surface-contrast)",
        },
        // Border
        border: {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
          disabled: "var(--border-disabled)",
          contrast: "var(--border-contrast)",
        },
        // Interactive
        interactive: {
          primary: "var(--interactive-primary)",
          secondary: "var(--interactive-secondary)",
          disabled: "var(--interactive-disabled)",
          contrast: "var(--interactive-contrast)",
        },
        // Status
        error: {
          solid: "var(--error-solid)",
          light: "var(--error-light)",
          "on-solid": "var(--error-on-solid)",
          "on-light": "var(--error-on-light)",
          border: "var(--error-border)",
        },
        success: {
          solid: "var(--success-solid)",
          light: "var(--success-light)",
          "on-solid": "var(--success-on-solid)",
          "on-light": "var(--success-on-light)",
          border: "var(--success-border)",
        },
        warning: {
          solid: "var(--warning-solid)",
          light: "var(--warning-light)",
          "on-solid": "var(--warning-on-solid)",
          "on-light": "var(--warning-on-light)",
          border: "var(--warning-border)",
        },
        accent: {
          solid: "var(--accent-solid)",
          light: "var(--accent-light)",
          "on-solid": "var(--accent-on-solid)",
          "on-light": "var(--accent-on-light)",
          border: "var(--accent-border)",
        },
        // On-brand (foreground on brand surfaces)
        "on-brand": {
          light: "var(--on-brand-light)",
          "light-secondary": "var(--on-brand-light-secondary)",
          "light-disabled": "var(--on-brand-light-disabled)",
          dark: "var(--on-brand-dark)",
          "dark-secondary": "var(--on-brand-dark-secondary)",
          "dark-disabled": "var(--on-brand-dark-disabled)",
        },
        // Overlay
        overlay: {
          scrim: "var(--overlay-scrim)",
          "solid-hover": "var(--overlay-solid-hover)",
          "solid-pressed": "var(--overlay-solid-pressed)",
          "light-hover": "var(--overlay-light-hover)",
          "light-pressed": "var(--overlay-light-pressed)",
        },
        // Brand anchors
        brand: {
          maroon: "var(--brand-maroon)",
          crimson: "var(--brand-crimson)",
          teal: "var(--brand-teal)",
          blue: "var(--brand-blue)",
          peach: "var(--brand-peach)",
          gold: "var(--brand-gold)",
          lime: "var(--brand-lime)",
        },
      },
      spacing: {
        "4": "4px",
        "8": "8px",
        "12": "12px",
        "16": "16px",
        "20": "20px",
        "24": "24px",
        "28": "28px",
        "32": "32px",
        "40": "40px",
        "48": "48px",
        "64": "64px",
        "80": "80px",
      },
      borderRadius: {
        "4": "4px",
        "8": "8px",
        "12": "12px",
        "16": "16px",
        "20": "20px",
        "24": "24px",
        "36": "36px",
        full: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Responsive primitives — values resolved at runtime via CSS vars
        "100": ["var(--typo-fs-100)", { lineHeight: "var(--typo-lh-140)" }],
        "200": ["var(--typo-fs-200)", { lineHeight: "var(--typo-lh-150)" }],
        "300": ["var(--typo-fs-300)", { lineHeight: "var(--typo-lh-150)" }],
        "350": ["var(--typo-fs-350)", { lineHeight: "var(--typo-lh-140)" }],
        "400": ["var(--typo-fs-400)", { lineHeight: "var(--typo-lh-150)" }],
        "450": ["var(--typo-fs-450)", { lineHeight: "var(--typo-lh-130)" }],
        "500": ["var(--typo-fs-500)", { lineHeight: "var(--typo-lh-120)" }],
        "600": ["var(--typo-fs-600)", { lineHeight: "var(--typo-lh-120)" }],
        "700": ["var(--typo-fs-700)", { lineHeight: "var(--typo-lh-120)" }],
        "800": ["var(--typo-fs-800)", { lineHeight: "var(--typo-lh-120)" }],
        "900": ["var(--typo-fs-900)", { lineHeight: "var(--typo-lh-120)" }],
        "1000": ["var(--typo-fs-1000)", { lineHeight: "var(--typo-lh-100)" }],
        "1100": ["var(--typo-fs-1100)", { lineHeight: "var(--typo-lh-100)" }],
        "1200": ["var(--typo-fs-1200)", { lineHeight: "var(--typo-lh-095)" }],
      },
    },
  },
  plugins: [],
};

export default config;
