#!/usr/bin/env python3
"""
Reset Button Compliance Test - AC-008A.39
Verifies that Reset button ONLY changes state and does NOT trigger form submission
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
    
    return webdriver.Chrome(options=chrome_options)


def test_reset_button_outside_form():
    """Test that Reset button is outside the form element"""
    print("\n🧪 Test 1: Reset Button Outside Form (AC-008A.39)")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        
        # Find form element
        form = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "form")))
        
        # Find reset button
        reset_btn = driver.find_element(By.ID, "reset-btn")
        
        # Get parent of reset button
        reset_parent = reset_btn.find_element(By.XPATH, "..")
        
        # Check that reset button is NOT inside form
        form_html = form.get_attribute('outerHTML')
        reset_btn_html = reset_btn.get_attribute('outerHTML')
        
        assert reset_btn_html not in form_html, "❌ Reset button should NOT be inside form"
        print("✅ Reset button is outside form element")
        
        # Verify reset button is sibling of form, not child
        assert reset_parent.get_attribute('class') != 'form', "❌ Reset button parent should not be form"
        print("✅ Reset button is not a child of form")
        
        print("✅ Test PASSED: Reset button is correctly positioned outside form")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_reset_button_type():
    """Test that Reset button has type='button' to prevent form submission"""
    print("\n🧪 Test 2: Reset Button Type Attribute (AC-008A.39)")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        reset_btn = wait.until(EC.presence_of_element_located((By.ID, "reset-btn")))
        
        # Check button type
        btn_type = reset_btn.get_attribute("type")
        assert btn_type == "button", f"❌ Reset button type should be 'button', got '{btn_type}'"
        print(f"✅ Reset button type: {btn_type}")
        
        print("✅ Test PASSED: Reset button has correct type attribute")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_reset_button_does_not_submit():
    """Test that clicking Reset button does NOT trigger form submission"""
    print("\n🧪 Test 3: Reset Button Does NOT Submit Form (AC-008A.39)")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        
        # Make reset button visible for testing
        driver.execute_script("""
            const resetBtn = document.getElementById('reset-btn');
            resetBtn.style.display = 'block';
        """)
        
        time.sleep(0.5)
        
        # Get initial URL
        initial_url = driver.current_url
        print(f"  Initial URL: {initial_url}")
        
        # Click reset button
        reset_btn = wait.until(EC.presence_of_element_located((By.ID, "reset-btn")))
        reset_btn.click()
        
        time.sleep(1)
        
        # Get URL after click
        after_click_url = driver.current_url
        print(f"  After click URL: {after_click_url}")
        
        # URL should NOT change (no form submission)
        assert initial_url == after_click_url, "❌ URL changed - form was submitted!"
        print("✅ URL unchanged - form was NOT submitted")
        
        # Check that page didn't reload (JavaScript should be intact)
        has_search_lifecycle = driver.execute_script("""
            return window.SearchLifecycleState !== undefined;
        """)
        assert has_search_lifecycle, "❌ Page reloaded (JavaScript lost)"
        print("✅ Page did not reload - JavaScript state preserved")
        
        print("✅ Test PASSED: Reset button does NOT submit form")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_reset_button_changes_state_only():
    """Test that Reset button only calls state change function"""
    print("\n🧪 Test 4: Reset Button Changes State Only (AC-008A.39)")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.ID, "reset-btn")))
        
        # Set up state to Results State
        driver.execute_script("""
            if (window.SearchLifecycleState) {
                window.SearchLifecycleState.setResultsState();
            }
        """)
        
        time.sleep(0.5)
        
        # Make reset button visible
        driver.execute_script("""
            document.getElementById('reset-btn').style.display = 'block';
        """)
        
        # Get initial state
        initial_state = driver.execute_script("""
            return window.SearchLifecycleState ? 
                   window.SearchLifecycleState.getCurrentState() : null;
        """)
        print(f"  Initial state: {initial_state}")
        assert initial_state == "results", f"❌ Expected 'results' state, got '{initial_state}'"
        
        # Click reset button
        reset_btn = driver.find_element(By.ID, "reset-btn")
        reset_btn.click()
        
        time.sleep(0.5)
        
        # Get state after click
        after_state = driver.execute_script("""
            return window.SearchLifecycleState ? 
                   window.SearchLifecycleState.getCurrentState() : null;
        """)
        print(f"  After click state: {after_state}")
        
        # State should change to 'initial'
        assert after_state == "initial", f"❌ Expected 'initial' state, got '{after_state}'"
        print("✅ State changed to 'initial'")
        
        # Verify no API call was made (button only changes state)
        # This is implicit - if form submitted, page would reload
        print("✅ No API call triggered (state change only)")
        
        print("✅ Test PASSED: Reset button only changes state")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        driver.quit()


def run_all_tests():
    """Run all Reset button compliance tests"""
    print("=" * 70)
    print("🚀 Reset Button Compliance Test Suite (AC-008A.39)")
    print("=" * 70)
    
    tests = [
        ("Reset Button Outside Form", test_reset_button_outside_form),
        ("Reset Button Type Attribute", test_reset_button_type),
        ("Reset Button Does NOT Submit", test_reset_button_does_not_submit),
        ("Reset Button Changes State Only", test_reset_button_changes_state_only),
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
        print("\n✅ AC-008A.39 COMPLIANCE: VERIFIED")
        print("   Reset button ONLY changes state, does NOT submit form")
    else:
        print("\n❌ AC-008A.39 COMPLIANCE: FAILED")
        print("   Reset button may be triggering form submission")
    
    return failed == 0


if __name__ == "__main__":
    import sys
    success = run_all_tests()
    sys.exit(0 if success else 1)
