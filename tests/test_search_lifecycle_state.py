"""
Test Suite for FR-008A: Search Lifecycle UI State Management
Tests the enabled/disabled state of UI elements throughout the search lifecycle.
"""

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time


@pytest.fixture
def driver():
    """Setup Chrome driver for testing"""
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=options)
    driver.set_window_size(1920, 1080)
    yield driver
    driver.quit()


def wait_for_element(driver, by, value, timeout=10):
    """Helper to wait for element"""
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((by, value))
    )


def is_element_enabled(element):
    """Check if element is enabled"""
    return element.is_enabled() and element.get_attribute('disabled') is None


def is_element_disabled(element):
    """Check if element is disabled"""
    return not element.is_enabled() or element.get_attribute('disabled') == 'true'


def is_element_visible(driver, element_id):
    """Check if element is visible"""
    try:
        element = driver.find_element(By.ID, element_id)
        return element.is_displayed()
    except:
        return False


class TestInitialPageLoadState:
    """Test AC-008A.1 to AC-008A.4: Initial Page Load State"""
    
    def test_01_initial_all_inputs_enabled(self, driver):
        """AC-008A.1: All input elements enabled on page load"""
        driver.get('http://localhost:3001/index.html')
        
        # Wait for page to load
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(1)  # Allow state initialization
        
        hotel_select = driver.find_element(By.ID, 'hotel-select')
        checkin_input = driver.find_element(By.ID, 'input-checkin')
        checkout_input = driver.find_element(By.ID, 'input-checkout')
        
        assert is_element_enabled(hotel_select), "Hotel selector should be enabled"
        assert is_element_enabled(checkin_input), "Check-in input should be enabled"
        assert is_element_enabled(checkout_input), "Check-out input should be enabled"
    
    def test_02_initial_search_button_enabled(self, driver):
        """AC-008A.2: Search button enabled on page load"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'search-button')
        time.sleep(1)
        
        search_btn = driver.find_element(By.ID, 'search-button')
        
        assert is_element_enabled(search_btn), "Search button should be enabled"
        assert search_btn.text.lower() == 'busca vagas', "Search button should have correct text"
    
    def test_03_initial_start_new_search_hidden(self, driver):
        """AC-008A.3: Start New Search button not visible on page load"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(1)
        
        assert not is_element_visible(driver, 'start-new-search-btn'), \
            "Start New Search button should be hidden initially"
    
    def test_04_initial_action_buttons_hidden(self, driver):
        """AC-008A.4: Copy and Clear buttons not visible on page load"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(1)
        
        # Results container should be hidden
        results_container = driver.find_element(By.ID, 'results-container')
        assert 'visible' not in results_container.get_attribute('class'), \
            "Results container should not be visible initially"


class TestSearchingState:
    """Test AC-008A.5 to AC-008A.12: During Search Execution State"""
    
    def test_05_searching_inputs_disabled(self, driver):
        """AC-008A.5-7: Inputs disabled during search"""
        driver.get('http://localhost:3001/index.html')
        
        # Wait for hotels to load
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        # Fill in dates
        checkin_input = driver.find_element(By.ID, 'input-checkin')
        checkout_input = driver.find_element(By.ID, 'input-checkout')
        checkin_input.send_keys('2025-12-20')
        checkout_input.send_keys('2025-12-22')
        
        # Submit form
        search_btn = driver.find_element(By.ID, 'search-button')
        search_btn.click()
        
        # Immediately check state (during search)
        time.sleep(0.5)
        
        hotel_select = driver.find_element(By.ID, 'hotel-select')
        checkin_input = driver.find_element(By.ID, 'input-checkin')
        checkout_input = driver.find_element(By.ID, 'input-checkout')
        
        assert is_element_disabled(hotel_select), "Hotel selector should be disabled during search"
        assert is_element_disabled(checkin_input), "Check-in input should be disabled during search"
        assert is_element_disabled(checkout_input), "Check-out input should be disabled during search"
    
    def test_06_searching_button_disabled(self, driver):
        """AC-008A.9-10: Search button disabled with 'Buscando...' text"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        # Fill dates and submit
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        
        search_btn = driver.find_element(By.ID, 'search-button')
        search_btn.click()
        
        time.sleep(0.5)
        
        search_btn = driver.find_element(By.ID, 'search-button')
        assert is_element_disabled(search_btn), "Search button should be disabled"
        assert '🔍' in search_btn.text or 'Buscando' in search_btn.text, \
            "Search button should show searching text"
    
    def test_07_searching_visual_indication(self, driver):
        """AC-008A.12: Disabled elements have visual indication"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        
        time.sleep(0.5)
        
        hotel_select = driver.find_element(By.ID, 'hotel-select')
        opacity = hotel_select.value_of_css_property('opacity')
        
        # Opacity should be reduced (0.5)
        assert float(opacity) < 1.0, "Disabled elements should have reduced opacity"


class TestResultsState:
    """Test AC-008A.13 to AC-008A.21: After Search Completion State"""
    
    def test_08_results_date_inputs_remain_disabled(self, driver):
        """AC-008A.13-15: Hotel and date inputs remain disabled after search"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        # Execute search
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        
        # Wait for results
        time.sleep(3)
        
        hotel_select = driver.find_element(By.ID, 'hotel-select')
        checkin_input = driver.find_element(By.ID, 'input-checkin')
        checkout_input = driver.find_element(By.ID, 'input-checkout')
        
        assert is_element_disabled(hotel_select), "Hotel selector should remain disabled"
        assert is_element_disabled(checkin_input), "Check-in input should remain disabled"
        assert is_element_disabled(checkout_input), "Check-out input should remain disabled"
    
    def test_09_results_search_button_disabled(self, driver):
        """AC-008A.17: Search button remains disabled after search"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        
        time.sleep(3)
        
        search_btn = driver.find_element(By.ID, 'search-button')
        assert is_element_disabled(search_btn), "Search button should remain disabled after search"
    
    def test_10_results_start_new_search_visible(self, driver):
        """AC-008A.18: Start New Search button visible after search"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        
        time.sleep(3)
        
        assert is_element_visible(driver, 'start-new-search-btn'), \
            "Start New Search button should be visible after search"
        
        start_new_btn = driver.find_element(By.ID, 'start-new-search-btn')
        assert is_element_enabled(start_new_btn), "Start New Search button should be enabled"
    
    def test_11_results_action_buttons_visible(self, driver):
        """AC-008A.19-20: Copy and Clear buttons visible after search"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        
        time.sleep(3)
        
        # Results container should be visible
        results_container = driver.find_element(By.ID, 'results-container')
        assert 'visible' in results_container.get_attribute('class'), \
            "Results container should be visible"


class TestStartNewSearchAction:
    """Test AC-008A.26 to AC-008A.37: Start New Search Action"""
    
    def test_12_start_new_search_button_exists(self, driver):
        """AC-008A.26: Start New Search button has correct ID"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'start-new-search-btn')
        
        btn = driver.find_element(By.ID, 'start-new-search-btn')
        assert btn is not None, "Start New Search button should exist with correct ID"
    
    def test_13_start_new_search_clears_results(self, driver):
        """AC-008A.27-28: Start New Search clears and hides results"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        # Execute search
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        time.sleep(3)
        
        # Click Start New Search
        start_new_btn = driver.find_element(By.ID, 'start-new-search-btn')
        start_new_btn.click()
        time.sleep(1)
        
        # Check results are hidden
        results_container = driver.find_element(By.ID, 'results-container')
        assert 'visible' not in results_container.get_attribute('class'), \
            "Results container should be hidden after Start New Search"
    
    def test_14_start_new_search_enables_inputs(self, driver):
        """AC-008A.29-31: Start New Search enables hotel and date inputs"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        # Execute search
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        time.sleep(3)
        
        # Click Start New Search
        driver.find_element(By.ID, 'start-new-search-btn').click()
        time.sleep(1)
        
        hotel_select = driver.find_element(By.ID, 'hotel-select')
        checkin_input = driver.find_element(By.ID, 'input-checkin')
        checkout_input = driver.find_element(By.ID, 'input-checkout')
        
        assert is_element_enabled(hotel_select), "Hotel selector should be enabled"
        assert is_element_enabled(checkin_input), "Check-in input should be enabled"
        assert is_element_enabled(checkout_input), "Check-out input should be enabled"
    
    def test_15_start_new_search_enables_search_button(self, driver):
        """AC-008A.32: Start New Search enables search button"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        time.sleep(3)
        
        driver.find_element(By.ID, 'start-new-search-btn').click()
        time.sleep(1)
        
        search_btn = driver.find_element(By.ID, 'search-button')
        assert is_element_enabled(search_btn), "Search button should be enabled"
        assert search_btn.text.lower() == 'busca vagas', "Search button should have original text"
    
    def test_16_start_new_search_hides_itself(self, driver):
        """AC-008A.33: Start New Search hides itself"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        time.sleep(3)
        
        driver.find_element(By.ID, 'start-new-search-btn').click()
        time.sleep(1)
        
        assert not is_element_visible(driver, 'start-new-search-btn'), \
            "Start New Search button should be hidden after click"
    
    def test_17_start_new_search_resets_guest_counter(self, driver):
        """AC-008A.35-36: Start New Search resets guest counter to default"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        time.sleep(3)
        
        driver.find_element(By.ID, 'start-new-search-btn').click()
        time.sleep(1)
        
        guest_input = driver.find_element(By.CSS_SELECTOR, '.quantity')
        assert '2' in guest_input.get_attribute('value'), \
            "Guest counter should reset to 2"
    
    def test_18_start_new_search_preserves_dates(self, driver):
        """AC-008A.36: Start New Search preserves date values (dates remain in input fields)"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        # Set dates
        checkin_input = driver.find_element(By.ID, 'input-checkin')
        checkout_input = driver.find_element(By.ID, 'input-checkout')
        checkin_input.send_keys('2025-12-20')
        checkout_input.send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        time.sleep(3)
        
        # Click start new search
        driver.find_element(By.ID, 'start-new-search-btn').click()
        time.sleep(1)
        
        # Verify dates are still in fields (not cleared)
        checkin_value = driver.find_element(By.ID, 'input-checkin').get_attribute('value')
        checkout_value = driver.find_element(By.ID, 'input-checkout').get_attribute('value')
        
        # Dates should not be empty (preserved for user convenience)
        assert checkin_value != '', "Check-in date should not be cleared"
        assert checkout_value != '', "Check-out date should not be cleared"
        
        # Inputs should be enabled for modification
        assert is_element_enabled(driver.find_element(By.ID, 'input-checkin')), \
            "Check-in input should be enabled after Start New Search"
        assert is_element_enabled(driver.find_element(By.ID, 'input-checkout')), \
            "Check-out input should be enabled after Start New Search"


class TestButtonStateTransitions:
    """Test button state transitions throughout lifecycle"""
    
    def test_19_search_button_vs_start_new_search_distinction(self, driver):
        """AC-008A: Verify distinct behavior of search vs start new search buttons"""
        driver.get('http://localhost:3001/index.html')
        
        wait_for_element(driver, By.ID, 'hotel-select')
        time.sleep(2)
        
        # Initially, search button enabled, start new search hidden
        assert is_element_enabled(driver.find_element(By.ID, 'search-button'))
        assert not is_element_visible(driver, 'start-new-search-btn')
        
        # After search, search button disabled, start new search visible
        driver.find_element(By.ID, 'input-checkin').send_keys('2025-12-20')
        driver.find_element(By.ID, 'input-checkout').send_keys('2025-12-22')
        driver.find_element(By.ID, 'search-button').click()
        time.sleep(3)
        
        assert is_element_disabled(driver.find_element(By.ID, 'search-button'))
        assert is_element_visible(driver, 'start-new-search-btn')
        
        # After start new search, back to initial state
        driver.find_element(By.ID, 'start-new-search-btn').click()
        time.sleep(1)
        
        assert is_element_enabled(driver.find_element(By.ID, 'search-button'))
        assert not is_element_visible(driver, 'start-new-search-btn')


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
