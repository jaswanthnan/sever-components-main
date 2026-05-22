import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Legacy React Router / Ant Design demo code that is not used by the Next.js app.
    "src/App.tsx",
    "src/main.tsx",
    "src/context/**",
    "src/hooks/**",
    "src/routes/**",
    "src/services/**",
    "src/views/**",
    "src/components/common/**",
    "src/components/forms/**",
    "src/components/patterns/**",
    "src/components/layout/Layout.tsx",
  ]),
]);

export default eslintConfig;
