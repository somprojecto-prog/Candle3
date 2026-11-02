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
        ink: "#050505",
        ink2: "#0C0C0C",
        fg: "#F5F5F5",
        muted: "#A3A3A3",
        code: "#6B6B6B",
        gold: "#C9A227",
        "gold-hi": "#E0B82E",
        "gold-active": "#A88B1F",
        line: "#1F1F1F",
        status: "#4ADE80",
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
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
        display: [
          "clamp(2.5rem,1.624rem+3.596vw,4.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        h1: [
          "clamp(2rem,1.562rem+1.798vw,3rem)",
          { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "500" },
        ],
        h2: [
          "clamp(1.5rem,1.281rem+0.899vw,2rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        h3: [
          "clamp(1.25rem,1.1406rem+0.4494vw,1.5rem)",
          { lineHeight: "1.3", letterSpacing: "-0.005em", fontWeight: "500" },
        ],
        body: [
          "clamp(1rem,0.945rem+0.2247vw,1.125rem)",
          { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" },
        ],
        small: ["1rem", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
        label: [
          "clamp(0.75rem,0.7226rem+0.1124vw,0.8125rem)",
          { lineHeight: "1.4", letterSpacing: "0.04em", fontWeight: "400" },
        ],
        micro: [
          "0.8125rem",
          { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "400" },
        ],
        btn: [
          "0.9375rem",
          { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "500" },
        ],
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
