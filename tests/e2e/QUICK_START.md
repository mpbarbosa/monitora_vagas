# E2E Tests - Quick Start

**⚡ Get running in 60 seconds**

---

## 1. Start Backend (Terminal 1)

```bash
cd backend
npm start
```

Wait for: `Server running on http://localhost:3001`

---

## 2. Run Tests (Terminal 2)

```bash
npm run test:e2e
```

---

## 3. Expected Result

```
 PASS  tests/e2e/apiClient.e2e.test.js (45.678 s)
  API Client E2E Tests
    Health Check Endpoint
      ✓ should successfully check API health (123 ms)
      ✓ should return response within timeout (89 ms)
      ✓ should handle multiple concurrent health checks (234 ms)
    [... 37 more tests ...]

Test Suites: 1 passed, 1 total
Tests:       40 passed, 40 total
Time:        45.678 s
```

---

## Common Commands

```bash
# Run all tests
npm run test:e2e

# Watch mode
npm run test:e2e:watch

# Filter tests
npm run test:e2e -- -t "Health"

# Verbose output
npm run test:e2e -- --verbose

# Custom API URL
TEST_API_URL=http://localhost:3001/api npm run test:e2e
```

---

## Troubleshooting

### Backend not running?
```bash
cd backend && npm start
```

### Wrong URL?
```bash
export TEST_API_URL=http://localhost:3001/api
npm run test:e2e
```

### Tests timing out?
```bash
# Check backend performance
curl http://localhost:3001/api/health
```

---

## Test Categories

- ✅ Health Check (3 tests)
- ✅ Hotel List (4 tests)
- ✅ Scraping (2 tests)
- ✅ Basic Search (6 tests)
- ✅ Advanced Search (3 tests)
- ✅ Weekend Search (4 tests)
- ✅ Error Handling (4 tests)
- ✅ Performance (3 tests)
- ✅ Integration (3 tests)
- ✅ Cache (3 tests)

**Total:** 40+ tests

---

## Documentation

- **Quick Start:** This file
- **Complete Guide:** `E2E_TEST_GUIDE.md`
- **API Reference:** `README.md`
- **Summary:** `../E2E_TEST_SUMMARY.md`

---

## Status: ✅ Ready

Start backend → Run tests → All pass! 🚀
