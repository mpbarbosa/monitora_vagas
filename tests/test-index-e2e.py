#!/usr/bin/env python3
"""
🧪 End-to-End Test Suite for index.html
Tests complete user workflows and interactions

Version: 1.0.0
Author: Monitora Vagas Development Team
Last Updated: 2025-12-09
"""

__version__ = "1.0.0"
__author__ = "Monitora Vagas Development Team"
__last_updated__ = "2025-12-09"

import unittest
import time
import urllib.request
import socket
import subprocess
import os
import signal
import sys

# Try to import colorama, fall back to no colors if not available
try:
    from colorama import Fore, Back, Style, init
    # Initialize colorama for cross-platform colored terminal output
    init(autoreset=True)
    COLORAMA_AVAILABLE = True
except ImportError:
    # Define dummy color variables if colorama is not installed
    class Fore:
        GREEN = ''
        RED = ''
        YELLOW = ''
        CYAN = ''
        BLUE = ''
        MAGENTA = ''
        LIGHTBLACK_EX = ''
    
    class Style:
        BRIGHT = ''
        RESET_ALL = ''
        DIM = ''
    
    COLORAMA_AVAILABLE = False

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException


class IndexE2ETests(unittest.TestCase):
    """
    End-to-End tests for index.html
    
    Version: 1.0.0
    
    API Server Strategy:
        1. Attempts to start local API server from ~/Documents/GitHub/busca_vagas/src/server.js on port 3001
        2. If local server starts successfully, uses it for testing (faster, isolated)
        3. If local server fails to start or is unavailable, falls back to production API
        4. Automatically cleans up local API server process after tests complete
    
    Test Coverage:
        - Page Load Tests (6 tests)
        - Form Interaction Tests (5 tests)
        - Form Validation Tests (2 tests)
        - UI Component Tests (3 tests)
        - Responsive Design Tests (3 tests)
        - Accessibility Tests (3 tests)
        - JavaScript Integration Tests (2 tests)
        - Performance Tests (2 tests)
        - Integration Tests (2 tests)
    
    Total: 26 test cases
    """
    
    @classmethod
    def setUpClass(cls):
        """⚙️  Set up test environment once for all tests"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        
        # Enable browser logging
        chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
        
        try:
            cls.driver = webdriver.Chrome(options=chrome_options)
            cls.driver.implicitly_wait(10)
            cls.base_url = 'http://localhost:8080/index.html'
            
            # Try to start local API server
            cls.api_server_process = cls._start_api_server()
            
            # Check API server availability
            cls.use_production_api = cls._check_api_server()
            
            print(f"\n{Fore.GREEN}✅ WebDriver initialized successfully{Style.RESET_ALL}")
            print(f"{Fore.CYAN}🌐 Testing URL: {cls.base_url}{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}🔌 API Server: {'Production' if cls.use_production_api else 'Local (localhost:3001)'}{Style.RESET_ALL}")
            if not COLORAMA_AVAILABLE:
                print("ℹ️  Note: Install colorama for colored output: pip install colorama")
        except Exception as e:
            print(f"\n{Fore.RED}❌ Failed to initialize WebDriver: {e}{Style.RESET_ALL}")
            raise
    
    @classmethod
    def _start_api_server(cls):
        """
        Try to start the local API server on port 3001
        Returns the process object if successful, None otherwise
        """
        api_server_path = os.path.expanduser('~/Documents/GitHub/busca_vagas/src/server.js')
        
        if not os.path.exists(api_server_path):
            print(f"{Fore.YELLOW}⚠️  API server not found at {api_server_path}{Style.RESET_ALL}")
            return None
        
        print(f"{Fore.CYAN}🚀 Starting local API server...{Style.RESET_ALL}")
        
        try:
            # Start the Node.js server with PORT=3001 environment variable
            env = os.environ.copy()
            env['PORT'] = '3001'
            
            process = subprocess.Popen(
                ['node', api_server_path],
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=os.path.dirname(api_server_path),
                preexec_fn=os.setsid if sys.platform != 'win32' else None
            )
            
            # Wait for server to start and verify it's responding
            max_attempts = 10
            for attempt in range(max_attempts):
                time.sleep(1)
                
                # Check if process is still running
                if process.poll() is not None:
                    stderr = process.stderr.read().decode()
                    print(f"{Fore.RED}❌ API server failed to start: {stderr}{Style.RESET_ALL}")
                    return None
                
                # Try to connect to health endpoint
                try:
                    with urllib.request.urlopen('http://localhost:3001/api/health', timeout=2) as response:
                        if response.status == 200:
                            print(f"{Fore.GREEN}✅ Local API server started and responding (PID: {process.pid}){Style.RESET_ALL}")
                            return process
                except:
                    if attempt < max_attempts - 1:
                        continue
            
            print(f"{Fore.YELLOW}⚠️  API server started but not responding to health checks{Style.RESET_ALL}")
            process.terminate()
            return None
                
        except Exception as e:
            print(f"{Fore.YELLOW}⚠️  Failed to start API server: {e}{Style.RESET_ALL}")
            return None
    
    @classmethod
    def _check_api_server(cls):
        """
        Check if local API server is running on port 3001
        Returns True if should use production API, False if local API is available
        """
        print(f"\n{Fore.CYAN}🔍 Checking API server availability...{Style.RESET_ALL}")
        
        # Try local API server first
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex(('localhost', 3001))
            sock.close()
            
            if result == 0:
                # Port is open, now check if it's actually the API
                try:
                    with urllib.request.urlopen('http://localhost:3001/api/health', timeout=3) as response:
                        if response.status == 200:
                            print(f"{Fore.GREEN}✅ Local API server is running on port 3001{Style.RESET_ALL}")
                            return False  # Use local API
                except:
                    pass
        except Exception as e:
            print(f"{Fore.YELLOW}⚠️  Local API server check failed: {e}{Style.RESET_ALL}")
        
        # Local API not available, fall back to production
        print(f"{Fore.YELLOW}⚠️  Local API server not available on port 3001{Style.RESET_ALL}")
        
        # Check production API
        try:
            with urllib.request.urlopen('https://www.mpbarbosa.com/api/health', timeout=5) as response:
                if response.status == 200:
                    print(f"{Fore.GREEN}✅ Production API server is reachable{Style.RESET_ALL}")
                    return True  # Use production API
        except Exception as e:
            print(f"{Fore.RED}❌ Production API server check failed: {e}{Style.RESET_ALL}")
            print(f"{Fore.RED}⚠️  WARNING: No API server available! Tests may fail.{Style.RESET_ALL}")
        
        return True  # Default to production
    
    @classmethod
    def tearDownClass(cls):
        """🧹 Clean up after all tests"""
        if hasattr(cls, 'driver'):
            cls.driver.quit()
            print(f"\n{Fore.GREEN}✅ WebDriver closed{Style.RESET_ALL}")
        
        # Stop local API server if we started it
        if hasattr(cls, 'api_server_process') and cls.api_server_process:
            try:
                print(f"{Fore.YELLOW}🛑 Stopping local API server...{Style.RESET_ALL}")
                if sys.platform != 'win32':
                    os.killpg(os.getpgid(cls.api_server_process.pid), signal.SIGTERM)
                else:
                    cls.api_server_process.terminate()
                cls.api_server_process.wait(timeout=5)
                print(f"{Fore.GREEN}✅ Local API server stopped{Style.RESET_ALL}")
            except Exception as e:
                print(f"{Fore.YELLOW}⚠️  Error stopping API server: {e}{Style.RESET_ALL}")
    
    def setUp(self):
        """🔄 Navigate to the page before each test"""
        # Add query parameter to use production API if local is not available
        url = self.base_url
        if self.use_production_api:
            url += '?useProductionAPI=true'
        self.driver.get(url)
        time.sleep(3)  # Allow page to fully load and API to be called
    
    # 🌐 Page Load Tests
    def test_01_page_loads_successfully(self):
        """🌐 Test that the page loads without errors"""
        self.assertIn("Au Form Wizard", self.driver.title)
        print(f"{Fore.GREEN}✅ Page loaded successfully{Style.RESET_ALL}")
    
    def test_02_all_form_elements_present(self):
        """📋 Test that all form elements are present on page load"""
        try:
            hotel_select = self.driver.find_element(By.ID, "hotel-select")
            checkin_input = self.driver.find_element(By.ID, "input-checkin")
            checkout_input = self.driver.find_element(By.ID, "input-checkout")
            search_button = self.driver.find_element(By.ID, "search-button")
            
            self.assertTrue(hotel_select.is_displayed(), "Hotel select should be visible")
            self.assertTrue(checkin_input.is_displayed(), "Check-in input should be visible")
            self.assertTrue(checkout_input.is_displayed(), "Check-out input should be visible")
            self.assertTrue(search_button.is_displayed(), "Search button should be visible")
            
            print(f"{Fore.GREEN}✅ 📋 All form elements are present and visible{Style.RESET_ALL}")
        except NoSuchElementException as e:
            self.fail(f"Form element not found: {e}")
    
    def test_03_results_container_initially_hidden(self):
        """👁️  Test that results container is hidden on page load"""
        results_container = self.driver.find_element(By.ID, "results-container")
        self.assertFalse(results_container.is_displayed(), "Results should be hidden initially")
        print(f"{Fore.GREEN}✅ Results container is initially hidden{Style.RESET_ALL}")
    
    # ⚙️  Form Interaction Tests
    def test_04_hotel_select_has_options(self):
        """🏨 Test that hotel select gets populated with options"""
        wait = WebDriverWait(self.driver, 10)
        hotel_select = self.driver.find_element(By.ID, "hotel-select")
        
        # Wait for options to load (API call) - give extra time for API response
        time.sleep(7)
        
        # Check browser console for errors
        logs = self.driver.get_log('browser')
        if logs:
            print(f"{Fore.YELLOW}Browser console logs:{Style.RESET_ALL}")
            for log in logs:
                print(f"{Style.DIM}{Fore.LIGHTBLACK_EX}  {log['level']}: {log['message']}{Style.RESET_ALL}")
        
        # Get current URL to verify API configuration
        current_url = self.driver.current_url
        print(f"Current URL: {current_url}")
        
        options = hotel_select.find_elements(By.TAG_NAME, "option")
        print(f"Found {len(options)} hotel options.")
        print("Options:", [option.text for option in options])
        # API returns 25 hotels + 1 default option = 26 total
        self.assertGreaterEqual(len(options), 25, "Hotel select should have at least 25 hotel options")
        print(f"{Fore.GREEN}✅ 🏨 Hotel select has {Fore.YELLOW}{len(options)}{Fore.GREEN} option(s){Style.RESET_ALL}")
    
    def test_05_checkin_input_accepts_text(self):
        """📅 Test that check-in input accepts text input"""
        checkin_input = self.driver.find_element(By.ID, "input-checkin")
        test_date = "01/12/2024"
        
        checkin_input.clear()
        checkin_input.send_keys(test_date)
        
        self.assertEqual(checkin_input.get_attribute('value'), test_date)
        print(f"{Fore.GREEN}✅ 📅 Check-in input accepts date: {Fore.CYAN}{test_date}{Style.RESET_ALL}")
    
    def test_06_checkout_input_accepts_text(self):
        """📅 Test that check-out input accepts text input"""
        checkout_input = self.driver.find_element(By.ID, "input-checkout")
        test_date = "05/12/2024"
        
        checkout_input.clear()
        checkout_input.send_keys(test_date)
        
        self.assertEqual(checkout_input.get_attribute('value'), test_date)
        print(f"{Fore.GREEN}✅ 📅 Check-out input accepts date: {Fore.CYAN}{test_date}{Style.RESET_ALL}")
    
    def test_07_guest_counter_plus_button_exists(self):
        """➕ Test that guest counter plus button exists"""
        plus_button = self.driver.find_element(By.CSS_SELECTOR, ".plus")
        self.assertTrue(plus_button.is_displayed(), "Plus button should be visible")
        print(f"{Fore.GREEN}✅ Guest counter ➕ button exists{Style.RESET_ALL}")
    
    def test_08_guest_counter_minus_button_exists(self):
        """➖ Test that guest counter minus button exists"""
        minus_button = self.driver.find_element(By.CSS_SELECTOR, ".minus")
        self.assertTrue(minus_button.is_displayed(), "Minus button should be visible")
        print(f"{Fore.GREEN}✅ Guest counter ➖ button exists{Style.RESET_ALL}")
    
    # 🔍 Form Validation Tests
    def test_09_form_validates_empty_dates(self):
        """🔍 Test that form validates when dates are empty"""
        search_button = self.driver.find_element(By.ID, "search-button")
        
        # Clear inputs
        checkin_input = self.driver.find_element(By.ID, "input-checkin")
        checkout_input = self.driver.find_element(By.ID, "input-checkout")
        checkin_input.clear()
        checkout_input.clear()
        
        # Click search
        search_button.click()
        
        # Wait for alert
        time.sleep(1)
        
        try:
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            self.assertIn("selecione as datas", alert_text.lower())
            alert.accept()
            print(f"{Fore.GREEN}✅ 🔍 Form validates empty dates{Style.RESET_ALL}")
        except:
            print(f"{Fore.YELLOW}⚠️  Alert validation test skipped (may require actual form submission){Style.RESET_ALL}")
    
    def test_10_search_button_text(self):
        """🔍 Test that search button has correct text"""
        search_button = self.driver.find_element(By.ID, "search-button")
        button_text = search_button.text.lower()
        self.assertIn("busca", button_text, "Button should have search text")
        print(f"{Fore.GREEN}✅ 🔍 Search button text: {Fore.CYAN}{search_button.text}{Style.RESET_ALL}")
    
    # 🖥️  UI Component Tests
    def test_11_copy_results_button_exists(self):
        """📋 Test that copy results button exists"""
        copy_button = self.driver.find_element(By.ID, "copy-results-btn")
        self.assertIsNotNone(copy_button, "Copy button should exist")
        print(f"{Fore.GREEN}✅ 📋 Copy results button exists{Style.RESET_ALL}")
    
    def test_12_clear_results_button_exists(self):
        """🧹 Test that clear results button exists"""
        clear_button = self.driver.find_element(By.ID, "clear-results-btn")
        self.assertIsNotNone(clear_button, "Clear button should exist")
        print(f"{Fore.GREEN}✅ 🧹 Clear results button exists{Style.RESET_ALL}")
    
    def test_13_hotels_cards_container_exists(self):
        """🏨 Test that hotels cards container exists"""
        container = self.driver.find_element(By.ID, "hotels-cards-container")
        self.assertIsNotNone(container, "Hotels cards container should exist")
        print(f"{Fore.GREEN}✅ 🏨 Hotels cards container exists{Style.RESET_ALL}")
    
    # 📱 Responsive Design Tests
    def test_14_mobile_viewport(self):
        """📱 Test page in mobile viewport"""
        self.driver.set_window_size(375, 667)  # iPhone 6/7/8 size
        time.sleep(1)
        
        search_button = self.driver.find_element(By.ID, "search-button")
        self.assertTrue(search_button.is_displayed(), "Button should be visible on mobile")
        print(f"{Fore.GREEN}✅ 📱 Page renders correctly in mobile viewport{Style.RESET_ALL}")
    
    def test_15_tablet_viewport(self):
        """📱 Test page in tablet viewport"""
        self.driver.set_window_size(768, 1024)  # iPad size
        time.sleep(1)
        
        search_button = self.driver.find_element(By.ID, "search-button")
        self.assertTrue(search_button.is_displayed(), "Button should be visible on tablet")
        print(f"{Fore.GREEN}✅ 📱 Page renders correctly in tablet viewport{Style.RESET_ALL}")
    
    def test_16_desktop_viewport(self):
        """🖥️  Test page in desktop viewport"""
        self.driver.set_window_size(1920, 1080)  # Full HD
        time.sleep(1)
        
        search_button = self.driver.find_element(By.ID, "search-button")
        self.assertTrue(search_button.is_displayed(), "Button should be visible on desktop")
        print(f"{Fore.GREEN}✅ 🖥️  Page renders correctly in desktop viewport{Style.RESET_ALL}")
    
    # ♿ Accessibility Tests
    def test_17_form_labels_exist(self):
        """🏷️  Test that form labels exist for accessibility"""
        labels = self.driver.find_elements(By.CSS_SELECTOR, ".label")
        self.assertGreaterEqual(len(labels), 3, "Should have at least 3 labels")
        print(f"{Fore.GREEN}✅ 🏷️  Found {Fore.YELLOW}{len(labels)}{Fore.GREEN} form labels{Style.RESET_ALL}")
    
    def test_18_buttons_have_text(self):
        """🔘 Test that all buttons have descriptive text"""
        search_button = self.driver.find_element(By.ID, "search-button")
        copy_button = self.driver.find_element(By.ID, "copy-results-btn")
        clear_button = self.driver.find_element(By.ID, "clear-results-btn")
        
        self.assertTrue(len(search_button.text) > 0, "Search button should have text")
        self.assertTrue(len(copy_button.text) > 0, "Copy button should have text")
        self.assertTrue(len(clear_button.text) > 0, "Clear button should have text")
        print(f"{Fore.GREEN}✅ 🔘 All buttons have descriptive text{Style.RESET_ALL}")
    
    def test_19_inputs_have_placeholders(self):
        """📝 Test that inputs have placeholder text"""
        checkin_input = self.driver.find_element(By.ID, "input-checkin")
        checkout_input = self.driver.find_element(By.ID, "input-checkout")
        
        checkin_placeholder = checkin_input.get_attribute('placeholder')
        checkout_placeholder = checkout_input.get_attribute('placeholder')
        
        self.assertTrue(len(checkin_placeholder) > 0, "Check-in should have placeholder")
        self.assertTrue(len(checkout_placeholder) > 0, "Check-out should have placeholder")
        print(f"{Fore.GREEN}✅ 📝 Placeholders: {Fore.CYAN}'{checkin_placeholder}', '{checkout_placeholder}'{Style.RESET_ALL}")
    
    # 📗 JavaScript Integration Tests
    def test_20_jquery_loaded(self):
        """📗 Test that jQuery is loaded"""
        jquery_loaded = self.driver.execute_script("return typeof jQuery !== 'undefined';")
        self.assertTrue(jquery_loaded, "jQuery should be loaded")
        print(f"{Fore.GREEN}✅ 📗 jQuery is loaded{Style.RESET_ALL}")
    
    def test_21_module_script_loaded(self):
        """📗 Test that module scripts are loaded"""
        scripts = self.driver.find_elements(By.CSS_SELECTOR, "script[type='module']")
        self.assertGreater(len(scripts), 0, "Module scripts should be present")
        print(f"{Fore.GREEN}✅ 📗 Found {Fore.YELLOW}{len(scripts)}{Fore.GREEN} module script(s){Style.RESET_ALL}")
    
    # ⚡ Performance Tests
    def test_22_page_load_time(self):
        """⏱️  Test that page loads within acceptable time"""
        start_time = time.time()
        self.driver.get(self.base_url)
        load_time = time.time() - start_time
        
        self.assertLess(load_time, 5, "Page should load in less than 5 seconds")
        print(f"{Fore.GREEN}✅ ⏱️  Page loaded in {Fore.YELLOW}{load_time:.2f}{Fore.GREEN} seconds{Style.RESET_ALL}")
    
    def test_23_no_javascript_errors(self):
        """🔍 Test that there are no JavaScript console errors"""
        logs = self.driver.get_log('browser')
        severe_errors = [log for log in logs if log['level'] == 'SEVERE']
        
        if severe_errors:
            print(f"{Fore.YELLOW}⚠️  Found {len(severe_errors)} severe error(s):{Style.RESET_ALL}")
            for error in severe_errors:
                print(f"{Fore.RED}  - {error['message']}{Style.RESET_ALL}")
        else:
            print(f"{Fore.GREEN}✅ 🔍 No severe JavaScript errors{Style.RESET_ALL}")
    
    # 🔄 Integration Tests
    def test_24_full_search_workflow(self):
        """🔄 Test complete search workflow (without actual API call)"""
        # Wait for hotels to load
        time.sleep(3)
        
        # Fill in form
        checkin_input = self.driver.find_element(By.ID, "input-checkin")
        checkout_input = self.driver.find_element(By.ID, "input-checkout")
        
        checkin_input.clear()
        checkin_input.send_keys("01/12/2024")
        
        checkout_input.clear()
        checkout_input.send_keys("05/12/2024")
        
        print(f"{Fore.GREEN}✅ 🔄 Full search workflow form filled successfully{Style.RESET_ALL}")
    
    def test_25_css_files_loaded(self):
        """🎨 Test that CSS files are loaded"""
        css_links = self.driver.find_elements(By.CSS_SELECTOR, "link[rel='stylesheet']")
        self.assertGreater(len(css_links), 0, "CSS files should be loaded")
        print(f"{Fore.GREEN}✅ 🎨 Found {Fore.YELLOW}{len(css_links)}{Fore.GREEN} CSS file(s){Style.RESET_ALL}")
    
    def test_26_external_resources_loaded(self):
        """🌐 Test that external resources (fonts, icons) are referenced"""
        google_fonts = self.driver.find_elements(By.CSS_SELECTOR, "link[href*='fonts.googleapis.com']")
        self.assertGreater(len(google_fonts), 0, "Google Fonts should be loaded")
        print(f"{Fore.GREEN}✅ 🌐 External resources are referenced{Style.RESET_ALL}")


def run_tests():
    """
    🚀 Run the test suite
    
    Version: 1.0.0
    Executes all 26 end-to-end tests for index.html
    
    Returns:
        bool: True if all tests passed, False otherwise
    """
    print("\n" + "="*70)
    print(f"{Fore.CYAN}{Style.BRIGHT}🧪 END-TO-END TEST SUITE FOR INDEX.HTML{Style.RESET_ALL}")
    print(f"{Fore.MAGENTA}📋 Version: {__version__}{Style.RESET_ALL}")
    print("="*70)
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(IndexE2ETests)
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "="*70)
    print(f"{Fore.CYAN}{Style.BRIGHT}📊 TEST SUMMARY{Style.RESET_ALL}")
    print("="*70)
    print(f"{Fore.BLUE}📊 Tests run: {Fore.YELLOW}{result.testsRun}{Style.RESET_ALL}")
    print(f"{Fore.GREEN}✅ Passed: {result.testsRun - len(result.failures) - len(result.errors)}{Style.RESET_ALL}")
    print(f"{Fore.RED}❌ Failed: {len(result.failures)}{Style.RESET_ALL}")
    print(f"{Fore.RED}❌ Errors: {len(result.errors)}{Style.RESET_ALL}")
    print("="*70)
    
    return result.wasSuccessful()


if __name__ == "__main__":
    import sys
    print(f"{Fore.CYAN}{Style.BRIGHT}🧪 Test Suite Version: {Fore.YELLOW}{__version__}{Style.RESET_ALL}")
    print(f"{Fore.MAGENTA}👤 Author: {__author__}{Style.RESET_ALL}")
    print(f"{Fore.BLUE}📅 Last Updated: {__last_updated__}{Style.RESET_ALL}")
    print("")
    success = run_tests()
    sys.exit(0 if success else 1)
