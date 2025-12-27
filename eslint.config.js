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
          selector: "ThisExpression:not(MethodDefinition > FunctionExpression ThisExpression, MethodDefinition > ArrowFunctionExpression ThisExpression)",
          message: "Usage of 'this' keyword is prohibited outside of class methods. Use functional programming patterns instead (dependency injection, closures, pure functions)."
        }
      ]
    }
  },
  {
    // Allow 'this' in test files and service classes
    files: [
      "**/*.test.js",
      "**/*.spec.js",
      "jest.config.js",
      "tests/**/*.js",
      "src/services/**/*.js"  // Service files can use classes
    ],
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
