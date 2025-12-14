# Booking Rules Test Suite Documentation

**Version:** 1.0.0  
**Date:** 2025-12-14  
**Purpose:** Validate BR-18 and BR-19 compliance in monitora_vagas web UI

---

## 📋 Overview

This test suite validates that the `monitora_vagas` web interface correctly implements holiday package booking rules as defined by the busca_vagas API (v1.4.1).

### Business Rules Tested

**BR-18: Pre-defined Holiday Packages**
- 🎄 Christmas Package: December 22 → December 27 (5 days/4 nights)
- 🎆 New Year Package: December 27 → January 2 (6 days/5 nights)

**BR-19: Restricted Booking Dates**
- Holiday periods must use exact package dates only
- No partial or custom dates allowed within holiday periods
- Client-side validation with user-friendly feedback

---

## 📁 Test Files

### Main Test Suite
**File:** `test_booking_rules.py`
- **Lines:** 750+ lines
- **Tests:** 25 comprehensive test cases
- **Framework:** Python unittest + Selenium WebDriver
- **Mode:** Headless Chrome (automated)

### Test Runner Script
**File:** `run-booking-rules-tests.sh`
- **Purpose:** Easy one-command test execution
- **Features:** Dependency checking, colored output
- **Usage:** `./run-booking-rules-tests.sh`

---

## 🧪 Test Categories

### 1. Christmas Package Tests (Tests 1-4)

**Test 1: Valid Christmas Package**
- Dates: Dec 22 → Dec 27
- Expected: ✅ Green success notice
- Validates: Exact package dates accepted

**Test 2: Invalid Partial Christmas Dates**
- Dates: Dec 23 → Dec 26
- Expected: ⚠️ Warning notice with correction info
- Validates: Partial dates rejected

**Test 3: Invalid Early Christmas Check-in**
- Dates: Dec 21 → Dec 27
- Expected: ⚠️ Warning or no package notice
- Validates: Early check-in rejected

**Test 4: Invalid Late Christmas Check-out**
- Dates: Dec 22 → Dec 28
- Expected: ⚠️ Warning notice
- Validates: Extended stay rejected

### 2. New Year Package Tests (Tests 5-8)

**Test 5: Valid New Year Package**
- Dates: Dec 27 → Jan 2 (next year)
- Expected: ✅ Green success notice
- Validates: Exact package dates accepted

**Test 6: Invalid Partial New Year Dates**
- Dates: Dec 28 → Jan 1
- Expected: ⚠️ Warning notice
- Validates: Partial dates rejected

**Test 7: Invalid Early New Year Check-in**
- Dates: Dec 26 → Jan 2
- Expected: ⚠️ Warning notice
- Validates: Wrong check-in rejected

**Test 8: Invalid Late New Year Check-out**
- Dates: Dec 27 → Jan 3
- Expected: ⚠️ Warning notice
- Validates: Extended stay rejected

### 3. Restricted Dates Tests (Tests 9-12)

**Test 9: December 27 Overlap - Christmas**
- Dates: Dec 22 → Dec 27
- Expected: ✅ Identified as Christmas package
- Validates: Dec 27 as Christmas checkout

**Test 10: December 27 Overlap - New Year**
- Dates: Dec 27 → Jan 2
- Expected: ✅ Identified as New Year package
- Validates: Dec 27 as New Year checkin

**Test 11: Mid-Period Dates**
- Dates: Dec 24 → Dec 25
- Expected: ⚠️ Warning for restricted period
- Validates: Middle of holiday period blocked

**Test 12: January First Week**
- Dates: Jan 1 → Jan 2
- Expected: ⚠️ Warning for restricted dates
- Validates: New Year period dates blocked

### 4. Non-Holiday Dates Tests (Tests 13-15)

**Test 13: Regular November Dates**
- Dates: Nov 15 → Nov 18
- Expected: No holiday notice
- Validates: Non-holiday dates work normally

**Test 14: Early December Dates**
- Dates: Dec 5 → Dec 10
- Expected: No holiday notice
- Validates: Pre-holiday dates work normally

**Test 15: Late January Dates**
- Dates: Jan 10 → Jan 15
- Expected: No holiday notice
- Validates: Post-holiday dates work normally

### 5. UI Element Tests (Tests 16-20)

**Test 16: Holiday Notice Element Exists**
- Validates: DOM element present
- Checks: Initially hidden state

**Test 17: Date Input Help Text**
- Validates: Help text elements exist
- Checks: Proper placement in DOM

**Test 18: Notice Visibility Toggle**
- Validates: Notice shows/hides correctly
- Checks: Dynamic behavior with date changes

**Test 19: Notice Styling - Valid Package**
- Validates: Green background for valid dates
- Checks: CSS styling applied correctly

**Test 20: Notice Styling - Invalid Dates**
- Validates: Yellow background for warnings
- Checks: Warning colors applied

### 6. Edge Cases (Tests 21-25)

**Test 21: Empty Date Inputs**
- Validates: No notice with empty dates
- Checks: Graceful handling

**Test 22: Only Check-in Date**
- Validates: No notice with incomplete dates
- Checks: Partial input handling

**Test 23: Reversed Dates**
- Validates: Handled gracefully
- Checks: Validation deferred to submit

**Test 24: Year Boundary**
- Validates: New Year package across years
- Checks: Year transition logic

**Test 25: Multiple Year Span**
- Validates: Long date ranges handled
- Checks: Holiday periods within range

---

## 🚀 Running the Tests

### Quick Start

```bash
# Navigate to tests directory
cd tests

# Run test suite
./run-booking-rules-tests.sh
```

### Manual Execution

```bash
# Run directly with Python
python3 test_booking_rules.py

# Run with verbose output
python3 test_booking_rules.py -v

# Run specific test
python3 -m unittest test_booking_rules.BookingRulesTestSuite.test_01_valid_christmas_package
```

---

## 📊 Expected Output

### Successful Run

```
================================================================================
🎄 BOOKING RULES TEST SUITE
================================================================================
Testing BR-18 (Holiday Packages) and BR-19 (Restricted Dates)
================================================================================

✅ Local server started on http://localhost:8765
✅ Chrome driver initialized (headless mode)

🎄 Test 1: Valid Christmas Package
   ✅ Valid Christmas dates accepted: 2025-12-22 → 2025-12-27
   ✅ Notice displayed: ✅ Pacote de Natal selecionado (5 dias/4 noites)
.
🎄 Test 2: Invalid Partial Christmas Dates
   ✅ Invalid dates detected: 2025-12-23 → 2025-12-26
   ✅ Warning displayed: ⚠️ As datas selecionadas estão no período...
.
...
(25 more tests)
...

================================================================================
📊 TEST SUMMARY
================================================================================
Tests run: 25
✅ Passed: 25
❌ Failed: 0
⚠️  Errors: 0
================================================================================
```

### Failed Test Example

```
🎄 Test 1: Valid Christmas Package
   ❌ AssertionError: Holiday notice should be visible
F

FAIL: test_01_valid_christmas_package
Traceback (most recent call last):
  ...
AssertionError: Holiday notice should be visible
```

---

## 🔧 Prerequisites

### Required Software

1. **Python 3.8+**
   ```bash
   python3 --version
   ```

2. **Selenium WebDriver**
   ```bash
   pip install selenium
   ```

3. **Chrome or Chromium Browser**
   ```bash
   google-chrome --version
   # or
   chromium-browser --version
   ```

### Installation

```bash
# Install Python dependencies
pip install selenium

# Or use requirements.txt
pip install -r ../requirements.txt
```

---

## 🎯 Test Coverage

### Holiday Package Validation
- ✅ Valid Christmas package (Dec 22-27)
- ✅ Valid New Year package (Dec 27-Jan 2)
- ✅ Invalid partial Christmas dates
- ✅ Invalid partial New Year dates
- ✅ Invalid early/late check-in/out dates

### UI Behavior
- ✅ Notice visibility toggling
- ✅ Color-coded feedback (green/yellow)
- ✅ Success/warning icons (✅/⚠️)
- ✅ Package information display
- ✅ Help text elements

### Edge Cases
- ✅ Empty date inputs
- ✅ Incomplete date selection
- ✅ Year boundary handling
- ✅ Date range overlaps
- ✅ December 27 overlap logic

### Date Ranges
- ✅ November (pre-holiday)
- ✅ Early December (pre-holiday)
- ✅ Christmas period (Dec 22-27)
- ✅ New Year period (Dec 27-Jan 2)
- ✅ Late January (post-holiday)

---

## 🐛 Troubleshooting

### Test Fails to Start

**Error:** `Chrome driver not found`
```bash
# Solution: Install Chrome/Chromium
sudo apt install chromium-browser
# or
sudo apt install google-chrome-stable
```

**Error:** `Selenium not installed`
```bash
# Solution: Install Selenium
pip install selenium
```

### Port Already in Use

**Error:** `Address already in use: 8765`
```bash
# Solution: Kill process on port 8765
lsof -ti:8765 | xargs kill -9
```

### Tests Timeout

**Issue:** Tests hang or timeout
```bash
# Solution: Increase timeout in test file
# Edit test_booking_rules.py
# Change: cls.wait = WebDriverWait(cls.driver, 10)
# To: cls.wait = WebDriverWait(cls.driver, 20)
```

### Headless Mode Issues

**Issue:** Tests fail in headless mode
```bash
# Solution: Run in visible mode for debugging
# Edit test_booking_rules.py
# Comment out: chrome_options.add_argument('--headless')
```

---

## 📝 Test Maintenance

### Updating for New Years

The test suite automatically uses the current year, so it should work year after year without modification. However, if you need to test specific years:

```python
# In setUp or individual tests
self.current_year = 2026  # Override current year
self.next_year = 2027
```

### Adding New Tests

1. Add new test method to `BookingRulesTestSuite` class
2. Follow naming convention: `test_##_descriptive_name`
3. Include print statements for verbose output
4. Use helper methods: `set_date_inputs()`, `get_holiday_notice()`, etc.

Example:
```python
def test_26_new_feature(self):
    """Test new booking rule feature"""
    print("\n🆕 Test 26: New Feature")
    
    # Test implementation
    self.set_date_inputs("2025-12-22", "2025-12-27")
    
    # Assertions
    self.assertTrue(condition, "Error message")
    
    print(f"   ✅ Feature validated")
```

### Modifying Existing Tests

1. Keep test names and numbers for consistency
2. Update assertions if UI changes
3. Update expected output in docstrings
4. Rerun full suite after changes

---

## 🔗 Related Documentation

### Project Documentation
- [Booking Rules Implementation](../docs/features/FUNCTIONAL_REQUIREMENTS.md) - BR-18, BR-19 specs
- [API Documentation](../docs/api/API_DOCUMENTATION.md) - API integration details
- [Test Suite README](./TEST_SUITE_README.md) - General testing guide

### External References
- [busca_vagas API](https://github.com/mpbarbosa/busca_vagas) - API source
- [Booking Rules Summary](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/api/BOOKING_RULES_SUMMARY.md) - API-side implementation

---

## 📈 Test Metrics

### Current Statistics
- **Total Tests:** 25
- **Test Categories:** 6
- **Lines of Code:** ~750
- **Test Duration:** ~30-45 seconds (headless)
- **Browser:** Chrome/Chromium (headless)
- **Coverage:** Client-side validation + UI behavior

### Pass/Fail Criteria
- ✅ **Pass:** All 25 tests pass
- ⚠️ **Warning:** 1-3 tests fail (investigate)
- ❌ **Fail:** 4+ tests fail (blocking issue)

---

## 🎓 Best Practices

### Before Committing
1. Run full test suite: `./run-booking-rules-tests.sh`
2. Verify all tests pass
3. Check for new warnings
4. Update test documentation if needed

### Test Development
1. Write test first (TDD approach)
2. Keep tests independent
3. Use descriptive test names
4. Add helpful print statements
5. Clean up in tearDown

### CI/CD Integration
```yaml
# Example GitHub Actions workflow
- name: Run Booking Rules Tests
  run: |
    cd tests
    ./run-booking-rules-tests.sh
```

---

## ✨ Summary

This comprehensive test suite ensures that the monitora_vagas web interface correctly enforces holiday booking rules (BR-18, BR-19) as mandated by the busca_vagas API. With 25 automated tests covering all aspects of the booking rules implementation, the suite provides confidence that users will receive appropriate guidance when booking during holiday periods.

**Key Features:**
- ✅ 25 automated tests
- ✅ Complete coverage of BR-18 and BR-19
- ✅ UI behavior validation
- ✅ Edge case testing
- ✅ Easy one-command execution
- ✅ Detailed output and reporting

**Status:** Production Ready  
**Maintenance:** Annual review (minimal changes needed)  
**Next Review:** December 2026

---

**Last Updated:** 2025-12-14  
**Maintained By:** Monitora Vagas Team
