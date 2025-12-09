# 🧪 Quick Reference: Testing index.html

## 🚀 Run All Tests (Easiest)
```bash
cd tests
./run-index-tests.sh
```

## 📋 Individual Test Files

### 1. Browser Integration Tests (Visual)
```bash
npm start
# Then open: http://localhost:8080/tests/test-index-comprehensive.html
```
- **File**: `test-index-comprehensive.html`
- **Tests**: 45 automated checks
- **Auto-runs**: Yes
- **Visual results**: Yes ✅

### 2. End-to-End Tests (Selenium)
```bash
npm start
python3 tests/test-index-e2e.py
```
- **File**: `test-index-e2e.py`
- **Tests**: 26 workflow tests
- **Headless**: Yes
- **Requires**: `pip install selenium`

### 3. Unit Tests (JavaScript)
```bash
# Run in browser console or with Jest
```
- **File**: `test-index-unit.js`
- **Tests**: 38 function tests
- **Standalone**: Yes

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `TEST_SUITE_README.md` | Complete documentation |
| `INDEX_TEST_SUITE_SUMMARY.md` | Overview & summary |
| `run-index-tests.sh` | Automated runner |

## ✅ What Gets Tested

- ✓ Page loads correctly
- ✓ All form elements present
- ✓ Hotel dropdown works
- ✓ Date inputs work
- ✓ Form validation
- ✓ Search button
- ✓ Results display
- ✓ Copy/Clear buttons
- ✓ Responsive design
- ✓ Accessibility
- ✓ No errors

## 🎯 Test Coverage

```
Total Tests: 109
├─ Browser Integration: 45 tests
├─ End-to-End: 26 tests
└─ Unit Tests: 38 tests
```

## 💡 Common Commands

```bash
# Run all tests
./run-index-tests.sh

# E2E tests only
./run-index-tests.sh --e2e-only

# Browser tests only
./run-index-tests.sh --browser-only

# Skip server start
./run-index-tests.sh --no-server

# Get help
./run-index-tests.sh --help
```

## 🐛 Troubleshooting

**Server won't start?**
```bash
lsof -i :8080  # Check what's using port 8080
```

**Selenium errors?**
```bash
pip install --upgrade selenium
```

**Need Chrome?**
```bash
# Linux
sudo apt-get install chromium-browser

# macOS
brew install chromium
```

## 📞 Quick Help

- **Full docs**: `tests/TEST_SUITE_README.md`
- **Summary**: `tests/INDEX_TEST_SUITE_SUMMARY.md`
- **Files**: `tests/test-index-*`

---
*Happy Testing! 🎉*
