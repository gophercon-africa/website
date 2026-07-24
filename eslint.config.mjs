import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      "src/generated/**",
      "next-env.d.ts",
      "cloudflare-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // This codebase's SSR-safe hydration pattern (read localStorage / set a
      // mounted flag in a mount effect) trips this rule; the alternative — a
      // lazy useState initializer — breaks SSR. Keep it visible, not fatal.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
