export default [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        AbortController: "readonly",
        Map: "readonly",
        Set: "readonly"
      }
    },
    rules: {
      "no-invalid-this": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ThisExpression",
          message: "Usage of 'this' keyword is prohibited. Use functional programming patterns instead (dependency injection, closures, pure functions)."
        }
      ]
    }
  },
  {
    // Allow 'this' in test files
    files: ["**/*.test.js", "**/*.spec.js", "jest.config.js", "tests/**/*.js"],
    rules: {
      "no-restricted-syntax": "off"
    }
  },
  {
    ignores: [
      "node_modules/**",
      "legacy/**",
      "venv/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "**/*.min.js",
      "src/archive/**"
    ]
  }
];
