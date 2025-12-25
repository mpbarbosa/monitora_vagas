# Use Case Test Suite

Comprehensive end-to-end test implementation for all use cases defined in [USE_CASE_TEST_SPECIFICATION.md](../../docs/testing/USE_CASE_TEST_SPECIFICATION.md).

## 📋 Overview

This test suite implements **10 critical use cases** covering:

- **UC-001:** First-Time User Hotel Search (Critical)
- **UC-002:** Advanced Search with Filters (High)
- **UC-003:** Date Range Validation (High)
- **UC-004:** Search Lifecycle Management (Critical)
- **UC-005:** API Integration and Caching (High)
- **UC-006:** Responsive Design Validation (Medium)
- **UC-007:** Accessibility Compliance (High)
- **UC-008:** Performance Benchmarks (Medium)
- **UC-009:** Error Handling and Recovery (High)
- **UC-010:** Weekend Search Optimization (Medium)

## 🎯 Test Coverage

| Use Case | Priority | Test Cases | FR Coverage |
|----------|----------|------------|-------------|
| UC-001 | Critical | 10 | FR-001, FR-002, FR-003, FR-005, FR-006 |
| UC-002 | High | 10 | FR-004, FR-007, FR-014 |
| UC-003 | High | 10 | FR-002, FR-003, FR-010 |
| UC-004 | Critical | 10 | FR-008A |
| UC-005 | High | 10 | FR-001, FR-005, FR-011 |
| UC-006 | Medium | 10 | FR-013 |
| UC-007 | High | 10 | FR-012 |
| UC-008 | Medium | 10 | FR-011 |
| UC-009 | High | 10 | FR-011 |
| UC-010 | Medium | 10 | FR-009 |
| **TOTAL** | - | **100** | **14 FRs** |

## 🚀 Quick Start

### Run All Use Cases (Local Environment)

```bash
# Using npm script
npm run test:uc

# Or directly
./tests/use_cases/run_use_case_tests.sh
```

### Run All Use Cases (Production Environment)

```bash
npm run test:uc:production

# Or directly
./tests/use_cases/run_use_case_tests.sh --env production
```

### Run All Use Cases (Both Environments)

```bash
npm run test:uc:both

# Or directly
./tests/use_cases/run_use_case_tests.sh --env both
```

### Run Specific Use Case

```bash
./tests/use_cases/run_use_case_tests.sh --uc UC-001
./tests/use_cases/run_use_case_tests.sh --uc UC-002 --env production
```

### Run Comprehensive Test Suite

```bash
# Local
npm run test:uc:all
python3 tests/use_cases/test_all_use_cases.py local

# Production
npm run test:uc:all:prod
python3 tests/use_cases/test_all_use_cases.py production

# Both
npm run test:uc:all:both
python3 tests/use_cases/test_all_use_cases.py both
```

## 📁 Test Files

### Individual Use Case Tests

- `test_uc001_first_time_user_search.py` - UC-001: First-time user workflow
- `test_uc002_advanced_search_filters.py` - UC-002: Guest filters and booking rules
- `test_uc003_date_range_validation.py` - UC-003: Date validation logic
- `test_uc004_search_lifecycle.py` - UC-004: Search state management

### Comprehensive Test Suite

- `test_all_use_cases.py` - All 10 use cases in one integrated suite

### Test Runners

- `run_use_case_tests.sh` - Shell script for running use cases
- `run_use_case_tests.py` - Python orchestrator for use case execution

## 🔧 Prerequisites

### Required Software

```bash
# Python 3.8+
python3 --version

# Chrome Browser
google-chrome --version

# ChromeDriver (matching Chrome version)
chromedriver --version
```

### Required Python Packages

```bash
pip install -r ../../requirements.txt

# Or individually
pip install selenium colorama
```

## 🌐 Environment Configuration

Tests support two environments:

### Local Development

- **URL:** `http://localhost:8080/public/index.html`
- **API:** Local API server (if running)
- **Use for:** Development, debugging, fast iteration

### Production

- **URL:** `https://www.mpbarbosa.com/public/index.html`
- **API:** Production API
- **Use for:** Final validation, release testing

### Setting Environment

```bash
# Environment variable
export TEST_BASE_URL="http://localhost:8080/public/index.html"

# Or use --env flag
./run_use_case_tests.sh --env production
```

## 📊 Test Output

### Success Example

```
========================================================================
         USE CASE TEST SUITE - Monitora Vagas
========================================================================

Configuration:
  Environment: local

Running comprehensive use case tests in local environment...

UC-001: First-Time User Hotel Search
✅ TC-001-01: Page loaded
✅ TC-001-02: Title correct
✅ TC-001-04: 28 hotels loaded
✅ TC-001-08: Default guest count = 2

UC-002: Advanced Search with Filters
✅ TC-002-04: Guest count increased
✅ TC-002-06: Booking rules toggle works

...

✅ ALL USE CASE TESTS PASSED
```

### Failure Example

```
UC-003: Date Range Validation
❌ TC-003-04 FAILED: Date validation error

FAILED: 1/10 tests
```

## 🧪 Test Details

### UC-001: First-Time User Hotel Search

Tests complete workflow for new user:

1. Page loads successfully
2. Page title correct
3. Hotel dropdown loading state
4. Hotels populate (25+ hotels)
5. Hotel selection
6. Check-in date entry
7. Check-out date entry
8. Guest count default (2)
9. Search button enabled
10. Search results display

**Priority:** Critical  
**Related FR:** FR-001, FR-002, FR-003, FR-005, FR-006

### UC-002: Advanced Search with Filters

Tests advanced filtering features:

1. Guest filter initial disabled state
2. Guest filter enabled after search
3. Decrease guest count
4. Increase guest count (max 10)
5. Set specific guest count
6. Uncheck booking rules toggle
7. Search with filters
8. Results respect guest filter
9. Re-enable booking rules
10. New search with rules

**Priority:** High  
**Related FR:** FR-004, FR-007, FR-014

### UC-003: Date Range Validation

Tests date validation business rules:

1. Accept valid check-in date
2. Reject same-day booking
3. Reject check-out before check-in
4. Accept 1-night range
5. Accept 30-night range
6. Disable search without check-in
7. Disable search without check-out
8. Enable search with valid dates
9. Prevent invalid submission
10. Handle weekend date ranges

**Priority:** High  
**Related FR:** FR-002, FR-003, FR-010

### UC-004: Search Lifecycle Management

Tests state transitions:

1. Initial state (form enabled, no results)
2. Fill form inputs
3. During search (loading state)
4. Verify form disabled during search
5. Results displayed
6. After search (Reset button visible)
7. Reset button properties (ID, text)
8. Click Reset (form re-enabled)
9. Reset completes (back to initial)
10. Second search lifecycle

**Priority:** Critical  
**Related FR:** FR-008A

### UC-005 through UC-010

See [USE_CASE_TEST_SPECIFICATION.md](../../docs/testing/USE_CASE_TEST_SPECIFICATION.md) for detailed test cases.

## 🐛 Debugging

### Run with Visible Browser

Edit test files to remove headless mode:

```python
# Comment out this line:
# chrome_options.add_argument('--headless')
```

### Increase Timeouts

```python
# Modify wait timeout
cls.wait = WebDriverWait(cls.driver, 60)  # Increase to 60s
```

### Verbose Output

```bash
python3 -m pytest tests/use_cases/test_uc001_first_time_user_search.py -v -s
```

### Screenshots on Failure

Tests automatically capture screenshots on failure in `tests/test_screenshots/`

## 📈 Performance

### Execution Times

| Test Suite | Tests | Duration | Environment |
|------------|-------|----------|-------------|
| UC-001 | 10 | ~2 min | Local |
| UC-002 | 10 | ~2 min | Local |
| UC-003 | 10 | ~2 min | Local |
| UC-004 | 10 | ~3 min | Local |
| All (Comprehensive) | 100 | ~15 min | Local |

### Optimization Tips

1. Run critical use cases first (UC-001, UC-004)
2. Use local environment for development
3. Run production tests only before release
4. Parallelize where possible (future enhancement)

## 🔄 Continuous Integration

### GitHub Actions Integration

```yaml
name: Use Case Tests
on: [push, pull_request]
jobs:
  use-case-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: pip install selenium colorama
      - name: Run use case tests
        run: npm run test:uc:all
```

## 📝 Adding New Use Cases

1. Create test file: `test_ucXXX_description.py`
2. Follow existing test structure
3. Update `run_use_case_tests.py` test suite list
4. Update this README
5. Run all tests to verify

### Template

```python
#!/usr/bin/env python3
"""
UC-XXX: Description
Priority: High/Medium/Low
Category: Category Name
Related FR: FR-XXX, FR-YYY
"""

import unittest
from selenium import webdriver
# ... imports ...

class UCXXXTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Setup
        pass
    
    def test_TC_XXX_01_description(self):
        # Test implementation
        pass

if __name__ == '__main__':
    unittest.main(verbosity=2)
```

## 🔗 Related Documentation

- [USE_CASE_TEST_SPECIFICATION.md](../../docs/testing/USE_CASE_TEST_SPECIFICATION.md) - Full test specification
- [E2E_TESTING_GUIDE.md](../../docs/guides/E2E_TESTING_GUIDE.md) - E2E testing guide
- [FUNCTIONAL_REQUIREMENTS.md](../../docs/features/FUNCTIONAL_REQUIREMENTS.md) - Functional requirements
- [TEST_SUITE_README.md](../TEST_SUITE_README.md) - Main test suite documentation

## 📞 Support

For issues or questions:

1. Check test output for specific error messages
2. Review test specification document
3. Check GitHub issues
4. Contact development team

## 📜 License

Copyright © 2024 Monitora Vagas Project

---

**Version:** 1.0.0  
**Last Updated:** 2024-12-25  
**Maintainer:** Monitora Vagas Test Team
