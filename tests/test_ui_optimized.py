"""
Simple UI Test with Optimized HTTP Server
Uses pytest fixtures for efficient test execution

Key Optimizations:
1. Session-scoped HTTP server (no 2s startup per test)
2. Explicit Chrome binary path (fixes binary detection)
3. Pytest markers for selective execution
"""

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pathlib import Path


@pytest.mark.selenium
@pytest.mark.smoke
@pytest.mark.timeout(30)
def test_page_loads(web_server, driver_function):
    """
    Test that the main page loads successfully
    Uses session-scoped web_server and function-scoped driver
    """
    print(f"📍 Testing: {web_server}")
    
    # Navigate to page
    driver_function.get(web_server)
    
    # Wait for page to load
    WebDriverWait(driver_function, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )
    
    # Verify page loaded
    assert "Monitora Vagas" in driver_function.title or "Hotel" in driver_function.title
    print("✅ Page loaded successfully")


@pytest.mark.selenium
@pytest.mark.smoke
@pytest.mark.timeout(30)
def test_hotel_select_exists(web_server, driver_function):
    """Test that hotel select dropdown exists"""
    driver_function.get(web_server)
    
    # Wait for hotel select
    hotel_select = WebDriverWait(driver_function, 10).until(
        EC.presence_of_element_located((By.ID, "hotel-select"))
    )
    
    assert hotel_select is not None
    print("✅ Hotel select dropdown found")


@pytest.mark.selenium
@pytest.mark.smoke  
@pytest.mark.timeout(30)
def test_date_inputs_exist(web_server, driver_function):
    """Test that date input fields exist"""
    driver_function.get(web_server)
    
    # Wait for date inputs
    checkin_input = WebDriverWait(driver_function, 10).until(
        EC.presence_of_element_located((By.ID, "checkin-date"))
    )
    checkout_input = driver_function.find_element(By.ID, "checkout-date")
    
    assert checkin_input is not None
    assert checkout_input is not None
    print("✅ Date input fields found")


@pytest.mark.selenium
@pytest.mark.smoke
@pytest.mark.timeout(30)
def test_search_button_exists(web_server, driver_function):
    """Test that search button exists"""
    driver_function.get(web_server)
    
    # Wait for search button
    search_button = WebDriverWait(driver_function, 10).until(
        EC.presence_of_element_located((By.ID, "search-btn"))
    )
    
    assert search_button is not None
    assert search_button.is_displayed()
    print("✅ Search button found and visible")


@pytest.mark.selenium
@pytest.mark.timeout(60)
def test_guest_counter_exists(web_server, driver_function):
    """Test that guest counter component exists"""
    driver_function.get(web_server)
    
    # Wait for guest filter card
    guest_filter = WebDriverWait(driver_function, 10).until(
        EC.presence_of_element_located((By.ID, "guest-filter-card"))
    )
    
    assert guest_filter is not None
    print("✅ Guest counter component found")


if __name__ == "__main__":
    # Run with pytest
    import sys
    sys.exit(pytest.main([__file__, "-v", "-s"]))
