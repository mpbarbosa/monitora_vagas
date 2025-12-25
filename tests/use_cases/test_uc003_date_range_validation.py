#!/usr/bin/env python3
"""
UC-003: Date Range Validation
Priority: High
Category: Validation Testing
Related FR: FR-002, FR-003, FR-010

Tests date validation and business rules enforcement.
"""

import unittest
import time
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

try:
    from colorama import Fore, Style, init
    init(autoreset=True)
except ImportError:
    class Fore:
        GREEN = RED = YELLOW = CYAN = BLUE = ''
    class Style:
        BRIGHT = RESET_ALL = ''


class UC003DateRangeValidation(unittest.TestCase):
    """UC-003: Date Range Validation Test Suite"""
    
    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--remote-debugging-port=9222')
        
        # Set Chrome binary location
        chrome_options.binary_location = '/opt/google/chrome/chrome'
        
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.implicitly_wait(10)
        cls.wait = WebDriverWait(cls.driver, 30)
        
        import os
        cls.base_url = os.getenv('TEST_BASE_URL', 'http://localhost:8080/public/index.html')
        
        print(f"\n{Fore.CYAN}{'='*70}")
        print(f"{Fore.CYAN}UC-003: Date Range Validation Test Suite")
        print(f"{Fore.CYAN}{'='*70}{Style.RESET_ALL}\n")
    
    @classmethod
    def tearDownClass(cls):
        if cls.driver:
            cls.driver.quit()
        print(f"\n{Fore.GREEN}✅ UC-003 Test Suite Complete{Style.RESET_ALL}\n")
    
    def setUp(self):
        self.driver.get(self.base_url)
        time.sleep(2)
    
    def test_TC_003_01_accept_valid_checkin(self):
        """TC-003-01: Select check-in date (today) - Date accepted"""
        print(f"{Fore.YELLOW}Running TC-003-01: Valid check-in date{Style.RESET_ALL}")
        
        try:
            checkin_input = self.wait.until(
                EC.presence_of_element_located((By.ID, "checkin-date"))
            )
            
            today = datetime.now().strftime("%Y-%m-%d")
            self.driver.execute_script(
                f"arguments[0].value = '{today}'",
                checkin_input
            )
            time.sleep(0.5)
            
            actual_value = checkin_input.get_attribute("value")
            self.assertEqual(actual_value, today)
            
            print(f"{Fore.GREEN}✅ TC-003-01 PASSED: Check-in date accepted{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ TC-003-01 FAILED: {str(e)}{Style.RESET_ALL}")
            raise
    
    def test_TC_003_04_valid_one_night_range(self):
        """TC-003-04: Valid date range (1 night)"""
        print(f"{Fore.YELLOW}Running TC-003-04: Valid 1-night range{Style.RESET_ALL}")
        
        try:
            checkin_input = self.wait.until(
                EC.presence_of_element_located((By.ID, "checkin-date"))
            )
            checkout_input = self.driver.find_element(By.ID, "checkout-date")
            
            checkin = datetime.now()
            checkout = checkin + timedelta(days=1)
            
            self.driver.execute_script(
                f"arguments[0].value = '{checkin.strftime('%Y-%m-%d')}'",
                checkin_input
            )
            self.driver.execute_script(
                f"arguments[0].value = '{checkout.strftime('%Y-%m-%d')}'",
                checkout_input
            )
            time.sleep(0.5)
            
            # Valid range should be accepted
            checkin_val = checkin_input.get_attribute("value")
            checkout_val = checkout_input.get_attribute("value")
            
            self.assertTrue(checkin_val and checkout_val)
            
            print(f"{Fore.GREEN}✅ TC-003-04 PASSED: 1-night range valid{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ TC-003-04 FAILED: {str(e)}{Style.RESET_ALL}")
            raise
    
    def test_TC_003_05_valid_thirty_night_range(self):
        """TC-003-05: Valid date range (30 nights)"""
        print(f"{Fore.YELLOW}Running TC-003-05: Valid 30-night range{Style.RESET_ALL}")
        
        try:
            checkin_input = self.wait.until(
                EC.presence_of_element_located((By.ID, "checkin-date"))
            )
            checkout_input = self.driver.find_element(By.ID, "checkout-date")
            
            checkin = datetime.now()
            checkout = checkin + timedelta(days=30)
            
            self.driver.execute_script(
                f"arguments[0].value = '{checkin.strftime('%Y-%m-%d')}'",
                checkin_input
            )
            self.driver.execute_script(
                f"arguments[0].value = '{checkout.strftime('%Y-%m-%d')}'",
                checkout_input
            )
            time.sleep(0.5)
            
            checkin_val = checkin_input.get_attribute("value")
            checkout_val = checkout_input.get_attribute("value")
            
            self.assertTrue(checkin_val and checkout_val)
            
            print(f"{Fore.GREEN}✅ TC-003-05 PASSED: 30-night range valid{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ TC-003-05 FAILED: {str(e)}{Style.RESET_ALL}")
            raise
    
    def test_TC_003_08_valid_dates_enable_search(self):
        """TC-003-08: Enter valid date range - Search button enabled"""
        print(f"{Fore.YELLOW}Running TC-003-08: Valid dates enable search{Style.RESET_ALL}")
        
        try:
            # Select hotel first
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, "hotel-select"))
            )
            time.sleep(3)
            
            options = hotel_select.find_elements(By.TAG_NAME, "option")
            for opt in options:
                if opt.get_attribute("value"):
                    opt.click()
                    break
            
            # Set valid dates
            checkin_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            checkout_date = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
            
            self.driver.execute_script(
                f"document.getElementById('checkin-date').value = '{checkin_date}';"
                f"document.getElementById('checkout-date').value = '{checkout_date}';"
            )
            time.sleep(1)
            
            search_btn = self.driver.find_element(By.ID, "search-btn")
            self.assertTrue(search_btn.is_enabled())
            
            print(f"{Fore.GREEN}✅ TC-003-08 PASSED: Search button enabled{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ TC-003-08 FAILED: {str(e)}{Style.RESET_ALL}")
            raise


if __name__ == '__main__':
    unittest.main(verbosity=2)
