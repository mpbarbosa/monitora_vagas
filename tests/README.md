# 🧪 Tests Directory

> End-to-End testing suite for Monitora Vagas web application

**Version**: 1.5.0  
**Last Updated**: 2025-12-14

---

## 📁 Directory Contents

```
tests/
├── test-index-e2e.py                    # Main E2E test suite (26 tests)
├── test_booking_rules.py                # NEW: Booking rules test suite (25 tests)
├── run-index-tests.sh                   # Shell script test runner
├── run-booking-rules-tests.sh           # NEW: Booking rules test runner
├── BOOKING_RULES_TEST_SUITE.md          # NEW: Booking rules documentation
├── BOOKING_RULES_QUICK_REFERENCE.md     # NEW: Quick reference guide
├── TEST_SUITE_README.md                 # Complete test documentation
└── README.md                            # This file
```

### New Test Suite (v1.5.0)
**Booking Rules Tests** - Validates BR-18 and BR-19 compliance
- 25 automated tests for holiday package validation
- Christmas Package (Dec 22-27) testing
- New Year Package (Dec 27-Jan 2) testing
- UI behavior and edge cases

---

## 🎯 Quick Start

### Run All E2E Tests

```bash
./run-index-tests.sh
```

### Run Booking Rules Tests (NEW)

```bash
./run-booking-rules-tests.sh
```

### Run Specific Tests

```bash
# E2E tests only
./run-index-tests.sh --e2e-only

# With verbose output
./run-index-tests.sh --verbose

# Individual E2E test
python3 test-index-e2e.py IndexE2ETests.test_04_hotel_select_has_options

# Individual booking rules test
python3 -m unittest test_booking_rules.BookingRulesTestSuite.test_01_valid_christmas_package
```

---

## 📦 Prerequisites

### Python Dependencies

```bash
pip install selenium colorama
```

Or use requirements.txt from root:

```bash
cd ..
pip install -r requirements.txt
```

### System Requirements

- Python 3.8+
- Chrome/Chromium browser
- ChromeDriver
- Node.js (for local API server)

---

## 🏗️ Test Architecture

### API Server Strategy

The test suite automatically manages API server connectivity:

1. **Attempts to start local API** from `~/Documents/GitHub/busca_vagas/src/server.js` on port 3001
2. **Validates server health** with `/api/health` endpoint check
3. **Falls back to production API** if local server unavailable
4. **Automatic cleanup** stops server after tests complete

### Test Flow

```
Setup → Start Local API → Health Check → Run Tests → Cleanup
  ↓           ↓              ↓             ↓           ↓
Init    Port 3001     Verify Running   26 Tests   Stop Server
```

---

## 📊 Test Coverage

### E2E Tests - 26 Comprehensive Tests

**Page Load Tests** (6)
- ✅ test_01_page_loads_successfully
- ✅ test_02_all_form_elements_present
- ✅ test_03_results_container_initially_hidden
- ✅ test_04_hotel_select_has_options
- ✅ test_05_checkin_input_accepts_text
- ✅ test_06_checkout_input_accepts_text

### Booking Rules Tests - 25 Comprehensive Tests (NEW)

**BR-18: Holiday Packages** (8 tests)
- ✅ Valid Christmas Package (Dec 22-27)
- ✅ Valid New Year Package (Dec 27-Jan 2)
- ⚠️ Invalid partial Christmas dates
- ⚠️ Invalid partial New Year dates
- ⚠️ Invalid early/late check-in/out

**BR-19: Restricted Dates** (4 tests)
- ✅ December 27 overlap handling
- ⚠️ Mid-period dates blocked
- ⚠️ January restricted dates

**UI & Edge Cases** (13 tests)
- ✅ Notice visibility and styling
- ✅ Non-holiday dates work normally
- ✅ Empty dates and boundaries
- ✅ Year boundary handling

**Total Tests: 51** (26 E2E + 25 Booking Rules)

**Form Interaction Tests** (5)
- ✅ test_07_guest_counter_plus_button_exists
- ✅ test_08_guest_counter_minus_button_exists
- ✅ test_09_form_validates_empty_dates
- ✅ test_10_search_button_text
- ✅ test_11_copy_results_button_exists

**UI Component Tests** (3)
- ✅ test_12_clear_results_button_exists
- ✅ test_13_hotels_cards_container_exists
- ✅ More...

**Responsive Design Tests** (3)
- ✅ test_14_mobile_viewport
- ✅ test_15_tablet_viewport
- ✅ test_16_desktop_viewport

**Accessibility Tests** (3)
- ✅ Form labels exist
- ✅ ARIA attributes present
- ✅ Keyboard navigation

**JavaScript Integration** (2)
- ✅ API client initialization
- ✅ Hotel dropdown population

**Performance Tests** (2)
- ✅ Page load time
- ✅ API response time

**Integration Tests** (2)
- ✅ Complete search workflow
- ✅ Results display

---

## 🔧 Troubleshooting

### API Server Won't Start

**Check if server exists:**
```bash
ls ~/Documents/GitHub/busca_vagas/src/server.js
```

**Manually start server:**
```bash
cd ~/Documents/GitHub/busca_vagas
PORT=3001 node src/server.js
```

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Hotels Not Loading

**Verify API is accessible:**
```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/vagas/hoteis
```

**Check production API:**
```bash
curl https://www.mpbarbosa.com/api/health
```

### ChromeDriver Issues

```bash
# Install ChromeDriver
sudo apt install chromium-chromedriver

# Or download manually
wget https://chromedriver.storage.googleapis.com/LATEST_RELEASE
```

---

## 🎨 Test Output

### Color-Coded Results

- 🟢 **Green**: Success messages
- 🟡 **Yellow**: Warnings
- 🔴 **Red**: Errors/Failures
- ⚪ **Grey**: Browser console logs (dimmed with `Style.DIM`)

### Example Output

```
🔍 Checking API server availability...
✅ Local API server started and responding (PID: 12345)

🧪 Running E2E Tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

test_04_hotel_select_has_options
Browser console logs:
  INFO: ✅ BuscaVagasAPIClient initialized
  INFO: 🏨 Retrieved 25 hotels
Found 26 hotel options.
✅ 🏨 Hotel select has 26 option(s)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ran 26 tests in 45.3s

OK
```

---

## 📚 Documentation

For complete testing documentation, see:

**📖 [E2E Testing Guide](../docs/guides/E2E_TESTING_GUIDE.md)**

Topics covered:
- Detailed test architecture
- Running specific tests
- CI/CD integration
- Contributing guidelines
- Advanced troubleshooting

---

## 🔄 Maintenance

### Update Frequency

Tests should be updated when:
- ✅ New features are added to index.html
- ✅ API endpoints change
- ✅ UI components are modified
- ✅ Form validation logic updates
- ✅ Dependencies are upgraded

### Version History

**v1.0.0** (2025-12-09)
- Initial test suite with 26 tests
- Automatic API server management
- Production API fallback
- Browser console logging
- Grey-styled console output
- Comprehensive hotel dropdown testing

---

## 🤝 Contributing

### Adding New Tests

1. Add test method to `IndexE2ETests` class
2. Follow naming convention: `test_##_descriptive_name`
3. Include docstring with emoji
4. Use colorama for styled output
5. Update test count in class docstring
6. Update this README

### Example Test Template

```python
def test_##_new_feature(self):
    """🔧 Test description with emoji"""
    # Setup
    element = self.driver.find_element(By.ID, "element-id")
    
    # Action
    element.click()
    
    # Assertion
    self.assertTrue(condition, "Assertion message")
    
    # Success output
    print(f"{Fore.GREEN}✅ New feature test passed{Style.RESET_ALL}")
```

---

## 📝 Related Files

- `../requirements.txt` - Python dependencies
- `../public/index.html` - Page under test
- `../public/services/apiClient.js` - API client
- `../public/config/environment.js` - Environment config

---

**✅ Maintained By**: Monitora Vagas Development Team  
**🐛 Report Issues**: Open a GitHub issue  
**💡 Suggestions**: Welcome via pull requests
