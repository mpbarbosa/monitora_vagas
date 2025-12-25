#!/usr/bin/env python3
"""
UC-004: Search Lifecycle Management
Priority: Critical
Category: State Management
Related FR: FR-008A

Tests search lifecycle: initial → searching → results → reset.
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


class UC004SearchLifecycle(unittest.TestCase):
    """UC-004: Search Lifecycle Management Test Suite"""
    
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
        print(f"{Fore.CYAN}UC-004: Search Lifecycle Management Test Suite")
        print(f"{Fore.CYAN}{'='*70}{Style.RESET_ALL}\n")
    
    @classmethod
    def tearDownClass(cls):
        if cls.driver:
            cls.driver.quit()
        print(f"\n{Fore.GREEN}✅ UC-004 Test Suite Complete{Style.RESET_ALL}\n")
    
    def setUp(self):
        self.driver.get(self.base_url)
        time.sleep(2)
    
    def test_TC_004_01_initial_state(self):
        """TC-004-01: Verify initial state - Form enabled, no results, no Reset button"""
        print(f"{Fore.YELLOW}Running TC-004-01: Initial state verification{Style.RESET_ALL}")
        
        try:
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, "hotel-select"))
            )
            checkin_input = self.driver.find_element(By.ID, "checkin-date")
            checkout_input = self.driver.find_element(By.ID, "checkout-date")
            
            # Verify form elements are enabled
            self.assertTrue(hotel_select.is_enabled())
            self.assertTrue(checkin_input.is_enabled())
            self.assertTrue(checkout_input.is_enabled())
            
            # Check for reset button (should not exist or be hidden)
            reset_buttons = self.driver.find_elements(By.ID, "reset-btn")
            if reset_buttons:
                self.assertFalse(reset_buttons[0].is_displayed())
            
            print(f"{Fore.GREEN}✅ TC-004-01 PASSED: Initial state valid{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ TC-004-01 FAILED: {str(e)}{Style.RESET_ALL}")
            raise
    
    def test_TC_004_07_reset_button_properties(self):
        """TC-004-07: Verify Reset button properties (ID, text)"""
        print(f"{Fore.YELLOW}Running TC-004-07: Reset button properties{Style.RESET_ALL}")
        
        try:
            # Perform a quick search to trigger reset button
            hotel_select = self.wait.until(
                EC.presence_of_element_located((By.ID, "hotel-select"))
            )
            time.sleep(3)
            
            # Select hotel and dates
            options = hotel_select.find_elements(By.TAG_NAME, "option")
            for opt in options:
                if opt.get_attribute("value"):
                    opt.click()
                    break
            
            checkin_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            checkout_date = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")
            
            self.driver.execute_script(
                f"document.getElementById('checkin-date').value = '{checkin_date}';"
                f"document.getElementById('checkout-date').value = '{checkout_date}';"
            )
            
            search_btn = self.driver.find_element(By.ID, "search-btn")
            search_btn.click()
            
            # Wait for reset button to appear
            time.sleep(5)
            
            reset_btn = self.driver.find_element(By.ID, "reset-btn")
            self.assertTrue(reset_btn.is_displayed())
            self.assertIn("Reset", reset_btn.text)
            
            print(f"{Fore.GREEN}✅ TC-004-07 PASSED: Reset button properties valid{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}❌ TC-004-07 FAILED: {str(e)}{Style.RESET_ALL}")
            raise


if __name__ == '__main__':
    unittest.main(verbosity=2)
