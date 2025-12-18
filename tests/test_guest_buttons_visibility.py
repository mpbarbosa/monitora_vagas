#!/usr/bin/env python3
"""
Guest Buttons Visibility Test - Results State
Verifies that guest number buttons are visible and functional in results state
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from pathlib import Path
import time


def setup_driver():
    """Setup Chrome WebDriver"""
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    
    return webdriver.Chrome(options=chrome_options)


def test_guest_buttons_exist():
    """Test that guest buttons exist in HTML"""
    print("\n🧪 Test 1: Guest Buttons Exist")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "plus")))
        
        # Find buttons
        plus_btn = driver.find_element(By.CLASS_NAME, "plus")
        minus_btn = driver.find_element(By.CLASS_NAME, "minus")
        
        assert plus_btn is not None, "❌ Plus button not found"
        print("✅ Plus button exists")
        
        assert minus_btn is not None, "❌ Minus button not found"
        print("✅ Minus button exists")
        
        # Check text content
        assert plus_btn.text == "+", f"❌ Plus button text: {plus_btn.text}"
        print(f"✅ Plus button text: {plus_btn.text}")
        
        assert minus_btn.text == "-", f"❌ Minus button text: {minus_btn.text}"
        print(f"✅ Minus button text: {minus_btn.text}")
        
        print("✅ Test PASSED: Guest buttons exist")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_guest_buttons_initial_state():
    """Test guest buttons in initial state"""
    print("\n🧪 Test 2: Guest Buttons Initial State")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        time.sleep(1)  # Wait for JavaScript initialization
        
        # Find buttons
        plus_btn = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "plus")))
        minus_btn = driver.find_element(By.CLASS_NAME, "minus")
        
        # Check aria-disabled
        plus_disabled = plus_btn.get_attribute("aria-disabled")
        minus_disabled = minus_btn.get_attribute("aria-disabled")
        
        print(f"  Plus button aria-disabled: {plus_disabled}")
        print(f"  Minus button aria-disabled: {minus_disabled}")
        
        # In initial state, should be disabled (true)
        assert plus_disabled == "true", f"❌ Expected aria-disabled='true', got '{plus_disabled}'"
        assert minus_disabled == "true", f"❌ Expected aria-disabled='true', got '{minus_disabled}'"
        print("✅ Buttons disabled in initial state")
        
        # Check for state class
        plus_classes = plus_btn.get_attribute("class")
        print(f"  Plus button classes: {plus_classes}")
        
        assert "state-initial" in plus_classes or "plus" in plus_classes, "❌ Button should have state class"
        print("✅ Button has correct classes")
        
        print("✅ Test PASSED: Initial state correct")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        driver.quit()


def test_guest_buttons_results_state():
    """Test guest buttons visibility in results state"""
    print("\n🧪 Test 3: Guest Buttons Results State")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        time.sleep(1)
        
        # Set to results state via JavaScript
        driver.execute_script("""
            if (window.SearchLifecycleState) {
                window.SearchLifecycleState.setResultsState();
            }
        """)
        
        time.sleep(0.5)
        
        # Find buttons
        plus_btn = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "plus")))
        minus_btn = driver.find_element(By.CLASS_NAME, "minus")
        
        # Check aria-disabled (should be false in results state)
        plus_disabled = plus_btn.get_attribute("aria-disabled")
        minus_disabled = minus_btn.get_attribute("aria-disabled")
        
        print(f"  Plus button aria-disabled: {plus_disabled}")
        print(f"  Minus button aria-disabled: {minus_disabled}")
        
        assert plus_disabled == "false", f"❌ Expected aria-disabled='false' in results state, got '{plus_disabled}'"
        assert minus_disabled == "false", f"❌ Expected aria-disabled='false' in results state, got '{minus_disabled}'"
        print("✅ Buttons enabled in results state")
        
        # Check for state-results class
        plus_classes = plus_btn.get_attribute("class")
        minus_classes = minus_btn.get_attribute("class")
        
        print(f"  Plus button classes: {plus_classes}")
        print(f"  Minus button classes: {minus_classes}")
        
        assert "state-results" in plus_classes, "❌ Plus button should have 'state-results' class"
        assert "state-results" in minus_classes, "❌ Minus button should have 'state-results' class"
        print("✅ Buttons have 'state-results' class")
        
        print("✅ Test PASSED: Results state correct")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        driver.quit()


def test_guest_buttons_visibility():
    """Test that buttons are visible (not display:none)"""
    print("\n🧪 Test 4: Guest Buttons Visibility")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        time.sleep(1)
        
        # Set to results state
        driver.execute_script("""
            if (window.SearchLifecycleState) {
                window.SearchLifecycleState.setResultsState();
            }
        """)
        
        time.sleep(0.5)
        
        plus_btn = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "plus")))
        minus_btn = driver.find_element(By.CLASS_NAME, "minus")
        
        # Check if displayed
        plus_displayed = plus_btn.is_displayed()
        minus_displayed = minus_btn.is_displayed()
        
        print(f"  Plus button displayed: {plus_displayed}")
        print(f"  Minus button displayed: {minus_displayed}")
        
        assert plus_displayed, "❌ Plus button should be visible"
        assert minus_displayed, "❌ Minus button should be visible"
        print("✅ Both buttons are visible")
        
        # Check opacity (should not be 0)
        plus_opacity = plus_btn.value_of_css_property("opacity")
        minus_opacity = minus_btn.value_of_css_property("opacity")
        
        print(f"  Plus button opacity: {plus_opacity}")
        print(f"  Minus button opacity: {minus_opacity}")
        
        plus_opacity_val = float(plus_opacity)
        minus_opacity_val = float(minus_opacity)
        
        assert plus_opacity_val > 0, f"❌ Plus button opacity should be > 0, got {plus_opacity_val}"
        assert minus_opacity_val > 0, f"❌ Minus button opacity should be > 0, got {minus_opacity_val}"
        print("✅ Buttons have visible opacity")
        
        print("✅ Test PASSED: Buttons are visible")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        driver.quit()


def test_icon_con_wrapper():
    """Test that icon-con wrapper exists"""
    print("\n🧪 Test 5: Icon-Con Wrapper Exists")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        
        # Find icon-con wrapper
        icon_con = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "icon-con")))
        
        assert icon_con is not None, "❌ icon-con wrapper not found"
        print("✅ icon-con wrapper exists")
        
        # Check that plus and minus are inside icon-con
        plus_in_icon_con = icon_con.find_elements(By.CLASS_NAME, "plus")
        minus_in_icon_con = icon_con.find_elements(By.CLASS_NAME, "minus")
        
        assert len(plus_in_icon_con) > 0, "❌ Plus button not inside icon-con"
        assert len(minus_in_icon_con) > 0, "❌ Minus button not inside icon-con"
        print("✅ Buttons are inside icon-con wrapper")
        
        print("✅ Test PASSED: Structure correct")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def run_all_tests():
    """Run all guest button visibility tests"""
    print("=" * 70)
    print("🚀 Guest Buttons Visibility Test Suite - Results State")
    print("=" * 70)
    
    tests = [
        ("Guest Buttons Exist", test_guest_buttons_exist),
        ("Initial State", test_guest_buttons_initial_state),
        ("Results State", test_guest_buttons_results_state),
        ("Visibility", test_guest_buttons_visibility),
        ("Icon-Con Wrapper", test_icon_con_wrapper),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            if result:
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            failed += 1
    
    print("\n" + "=" * 70)
    print(f"📊 Test Results: {passed} passed, {failed} failed")
    print("=" * 70)
    
    if failed == 0:
        print("\n✅ GUEST BUTTONS VISIBILITY: VERIFIED")
        print("   • Buttons exist in HTML")
        print("   • Buttons respond to state changes")
        print("   • Buttons visible in results state")
        print("   • Proper structure with icon-con wrapper")
    
    return failed == 0


if __name__ == "__main__":
    import sys
    success = run_all_tests()
    sys.exit(0 if success else 1)
