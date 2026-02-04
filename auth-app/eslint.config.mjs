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
  ]),
  // Custom rules to fix issues
  {
    rules: {
      // Turn off unescaped entities - apostrophes in text are fine
      "react/no-unescaped-entities": "off",
      // Turn unused variables into warnings (for development)
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true
      }],
      // Allow explicit any in some cases but warn
      "@typescript-eslint/no-explicit-any": "warn",
      // Prefer const but don't error
      "prefer-const": "warn",
      // React hooks exhaustive deps as warning
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]);

export default eslintConfig;
