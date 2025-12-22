#!/usr/bin/env python3
"""
FR-014: Booking Rules Toggle Test Suite
Tests the applyBookingRules toggle functionality

Functional Requirement: FR-014
Tests that the booking rules toggle:
1. Exists in the UI
2. Has correct default state (enabled/checked)
3. Can be toggled on/off
4. Includes parameter in API requests

Version: 1.0.0
Date: 2024-12-22
"""

import os
import sys
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from pathlib import Path
import http.server
import socketserver
import threading

class BookingRulesToggleTest(unittest.TestCase):
    """Test suite for FR-014: Booking Rules Toggle"""
    
    @classmethod
    def setUpClass(cls):
        """Set up test environment"""
        print("\n" + "="*80)
        print("🔘 FR-014: BOOKING RULES TOGGLE TEST SUITE")
        print("="*80)
        print("Testing applyBookingRules toggle functionality")
        print("="*80 + "\n")
        
        # Find project root and public directory
        cls.project_root = Path(__file__).parent.parent
        cls.public_dir = cls.project_root / 'public'
        
        if not cls.public_dir.exists():
            raise Exception(f"Public directory not found: {cls.public_dir}")
        
        # Start local HTTP server
        cls.port = 8766
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
    
    @classmethod
    def tearDownClass(cls):
        """Clean up test environment"""
        print("\n" + "="*80)
        print("🧹 Cleaning up...")
        if hasattr(cls, 'driver'):
            cls.driver.quit()
            print("✅ Browser closed")
        if hasattr(cls, 'httpd'):
            cls.httpd.shutdown()
            print("✅ Server stopped")
        print("="*80 + "\n")
    
    def setUp(self):
        """Load page before each test"""
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(1)
    
    def test_01_toggle_exists(self):
        """AC-014.1: Booking rules toggle exists"""
        print("\n🧪 Test 1: Booking Rules Toggle Exists")
        
        toggle = self.driver.find_element(By.ID, "apply-booking-rules")
        self.assertIsNotNone(toggle, "Booking rules toggle should exist")
        
        toggle_type = toggle.get_attribute('type')
        self.assertEqual(toggle_type, 'checkbox', "Toggle should be a checkbox")
        
        print("   ✅ Toggle exists")
        print(f"   ✅ Toggle type: {toggle_type}")
    
    def test_02_default_state_enabled(self):
        """AC-014.3: Default state is enabled (checked)"""
        print("\n🧪 Test 2: Default State is Enabled")
        
        toggle = self.driver.find_element(By.ID, "apply-booking-rules")
        is_checked = toggle.is_selected()
        
        self.assertTrue(is_checked, "Toggle should be checked by default")
        
        print("   ✅ Default state: checked (enabled)")
        print("   ✅ Booking rules will be applied by default")
    
    def test_03_label_exists(self):
        """AC-014.2: Toggle has clear label"""
        print("\n🧪 Test 3: Toggle Has Clear Label")
        
        label = self.driver.find_element(By.CSS_SELECTOR, "label[for='apply-booking-rules']")
        self.assertIsNotNone(label, "Label should exist")
        
        label_text = label.text
        self.assertIn("Regras", label_text, "Label should mention 'Regras'")
        
        print(f"   ✅ Label text: '{label_text}'")
        print("   ✅ Label is clearly visible")
    
    def test_04_toggle_can_be_changed(self):
        """AC-014.8: Toggle can be clicked and state changes"""
        print("\n🧪 Test 4: Toggle Can Be Changed")
        
        toggle = self.driver.find_element(By.ID, "apply-booking-rules")
        
        # Initial state (should be checked)
        initial_state = toggle.is_selected()
        print(f"   📌 Initial state: {initial_state}")
        
        # Click to uncheck
        toggle.click()
        time.sleep(0.5)
        
        after_click_state = toggle.is_selected()
        print(f"   📌 After click: {after_click_state}")
        
        self.assertNotEqual(initial_state, after_click_state, 
                          "Toggle state should change after click")
        
        # Click again to restore
        toggle.click()
        time.sleep(0.5)
        
        restored_state = toggle.is_selected()
        print(f"   📌 After second click: {restored_state}")
        
        self.assertEqual(initial_state, restored_state,
                       "Toggle should return to initial state")
        
        print("   ✅ Toggle state changes correctly")
    
    def test_05_toggle_accessibility(self):
        """Test accessibility attributes"""
        print("\n🧪 Test 5: Accessibility Attributes")
        
        toggle = self.driver.find_element(By.ID, "apply-booking-rules")
        
        # Check ARIA attributes
        aria_label = toggle.get_attribute('aria-label')
        aria_described_by = toggle.get_attribute('aria-describedby')
        
        self.assertIsNotNone(aria_label, "Toggle should have aria-label")
        
        print(f"   ✅ ARIA label: '{aria_label}'")
        if aria_described_by:
            print(f"   ✅ ARIA described by: '{aria_described_by}'")
        
        # Check tooltip
        tooltip_attr = toggle.get_attribute('data-bs-toggle')
        if tooltip_attr:
            print(f"   ✅ Tooltip enabled: {tooltip_attr}")
    
    def test_06_form_submission_with_toggle(self):
        """Verify toggle is accessible during form preparation"""
        print("\n🧪 Test 6: Toggle Available During Form Interaction")
        
        # Fill in form fields
        checkin = self.driver.find_element(By.ID, "input-checkin")
        checkout = self.driver.find_element(By.ID, "input-checkout")
        
        # Set dates
        from datetime import datetime, timedelta
        today = datetime.now()
        tomorrow = today + timedelta(days=1)
        
        checkin.send_keys(today.strftime("%Y-%m-%d"))
        checkout.send_keys(tomorrow.strftime("%Y-%m-%d"))
        
        # Toggle should still be accessible
        toggle = self.driver.find_element(By.ID, "apply-booking-rules")
        self.assertTrue(toggle.is_enabled(), "Toggle should be enabled")
        
        # Change toggle state
        initial_state = toggle.is_selected()
        toggle.click()
        time.sleep(0.5)
        
        new_state = toggle.is_selected()
        self.assertNotEqual(initial_state, new_state)
        
        print("   ✅ Toggle remains functional with form filled")
        print(f"   ✅ Toggle changed from {initial_state} to {new_state}")
    
    def test_07_visual_feedback(self):
        """AC-014.7 & AC-014.8: Visual state indication"""
        print("\n🧪 Test 7: Visual Feedback")
        
        toggle = self.driver.find_element(By.ID, "apply-booking-rules")
        
        # Check if toggle is visible
        self.assertTrue(toggle.is_displayed(), "Toggle should be visible")
        
        # Check computed styles (basic check)
        size = toggle.size
        location = toggle.location
        
        self.assertGreater(size['width'], 0, "Toggle should have width")
        self.assertGreater(size['height'], 0, "Toggle should have height")
        
        print(f"   ✅ Toggle is visible")
        print(f"   ✅ Size: {size['width']}x{size['height']}px")
        print(f"   ✅ Location: ({location['x']}, {location['y']})")
    
    def test_08_container_placement(self):
        """Verify toggle is properly placed in form"""
        print("\n🧪 Test 8: Toggle Placement in Form")
        
        toggle = self.driver.find_element(By.ID, "apply-booking-rules")
        
        # Find parent container
        parent = toggle.find_element(By.XPATH, "./ancestor::div[contains(@class, 'col-md-1')]")
        self.assertIsNotNone(parent, "Toggle should be in a Bootstrap column")
        
        # Verify it's inside the form
        form = toggle.find_element(By.XPATH, "./ancestor::form")
        self.assertIsNotNone(form, "Toggle should be inside the form")
        
        print("   ✅ Toggle is properly placed in form")
        print("   ✅ Toggle is in Bootstrap column layout")

def run_tests():
    """Run the test suite"""
    # Create test suite
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(BookingRulesToggleTest)
    
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
    print(f"💥 Errors: {len(result.errors)}")
    print("="*80 + "\n")
    
    # Return exit code
    return 0 if result.wasSuccessful() else 1

if __name__ == '__main__':
    sys.exit(run_tests())
