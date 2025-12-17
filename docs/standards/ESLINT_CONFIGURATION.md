# ESLint Configuration Guide

## Overview

This project uses ESLint 9 with strict rules to enforce functional programming principles and referential transparency.

## Configuration Files

- **eslint.config.js**: Main ESLint configuration file (ESLint 9+ flat config format)
- **package.json**: Contains lint scripts

## Key Rules

### No `this` Keyword Rule

**Rule**: `no-restricted-syntax` with `ThisExpression` selector

**Purpose**: Enforce functional programming by prohibiting the use of the `this` keyword.

**Rationale**:

- Promotes referential transparency
- Encourages dependency injection over implicit state
- Forces explicit parameter passing
- Makes code more testable and predictable
- Aligns with functional programming principles

**Error Message**:

```text
Usage of 'this' keyword is prohibited. Use functional programming patterns instead 
(dependency injection, closures, pure functions).
```

### Exemptions

The `this` keyword restriction is disabled for:

- Test files: `**/*.test.js`, `**/*.spec.js`
- Test directories: `tests/**/*.js`
- Configuration files: `jest.config.js`

**Reason**: Test frameworks (Jest, etc.) and test utilities often require `this` for context management and mocking.

## Running ESLint

### Check for Errors

```bash
npm run lint
```

### Auto-fix Issues (where possible)

```bash
npm run lint:fix
```

**Note**: The `no-this` rule cannot be auto-fixed and requires manual refactoring.

## Ignored Patterns

The following directories are automatically ignored:

- `node_modules/**`
- `legacy/**`
- `venv/**`
- `dist/**`
- `build/**`
- `coverage/**`
- `**/*.min.js`

## Functional Programming Alternatives to `this`

### Instead of Class Methods with `this`

❌ **Avoid**:

```javascript
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async fetch(endpoint) {
    return await fetch(`${this.baseURL}${endpoint}`);
  }
}
```

✅ **Prefer**:

```javascript
// Factory function with closure
const createAPIClient = (baseURL) => {
  const fetch = async (endpoint) => {
    return await fetch(`${baseURL}${endpoint}`);
  };
  
  return { fetch };
};

// Or pure function with dependency injection
const fetchData = async (baseURL, endpoint) => {
  return await fetch(`${baseURL}${endpoint}`);
};
```

### Instead of Event Handlers with `this`

❌ **Avoid**:

```javascript
class ButtonHandler {
  constructor(button) {
    this.button = button;
    button.addEventListener('click', this.handleClick.bind(this));
  }
  
  handleClick() {
    console.log(this.button);
  }
}
```

✅ **Prefer**:

```javascript
// Closure capturing dependencies
const createButtonHandler = (button) => {
  const handleClick = () => {
    console.log(button);
  };
  
  button.addEventListener('click', handleClick);
  
  return { handleClick };
};
```

### Instead of State Management with `this`

❌ **Avoid**:

```javascript
class Counter {
  constructor() {
    this.count = 0;
  }
  
  increment() {
    this.count++;
    return this.count;
  }
}
```

✅ **Prefer**:

```javascript
// Immutable state updates
const increment = (count) => count + 1;

// Or closure for mutable state (if necessary)
const createCounter = (initialCount = 0) => {
  let count = initialCount;
  
  return {
    increment: () => ++count,
    getCount: () => count
  };
};
```

## Migration Guide

### Step 1: Identify Violations

Run the linter to see all `this` usages:

```bash
npm run lint
```

### Step 2: Refactor Patterns

Choose the appropriate pattern based on your use case:

1. **Pure Functions**: For stateless operations
2. **Closures**: For encapsulated state
3. **Factory Functions**: For creating configured instances
4. **Dependency Injection**: For passing dependencies explicitly

### Step 3: Update Tests

Ensure tests still work with the new functional patterns.

### Step 4: Verify

Run linter again to confirm all violations are resolved:

```bash
npm run lint
```

## Benefits

1. **Referential Transparency**: Functions return the same output for the same input
2. **Easier Testing**: No hidden state or context dependencies
3. **Better Composability**: Pure functions compose cleanly
4. **Improved Maintainability**: Explicit dependencies make code easier to understand
5. **Reduced Bugs**: No `this` binding issues or context confusion

## Related Documentation

- [Referential Transparency Guidelines](../../.github/REFERENTIAL_TRANSPARENCY.md)
- [Functional Requirements](../features/FUNCTIONAL_REQUIREMENTS.md)
- [API Client Technical Specification](../specifications/MAIN_JS_TECHNICAL_SPECIFICATION.md)

## ESLint Version

This project uses **ESLint 9.39.2** with the new flat config format (`eslint.config.js`).

## Continuous Integration

Consider adding ESLint checks to your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run ESLint
  run: npm run lint
```

## Troubleshooting

### Issue: "Couldn't find eslint.config.js"

**Solution**: Ensure you're using ESLint 9+ and have `eslint.config.js` (not `.eslintrc.*`).

### Issue: Test files fail with `this` errors

**Solution**: Verify test files match the exemption patterns in `eslint.config.js`:

- `**/*.test.js`
- `**/*.spec.js`
- `tests/**/*.js`

### Issue: Need to use `this` in specific file

**Solution**: Add file-specific override in `eslint.config.js`:

```javascript
{
  files: ["path/to/special-file.js"],
  rules: {
    "no-restricted-syntax": "off"
  }
}
```

## Contributing

When adding new code:

1. Follow functional programming patterns
2. Avoid `this` keyword
3. Run `npm run lint` before committing
4. Document any new patterns or exceptions

## Support

For questions or issues with ESLint configuration:

1. Review this documentation
2. Check [ESLint 9 migration guide](https://eslint.org/docs/latest/use/configure/migration-guide)
3. Consult team coding standards
