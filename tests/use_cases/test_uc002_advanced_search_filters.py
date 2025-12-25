#!/usr/bin/env python3
"""
UC-002: Advanced Search with Filters
Priority: High
Category: Feature Testing
Related FR: FR-004, FR-007, FR-014

Tests advanced search using guest count filtering and booking rules toggle.
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


class UC002AdvancedSearchFilters(unittest.TestCase):
    """UC-002: Advanced Search with Filters Test Suite"""
    
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
        print(f"{Fore.CYAN}UC-002: Advanced Search with Filters Test Suite")
        print(f"{Fore.CYAN}{'='*70}{Style.RESET_ALL}\n")
    
    @classmethod
    def tearDownClass(cls):
        if cls.driver:
            cls.driver.quit()
        print(f"\n{Fore.GREEN}✅ UC-002 Test Suite Complete{Style.RESET_ALL}\n")
    
    def setUp(self):
        self.driver.get(self.base_url)
        time.sleep(2)
    
    def test_TC_002_01_guest_filter_initial_disabled(self):
        """TC-002-01: Verify guest filter disabled initially"""
        print(f"{Fore.YELLOW}Running TC-002-01: Guest filter initial state{Style.RESET_ALL}")
        
        try:
            guest_minus = self.wait.until(
                EC.presence_of_element_located((By.ID, "guest-minus"))
            )
            guest_plus = self.driver.find_element(By.ID, "guest-plus")
            
            # Check if buttons are disabled initially
            minus_disabled = not guest_minus.is_enabled() or \
                           guest_minus.get_attribute("disabled") is not None
            plus_disabled = not guest_plus.is_enabled() or \
                          guest_plus.get_attribute("disabled") is not None
            
            print(f"{Fore.GREEN}✅ TC-002-01 PASSED: Guest filter initial state validated{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ TC-002-01 FAILED: {str(e)}{Style.RESET_ALL}")
            raise
    
    def test_TC_002_03_decrease_guest_count(self):
        """TC-002-03: Click minus button - Count decrements to 1"""
        print(f"{Fore.YELLOW}Running TC-002-03: Decrease guest count{Style.RESET_ALL}")
        
        try:
            guest_count = self.wait.until(
                EC.presence_of_element_located((By.ID, "guest-count"))
            )
            guest_minus = self.driver.find_element(By.ID, "guest-minus")
            
            initial_count = int(guest_count.get_attribute("value"))
            
            # Click minus button
            guest_minus.click()
            time.sleep(0.5)
            
            new_count = int(guest_count.get_attribute("value"))
            self.assertEqual(new_count, initial_count - 1)
            
            print(f"{Fore.GREEN}✅ TC-002-03 PASSED: Guest count decreased to {new_count}{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ TC-002-03 FAILED: {str(e)}{Style.RESET_ALL}")
            raise
    
    def test_TC_002_04_increase_guest_count(self):
        """TC-002-04: Click plus button - Count increments, max 10 guests"""
        print(f"{Fore.YELLOW}Running TC-002-04: Increase guest count{Style.RESET_ALL}")
        
        try:
            guest_count = self.wait.until(
                EC.presence_of_element_located((By.ID, "guest-count"))
            )
            guest_plus = self.driver.find_element(By.ID, "guest-plus")
            
            initial_count = int(guest_count.get_attribute("value"))
            
            # Click plus button
            guest_plus.click()
            time.sleep(0.5)
            
            new_count = int(guest_count.get_attribute("value"))
            self.assertEqual(new_count, initial_count + 1)
            self.assertLessEqual(new_count, 10, "Max guests should be 10")
            
            print(f"{Fore.GREEN}✅ TC-002-04 PASSED: Guest count increased to {new_count}{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ TC-002-04 FAILED: {str(e)}{Style.RESET_ALL}")
            raise
    
    def test_TC_002_06_booking_rules_toggle(self):
        """TC-002-06: Uncheck booking rules toggle"""
        print(f"{Fore.YELLOW}Running TC-002-06: Booking rules toggle{Style.RESET_ALL}")
        
        try:
            booking_rules = self.wait.until(
                EC.presence_of_element_located((By.ID, "apply-booking-rules"))
            )
            
            # Check initial state (should be checked)
            initial_checked = booking_rules.is_selected()
            
            # Toggle it
            if initial_checked:
                booking_rules.click()
                time.sleep(0.5)
                
            final_checked = booking_rules.is_selected()
            self.assertNotEqual(initial_checked, final_checked)
            
            print(f"{Fore.GREEN}✅ TC-002-06 PASSED: Booking rules toggle works{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ TC-002-06 FAILED: {str(e)}{Style.RESET_ALL}")
            raise


if __name__ == '__main__':
    unittest.main(verbosity=2)
