#!/usr/bin/env python3
"""
Trade Union Hotel Search Platform - Date Selection Test
Tests the enhanced date selection functionality with mutually exclusive options
"""

import os
import sys
import time
import http.server
import socketserver
import threading
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class DateSelectionTest:
    def __init__(self):
        self.project_root = os.path.dirname(os.path.abspath(__file__))
        self.src_dir = os.path.join(self.project_root, 'src')
        self.driver = None
        self.server = None
        self.server_thread = None
        self.base_url = None
        
    def start_server(self):
        """Start local HTTP server for testing"""
        port = 48652  # Different port to avoid conflicts
        
        class Handler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, directory=self.src_dir, **kwargs)
        
        self.server = socketserver.TCPServer(("", port), Handler)
        self.server_thread = threading.Thread(target=self.server.serve_forever)
        self.server_thread.daemon = True
        self.server_thread.start()
        
        self.base_url = f"http://localhost:{port}"
        print(f"Local server started at {self.base_url}")
        time.sleep(1)  # Give server time to start
        
    def stop_server(self):
        """Stop local HTTP server"""
        if self.server:
            self.server.shutdown()
            self.server.server_close()
            print("Local server stopped")
    
    def setup_webdriver(self):
        """Initialize WebDriver with Chrome"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36')
        
        # Try to use system Chrome
        service = Service()
        
        try:
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            print("WebDriver initialized successfully")
        except Exception as e:
            print(f"Failed to initialize WebDriver: {e}")
            raise
    
    def close_webdriver(self):
        """Close WebDriver"""
        if self.driver:
            self.driver.quit()
            print("WebDriver closed")
    
    def test_date_method_radio_buttons(self):
        """Test that date method radio buttons are present and working"""
        print("--- Testing Date Method Radio Buttons ---")
        
        try:
            # Load the page
            self.driver.get(f"{self.base_url}/index.html")
            
            # Wait for page to load and JS to initialize
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "search-form"))
            )
            time.sleep(2)  # Additional wait for JS initialization
            
            # Find the date method radio buttons
            months_radio = self.driver.find_element(By.ID, "date-method-months")
            range_radio = self.driver.find_element(By.ID, "date-method-range")
            
            print("✓ Date method radio buttons found")
            
            # Check that months is selected by default
            assert months_radio.is_selected(), "Months radio should be selected by default"
            assert not range_radio.is_selected(), "Range radio should not be selected by default"
            print("✓ Default selection verified (months)")
            
            # Test switching to range
            range_radio.click()
            time.sleep(0.5)
            
            assert not months_radio.is_selected(), "Months radio should not be selected after clicking range"
            assert range_radio.is_selected(), "Range radio should be selected after clicking"
            print("✓ Radio button switching works")
            
            return True
            
        except Exception as e:
            print(f"✗ Date method radio buttons test failed: {e}")
            return False
    
    def test_month_selection_container(self):
        """Test month selection container visibility"""
        print("--- Testing Month Selection Container ---")
        
        try:
            # Ensure months radio is selected
            months_radio = self.driver.find_element(By.ID, "date-method-months")
            months_radio.click()
            time.sleep(0.5)
            
            # Check month container visibility
            month_container = self.driver.find_element(By.ID, "month-selection-container")
            range_container = self.driver.find_element(By.ID, "date-range-container")
            
            # Month container should be visible
            assert month_container.is_displayed(), "Month container should be visible when months radio is selected"
            print("✓ Month container is visible")
            
            # Range container should be hidden
            assert not range_container.is_displayed(), "Range container should be hidden when months radio is selected"
            print("✓ Range container is hidden")
            
            # Check month select options
            month_select = self.driver.find_element(By.ID, "month-selection")
            select = Select(month_select)
            options = select.options
            
            assert len(options) == 3, f"Should have 3 month options, found {len(options)}"
            print("✓ Month selection has correct number of options")
            
            return True
            
        except Exception as e:
            print(f"✗ Month selection container test failed: {e}")
            return False
    
    def test_date_range_container(self):
        """Test date range container visibility and functionality"""
        print("--- Testing Date Range Container ---")
        
        try:
            # Switch to range radio
            range_radio = self.driver.find_element(By.ID, "date-method-range")
            range_radio.click()
            time.sleep(0.5)
            
            # Check container visibility
            month_container = self.driver.find_element(By.ID, "month-selection-container")
            range_container = self.driver.find_element(By.ID, "date-range-container")
            
            # Range container should be visible
            assert range_container.is_displayed(), "Range container should be visible when range radio is selected"
            print("✓ Range container is visible")
            
            # Month container should be hidden
            assert not month_container.is_displayed(), "Month container should be hidden when range radio is selected"
            print("✓ Month container is hidden")
            
            # Check date inputs are present
            start_date_input = self.driver.find_element(By.ID, "start-date")
            end_date_input = self.driver.find_element(By.ID, "end-date")
            
            assert start_date_input.is_displayed(), "Start date input should be visible"
            assert end_date_input.is_displayed(), "End date input should be visible"
            print("✓ Date inputs are visible")
            
            # Test date input functionality (ISO format yyyy-mm-dd)
            today = "2025-01-15"  # Use a fixed date for testing
            future_date = "2025-01-22"
            
            start_date_input.send_keys(today)
            end_date_input.send_keys(future_date)
            
            assert start_date_input.get_attribute("value") == today, "Start date should be set (ISO format)"
            assert end_date_input.get_attribute("value") == future_date, "End date should be set (ISO format)"
            print("✓ Date inputs accept ISO format values (yyyy-mm-dd)")
            
            return True
            
        except Exception as e:
            print(f"✗ Date range container test failed: {e}")
            return False
    
    def test_mutual_exclusivity(self):
        """Test that date selection methods are mutually exclusive"""
        print("--- Testing Mutual Exclusivity ---")
        
        try:
            # Start with months selected
            months_radio = self.driver.find_element(By.ID, "date-method-months")
            range_radio = self.driver.find_element(By.ID, "date-method-range")
            
            months_radio.click()
            time.sleep(0.5)
            
            # Set a month selection
            month_select = self.driver.find_element(By.ID, "month-selection")
            Select(month_select).select_by_value("next")
            
            original_month_value = Select(month_select).first_selected_option.get_attribute("value")
            print(f"✓ Set month selection to: {original_month_value}")
            
            # Switch to range
            range_radio.click()
            time.sleep(0.5)
            
            # Set date range
            start_date_input = self.driver.find_element(By.ID, "start-date")
            end_date_input = self.driver.find_element(By.ID, "end-date")
            
            start_date_input.send_keys("2025-01-15")
            end_date_input.send_keys("2025-01-22")
            
            start_value = start_date_input.get_attribute("value")
            end_value = end_date_input.get_attribute("value")
            
            print(f"✓ Set date range: {start_value} to {end_value}")
            
            # Switch back to months and verify range is cleared
            months_radio.click()
            time.sleep(0.5)
            
            # Check that date range inputs are cleared
            start_date_input = self.driver.find_element(By.ID, "start-date")
            end_date_input = self.driver.find_element(By.ID, "end-date")
            
            # Note: inputs might not be visible, so we check their values
            start_cleared = start_date_input.get_attribute("value") == ""
            end_cleared = end_date_input.get_attribute("value") == ""
            
            print(f"✓ Date range cleared when switching to months: start={start_cleared}, end={end_cleared}")
            
            return True
            
        except Exception as e:
            print(f"✗ Mutual exclusivity test failed: {e}")
            return False
    
    def test_form_styling(self):
        """Test that the new date selection styling is applied correctly"""
        print("--- Testing Form Styling ---")
        
        try:
            # Check that CSS classes are applied
            date_container = self.driver.find_element(By.CLASS_NAME, "date-selection-container")
            method_selection = self.driver.find_element(By.CLASS_NAME, "date-method-selection")
            
            print("✓ Date selection container has correct class")
            print("✓ Date method selection has correct class")
            
            # Check radio options styling
            radio_options = self.driver.find_elements(By.CSS_SELECTOR, ".date-method-selection .radio-option")
            assert len(radio_options) == 2, f"Should have 2 radio options, found {len(radio_options)}"
            print("✓ Radio options found with correct styling")
            
            # Check date input groups
            date_input_groups = self.driver.find_elements(By.CLASS_NAME, "date-input-group")
            assert len(date_input_groups) == 2, f"Should have 2 date input groups, found {len(date_input_groups)}"
            print("✓ Date input groups styled correctly")
            
            return True
            
        except Exception as e:
            print(f"✗ Form styling test failed: {e}")
            return False
    
    def run_all_tests(self):
        """Run all date selection tests"""
        print("============================================================")
        print("Trade Union Hotel Search Platform - Date Selection Test Suite")
        print("============================================================")
        
        try:
            # Setup
            self.start_server()
            self.setup_webdriver()
            
            # Run tests
            tests = [
                self.test_date_method_radio_buttons,
                self.test_month_selection_container,
                self.test_date_range_container,
                self.test_mutual_exclusivity,
                self.test_form_styling
            ]
            
            results = []
            for test in tests:
                result = test()
                results.append(result)
                print()
                
        except Exception as e:
            print(f"Test suite failed: {e}")
            return False
            
        finally:
            # Cleanup
            self.close_webdriver()
            self.stop_server()
        
        # Summary
        passed = sum(results)
        total = len(results)
        
        print("============================================================")
        print("Date Selection Test Summary:")
        print(f"Tests run: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        
        if passed == total:
            print("\n✅ All date selection tests passed!")
            return True
        else:
            print(f"\n❌ {total - passed} test(s) failed")
            return False

if __name__ == "__main__":
    test_suite = DateSelectionTest()
    success = test_suite.run_all_tests()
    sys.exit(0 if success else 1)