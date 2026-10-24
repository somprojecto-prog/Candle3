import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        ink2: "#121212",
        fg: "#EDEDED",
        muted: "#8A8A8A",
        code: "#5C5C5C",
        gold: "#C9A84C",
        "gold-hi": "#D4B45E",
        line: "#2A2A2A",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        h1: [
          "clamp(2.5rem, 1.6rem + 3.2vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        h2: [
          "clamp(1.75rem, 1.1rem + 2.2vw, 3rem)",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        body: [
          "clamp(1rem, 0.95rem + 0.2vw, 1.125rem)",
          { lineHeight: "1.6", fontWeight: "400" },
        ],
        btn: [
          "1rem",
          { lineHeight: "1.25rem", letterSpacing: "0.04em", fontWeight: "500" },
        ],
        caption: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.18em", fontWeight: "500" },
        ],
        "mono-md": ["0.9375rem", { lineHeight: "1.4" }],
        "mono-sm": ["0.8125rem", { lineHeight: "1.4" }],
      },
      borderRadius: {
        DEFAULT: "4px",
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("story", 'html[data-story="on"] &');
      addVariant("nostory", 'html:not([data-story="on"]) &');
    }),
  ],
};

export default config;
