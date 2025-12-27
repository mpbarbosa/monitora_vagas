# Jest Mocks Directory

**Location:** `tests/__mocks__/`  
**Purpose:** Mock implementations for Jest unit tests  
**Last Updated:** 2024-12-22

---

## 📋 Overview

This directory contains mock implementations of modules used in Jest unit tests. Mocks allow tests to run without external dependencies (CDN, network, file system).

**Why Mocks:**
- ✅ Faster test execution (no network calls)
- ✅ Deterministic results (no external variability)
- ✅ Offline testing capability
- ✅ Isolated unit tests (test one thing at a time)

---

## 📁 Mock Files

### ibira-loader.js

**Purpose:** Mock implementation of `src/services/ibira-loader.js`

**What it mocks:**
- CDN loading of ibira.js library
- Local fallback mechanism
- IbiraAPIFetchManager class

**Mock Behavior:**
```javascript
// Returns mock IbiraAPIFetchManager with stubbed methods
export const IbiraAPIFetchManager = jest.fn().mockImplementation(() => ({
    fetch: jest.fn(),
    clearCache: jest.fn(),
    getCacheStats: jest.fn()
}));

// Mock loadIbira function
export const loadIbira = jest.fn().mockResolvedValue({
    IbiraAPIFetchManager
});
```

**Usage in Tests:**
```javascript
// tests/apiClient.test.js
import { IbiraAPIFetchManager } from '../__mocks__/ibira-loader.js';

test('API client uses ibira.js', () => {
    const client = new BuscaVagasAPIClient();
    expect(IbiraAPIFetchManager).toHaveBeenCalled();
});
```

---

## 🔧 How Jest Uses Mocks

### Automatic Mocking

Jest automatically uses mocks in `__mocks__/` when:
1. Module path matches mock file path
2. `jest.mock()` is called in test file

**Example:**
```javascript
// Test file
jest.mock('../src/services/ibira-loader.js');

// Jest will use: tests/__mocks__/ibira-loader.js
```

### Manual Mocking

```javascript
// Explicit mock
jest.mock('../src/services/ibira-loader.js', () => ({
    IbiraAPIFetchManager: jest.fn(),
    loadIbira: jest.fn()
}));
```

---

## 📝 Creating New Mocks

### Step-by-Step

1. **Identify Module to Mock**
   ```javascript
   // Example: Want to mock src/services/logger.js
   ```

2. **Create Mock File**
   ```bash
   # Create mock with same relative path structure
   touch tests/__mocks__/logger.js
   ```

3. **Implement Mock**
   ```javascript
   // tests/__mocks__/logger.js
   export const logger = {
       debug: jest.fn(),
       info: jest.fn(),
       warn: jest.fn(),
       error: jest.fn()
   };
   ```

4. **Use in Tests**
   ```javascript
   // tests/myTest.test.js
   jest.mock('../src/services/logger.js');
   import { logger } from '../src/services/logger.js';
   
   test('logs message', () => {
       myFunction();
       expect(logger.info).toHaveBeenCalledWith('Expected message');
   });
   ```

---

## 🎯 Best Practices

### DO:
- ✅ Mock external dependencies (APIs, CDN, file system)
- ✅ Keep mocks simple and focused
- ✅ Match original module's interface
- ✅ Use `jest.fn()` for trackable function calls
- ✅ Document mock behavior

### DON'T:
- ❌ Mock internal application logic
- ❌ Over-mock (makes tests brittle)
- ❌ Forget to reset mocks between tests
- ❌ Mock things that should be tested

---

## 🧪 Testing with Mocks

### Reset Mocks

```javascript
beforeEach(() => {
    // Clear mock call history
    jest.clearAllMocks();
});

afterEach(() => {
    // Restore original implementation
    jest.restoreAllMocks();
});
```

### Verify Mock Calls

```javascript
test('API client calls ibira.js', () => {
    const client = new BuscaVagasAPIClient();
    
    // Check constructor was called
    expect(IbiraAPIFetchManager).toHaveBeenCalled();
    
    // Check with specific arguments
    expect(IbiraAPIFetchManager).toHaveBeenCalledWith({
        maxCacheSize: 100,
        cacheExpiration: 300000
    });
});
```

### Mock Return Values

```javascript
// Mock successful API response
mockFetch.mockResolvedValue({
    success: true,
    data: { hotels: [...] }
});

// Mock error
mockFetch.mockRejectedValue(new Error('Network error'));

// Mock different values per call
mockFetch
    .mockResolvedValueOnce({ data: 'first' })
    .mockResolvedValueOnce({ data: 'second' });
```

---

## 📚 Related Documentation

- **[Jest Setup Guide](../JEST_SETUP_COMPLETE.md)** - Jest configuration
- **[API Client Tests](../apiClient.test.js)** - Example test using mocks
- **[Test Suite README](../TEST_SUITE_README.md)** - Overall test documentation
- **[Jest Documentation](https://jestjs.io/docs/mock-functions)** - Official Jest mocking guide

---

## 🔍 Troubleshooting

### Mock Not Being Used

**Problem:** Jest uses real module instead of mock

**Solution:**
```javascript
// Ensure jest.mock() is called before imports
jest.mock('../src/services/ibira-loader.js');
import { IbiraAPIFetchManager } from '../src/services/ibira-loader.js';
```

### Mock Not Found

**Problem:** `Cannot find module` error

**Solution:**
```bash
# Check file path matches module structure
tests/__mocks__/ibira-loader.js  # ✅ Correct
tests/__mocks__/services/ibira-loader.js  # ❌ Wrong path
```

### Mock Not Tracking Calls

**Problem:** `expect(...).toHaveBeenCalled()` fails

**Solution:**
```javascript
// Ensure using jest.fn()
export const myFunction = jest.fn();  // ✅ Trackable
export const myFunction = () => {};   // ❌ Not trackable
```

---

## 📋 Maintenance

**Regular Tasks:**
1. ✅ Update mocks when original modules change
2. ✅ Add mocks for new external dependencies
3. ✅ Document mock behavior changes
4. ✅ Keep mocks synchronized with real implementations

**Before Releases:**
```bash
# Verify mocks work correctly
npm run test:all:js

# Check mock coverage
npm run test:api:coverage
```

---

**Last Updated:** 2024-12-22  
**Mock Count:** 1 file (ibira-loader.js)  
**Maintainer:** Monitora Vagas Development Team
