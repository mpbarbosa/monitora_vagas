#!/usr/bin/env python3
"""
Quick test for the quick-union element to identify the specific issue
"""

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException

def test_quick_union_element():
    """Test the quick-union select element specifically"""
    
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        print("🔍 Testing quick-union element functionality...")
        
        # Load the page
        driver.get("http://localhost:8081/index.html")
        time.sleep(3)  # Wait for page to load
        
        # Test 1: Check if element exists
        try:
            union_element = driver.find_element(By.ID, "quick-union")
            print("✅ Element found: quick-union")
        except NoSuchElementException:
            print("❌ Element NOT found: quick-union")
            return False
        
        # Test 2: Check if element is displayed
        if union_element.is_displayed():
            print("✅ Element is visible")
        else:
            print("❌ Element exists but is NOT visible")
            return False
        
        # Test 3: Check element properties
        tag_name = union_element.tag_name
        element_id = union_element.get_attribute("id")
        name_attr = union_element.get_attribute("name") 
        class_attr = union_element.get_attribute("class")
        
        print(f"📋 Element properties:")
        print(f"   Tag: {tag_name}")
        print(f"   ID: {element_id}")
        print(f"   Name: {name_attr}")
        print(f"   Class: {class_attr}")
        
        # Test 4: Check if it's enabled and interactable
        if union_element.is_enabled():
            print("✅ Element is enabled")
        else:
            print("❌ Element is DISABLED")
            return False
        
        # Test 5: Check options
        if tag_name.lower() == 'select':
            options = union_element.find_elements(By.TAG_NAME, "option")
            print(f"📋 Found {len(options)} option(s):")
            for i, option in enumerate(options):
                value = option.get_attribute("value")
                text = option.text
                selected = option.is_selected()
                print(f"   Option {i+1}: value='{value}', text='{text}', selected={selected}")
        
        # Test 6: Try to interact with the element
        try:
            current_value = union_element.get_attribute("value")
            print(f"📋 Current value: {current_value}")
            
            # Try to click it (for select elements)
            union_element.click()
            time.sleep(0.5)
            print("✅ Element can be clicked")
            
        except Exception as e:
            print(f"❌ Error interacting with element: {e}")
            return False
        
        # Test 7: Check for JavaScript errors
        logs = driver.get_log('browser')
        js_errors = [log for log in logs if log['level'] == 'SEVERE']
        if js_errors:
            print("❌ JavaScript errors found:")
            for error in js_errors:
                print(f"   {error['message']}")
            return False
        else:
            print("✅ No JavaScript errors")
        
        print("🎉 All tests passed! quick-union element is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
    finally:
        driver.quit()

if __name__ == "__main__":
    success = test_quick_union_element()
    if not success:
        print("\n🔧 Element needs investigation or fixes")
    else:
        print("\n✨ Element is functioning properly")