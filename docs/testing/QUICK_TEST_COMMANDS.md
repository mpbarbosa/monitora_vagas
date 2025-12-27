# Quick Test Command Reference

## Running Tests

### Python Selenium Tests
```bash
# Single UI test
python3 tests/simple_ui_test.py

# All Python tests with pytest
pytest tests/

# Parallel execution (4 workers)
pytest tests/ -n 4

# With coverage
pytest tests/ --cov=src --cov-report=html
```

### JavaScript Jest Tests
```bash
# All Jest tests
npm test

# API client tests only
npm run test:api

# With coverage
npm run test:api:coverage

# Watch mode
npm run test:api:watch

# E2E tests
npm run test:e2e
```

### Combined Test Suites
```bash
# Run all JavaScript tests
npm run test:all:js

# Run all tests (Python + JavaScript)
npm run test:all
```

## Viewing Coverage Reports

### Jest Coverage
```bash
npm run test:api:coverage
open coverage/lcov-report/index.html
```

### Pytest Coverage
```bash
pytest tests/ --cov=src --cov-report=html
open htmlcov/index.html
```

## Test Markers (Pytest)

```bash
# Run only Selenium tests
pytest -m selenium

# Skip slow tests
pytest -m "not slow"

# Run API tests only
pytest -m api

# Run unit tests only
pytest -m unit
```

## Quick Verification

```bash
# Verify all systems working
python3 tests/simple_ui_test.py && npm run test:api
```

## Test Configuration Files

- `pytest.ini` - Pytest configuration
- `jest.config.js` - Jest configuration
- `tests/conftest.py` - Pytest fixtures
- `tests/config/selenium_config.py` - Selenium/Chrome setup

## Current Status (2024-12-26)

✅ Python Selenium: PASSING (simple_ui_test.py)
✅ Jest Tests: 73/73 passing
✅ Coverage: 19.57% baseline established
✅ Target: 80% coverage

## Common Issues

### Chrome Not Found
Solution: Tests now use system PATH automatically (fixed in selenium_config.py)

### Tests Too Slow
Solution: Use parallel execution (`pytest -n auto` or `npm run test:api:watch`)

### Coverage Below Threshold
Expected: Working on expanding coverage from 19.57% → 80%

---

**Last Updated:** 2024-12-26  
**Version:** v2.2.0
