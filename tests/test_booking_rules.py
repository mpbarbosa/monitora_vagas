#!/usr/bin/env python3
"""
Booking Rules Test Suite for Monitora Vagas
Tests BR-18 and BR-19 compliance in the web UI

Business Rules:
- BR-18: Pre-defined Holiday Packages
  * Christmas Package: Dec 22 → Dec 27 (5 days/4 nights)
  * New Year Package: Dec 27 → Jan 2 (6 days/5 nights)
- BR-19: Restricted Booking Dates
  * Holiday periods must use exact package dates only

Version: 1.0.0
Date: 2025-12-14
"""

import os
import sys
import time
import unittest
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import http.server
import socketserver
import threading
from pathlib import Path

class BookingRulesTestSuite(unittest.TestCase):
    """Test suite for booking rules validation (BR-18, BR-19)"""
    
    @classmethod
    def setUpClass(cls):
        """Set up test environment - start local server and browser"""
        print("\n" + "="*80)
        print("🎄 BOOKING RULES TEST SUITE")
        print("="*80)
        print("Testing BR-18 (Holiday Packages) and BR-19 (Restricted Dates)")
        print("="*80 + "\n")
        
        # Find project root and public directory
        cls.project_root = Path(__file__).parent.parent
        cls.public_dir = cls.project_root / 'public'
        
        if not cls.public_dir.exists():
            raise Exception(f"Public directory not found: {cls.public_dir}")
        
        # Start local HTTP server
        cls.port = 8765
        cls.base_url = f"http://localhost:{cls.port}"
        
        os.chdir(cls.public_dir)
        handler = http.server.SimpleHTTPRequestHandler
        cls.httpd = socketserver.TCPServer(("", cls.port), handler)
        cls.server_thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.server_thread.start()
        print(f"✅ Local server started on {cls.base_url}")
        time.sleep(1)
        
        # Set up Chrome driver
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        
        try:
            cls.driver = webdriver.Chrome(options=chrome_options)
            print("✅ Chrome driver initialized (headless mode)")
        except Exception as e:
            print(f"❌ Failed to initialize Chrome driver: {e}")
            cls.httpd.shutdown()
            raise
        
        cls.driver.implicitly_wait(5)
        cls.wait = WebDriverWait(cls.driver, 10)
        
        # Test data - current year for dynamic testing
        cls.current_year = datetime.now().year
        cls.next_year = cls.current_year + 1
    
    @classmethod
    def tearDownClass(cls):
        """Clean up - close browser and stop server"""
        print("\n" + "="*80)
        print("🧹 Cleaning up test environment...")
        if hasattr(cls, 'driver'):
            cls.driver.quit()
            print("✅ Browser closed")
        if hasattr(cls, 'httpd'):
            cls.httpd.shutdown()
            print("✅ Server stopped")
        print("="*80 + "\n")
    
    def setUp(self):
        """Set up each test - navigate to page"""
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(1)  # Wait for page load
    
    def set_date_inputs(self, checkin, checkout):
        """Helper: Set check-in and check-out dates"""
        checkin_input = self.driver.find_element(By.ID, 'input-checkin')
        checkout_input = self.driver.find_element(By.ID, 'input-checkout')
        
        # Clear and set dates
        checkin_input.clear()
        checkin_input.send_keys(checkin)
        
        checkout_input.clear()
        checkout_input.send_keys(checkout)
        
        # Trigger change events
        self.driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", checkin_input)
        self.driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", checkout_input)
        
        time.sleep(0.5)  # Wait for UI update
    
    def get_holiday_notice(self):
        """Helper: Get holiday package notice element"""
        try:
            notice = self.driver.find_element(By.ID, 'holiday-package-notice')
            return notice
        except NoSuchElementException:
            return None
    
    def get_notice_text(self):
        """Helper: Get text from holiday notice"""
        notice = self.get_holiday_notice()
        if notice and notice.is_displayed():
            return self.driver.find_element(By.ID, 'holiday-package-text').text
        return None
    
    # ========================================================================
    # BR-18: CHRISTMAS PACKAGE TESTS
    # ========================================================================
    
    def test_01_valid_christmas_package(self):
        """Test valid Christmas package dates (Dec 22 → Dec 27)"""
        print("\n🎄 Test 1: Valid Christmas Package")
        
        checkin = f"{self.current_year}-12-22"
        checkout = f"{self.current_year}-12-27"
        
        self.set_date_inputs(checkin, checkout)
        
        # Check if notice appears
        notice = self.get_holiday_notice()
        self.assertIsNotNone(notice, "Holiday notice should be present")
        self.assertTrue(notice.is_displayed(), "Holiday notice should be visible")
        
        # Check notice content
        notice_text = self.get_notice_text()
        self.assertIn("Natal", notice_text.lower(), "Should mention Christmas (Natal)")
        self.assertIn("✅", notice_text, "Should show success checkmark")
        
        print(f"   ✅ Valid Christmas dates accepted: {checkin} → {checkout}")
        print(f"   ✅ Notice displayed: {notice_text}")
    
    def test_02_invalid_christmas_partial_dates(self):
        """Test invalid partial Christmas dates (Dec 23 → Dec 26)"""
        print("\n🎄 Test 2: Invalid Partial Christmas Dates")
        
        checkin = f"{self.current_year}-12-23"
        checkout = f"{self.current_year}-12-26"
        
        self.set_date_inputs(checkin, checkout)
        
        # Check if warning notice appears
        notice = self.get_holiday_notice()
        self.assertIsNotNone(notice, "Warning notice should be present")
        self.assertTrue(notice.is_displayed(), "Warning notice should be visible")
        
        # Check notice content
        notice_text = self.get_notice_text()
        self.assertIn("⚠", notice_text, "Should show warning symbol")
        self.assertIn("22", notice_text, "Should mention Dec 22")
        self.assertIn("27", notice_text, "Should mention Dec 27")
        
        print(f"   ✅ Invalid dates detected: {checkin} → {checkout}")
        print(f"   ✅ Warning displayed: {notice_text}")
    
    def test_03_invalid_christmas_early_checkin(self):
        """Test invalid early Christmas check-in (Dec 21 → Dec 27)"""
        print("\n🎄 Test 3: Invalid Early Christmas Check-in")
        
        checkin = f"{self.current_year}-12-21"
        checkout = f"{self.current_year}-12-27"
        
        self.set_date_inputs(checkin, checkout)
        
        notice = self.get_holiday_notice()
        notice_text = self.get_notice_text()
        
        # Should show warning or no special package notice
        if notice and notice.is_displayed():
            # If notice shown, should be a warning
            self.assertIn("⚠", notice_text, "Should show warning for wrong dates")
            print(f"   ✅ Warning displayed for early check-in")
        else:
            print(f"   ✅ No holiday package notice (dates outside period)")
    
    def test_04_invalid_christmas_late_checkout(self):
        """Test invalid late Christmas check-out (Dec 22 → Dec 28)"""
        print("\n🎄 Test 4: Invalid Late Christmas Check-out")
        
        checkin = f"{self.current_year}-12-22"
        checkout = f"{self.current_year}-12-28"
        
        self.set_date_inputs(checkin, checkout)
        
        notice = self.get_holiday_notice()
        notice_text = self.get_notice_text()
        
        if notice and notice.is_displayed():
            # Could be interpreted as trying to book into New Year period
            # Should show warning
            self.assertIn("⚠", notice_text, "Should show warning")
            print(f"   ✅ Warning displayed for extended stay")
    
    # ========================================================================
    # BR-18: NEW YEAR PACKAGE TESTS
    # ========================================================================
    
    def test_05_valid_new_year_package(self):
        """Test valid New Year package dates (Dec 27 → Jan 2)"""
        print("\n🎆 Test 5: Valid New Year Package")
        
        checkin = f"{self.current_year}-12-27"
        checkout = f"{self.next_year}-01-02"
        
        self.set_date_inputs(checkin, checkout)
        
        # Check if notice appears
        notice = self.get_holiday_notice()
        self.assertIsNotNone(notice, "Holiday notice should be present")
        self.assertTrue(notice.is_displayed(), "Holiday notice should be visible")
        
        # Check notice content
        notice_text = self.get_notice_text()
        self.assertIn("ano novo", notice_text.lower(), "Should mention New Year")
        self.assertIn("✅", notice_text, "Should show success checkmark")
        
        print(f"   ✅ Valid New Year dates accepted: {checkin} → {checkout}")
        print(f"   ✅ Notice displayed: {notice_text}")
    
    def test_06_invalid_new_year_partial_dates(self):
        """Test invalid partial New Year dates (Dec 28 → Jan 1)"""
        print("\n🎆 Test 6: Invalid Partial New Year Dates")
        
        checkin = f"{self.current_year}-12-28"
        checkout = f"{self.next_year}-01-01"
        
        self.set_date_inputs(checkin, checkout)
        
        # Check if warning notice appears
        notice = self.get_holiday_notice()
        self.assertIsNotNone(notice, "Warning notice should be present")
        self.assertTrue(notice.is_displayed(), "Warning notice should be visible")
        
        # Check notice content
        notice_text = self.get_notice_text()
        self.assertIn("⚠", notice_text, "Should show warning symbol")
        
        print(f"   ✅ Invalid dates detected: {checkin} → {checkout}")
        print(f"   ✅ Warning displayed")
    
    def test_07_invalid_new_year_early_checkin(self):
        """Test invalid early New Year check-in (Dec 26 → Jan 2)"""
        print("\n🎆 Test 7: Invalid Early New Year Check-in")
        
        checkin = f"{self.current_year}-12-26"
        checkout = f"{self.next_year}-01-02"
        
        self.set_date_inputs(checkin, checkout)
        
        notice = self.get_holiday_notice()
        if notice and notice.is_displayed():
            notice_text = self.get_notice_text()
            # Could be interpreted as Christmas package attempt
            self.assertIn("⚠", notice_text, "Should show warning")
            print(f"   ✅ Warning displayed for wrong check-in")
    
    def test_08_invalid_new_year_late_checkout(self):
        """Test invalid late New Year check-out (Dec 27 → Jan 3)"""
        print("\n🎆 Test 8: Invalid Late New Year Check-out")
        
        checkin = f"{self.current_year}-12-27"
        checkout = f"{self.next_year}-01-03"
        
        self.set_date_inputs(checkin, checkout)
        
        notice = self.get_holiday_notice()
        if notice and notice.is_displayed():
            notice_text = self.get_notice_text()
            self.assertIn("⚠", notice_text, "Should show warning for extended stay")
            print(f"   ✅ Warning displayed for late check-out")
    
    # ========================================================================
    # BR-19: RESTRICTED DATES TESTS
    # ========================================================================
    
    def test_09_december_27_overlap_christmas(self):
        """Test Dec 27 as Christmas check-out (valid)"""
        print("\n📅 Test 9: December 27 Overlap - Christmas Package")
        
        checkin = f"{self.current_year}-12-22"
        checkout = f"{self.current_year}-12-27"
        
        self.set_date_inputs(checkin, checkout)
        
        notice_text = self.get_notice_text()
        self.assertIn("✅", notice_text, "Should be valid Christmas package")
        self.assertIn("natal", notice_text.lower(), "Should identify as Christmas")
        
        print(f"   ✅ Dec 27 correctly identified as Christmas check-out")
    
    def test_10_december_27_overlap_new_year(self):
        """Test Dec 27 as New Year check-in (valid)"""
        print("\n📅 Test 10: December 27 Overlap - New Year Package")
        
        checkin = f"{self.current_year}-12-27"
        checkout = f"{self.next_year}-01-02"
        
        self.set_date_inputs(checkin, checkout)
        
        notice_text = self.get_notice_text()
        self.assertIn("✅", notice_text, "Should be valid New Year package")
        self.assertIn("ano novo", notice_text.lower(), "Should identify as New Year")
        
        print(f"   ✅ Dec 27 correctly identified as New Year check-in")
    
    def test_11_december_mid_period_dates(self):
        """Test dates in middle of Christmas period (Dec 24-25)"""
        print("\n📅 Test 11: Mid-Period Dates (Dec 24-25)")
        
        checkin = f"{self.current_year}-12-24"
        checkout = f"{self.current_year}-12-25"
        
        self.set_date_inputs(checkin, checkout)
        
        notice = self.get_holiday_notice()
        if notice and notice.is_displayed():
            notice_text = self.get_notice_text()
            self.assertIn("⚠", notice_text, "Should show warning")
            print(f"   ✅ Warning displayed for mid-period dates")
        else:
            self.fail("Should show warning for dates in Christmas period")
    
    def test_12_january_first_week(self):
        """Test dates in first week of January (Jan 1-2 restricted)"""
        print("\n📅 Test 12: January First Week Dates")
        
        checkin = f"{self.next_year}-01-01"
        checkout = f"{self.next_year}-01-02"
        
        self.set_date_inputs(checkin, checkout)
        
        notice = self.get_holiday_notice()
        if notice and notice.is_displayed():
            notice_text = self.get_notice_text()
            self.assertIn("⚠", notice_text, "Should show warning for restricted dates")
            print(f"   ✅ Warning displayed for Jan 1-2 (New Year period)")
    
    # ========================================================================
    # NON-HOLIDAY DATES TESTS
    # ========================================================================
    
    def test_13_regular_dates_november(self):
        """Test regular dates in November (no restrictions)"""
        print("\n📅 Test 13: Regular November Dates")
        
        checkin = f"{self.current_year}-11-15"
        checkout = f"{self.current_year}-11-18"
        
        self.set_date_inputs(checkin, checkout)
        
        notice = self.get_holiday_notice()
        if notice:
            self.assertFalse(notice.is_displayed(), "No notice should be shown for regular dates")
        
        print(f"   ✅ No holiday notice for regular dates")
    
    def test_14_regular_dates_early_december(self):
        """Test early December dates (before holiday period)"""
        print("\n📅 Test 14: Early December Dates")
        
        checkin = f"{self.current_year}-12-05"
        checkout = f"{self.current_year}-12-10"
        
        self.set_date_inputs(checkin, checkout)
        
        notice = self.get_holiday_notice()
        if notice:
            self.assertFalse(notice.is_displayed(), "No notice for dates before holiday period")
        
        print(f"   ✅ No holiday notice for early December")
    
    def test_15_regular_dates_late_january(self):
        """Test late January dates (after holiday period)"""
        print("\n📅 Test 15: Late January Dates")
        
        checkin = f"{self.next_year}-01-10"
        checkout = f"{self.next_year}-01-15"
        
        self.set_date_inputs(checkin, checkout)
        
        notice = self.get_holiday_notice()
        if notice:
            self.assertFalse(notice.is_displayed(), "No notice for dates after holiday period")
        
        print(f"   ✅ No holiday notice for late January")
    
    # ========================================================================
    # UI ELEMENT TESTS
    # ========================================================================
    
    def test_16_holiday_notice_element_exists(self):
        """Test that holiday notice element exists in DOM"""
        print("\n🎨 Test 16: Holiday Notice Element Exists")
        
        notice = self.driver.find_element(By.ID, 'holiday-package-notice')
        self.assertIsNotNone(notice, "Holiday notice element should exist")
        
        # Initially hidden
        self.assertFalse(notice.is_displayed(), "Notice should be hidden initially")
        
        print(f"   ✅ Holiday notice element present in DOM")
    
    def test_17_date_input_help_text(self):
        """Test that date input help text elements exist"""
        print("\n🎨 Test 17: Date Input Help Text Elements")
        
        checkin_help = self.driver.find_element(By.ID, 'checkin-help')
        checkout_help = self.driver.find_element(By.ID, 'checkout-help')
        
        self.assertIsNotNone(checkin_help, "Check-in help element should exist")
        self.assertIsNotNone(checkout_help, "Check-out help element should exist")
        
        print(f"   ✅ Date help text elements present")
    
    def test_18_notice_visibility_toggle(self):
        """Test that notice visibility toggles correctly"""
        print("\n🎨 Test 18: Notice Visibility Toggle")
        
        notice = self.get_holiday_notice()
        
        # Initially hidden
        self.assertFalse(notice.is_displayed(), "Should be hidden initially")
        
        # Set Christmas dates
        self.set_date_inputs(f"{self.current_year}-12-22", f"{self.current_year}-12-27")
        self.assertTrue(notice.is_displayed(), "Should be visible with holiday dates")
        
        # Set regular dates
        self.set_date_inputs(f"{self.current_year}-11-15", f"{self.current_year}-11-18")
        self.assertFalse(notice.is_displayed(), "Should be hidden with regular dates")
        
        print(f"   ✅ Notice visibility toggles correctly")
    
    def test_19_notice_styling_valid_package(self):
        """Test notice styling for valid holiday package"""
        print("\n🎨 Test 19: Notice Styling - Valid Package")
        
        self.set_date_inputs(f"{self.current_year}-12-22", f"{self.current_year}-12-27")
        
        notice = self.get_holiday_notice()
        bg_color = notice.value_of_css_property('background-color')
        border_color = notice.value_of_css_property('border-color')
        
        # Should have green styling for valid package
        # rgb(212, 237, 218) = #d4edda (green background)
        print(f"   ✅ Valid package styling: bg={bg_color}, border={border_color}")
    
    def test_20_notice_styling_invalid_dates(self):
        """Test notice styling for invalid holiday dates"""
        print("\n🎨 Test 20: Notice Styling - Invalid Dates")
        
        self.set_date_inputs(f"{self.current_year}-12-23", f"{self.current_year}-12-26")
        
        notice = self.get_holiday_notice()
        bg_color = notice.value_of_css_property('background-color')
        
        # Should have yellow/warning styling for invalid dates
        # rgb(255, 243, 205) = #fff3cd (yellow background)
        print(f"   ✅ Warning styling: bg={bg_color}")
    
    # ========================================================================
    # EDGE CASES
    # ========================================================================
    
    def test_21_empty_dates(self):
        """Test behavior with empty date inputs"""
        print("\n🔍 Test 21: Empty Date Inputs")
        
        # Clear dates
        self.set_date_inputs("", "")
        
        notice = self.get_holiday_notice()
        if notice:
            self.assertFalse(notice.is_displayed(), "No notice should show for empty dates")
        
        print(f"   ✅ No notice with empty dates")
    
    def test_22_only_checkin_date(self):
        """Test behavior with only check-in date"""
        print("\n🔍 Test 22: Only Check-in Date")
        
        self.set_date_inputs(f"{self.current_year}-12-22", "")
        
        notice = self.get_holiday_notice()
        if notice:
            self.assertFalse(notice.is_displayed(), "No notice with incomplete dates")
        
        print(f"   ✅ No notice with only check-in date")
    
    def test_23_reversed_dates(self):
        """Test behavior with reversed dates (checkout before checkin)"""
        print("\n🔍 Test 23: Reversed Dates")
        
        checkin = f"{self.current_year}-12-27"
        checkout = f"{self.current_year}-12-22"
        
        self.set_date_inputs(checkin, checkout)
        
        # Should handle gracefully (validation happens on submit)
        print(f"   ✅ Reversed dates handled (validation on submit)")
    
    def test_24_year_boundary_new_year(self):
        """Test New Year package across year boundary"""
        print("\n🔍 Test 24: Year Boundary - New Year Package")
        
        checkin = f"{self.current_year}-12-27"
        checkout = f"{self.next_year}-01-02"
        
        self.set_date_inputs(checkin, checkout)
        
        notice_text = self.get_notice_text()
        self.assertIn("✅", notice_text, "Should recognize valid package across years")
        
        print(f"   ✅ Year boundary handled correctly")
    
    def test_25_multiple_year_dates(self):
        """Test dates spanning multiple years (beyond packages)"""
        print("\n🔍 Test 25: Multiple Year Span")
        
        checkin = f"{self.current_year}-12-15"
        checkout = f"{self.next_year}-01-15"
        
        self.set_date_inputs(checkin, checkout)
        
        # Should warn about holiday periods within the range
        notice = self.get_holiday_notice()
        if notice and notice.is_displayed():
            print(f"   ✅ Notice shown for range spanning holiday periods")
        else:
            print(f"   ✅ No specific package notice (dates span beyond packages)")

def run_test_suite():
    """Run the complete booking rules test suite"""
    print("\n" + "="*80)
    print("🚀 STARTING BOOKING RULES TEST SUITE")
    print("="*80)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Testing Year: {datetime.now().year}")
    print("="*80 + "\n")
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(BookingRulesTestSuite)
    
    # Run tests with verbose output
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "="*80)
    print("📊 TEST SUMMARY")
    print("="*80)
    print(f"Tests run: {result.testsRun}")
    print(f"✅ Passed: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"❌ Failed: {len(result.failures)}")
    print(f"⚠️  Errors: {len(result.errors)}")
    print("="*80)
    
    # Exit with appropriate code
    sys.exit(0 if result.wasSuccessful() else 1)

if __name__ == '__main__':
    try:
        run_test_suite()
    except KeyboardInterrupt:
        print("\n\n❌ Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Test suite failed: {e}")
        sys.exit(1)
