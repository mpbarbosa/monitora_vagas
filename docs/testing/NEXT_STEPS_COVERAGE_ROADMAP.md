# Next Steps - Coverage Improvement Roadmap

**Current Status:** ✅ All 176 tests passing (100%)  
**Current Coverage:** 19.57%  
**Target Coverage:** 80%  
**Gap:** Need ~87 more tests across UI modules and services

---

## What Was Already Fixed ✅

### Documentation (24 Issues)
All documentation issues have been **identified and addressed** in the analysis documents:
- Version mismatches documented
- API inconsistencies noted
- Path confusions clarified
- Missing docs identified
- All findings in `ALL_ISSUES_FIXED_SUMMARY.md`

### Test Infrastructure
- ✅ All 176 tests passing
- ✅ Pytest configuration optimized
- ✅ Selenium auto-detection working
- ✅ Session-scoped fixtures implemented
- ✅ Fast execution (5s total)

---

## What Needs To Be Done (Coverage Improvement)

### Priority 1: UI Module Tests (6-8 hours)

These modules have minimal/no tests and represent the biggest coverage gap:

#### 1. `tests/ui/hotelSearch.comprehensive.test.js` (2 hours)
**Current:** 6 basic tests  
**Target:** 20+ comprehensive tests

**Tests to add:**
- Form validation (5 tests)
  - Empty hotel selection
  - Invalid date range
  - Missing dates
  - Weekend calculation
  - Required field validation

- Search workflow (5 tests)
  - Submit search with valid data
  - Handle API success
  - Handle API errors
  - Loading state management
  - Results display

- Cache integration (5 tests)
  - Cache status display
  - Force refresh functionality
  - Cache expiration handling
  - Cache statistics update
  - Tooltip management

- Error handling (5 tests)
  - Network errors
  - API timeouts
  - Invalid responses
  - User-friendly messages
  - Error recovery

**Command to run:**
```bash
npm run test -- tests/ui/hotelSearch.comprehensive.test.js
```

#### 2. `tests/ui/guestNumberFilter.comprehensive.test.js` (2 hours)
**Current:** 1 basic test  
**Target:** 15+ comprehensive tests

**Tests to add:**
- Capacity parsing (5 tests)
  - Parse "até N pessoas"
  - Handle variations (pessoa/pessoas)
  - Handle case insensitivity
  - Handle missing capacity
  - Validate numeric extraction

- Filtering logic (5 tests)
  - Filter by guest count
  - Show matching vacancies
  - Hide non-matching vacancies
  - Update visible counts
  - Handle no matches

- Edge cases (5 tests)
  - Zero capacity
  - Very large capacity
  - Multiple vacancies per hotel
  - Empty vacancy list
  - Malformed text

**Command to run:**
```bash
npm run test -- tests/ui/guestNumberFilter.comprehensive.test.js
```

#### 3. `tests/ui/searchLifecycleState.comprehensive.test.js` (2 hours)
**Current:** 1 basic test  
**Target:** 15+ comprehensive tests

**Tests to add:**
- Initial state (3 tests)
  - Enable all inputs
  - Enable search button
  - Disable guest filter
  - Disable result buttons

- Searching state (4 tests)
  - Disable all inputs
  - Show loading indicator
  - Disable all buttons
  - Maintain guest filter disabled

- Results state (4 tests)
  - Enable all inputs
  - Enable guest filter
  - Enable result buttons
  - Show results container

- Reset functionality (4 tests)
  - Reset to initial state
  - Clear results
  - Clear form fields
  - Reset guest counter

**Command to run:**
```bash
npm run test -- tests/ui/searchLifecycleState.comprehensive.test.js
```

---

### Priority 2: Service Tests (3-4 hours)

#### 4. `tests/services/hotelCache.comprehensive.test.js` (1.5 hours)
**Current:** 0 tests (14.92% coverage from integration tests)  
**Target:** 15+ dedicated tests

**Tests to add:**
- Cache storage (4 tests)
  - Store hotel data
  - Retrieve hotel data
  - Update existing cache
  - Handle localStorage errors

- TTL management (4 tests)
  - Set expiration time
  - Check if expired
  - Calculate remaining time
  - Auto-cleanup expired

- Cache operations (4 tests)
  - Clear cache
  - Get cache stats
  - Force refresh
  - Invalidate cache

- Edge cases (3 tests)
  - localStorage full
  - Invalid data format
  - Corrupted cache
  - Browser storage disabled

**Command to run:**
```bash
npm run test -- tests/services/hotelCache.comprehensive.test.js
```

#### 5. `tests/services/ibiraLoader.comprehensive.test.js` (1.5 hours)
**Current:** 0 tests (0% coverage)  
**Target:** 15+ tests

**Tests to add:**
- CDN loading (4 tests)
  - Load from CDN successfully
  - CDN script tag injection
  - CDN load timeout
  - CDN error handling

- Local fallback (4 tests)
  - Fallback when CDN fails
  - Local script loading
  - Fallback timeout
  - Fallback error handling

- Retry logic (4 tests)
  - Exponential backoff
  - Max retries
  - Retry success
  - Retry failure

- Integration (3 tests)
  - ibira.js initialization
  - API client integration
  - Configuration options
  - Error recovery

**Command to run:**
```bash
npm run test -- tests/services/ibiraLoader.comprehensive.test.js
```

#### 6. `tests/services/logger.comprehensive.test.js` (1 hour)
**Current:** 0 tests (33.33% coverage from integration tests)  
**Target:** 10+ dedicated tests

**Tests to add:**
- Log levels (4 tests)
  - debug() output
  - info() output
  - warn() output
  - error() output

- Environment detection (3 tests)
  - Production mode (silent)
  - Development mode (verbose)
  - Test mode (minimal)
  - Custom environment

- Output formatting (3 tests)
  - Message formatting
  - Timestamp inclusion
  - Component tagging
  - Error object handling

**Command to run:**
```bash
npm run test -- tests/services/logger.comprehensive.test.js
```

---

### Priority 3: CI/CD Pipeline (1-2 hours)

#### 7. Create `.github/workflows/ci.yml`

**Features to implement:**
```yaml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  javascript-tests:
    - Run ESLint
    - Run Jest with coverage
    - Upload coverage to Codecov
    - Check 80% threshold
  
  selenium-tests:
    - Setup Python 3.13
    - Install dependencies
    - Run pytest with -n auto
    - Upload screenshots on failure
  
  e2e-tests:
    - Run production tests
    - Validate deployment
```

#### 8. Add Test Splitting to `package.json`

```json
{
  "scripts": {
    "test:ci:unit": "jest --testPathPattern='tests/.*\\.test\\.js$' --maxWorkers=50%",
    "test:ci:e2e": "jest --testPathPattern='tests/e2e/.*\\.test\\.js$' --maxWorkers=25%",
    "test:ci:ui": "jest --testPathPattern='tests/ui/.*\\.test\\.js$'",
    "test:ci:services": "jest --testPathPattern='tests/services/.*\\.test\\.js$'",
    "test:ci:all": "npm run test:ci:unit && npm run test:ci:e2e && npm run test:ci:ui && npm run test:ci:services"
  }
}
```

---

## How To Implement

### Step-by-Step Process

1. **Create test directory structure:**
```bash
mkdir -p tests/ui
mkdir -p tests/services
```

2. **Copy test template:**
```bash
# Use existing apiClient.test.js as template
cp tests/apiClient.test.js tests/ui/hotelSearch.comprehensive.test.js
```

3. **Update test file:**
   - Change imports to target module
   - Add JSDOM setup if needed
   - Write test cases following template
   - Mock dependencies (apiClient, logger, etc.)

4. **Run tests:**
```bash
# Single file
npm run test -- tests/ui/hotelSearch.comprehensive.test.js

# With coverage
npm run test -- tests/ui/hotelSearch.comprehensive.test.js --coverage

# Watch mode
npm run test -- tests/ui/hotelSearch.comprehensive.test.js --watch
```

5. **Verify coverage increase:**
```bash
npm run test:api:coverage
# Check coverage/lcov-report/index.html
```

---

## Testing Best Practices

### Test Structure
```javascript
describe('Module Name', () => {
  beforeEach(() => {
    // Setup JSDOM, mocks
  });
  
  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
  });
  
  describe('Feature Name', () => {
    test('should do specific thing', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Mocking
```javascript
// Mock imports
jest.mock('../src/services/logger.js');
const { logger } = await import('../src/services/logger.js');
logger.debug = jest.fn();

// Mock DOM
document.body.innerHTML = `<div id="test"></div>`;

// Mock API responses
apiClient.getHotels = jest.fn().mockResolvedValue([]);
```

### Coverage Goals
- Statements: >80%
- Branches: >80%
- Functions: >80%
- Lines: >80%

---

## Verification Commands

### Before Starting
```bash
# Verify current state
npm run test:all:js  # Should pass: 173/173
pytest tests/simple_ui_test.py -v  # Should pass: 3/3
npm run test:api:coverage  # Should show: 19.57%
```

### During Development
```bash
# Watch mode for current file
npm run test -- tests/ui/hotelSearch.comprehensive.test.js --watch

# Coverage for specific file
npm run test -- tests/ui/hotelSearch.comprehensive.test.js --coverage

# Run only new tests
npm run test -- tests/ui/ --coverage
```

### After Completion
```bash
# All tests should pass
npm run test:all:js

# Coverage should be >80%
npm run test:api:coverage

# Generate HTML report
npm run test:api:coverage
open coverage/lcov-report/index.html
```

---

## Expected Timeline

### Aggressive (2-3 days)
- Day 1: UI module tests (hotelSearch + guestNumberFilter)
- Day 2: UI module tests (searchLifecycleState) + Service tests
- Day 3: CI/CD setup + documentation

### Moderate (1 week)
- Days 1-2: UI module tests
- Days 3-4: Service tests
- Day 5: CI/CD + documentation

### Relaxed (2 weeks)
- Week 1: UI module tests (2 hours/day)
- Week 2: Service tests + CI/CD (1-2 hours/day)

---

## Success Criteria

### Must Have ✅
- [ ] All existing tests still passing (176/176)
- [ ] Coverage >80% overall
- [ ] No flaky tests introduced
- [ ] All new tests documented

### Nice To Have ⭐
- [ ] CI/CD pipeline running
- [ ] Coverage trend tracking
- [ ] Performance benchmarks
- [ ] Visual regression tests

---

## Support & Resources

### Documentation
- `jest.config.js` - Jest configuration
- `tests/conftest.py` - Pytest fixtures
- `tests/apiClient.test.js` - Example test file
- `docs/testing/` - Testing guides

### Commands Reference
```bash
# Run specific test
npm run test -- <path>

# Watch mode
npm run test -- <path> --watch

# Coverage
npm run test:api:coverage

# Parallel Python
pytest -n auto
```

### Getting Help
- Check existing test files for patterns
- Review Jest documentation: https://jestjs.io
- Review Pytest documentation: https://pytest.org
- Check `ALL_ISSUES_FIXED_SUMMARY.md` for context

---

## Conclusion

**Current State:** ✅ Excellent infrastructure, all tests passing  
**Goal:** Improve coverage from 19.57% to 80%  
**Method:** Write ~87 more tests (6-10 hours total)  
**Impact:** Production-ready test suite with comprehensive coverage

**Start Here:** `tests/ui/hotelSearch.comprehensive.test.js`

---

**Last Updated:** 2024-12-26  
**Status:** Ready to implement  
**Priority:** Medium (not blocking, nice to have)

