/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base:       "var(--color-base)",
        surface:    "var(--color-surface)",
        border:     "var(--color-border)",
        text:       "var(--color-text)",
        foreground: "var(--color-text)",
        muted:      "var(--color-muted)",
        accent:     "var(--color-accent)",
        background: "var(--color-surface)",
      },
    },
  },
  plugins: [],
};
