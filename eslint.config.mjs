// ESLint config - disabled during builds via next.config.mjs
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "dist/**",
    ],
  },
];

export default eslintConfig;
