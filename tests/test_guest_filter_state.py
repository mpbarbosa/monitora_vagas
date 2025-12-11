#!/usr/bin/env python3
"""
Test Suite for FR-004A: Guest Filter State Management
Tests the disabled/enabled state of the guest filter card
"""

import sys
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
import http.server
import socketserver
import threading
import socket

class GuestFilterStateTest:
    """Test suite for Guest Filter State Management (FR-004A)"""
    
    def __init__(self):
        self.setup_local_server()
        self.setup_webdriver()
        self.test_results = []
    
    def setup_local_server(self):
        """Start a local HTTP server"""
        self.server_port = self.find_free_port()
        self.base_url = f"http://localhost:{self.server_port}"
        
        project_root = Path(__file__).parent.parent
        public_dir = project_root / "public"
        
        print(f"Starting server on port {self.server_port}")
        print(f"Serving from: {public_dir}")
        
        class Handler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, directory=str(public_dir), **kwargs)
            
            def log_message(self, format, *args):
                pass  # Suppress server logs
        
        self.httpd = socketserver.TCPServer(("", self.server_port), Handler)
        self.server_thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.server_thread.start()
        time.sleep(1)
        print(f"✓ Server started at {self.base_url}\n")
    
    def setup_webdriver(self):
        """Configure Chrome WebDriver"""
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--headless")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(5)
        self.wait = WebDriverWait(self.driver, 10)
    
    def find_free_port(self):
        """Find an available port"""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('', 0))
            s.listen(1)
            port = s.getsockname()[1]
        return port
    
    def log_test(self, name, passed, message=""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        self.test_results.append((name, passed, message))
        print(f"{status}: {name}")
        if message:
            print(f"    {message}")
    
    def test_01_guest_filter_exists(self):
        """Test that guest filter card exists with correct ID"""
        print("\n--- Test 1: Guest Filter Card Existence ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            guest_filter = self.driver.find_element(By.ID, "guest-filter-card")
            self.log_test("Guest filter card exists", True, f"Found element with ID 'guest-filter-card'")
            return True
        except Exception as e:
            self.log_test("Guest filter card exists", False, f"Error: {e}")
            return False
    
    def test_02_initial_disabled_state(self):
        """Test AC-004A.1: Filter is disabled on page load"""
        print("\n--- Test 2: Initial Disabled State (AC-004A.1) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            guest_filter = self.driver.find_element(By.ID, "guest-filter-card")
            
            # Check for disabled class
            classes = guest_filter.get_attribute('class')
            has_disabled_class = 'filter-disabled' in classes
            self.log_test("Has 'filter-disabled' class", has_disabled_class, f"Classes: {classes}")
            
            # Check aria-disabled attribute
            aria_disabled = guest_filter.get_attribute('aria-disabled')
            is_aria_disabled = aria_disabled == 'true'
            self.log_test("Has aria-disabled='true'", is_aria_disabled, f"aria-disabled: {aria_disabled}")
            
            # Check opacity
            opacity = self.driver.execute_script(
                "return window.getComputedStyle(arguments[0]).opacity;", guest_filter
            )
            has_reduced_opacity = float(opacity) < 1.0
            self.log_test("Has reduced opacity", has_reduced_opacity, f"Opacity: {opacity}")
            
            return has_disabled_class and is_aria_disabled
        except Exception as e:
            self.log_test("Initial disabled state check", False, f"Error: {e}")
            return False
    
    def test_03_interaction_blocked_when_disabled(self):
        """Test AC-004A.2: Disabled state prevents interaction"""
        print("\n--- Test 3: Interaction Blocked When Disabled (AC-004A.2) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            guest_filter = self.driver.find_element(By.ID, "guest-filter-card")
            plus_btn = guest_filter.find_element(By.CLASS_NAME, "plus")
            
            # Get initial value
            input_field = guest_filter.find_element(By.CLASS_NAME, "quantity")
            initial_value = input_field.get_attribute('value')
            
            # Try to click plus button
            plus_btn.click()
            time.sleep(0.5)
            
            # Check if value changed
            new_value = input_field.get_attribute('value')
            interaction_blocked = (new_value == initial_value)
            
            self.log_test("Interaction blocked when disabled", interaction_blocked, 
                         f"Initial: {initial_value}, After click: {new_value}")
            
            # Check readonly attribute
            is_readonly = input_field.get_attribute('readonly') is not None
            self.log_test("Input has readonly attribute", is_readonly)
            
            return interaction_blocked
        except Exception as e:
            self.log_test("Interaction blocked check", False, f"Error: {e}")
            return False
    
    def test_04_visual_indication_disabled(self):
        """Test AC-004A.3: Visual indication of disabled state"""
        print("\n--- Test 4: Visual Indication of Disabled State (AC-004A.3) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            guest_filter = self.driver.find_element(By.ID, "guest-filter-card")
            
            # Check opacity
            opacity = float(self.driver.execute_script(
                "return window.getComputedStyle(arguments[0]).opacity;", guest_filter
            ))
            
            # Check pointer-events
            pointer_events = self.driver.execute_script(
                "return window.getComputedStyle(arguments[0]).pointerEvents;", guest_filter
            )
            
            # Check background or overlay
            has_visual_indication = opacity < 1.0 or pointer_events == 'none'
            
            self.log_test("Visual indication present", has_visual_indication, 
                         f"Opacity: {opacity}, Pointer-events: {pointer_events}")
            
            return has_visual_indication
        except Exception as e:
            self.log_test("Visual indication check", False, f"Error: {e}")
            return False
    
    def test_05_enabled_after_search(self):
        """Test AC-004A.4: Filter enabled after search completion"""
        print("\n--- Test 5: Enabled After Search Completion (AC-004A.4) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            # Fill in search form
            hotel_select = self.driver.find_element(By.ID, "hotel-select")
            time.sleep(2)  # Wait for hotels to load
            
            # Select first available hotel
            options = hotel_select.find_elements(By.TAG_NAME, "option")
            if len(options) > 1:
                options[1].click()
            
            # Fill dates
            checkin_input = self.driver.find_element(By.ID, "input-checkin")
            checkout_input = self.driver.find_element(By.ID, "input-checkout")
            
            checkin_input.send_keys("2025-12-15")
            checkout_input.send_keys("2025-12-17")
            
            # Submit search
            search_button = self.driver.find_element(By.ID, "search-button")
            search_button.click()
            
            # Wait for search to complete (max 15 seconds)
            time.sleep(5)
            
            # Check if guest filter is now enabled
            guest_filter = self.driver.find_element(By.ID, "guest-filter-card")
            
            classes = guest_filter.get_attribute('class')
            has_enabled_class = 'filter-enabled' in classes
            
            aria_disabled = guest_filter.get_attribute('aria-disabled')
            is_aria_enabled = aria_disabled == 'false'
            
            self.log_test("Has 'filter-enabled' class after search", has_enabled_class, 
                         f"Classes: {classes}")
            self.log_test("Has aria-disabled='false' after search", is_aria_enabled, 
                         f"aria-disabled: {aria_disabled}")
            
            return has_enabled_class and is_aria_enabled
        except Exception as e:
            self.log_test("Enabled after search check", False, f"Error: {e}")
            return False
    
    def test_06_interaction_allowed_when_enabled(self):
        """Test AC-004A.5: Enabled state allows interaction"""
        print("\n--- Test 6: Interaction Allowed When Enabled (AC-004A.5) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            # Manually enable the filter (simulating search completion)
            self.driver.execute_script("""
                if (window.GuestFilterStateManager) {
                    window.GuestFilterStateManager.enable();
                }
            """)
            time.sleep(0.5)
            
            guest_filter = self.driver.find_element(By.ID, "guest-filter-card")
            plus_btn = guest_filter.find_element(By.CLASS_NAME, "plus")
            
            # Get initial value
            input_field = guest_filter.find_element(By.CLASS_NAME, "quantity")
            initial_value = input_field.get_attribute('value')
            
            # Click plus button
            plus_btn.click()
            time.sleep(0.5)
            
            # Check if value changed
            new_value = input_field.get_attribute('value')
            interaction_allowed = (new_value != initial_value)
            
            self.log_test("Interaction allowed when enabled", interaction_allowed, 
                         f"Initial: {initial_value}, After click: {new_value}")
            
            return interaction_allowed
        except Exception as e:
            self.log_test("Interaction allowed check", False, f"Error: {e}")
            return False
    
    def test_07_state_persistence(self):
        """Test AC-004A.7: State persists after being enabled"""
        print("\n--- Test 7: State Persistence (AC-004A.7) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            # Enable the filter
            self.driver.execute_script("""
                if (window.GuestFilterStateManager) {
                    window.GuestFilterStateManager.enable();
                }
            """)
            time.sleep(0.5)
            
            # Check if still enabled after some time
            time.sleep(2)
            
            guest_filter = self.driver.find_element(By.ID, "guest-filter-card")
            classes = guest_filter.get_attribute('class')
            still_enabled = 'filter-enabled' in classes
            
            self.log_test("State persists after enablement", still_enabled, 
                         f"Classes: {classes}")
            
            return still_enabled
        except Exception as e:
            self.log_test("State persistence check", False, f"Error: {e}")
            return False
    
    def run_all_tests(self):
        """Run all test cases"""
        print("="*70)
        print("FR-004A: Guest Filter State Management Test Suite")
        print("="*70)
        
        tests = [
            self.test_01_guest_filter_exists,
            self.test_02_initial_disabled_state,
            self.test_03_interaction_blocked_when_disabled,
            self.test_04_visual_indication_disabled,
            self.test_05_enabled_after_search,
            self.test_06_interaction_allowed_when_enabled,
            self.test_07_state_persistence,
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ Test failed with exception: {e}")
        
        # Print summary
        print("\n" + "="*70)
        print("Test Summary")
        print("="*70)
        
        passed = sum(1 for _, result, _ in self.test_results if result)
        total = len(self.test_results)
        
        print(f"\nTests Run: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Pass Rate: {(passed/total*100):.1f}%")
        
        print("\nDetailed Results:")
        for name, result, message in self.test_results:
            status = "✅" if result else "❌"
            print(f"{status} {name}")
            if message and not result:
                print(f"   {message}")
        
        print("\n" + "="*70)
        
        return passed == total
    
    def cleanup(self):
        """Clean up resources"""
        if hasattr(self, 'driver'):
            self.driver.quit()
        if hasattr(self, 'httpd'):
            self.httpd.shutdown()

def main():
    """Main test execution"""
    test_suite = GuestFilterStateTest()
    
    try:
        success = test_suite.run_all_tests()
        test_suite.cleanup()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        test_suite.cleanup()
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        test_suite.cleanup()
        sys.exit(1)

if __name__ == "__main__":
    main()
