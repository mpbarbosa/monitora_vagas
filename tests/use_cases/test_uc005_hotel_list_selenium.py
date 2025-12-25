#!/usr/bin/env python3
"""
UC-005: Hotel List Browser Verification (Selenium)
Priority: High
Category: UI Integration Testing
Related FR: FR-001, FR-002

Tests hotel list loading and display in the browser using Selenium WebDriver.
Verifies that all 25 hotels are correctly loaded and displayed in the UI.
"""

import unittest
import time
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

try:
    from colorama import Fore, Style, init
    init(autoreset=True)
    COLORAMA_AVAILABLE = True
except ImportError:
    class Fore:
        GREEN = RED = YELLOW = CYAN = BLUE = MAGENTA = ''
    class Style:
        BRIGHT = RESET_ALL = ''
    COLORAMA_AVAILABLE = False


class UC005HotelListSelenium(unittest.TestCase):
    """
    UC-005: Hotel List Browser Verification Test Suite (Selenium)
    
    Validates that hotel list is properly loaded and displayed in browser.
    """
    
    # Expected hotels list
    EXPECTED_HOTELS = [
        "Todas", "Amparo", "Appenzell", "Areado", "Avaré", "Boraceia",
        "Campos do Jordão", "Caraguatatuba", "Fazenda Ibirá", "Guarujá",
        "Itanhaém", "Lindoia", "Maresias", "Monte Verde", "Peruíbe I",
        "Peruíbe II", "Poços de Caldas", "Saha", "São Lourenço", "São Pedro",
        "Serra Negra", "Socorro", "Termas de Ibirá", "Ubatuba", "Unidade Capital"
    ]
    
    @classmethod
    def setUpClass(cls):
        """Set up test environment"""
        print(f"\n{Fore.CYAN}{'='*80}")
        print(f"{Fore.CYAN}{Style.BRIGHT}UC-005: Hotel List Browser Verification (Selenium)")
        print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
        
        # Configure Chrome options
        chrome_options = Options()
        chrome_options.add_argument('--headless=new')  # Use new headless mode
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-software-rasterizer')
        
        # Don't set binary_location - let Selenium find Chrome automatically
        # This works better with system installations
        driver_initialized = False
        
        try:
            cls.driver = webdriver.Chrome(options=chrome_options)
            cls.driver.implicitly_wait(10)
            cls.wait = WebDriverWait(cls.driver, 30)
            print(f"{Fore.GREEN}✓ Chrome driver initialized successfully{Style.RESET_ALL}")
            driver_initialized = True
        except Exception as e:
            error_msg = str(e)
            print(f"{Fore.RED}❌ Failed to initialize Chrome driver{Style.RESET_ALL}")
            
            # Check if it's the binary location issue
            if "no chrome binary" in error_msg.lower():
                print(f"{Fore.YELLOW}💡 Chrome binary issue detected{Style.RESET_ALL}")
                print(f"{Fore.YELLOW}   Trying with chromium-browser...{Style.RESET_ALL}")
                
                # Try with chromium-browser as fallback
                try:
                    chrome_options.binary_location = '/usr/bin/chromium-browser'
                    cls.driver = webdriver.Chrome(options=chrome_options)
                    cls.driver.implicitly_wait(10)
                    cls.wait = WebDriverWait(cls.driver, 30)
                    print(f"{Fore.GREEN}✓ Chrome driver initialized with chromium-browser{Style.RESET_ALL}")
                    driver_initialized = True
                except Exception as e2:
                    print(f"{Fore.RED}❌ Chromium-browser also failed{Style.RESET_ALL}")
            
            if not driver_initialized:
                print(f"{Fore.YELLOW}Error: {str(e)[:200]}{Style.RESET_ALL}")
                print(f"{Fore.YELLOW}💡 Note: Browser testing requires Chrome/Chromium.{Style.RESET_ALL}")
                print(f"{Fore.YELLOW}   Alternative: Run API test - test_hotel_list_verification.py{Style.RESET_ALL}")
                raise
        
        # Determine base URL from environment
        cls.base_url = os.getenv('TEST_BASE_URL', 'http://localhost:8080/public/index.html')
        
        print(f"{Fore.CYAN}Testing URL: {cls.base_url}")
        print(f"{Fore.CYAN}Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
        
        cls.test_results = {
            'total': 0,
            'passed': 0,
            'failed': 0,
            'details': []
        }
    
    @classmethod
    def tearDownClass(cls):
        """Clean up test environment"""
        if hasattr(cls, 'driver') and cls.driver:
            cls.driver.quit()
        
        # Print summary
        print(f"\n{Fore.CYAN}{'='*80}")
        print(f"{Fore.CYAN}TEST SUMMARY")
        print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
        
        print(f"End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        print(f"Total Tests: {cls.test_results['total']}")
        print(f"{Fore.GREEN}Passed: {cls.test_results['passed']}{Style.RESET_ALL}")
        print(f"{Fore.RED}Failed: {cls.test_results['failed']}{Style.RESET_ALL}")
        
        if cls.test_results['total'] > 0:
            pass_rate = (cls.test_results['passed'] / cls.test_results['total']) * 100
            print(f"Pass Rate: {pass_rate:.1f}%\n")
        
        # Detailed results
        if cls.test_results['details']:
            print(f"{Fore.CYAN}Detailed Results:{Style.RESET_ALL}\n")
            for test_name, status, message in cls.test_results['details']:
                color = Fore.GREEN if status == 'PASS' else Fore.RED
                symbol = '✅' if status == 'PASS' else '❌'
                print(f"  {color}{symbol} {test_name:50s} {status:6s} - {message}{Style.RESET_ALL}")
        
        if cls.test_results['failed'] == 0:
            print(f"\n{Fore.GREEN}{Style.BRIGHT}✅ ALL HOTEL LIST BROWSER TESTS PASSED!{Style.RESET_ALL}\n")
        else:
            print(f"\n{Fore.RED}{Style.BRIGHT}❌ SOME TESTS FAILED{Style.RESET_ALL}\n")
        
        print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
    
    def setUp(self):
        """Navigate to application before each test"""
        self.driver.get(self.base_url)
        time.sleep(2)
    
    def _record_result(self, test_name, passed, message):
        """Record test result"""
        self.test_results['total'] += 1
        if passed:
            self.test_results['passed'] += 1
            status = 'PASS'
        else:
            self.test_results['failed'] += 1
            status = 'FAIL'
        self.test_results['details'].append((test_name, status, message))
    
    def test_TC_005_01_page_loads_successfully(self):
        """TC-005-01: Page loads successfully"""
        test_name = "TC-005-01: Page loads successfully"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            # Verify page is accessible
            current_url = self.driver.current_url
            self.assertTrue(len(current_url) > 0, "Page should load")
            
            # Verify page loaded completely
            self.wait.until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )
            
            print(f"{Fore.GREEN}✅ {test_name} PASSED{Style.RESET_ALL}\n")
            self._record_result(test_name, True, "Page loaded successfully")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            raise
    
    def test_TC_005_02_hotel_select_exists(self):
        """TC-005-02: Hotel select dropdown exists"""
        test_name = "TC-005-02: Hotel select dropdown exists"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            # Note: Element ID is 'hotel-select' (kebab-case) not 'hotelSelect'
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, 'hotel-select'))
            )
            
            self.assertTrue(hotel_select.is_displayed(), "Hotel select should be visible")
            self.assertTrue(hotel_select.is_enabled(), "Hotel select should be enabled")
            
            print(f"{Fore.GREEN}✅ {test_name} PASSED{Style.RESET_ALL}\n")
            self._record_result(test_name, True, "Hotel select found and enabled")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            raise
    
    def test_TC_005_03_hotel_count_correct(self):
        """TC-005-03: Hotel count is 25"""
        test_name = "TC-005-03: Hotel count is 25"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, 'hotel-select'))
            )
            
            # Wait for options to load
            self.wait.until(
                lambda d: len(hotel_select.find_elements(By.TAG_NAME, 'option')) >= 25
            )
            
            options = hotel_select.find_elements(By.TAG_NAME, 'option')
            actual_count = len(options)
            expected_count = len(self.EXPECTED_HOTELS)
            
            print(f"   Expected: {expected_count} hotels")
            print(f"   Actual: {actual_count} hotels")
            
            self.assertEqual(
                actual_count,
                expected_count,
                f"Should have {expected_count} hotel options, found {actual_count}"
            )
            
            print(f"{Fore.GREEN}✅ {test_name} PASSED{Style.RESET_ALL}\n")
            self._record_result(test_name, True, f"{actual_count} hotels loaded")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            raise
    
    def test_TC_005_04_all_expected_hotels_present(self):
        """TC-005-04: All expected hotels are present"""
        test_name = "TC-005-04: All expected hotels present"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, 'hotel-select'))
            )
            
            # Wait for options to load
            self.wait.until(
                lambda d: len(hotel_select.find_elements(By.TAG_NAME, 'option')) >= 25
            )
            
            options = hotel_select.find_elements(By.TAG_NAME, 'option')
            actual_hotels = [opt.text for opt in options]
            
            missing_hotels = []
            for expected in self.EXPECTED_HOTELS:
                if expected not in actual_hotels:
                    missing_hotels.append(expected)
            
            if missing_hotels:
                print(f"{Fore.RED}   Missing hotels: {', '.join(missing_hotels)}{Style.RESET_ALL}")
                self.fail(f"Missing hotels: {', '.join(missing_hotels)}")
            
            print(f"{Fore.GREEN}✅ {test_name} PASSED - All {len(self.EXPECTED_HOTELS)} hotels present{Style.RESET_ALL}\n")
            self._record_result(test_name, True, f"All {len(self.EXPECTED_HOTELS)} hotels present")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            raise
    
    def test_TC_005_05_no_duplicate_hotels(self):
        """TC-005-05: No duplicate hotels in list"""
        test_name = "TC-005-05: No duplicate hotels"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, 'hotel-select'))
            )
            
            options = hotel_select.find_elements(By.TAG_NAME, 'option')
            hotel_names = [opt.text for opt in options]
            
            unique_names = set(hotel_names)
            duplicates = len(hotel_names) - len(unique_names)
            
            if duplicates > 0:
                duplicate_list = [name for name in hotel_names if hotel_names.count(name) > 1]
                print(f"{Fore.RED}   Found {duplicates} duplicate(s): {set(duplicate_list)}{Style.RESET_ALL}")
                self.fail(f"Found {duplicates} duplicate hotel(s)")
            
            print(f"{Fore.GREEN}✅ {test_name} PASSED - No duplicates{Style.RESET_ALL}\n")
            self._record_result(test_name, True, "No duplicates found")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            raise
    
    def test_TC_005_06_hotel_options_have_values(self):
        """TC-005-06: Hotel options have valid values"""
        test_name = "TC-005-06: Hotel options have valid values"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, 'hotel-select'))
            )
            
            options = hotel_select.find_elements(By.TAG_NAME, 'option')
            
            # Check that all options (except "Todas") have valid hotelId values
            invalid_options = []
            for option in options:
                hotel_name = option.text
                hotel_value = option.get_attribute('value')
                
                if hotel_name == "Todas":
                    # "Todas" should have empty or "all" value
                    if hotel_value not in ['', 'all', 'todas']:
                        invalid_options.append(f"{hotel_name} (value: {hotel_value})")
                else:
                    # Other hotels should have numeric hotelId
                    if not hotel_value or hotel_value == '':
                        invalid_options.append(f"{hotel_name} (no value)")
            
            if invalid_options:
                print(f"{Fore.RED}   Invalid options: {', '.join(invalid_options)}{Style.RESET_ALL}")
                self.fail(f"Invalid hotel values: {', '.join(invalid_options)}")
            
            print(f"{Fore.GREEN}✅ {test_name} PASSED - All options have valid values{Style.RESET_ALL}\n")
            self._record_result(test_name, True, "All options have valid values")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            raise
    
    def test_TC_005_07_hotel_selection_works(self):
        """TC-005-07: Hotel selection updates UI"""
        test_name = "TC-005-07: Hotel selection works"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, 'hotel-select'))
            )
            
            # Select a specific hotel
            target_hotel = "Guarujá"
            
            # Find and select the option
            options = hotel_select.find_elements(By.TAG_NAME, 'option')
            hotel_found = False
            
            for option in options:
                if option.text == target_hotel:
                    option.click()
                    hotel_found = True
                    break
            
            self.assertTrue(hotel_found, f"Hotel '{target_hotel}' not found in dropdown")
            
            time.sleep(0.5)  # Allow UI to update
            
            # Verify selection
            selected_option = hotel_select.find_element(By.CSS_SELECTOR, 'option:checked')
            selected_text = selected_option.text
            
            self.assertEqual(
                selected_text,
                target_hotel,
                f"Expected '{target_hotel}' to be selected, got '{selected_text}'"
            )
            
            print(f"   Selected hotel: {selected_text}")
            print(f"{Fore.GREEN}✅ {test_name} PASSED{Style.RESET_ALL}\n")
            self._record_result(test_name, True, f"Successfully selected {target_hotel}")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            raise
    
    def test_TC_005_08_hotel_list_load_time(self):
        """TC-005-08: Hotel list loads within acceptable time"""
        test_name = "TC-005-08: Hotel list load time < 5s"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            # Navigate to fresh page
            start_time = time.time()
            self.driver.get(self.base_url)
            
            # Wait for hotel select and all options
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, 'hotel-select'))
            )
            
            self.wait.until(
                lambda d: len(hotel_select.find_elements(By.TAG_NAME, 'option')) >= 25
            )
            
            load_time = time.time() - start_time
            
            print(f"   Load time: {load_time:.2f} seconds")
            
            self.assertLess(
                load_time,
                5.0,
                f"Hotel list took {load_time:.2f}s to load (max 5s)"
            )
            
            print(f"{Fore.GREEN}✅ {test_name} PASSED - Loaded in {load_time:.2f}s{Style.RESET_ALL}\n")
            self._record_result(test_name, True, f"Loaded in {load_time:.2f}s")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            raise
    
    def test_TC_005_09_display_complete_hotel_list(self):
        """TC-005-09: Display complete hotel list"""
        test_name = "TC-005-09: Display complete hotel list"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, 'hotel-select'))
            )
            
            options = hotel_select.find_elements(By.TAG_NAME, 'option')
            
            print(f"\n{Fore.CYAN}{'='*80}")
            print(f"{Fore.CYAN}HOTEL LIST DISPLAYED IN BROWSER ({len(options)} hotels)")
            print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
            
            for i, option in enumerate(options, 1):
                hotel_name = option.text
                hotel_value = option.get_attribute('value')
                icon = "🏨"
                print(f"{i:2d}. {icon} {hotel_name:25s} (value: {hotel_value})")
            
            print(f"\n{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
            
            print(f"{Fore.GREEN}✅ {test_name} PASSED{Style.RESET_ALL}\n")
            self._record_result(test_name, True, f"Displayed {len(options)} hotels")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            raise


def run_tests():
    """Run the test suite"""
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(UC005HotelListSelenium)
    runner = unittest.TextTestRunner(verbosity=0)
    result = runner.run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    import sys
    sys.exit(run_tests())
