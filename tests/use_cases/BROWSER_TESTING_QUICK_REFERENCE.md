# Browser Testing Quick Reference

## 🚀 Quick Commands

### Run Tests

```bash
# Selenium (recommended)
npm run test:browser:selenium

# Playwright (optional, requires installation)
npm run test:browser:playwright

# Both
npm run test:browser:all

# Production testing
npm run test:browser:selenium:prod
```

### Install Playwright (Optional)

```bash
pip install playwright==1.40.0
python -m playwright install chromium
```

---

## 📁 Files Overview

| File | Purpose | Lines |
|------|---------|-------|
| `test_uc005_hotel_list_selenium.py` | Selenium browser tests | 465 |
| `test_uc005_hotel_list_playwright.py` | Playwright browser tests | 485 |
| `UC005_HOTEL_LIST_BROWSER_VERIFICATION.md` | Use case documentation | 380+ |
| `BROWSER_TESTING_GUIDE.md` | Complete guide | 400+ |
| `BROWSER_TESTING_IMPLEMENTATION_SUMMARY.md` | Summary | 330+ |

---

## 🧪 Test Cases

### Selenium (9 tests)
- ✅ Page loads successfully
- ✅ Hotel select exists
- ✅ Hotel count is 25
- ✅ All expected hotels present
- ✅ No duplicate hotels
- ✅ Hotel options have values
- ✅ Hotel selection works
- ✅ Load time < 5s
- ✅ Display complete list

### Playwright (10 tests)
- Same as Selenium +
- ✅ API integration verification

---

## 🔧 Environment Setup

### Local Testing
```bash
export TEST_BASE_URL=http://localhost:8080/public/index.html
npm run dev  # In another terminal
npm run test:browser:selenium
```

### Production Testing
```bash
export TEST_BASE_URL=https://www.mpbarbosa.com/vagas/
npm run test:browser:selenium
```

---

## 📊 Comparison

| Feature | Selenium | Playwright |
|---------|----------|------------|
| **Installed** | ✅ Yes | ❌ Optional |
| **Speed** | Moderate | Fast |
| **Auto-wait** | Manual | Built-in |
| **Debugging** | Basic | Advanced |
| **Recommended** | ✅ Primary | Future |

---

## 🆘 Quick Troubleshooting

**Chrome not found:**
```bash
sudo apt-get install chromium-browser
```

**Tests timeout:**
- Check application is running
- Verify network connectivity
- Increase timeout in test file

**Selenium not working:**
```bash
pip install --upgrade selenium
```

**Playwright not installed:**
```bash
pip install playwright
python -m playwright install chromium
```

---

## 📚 Documentation

- **Complete Guide:** `docs/BROWSER_TESTING_GUIDE.md`
- **Use Case Doc:** `tests/use_cases/UC005_HOTEL_LIST_BROWSER_VERIFICATION.md`
- **Summary:** `tests/use_cases/BROWSER_TESTING_IMPLEMENTATION_SUMMARY.md`

---

## ✅ What's Tested

- Hotel dropdown element visibility
- All 25 hotels loaded correctly
- No duplicate hotels
- Valid option values
- Hotel selection functionality
- Page load performance (<5s)
- API integration (Playwright)

---

## 🎯 Expected Hotels (25)

```
Todas, Amparo, Appenzell, Areado, Avaré, Boraceia,
Campos do Jordão, Caraguatatuba, Fazenda Ibirá, Guarujá,
Itanhaém, Lindoia, Maresias, Monte Verde, Peruíbe I,
Peruíbe II, Poços de Caldas, Saha, São Lourenço, São Pedro,
Serra Negra, Socorro, Termas de Ibirá, Ubatuba, Unidade Capital
```

---

## 📋 Test Output Example

```
================================================================================
UC-005: Hotel List Browser Verification (Selenium)
================================================================================

Testing URL: http://localhost:8080/public/index.html

✅ TC-005-01 PASSED
✅ TC-005-02 PASSED
✅ TC-005-03 PASSED - 25 hotels loaded
✅ TC-005-04 PASSED - All 25 hotels present
✅ TC-005-05 PASSED - No duplicates
✅ TC-005-06 PASSED - All options have valid values
✅ TC-005-07 PASSED - Successfully selected Guarujá
✅ TC-005-08 PASSED - Loaded in 1.23s
✅ TC-005-09 PASSED - Displayed 25 hotels

Pass Rate: 100.0%

✅ ALL HOTEL LIST BROWSER TESTS PASSED!
```

---

**Status:** ✅ Production Ready  
**Updated:** 2025-12-25
