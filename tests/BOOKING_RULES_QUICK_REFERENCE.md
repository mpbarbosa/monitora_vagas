# Booking Rules Test Suite - Quick Reference

**Version:** 1.0.0 | **Date:** 2025-12-14

---

## 🚀 Quick Start

```bash
cd tests
./run-booking-rules-tests.sh
```

---

## 📋 Business Rules

### BR-18: Holiday Packages
- 🎄 **Christmas:** Dec 22 → Dec 27 (5 days/4 nights)
- 🎆 **New Year:** Dec 27 → Jan 2 (6 days/5 nights)

### BR-19: Restricted Dates
- Holiday periods must use exact package dates
- No partial or custom dates allowed

---

## 🧪 Test Suite

**File:** `test_booking_rules.py`  
**Tests:** 25 automated tests  
**Duration:** ~30-45 seconds  
**Framework:** Python + Selenium

### Test Categories

| Category | Tests | Coverage |
|----------|-------|----------|
| Christmas Package | 4 | Valid/invalid dates |
| New Year Package | 4 | Valid/invalid dates |
| Restricted Dates | 4 | Period overlaps |
| Non-Holiday Dates | 3 | Regular dates |
| UI Elements | 5 | Notice, styling |
| Edge Cases | 5 | Boundaries, errors |

---

## 📊 Test Results

### Success Output
```
Tests run: 25
✅ Passed: 25
❌ Failed: 0
⚠️  Errors: 0
```

### Individual Tests
1. ✅ Valid Christmas Package
2. ⚠️ Invalid Partial Christmas
3. ⚠️ Invalid Early Check-in
4. ⚠️ Invalid Late Check-out
5. ✅ Valid New Year Package
6. ⚠️ Invalid Partial New Year
7. ⚠️ Invalid Early NY Check-in
8. ⚠️ Invalid Late NY Check-out
9. ✅ Dec 27 - Christmas
10. ✅ Dec 27 - New Year
11. ⚠️ Mid-Period Dates
12. ⚠️ January First Week
13. ✅ November Dates
14. ✅ Early December
15. ✅ Late January
16. ✅ Notice Element Exists
17. ✅ Help Text Elements
18. ✅ Visibility Toggle
19. ✅ Valid Package Styling
20. ⚠️ Warning Styling
21. ✅ Empty Dates
22. ✅ Incomplete Dates
23. ✅ Reversed Dates
24. ✅ Year Boundary
25. ✅ Multi-Year Span

---

## 🛠️ Prerequisites

```bash
# Python 3.8+
python3 --version

# Selenium
pip install selenium

# Chrome/Chromium
google-chrome --version
```

---

## 📝 Common Commands

### Run All Tests
```bash
./run-booking-rules-tests.sh
```

### Run Specific Test
```bash
python3 -m unittest test_booking_rules.BookingRulesTestSuite.test_01_valid_christmas_package
```

### Run in Verbose Mode
```bash
python3 test_booking_rules.py -v
```

### Debug Mode (Visible Browser)
Edit `test_booking_rules.py`:
```python
# Comment out this line:
# chrome_options.add_argument('--headless')
```

---

## 🔍 Test Scenarios

### Valid Packages ✅
- `2025-12-22` → `2025-12-27` (Christmas)
- `2025-12-27` → `2026-01-02` (New Year)

### Invalid Dates ⚠️
- `2025-12-23` → `2025-12-26` (Partial Christmas)
- `2025-12-28` → `2026-01-01` (Partial New Year)
- `2025-12-24` → `2025-12-25` (Mid-period)

### Regular Dates ✅
- `2025-11-15` → `2025-11-18` (November)
- `2025-12-05` → `2025-12-10` (Early Dec)
- `2026-01-10` → `2026-01-15` (Late Jan)

---

## 🐛 Troubleshooting

### Port in Use
```bash
lsof -ti:8765 | xargs kill -9
```

### Selenium Not Found
```bash
pip install selenium
```

### Chrome Not Found
```bash
sudo apt install chromium-browser
```

### Tests Timeout
Increase timeout in `test_booking_rules.py`:
```python
cls.wait = WebDriverWait(cls.driver, 20)  # Was 10
```

---

## 📈 Expected Behavior

### Valid Holiday Package
1. User selects exact package dates
2. Green notice appears: "✅ Pacote de Natal selecionado"
3. Test passes

### Invalid Holiday Dates
1. User selects partial dates in holiday period
2. Yellow warning appears with correct dates
3. Test detects warning correctly
4. Test passes

### Regular Dates
1. User selects non-holiday dates
2. No holiday notice displayed
3. Test confirms no notice
4. Test passes

---

## 🔗 Documentation

- **Full Guide:** [BOOKING_RULES_TEST_SUITE.md](./BOOKING_RULES_TEST_SUITE.md)
- **Requirements:** [FUNCTIONAL_REQUIREMENTS.md](../docs/features/FUNCTIONAL_REQUIREMENTS.md)
- **API Docs:** [API_DOCUMENTATION.md](../docs/api/API_DOCUMENTATION.md)

---

## ✅ Checklist

Before committing code:
- [ ] Run test suite
- [ ] All 25 tests pass
- [ ] No new warnings
- [ ] Update docs if UI changed

---

**Quick Help:**
```bash
./run-booking-rules-tests.sh --help  # Show usage
python3 test_booking_rules.py -h     # Test options
```

**Status:** ✅ Production Ready  
**Last Updated:** 2025-12-14
