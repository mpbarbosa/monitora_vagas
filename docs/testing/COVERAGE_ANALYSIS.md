# Test Coverage Analysis & Improvement Plan

**Generated:** 2024-12-26  
**Current Coverage:** 19.57% (Target: 80%)  
**Status:** 🔴 **BELOW THRESHOLD** - Action required  
**Priority:** HIGH

---

## Current Coverage Status

### Overall Metrics (Jest)

| Metric | Current | Target | Gap | Status |
|--------|---------|--------|-----|--------|
| **Statements** | 19.57% | 80% | -60.43% | 🔴 |
| **Branches** | 18.91% | 80% | -61.09% | 🔴 |
| **Functions** | 38.29% | 80% | -41.71% | 🔴 |
| **Lines** | 19.65% | 80% | -60.35% | 🔴 |

**Test Suite:** 73/73 tests passing ✅  
**Execution Time:** 0.813s ✅  
**Coverage Threshold:** ❌ Not met (all metrics below 80%)

---

## Per-File Coverage Breakdown

### services/ Directory

| File | Statements | Branches | Functions | Lines | Uncovered Lines |
|------|------------|----------|-----------|-------|-----------------|
| **apiClient.js** | 25.64% | 25.58% | 55% | 25.64% | 227-493 (267 lines) |
| **hotelCache.js** | 14.92% | 10.71% | 28.57% | 14.92% | 43-217 (175 lines) |
| **ibira-loader.js** | 0% | 0% | 0% | 0% | 14-108 (95 lines) |
| **logger.js** | 33.33% | 21.21% | 27.77% | 33.33% | Multiple gaps |

### js/ Directory (UI Modules)

| File | Coverage | Status | Priority |
|------|----------|--------|----------|
| **hotelSearch.js** | ❌ Not tested | 🔴 CRITICAL | P0 |
| **guestCounter.js** | ❌ Not tested | 🔴 CRITICAL | P0 |
| **guestNumberFilter.js** | ❌ Not tested | 🔴 CRITICAL | P0 |
| **searchLifecycleState.js** | ❌ Not tested | 🔴 CRITICAL | P0 |
| **global.js** | ❌ Not tested | 🟡 MEDIUM | P2 |

### config/ Directory

| File | Coverage | Status | Priority |
|------|----------|--------|----------|
| **constants.js** | ⚠️ Partial (referenced) | 🟡 MEDIUM | P1 |
| **environment.js** | ❌ Not tested | 🟡 MEDIUM | P1 |

---

## Root Cause Analysis

### Why Coverage is Low

1. **Test Scope Limited:**
   - Only `apiClient.test.js` exists (73 tests)
   - Tests cover apiClient.js pure functions only
   - No tests for UI modules (src/js/)
   - No tests for configuration modules
   - No integration tests

2. **Python Tests Don't Count:**
   - Selenium tests generate no JavaScript coverage
   - Python tests currently blocked (Chrome binary issue)
   - E2E tests provide integration validation but no code coverage metrics

3. **Missing Test Files:**
   - No `hotelSearch.test.js`
   - No `guestCounter.test.js`
   - No `guestNumberFilter.test.js`
   - No `searchLifecycleState.test.js`
   - No `logger.test.js`
   - No `hotelCache.test.js`
   - No `ibira-loader.test.js`

---

## Coverage Improvement Plan

### Phase 1: Fix Critical Gaps (Priority 0)

**Target:** UI module tests (src/js/)  
**Effort:** 8-12 hours  
**Impact:** +40-50% coverage  
**Timeline:** Week 1

#### 1.1. hotelSearch.js Tests

**File to Create:** `tests/unit/services/hotelSearch.test.js`

**Test Coverage Needed:**
- Search initialization
- Event listener setup
- Search button click handler
- Hotel dropdown population
- Results display rendering
- Error handling
- Cache status updates
- Holiday notices
- Copy results functionality
- Clear results functionality

**Estimated Tests:** 25-30 tests  
**Expected Coverage:** 70-80% of hotelSearch.js

#### 1.2. guestCounter.js Tests

**File to Create:** `tests/unit/components/guestCounter.test.js`

**Test Coverage Needed:**
- Counter initialization
- Increment/decrement buttons
- State management (enabled/disabled)
- Value validation (1-10)
- DOM manipulation
- Event handlers

**Estimated Tests:** 15-20 tests  
**Expected Coverage:** 80-90% of guestCounter.js

#### 1.3. guestNumberFilter.js Tests

**File to Create:** `tests/unit/components/guestNumberFilter.test.js`

**Test Coverage Needed:**
- Capacity parsing (regex)
- Filter application
- Statistics updates
- Card show/hide logic
- Edge cases (invalid input)

**Estimated Tests:** 15-18 tests  
**Expected Coverage:** 85-95% of guestNumberFilter.js

#### 1.4. searchLifecycleState.js Tests

**File to Create:** `tests/unit/state/searchLifecycleState.test.js`

**Test Coverage Needed:**
- State transitions
- Element visibility management
- Button enable/disable
- Guest counter activation
- Reset button behavior

**Estimated Tests:** 20-25 tests  
**Expected Coverage:** 75-85% of searchLifecycleState.js

**Phase 1 Impact:**
- **Current:** 19.57% overall coverage
- **After Phase 1:** ~50-60% overall coverage
- **Improvement:** +30-40 percentage points

---

### Phase 2: Complete Service Coverage (Priority 1)

**Target:** Remaining service files  
**Effort:** 6-8 hours  
**Impact:** +15-20% coverage  
**Timeline:** Week 2

#### 2.1. logger.js Tests

**File to Create:** `tests/unit/services/logger.test.js`

**Test Coverage Needed:**
- Log level management
- Environment detection
- Debug/info/warn/error methods
- Time tracking (time/timeEnd)
- Group logging
- Production vs development behavior

**Estimated Tests:** 20-25 tests  
**Expected Coverage:** 80-90% of logger.js

#### 2.2. hotelCache.js Tests

**File to Create:** `tests/unit/services/hotelCache.test.js`

**Test Coverage Needed:**
- Cache set/get operations
- TTL expiration
- LocalStorage availability check
- In-memory fallback
- Clear cache
- Statistics

**Estimated Tests:** 18-22 tests  
**Expected Coverage:** 85-95% of hotelCache.js

#### 2.3. ibira-loader.js Tests

**File to Create:** `tests/unit/services/ibira-loader.test.js`

**Test Coverage Needed:**
- CDN loading attempt
- Local fallback
- Error handling
- Module caching
- Retry logic

**Estimated Tests:** 12-15 tests  
**Expected Coverage:** 70-80% of ibira-loader.js

**Phase 2 Impact:**
- **After Phase 1:** ~50-60% overall coverage
- **After Phase 2:** ~70-75% overall coverage
- **Improvement:** +15-20 percentage points

---

### Phase 3: Configuration Coverage (Priority 2)

**Target:** Configuration modules  
**Effort:** 4-6 hours  
**Impact:** +5-10% coverage  
**Timeline:** Week 3

#### 3.1. constants.js Tests

**File to Create:** `tests/unit/config/constants.test.js`

**Test Coverage Needed:**
- Utility functions (formatDuration, inRange, getTimeout)
- Constant value validation
- Export structure verification

**Estimated Tests:** 15-20 tests  
**Expected Coverage:** 80-90% of constants.js

#### 3.2. environment.js Tests

**File to Create:** `tests/unit/config/environment.test.js`

**Test Coverage Needed:**
- Environment detection
- Config retrieval
- Environment variable validation
- Default values

**Estimated Tests:** 12-15 tests  
**Expected Coverage:** 75-85% of environment.js

**Phase 3 Impact:**
- **After Phase 2:** ~70-75% overall coverage
- **After Phase 3:** ~80-85% overall coverage
- **Improvement:** +5-10 percentage points

---

## Implementation Templates

### Template 1: UI Module Test (hotelSearch.js)

```javascript
// tests/unit/workflows/hotelSearch.test.js
import { jest } from '@jest/globals';

describe('Hotel Search Workflow', () => {
  let mockDOM;
  
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <input id="hotel-select" />
      <input id="date-range" />
      <button id="search-btn"></button>
      <div id="results"></div>
      <div id="cache-status"></div>
    `;
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
  });
  
  describe('Initialization', () => {
    test('sets up event listeners on init', () => {
      const initHotelSearch = require('../../../src/js/hotelSearch.js').init;
      initHotelSearch();
      
      const searchBtn = document.getElementById('search-btn');
      expect(searchBtn).toBeDefined();
      expect(searchBtn.onclick).toBeDefined();
    });
    
    test('populates hotel dropdown on init', async () => {
      // Mock API response
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: ['Hotel A', 'Hotel B']
          })
        })
      );
      
      const initHotelSearch = require('../../../src/js/hotelSearch.js').init;
      await initHotelSearch();
      
      const hotelSelect = document.getElementById('hotel-select');
      expect(hotelSelect.options.length).toBeGreaterThan(0);
    });
  });
  
  describe('Search Functionality', () => {
    test('validates input before search', () => {
      // Test validation logic
    });
    
    test('displays loading state during search', () => {
      // Test loading UI
    });
    
    test('displays results after successful search', async () => {
      // Test results rendering
    });
    
    test('displays error on failed search', async () => {
      // Test error handling
    });
  });
  
  // Add 20+ more tests...
});
```

### Template 2: Service Test (logger.js)

```javascript
// tests/unit/services/logger.test.js
import { jest } from '@jest/globals';
import { logger } from '../../../src/services/logger.js';

describe('Logger Service', () => {
  let consoleSpy;
  
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });
  
  afterEach(() => {
    consoleSpy.mockRestore();
  });
  
  describe('Log Level Management', () => {
    test('respects log level configuration', () => {
      logger.setLevel('ERROR');
      logger.debug('test');
      expect(consoleSpy).not.toHaveBeenCalled();
      
      logger.error('test');
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    test('allows runtime level changes', () => {
      // Test level changes
    });
  });
  
  describe('Logging Methods', () => {
    test('debug logs with correct format', () => {
      logger.debug('Test message', 'COMPONENT');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG'),
        expect.stringContaining('COMPONENT')
      );
    });
    
    // Test info, warn, error...
  });
  
  // Add 15+ more tests...
});
```

---

## Testing Best Practices

### DO:
- ✅ Test each function in isolation
- ✅ Mock external dependencies (fetch, localStorage)
- ✅ Test edge cases and error conditions
- ✅ Use descriptive test names
- ✅ Setup/teardown properly (beforeEach/afterEach)
- ✅ Aim for 80%+ coverage per file
- ✅ Test both success and failure paths

### DON'T:
- ❌ Test implementation details
- ❌ Write flaky tests
- ❌ Ignore edge cases
- ❌ Skip error handling tests
- ❌ Leave tests commented out
- ❌ Test multiple concerns in one test

---

## Progress Tracking

### Coverage Milestones

| Milestone | Target | Completion | Status |
|-----------|--------|------------|--------|
| **Phase 1 Complete** | 50-60% | Week 1 | 🔴 Not Started |
| **Phase 2 Complete** | 70-75% | Week 2 | 🔴 Not Started |
| **Phase 3 Complete** | 80-85% | Week 3 | 🔴 Not Started |
| **Threshold Met** | 80%+ | Week 3 | 🔴 Not Started |

### Weekly Goals

**Week 1:**
- [ ] Create hotelSearch.test.js (25-30 tests)
- [ ] Create guestCounter.test.js (15-20 tests)
- [ ] Create guestNumberFilter.test.js (15-18 tests)
- [ ] Create searchLifecycleState.test.js (20-25 tests)
- [ ] Run coverage: `npm run test:api:coverage`
- [ ] Target: 50-60% coverage

**Week 2:**
- [ ] Create logger.test.js (20-25 tests)
- [ ] Create hotelCache.test.js (18-22 tests)
- [ ] Create ibira-loader.test.js (12-15 tests)
- [ ] Run coverage: `npm run test:all:js -- --coverage`
- [ ] Target: 70-75% coverage

**Week 3:**
- [ ] Create constants.test.js (15-20 tests)
- [ ] Create environment.test.js (12-15 tests)
- [ ] Refine existing tests for edge cases
- [ ] Run full coverage: `npm run test:api:coverage`
- [ ] Target: 80-85% coverage

---

## Running Coverage Reports

### Generate Coverage

```bash
# API client coverage (current)
npm run test:api:coverage

# All JavaScript tests with coverage (after new tests added)
npm run test:all:js -- --coverage

# Specific file coverage
npx jest tests/unit/services/logger.test.js --coverage

# Watch mode with coverage
npm run test:js:watch -- --coverage
```

### View Coverage Report

```bash
# Open HTML report in browser
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

### Coverage Badges

Add to README.md:
```markdown
![Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)
```

---

## Expected Outcomes

### By End of Week 1:
- ✅ 4 new test files (UI modules)
- ✅ ~75-95 new tests
- ✅ Coverage: 50-60% (from 19.57%)
- ✅ All UI modules have basic coverage

### By End of Week 2:
- ✅ 7 new test files total (UI + services)
- ✅ ~120-150 new tests
- ✅ Coverage: 70-75% (from 50-60%)
- ✅ All service files have coverage

### By End of Week 3:
- ✅ 9 new test files total (UI + services + config)
- ✅ ~150-180 new tests
- ✅ Coverage: 80-85% (meets threshold!)
- ✅ All modules have comprehensive coverage

---

## Related Documentation

- **[Jest Configuration](../../jest.config.js)** - Coverage thresholds
- **[Test Suite README](../TEST_SUITE_README.md)** - Testing overview
- **[API Client Tests](../apiClient.test.js)** - Example test structure
- **[NPM Scripts](../../README.md#npm-scripts-reference)** - Test commands

---

## Summary

**Current State:** 19.57% coverage (73 tests passing)  
**Target State:** 80%+ coverage (180+ tests)  
**Gap:** -60.43 percentage points  
**Effort:** 18-26 hours over 3 weeks  
**Priority:** HIGH - Coverage threshold not met

**Action Required:** Implement 3-phase plan to achieve 80% coverage threshold.

**Next Step:** Start Phase 1 - Create UI module tests

---

**Last Updated:** 2024-12-26  
**Author:** Monitora Vagas Development Team  
**Status:** Coverage improvement plan ready for implementation
