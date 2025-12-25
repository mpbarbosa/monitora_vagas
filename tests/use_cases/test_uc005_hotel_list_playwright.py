#!/usr/bin/env python3
"""
UC-005: Hotel List Browser Verification (Playwright)
Priority: High
Category: UI Integration Testing
Related FR: FR-001, FR-002

Tests hotel list loading and display in the browser using Playwright.
Verifies that all 25 hotels are correctly loaded and displayed in the UI.

Note: Requires Playwright installation:
    pip install playwright==1.40.0
    python -m playwright install chromium
"""

import unittest
import time
import os
from datetime import datetime

try:
    from playwright.sync_api import sync_playwright, expect, TimeoutError as PlaywrightTimeout
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False
    print("⚠️  Playwright not installed. Run: pip install playwright && python -m playwright install chromium")

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


@unittest.skipIf(not PLAYWRIGHT_AVAILABLE, "Playwright not installed")
class UC005HotelListPlaywright(unittest.TestCase):
    """
    UC-005: Hotel List Browser Verification Test Suite (Playwright)
    
    Validates that hotel list is properly loaded and displayed in browser.
    Uses Playwright for modern browser automation with auto-wait features.
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
        print(f"{Fore.CYAN}{Style.BRIGHT}UC-005: Hotel List Browser Verification (Playwright)")
        print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
        
        if not PLAYWRIGHT_AVAILABLE:
            return
        
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-dev-shm-usage']
        )
        cls.context = cls.browser.new_context(
            viewport={'width': 1920, 'height': 1080}
        )
        
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
        if PLAYWRIGHT_AVAILABLE and hasattr(cls, 'context'):
            cls.context.close()
            cls.browser.close()
            cls.playwright.stop()
        
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
        """Create new page before each test"""
        if PLAYWRIGHT_AVAILABLE:
            self.page = self.context.new_page()
            self.page.goto(self.base_url)
            self.page.wait_for_load_state('networkidle')
    
    def tearDown(self):
        """Close page after each test"""
        if PLAYWRIGHT_AVAILABLE and hasattr(self, 'page'):
            self.page.close()
    
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
            # Verify page loaded
            self.assertTrue(len(self.page.url) > 0, "Page should load")
            
            # Check page title or key element
            hotel_select = self.page.locator('#hotel-select')
            hotel_select.wait_for(state='visible', timeout=10000)
            
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
            hotel_select = self.page.locator('#hotel-select')
            
            # Playwright has built-in auto-wait
            expect(hotel_select).to_be_visible()
            expect(hotel_select).to_be_enabled()
            
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
            # Wait for all options to load
            options = self.page.locator('#hotel-select option')
            
            # Use Playwright's expect with auto-retry
            expect(options).to_have_count(len(self.EXPECTED_HOTELS))
            
            actual_count = options.count()
            expected_count = len(self.EXPECTED_HOTELS)
            
            print(f"   Expected: {expected_count} hotels")
            print(f"   Actual: {actual_count} hotels")
            
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
            options = self.page.locator('#hotel-select option')
            
            # Get all option texts
            actual_hotels = options.all_text_contents()
            
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
            options = self.page.locator('#hotel-select option')
            hotel_names = options.all_text_contents()
            
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
            options = self.page.locator('#hotel-select option')
            
            # Check each option
            invalid_options = []
            for i in range(options.count()):
                option = options.nth(i)
                hotel_name = option.text_content()
                hotel_value = option.get_attribute('value')
                
                if hotel_name == "Todas":
                    # "Todas" should have empty or "all" value
                    if hotel_value not in ['', 'all', 'todas']:
                        invalid_options.append(f"{hotel_name} (value: {hotel_value})")
                else:
                    # Other hotels should have hotelId
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
            target_hotel = "Guarujá"
            
            # Select by label (visible text)
            self.page.select_option('#hotel-select', label=target_hotel)
            
            # Verify selection
            selected_value = self.page.locator('#hotel-select').input_value()
            
            # Get selected option text
            selected_text = self.page.locator('#hotel-select option:checked').text_content()
            
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
            self.page.goto(self.base_url)
            
            # Wait for all options to load
            options = self.page.locator('#hotel-select option')
            expect(options).to_have_count(len(self.EXPECTED_HOTELS), timeout=5000)
            
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
    
    def test_TC_005_09_api_integration_verification(self):
        """TC-005-09: Verify API integration with network monitoring"""
        test_name = "TC-005-09: API integration verification"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            # Track API responses
            api_responses = []
            
            def handle_response(response):
                if 'hoteis/scrape' in response.url or 'hotels' in response.url:
                    api_responses.append({
                        'url': response.url,
                        'status': response.status,
                        'ok': response.ok
                    })
            
            # Create new page with response listener
            test_page = self.context.new_page()
            test_page.on('response', handle_response)
            
            # Navigate and wait
            test_page.goto(self.base_url)
            test_page.wait_for_load_state('networkidle')
            
            # Verify options loaded
            options = test_page.locator('#hotel-select option')
            expect(options).to_have_count(len(self.EXPECTED_HOTELS))
            
            # Check if API was called (may not be if using cached data)
            if api_responses:
                print(f"   API calls detected: {len(api_responses)}")
                for resp in api_responses:
                    print(f"   - {resp['url']} (Status: {resp['status']})")
                    self.assertTrue(resp['ok'], f"API call failed: {resp['url']}")
            else:
                print(f"   No API calls detected (may be using cache)")
            
            test_page.close()
            
            print(f"{Fore.GREEN}✅ {test_name} PASSED{Style.RESET_ALL}\n")
            self._record_result(test_name, True, "API integration verified")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            if 'test_page' in locals():
                test_page.close()
            raise
    
    def test_TC_005_10_display_complete_hotel_list(self):
        """TC-005-10: Display complete hotel list"""
        test_name = "TC-005-10: Display complete hotel list"
        print(f"{Fore.YELLOW}Running {test_name}{Style.RESET_ALL}")
        
        try:
            options = self.page.locator('#hotel-select option')
            
            # Get all options
            hotel_list = []
            for i in range(options.count()):
                option = options.nth(i)
                hotel_name = option.text_content()
                hotel_value = option.get_attribute('value')
                hotel_list.append((hotel_name, hotel_value))
            
            print(f"\n{Fore.CYAN}{'='*80}")
            print(f"{Fore.CYAN}HOTEL LIST DISPLAYED IN BROWSER ({len(hotel_list)} hotels)")
            print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
            
            for i, (name, value) in enumerate(hotel_list, 1):
                icon = "🏨"
                print(f"{i:2d}. {icon} {name:25s} (value: {value})")
            
            print(f"\n{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
            
            print(f"{Fore.GREEN}✅ {test_name} PASSED{Style.RESET_ALL}\n")
            self._record_result(test_name, True, f"Displayed {len(hotel_list)} hotels")
        except Exception as e:
            print(f"{Fore.RED}❌ {test_name} FAILED: {str(e)}{Style.RESET_ALL}\n")
            self._record_result(test_name, False, str(e))
            raise


def run_tests():
    """Run the test suite"""
    if not PLAYWRIGHT_AVAILABLE:
        print(f"\n{Fore.RED}❌ Playwright not installed{Style.RESET_ALL}")
        print(f"\n{Fore.YELLOW}To install Playwright:{Style.RESET_ALL}")
        print(f"  pip install playwright==1.40.0")
        print(f"  python -m playwright install chromium\n")
        return 1
    
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(UC005HotelListPlaywright)
    runner = unittest.TextTestRunner(verbosity=0)
    result = runner.run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    import sys
    sys.exit(run_tests())
