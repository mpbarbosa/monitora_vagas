#!/usr/bin/env python3
"""
Test Suite: Guest Button State Differentiation
Tests visual state changes for plus/minus buttons across search lifecycle
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from pathlib import Path
import time


def setup_driver():
    """Setup Chrome WebDriver with headless options"""
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    
    return webdriver.Chrome(options=chrome_options)


def test_initial_state():
    """Test guest buttons in initial state (before search)"""
    print("\n🧪 Test 1: Initial State - Guest Buttons")
    
    driver = setup_driver()
    try:
        # Load page
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        # Wait for page load
        wait = WebDriverWait(driver, 10)
        plus_btn = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "plus")))
        minus_btn = driver.find_element(By.CLASS_NAME, "minus")
        
        # Check initial state class
        plus_classes = plus_btn.get_attribute("class")
        minus_classes = minus_btn.get_attribute("class")
        
        assert "state-initial" in plus_classes, f"❌ Plus button missing state-initial class: {plus_classes}"
        assert "state-initial" in minus_classes, f"❌ Minus button missing state-initial class: {minus_classes}"
        
        print(f"✅ Plus button classes: {plus_classes}")
        print(f"✅ Minus button classes: {minus_classes}")
        
        # Check visual properties (disabled state)
        plus_opacity = plus_btn.value_of_css_property("opacity")
        plus_cursor = plus_btn.value_of_css_property("cursor")
        
        print(f"✅ Plus button opacity: {plus_opacity} (should be ~0.3)")
        print(f"✅ Plus button cursor: {plus_cursor} (should be not-allowed)")
        
        # Check aria-disabled attribute
        assert plus_btn.get_attribute("aria-disabled") == "true", "❌ Plus button should have aria-disabled=true"
        assert minus_btn.get_attribute("aria-disabled") == "true", "❌ Minus button should have aria-disabled=true"
        
        print("✅ ARIA attributes correctly set")
        print("✅ Initial State Test PASSED")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False
        
    finally:
        driver.quit()


def test_state_transitions():
    """Test guest buttons state transitions through search lifecycle"""
    print("\n🧪 Test 2: State Transitions - Guest Buttons")
    
    driver = setup_driver()
    try:
        # Load page
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        
        # Get buttons
        plus_btn = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "plus")))
        minus_btn = driver.find_element(By.CLASS_NAME, "minus")
        
        # 1. Initial State
        print("  📍 Checking Initial State...")
        initial_classes = plus_btn.get_attribute("class")
        assert "state-initial" in initial_classes, "❌ Should start in state-initial"
        print("  ✅ Confirmed: state-initial")
        
        # 2. Trigger search (simulate by calling JS function)
        driver.execute_script("""
            if (window.SearchLifecycleState) {
                window.SearchLifecycleState.setSearchingState();
            }
        """)
        
        time.sleep(0.5)  # Wait for state change
        
        # Check searching state
        print("  📍 Checking Searching State...")
        searching_classes = plus_btn.get_attribute("class")
        assert "state-searching" in searching_classes, f"❌ Should be in state-searching: {searching_classes}"
        assert "state-initial" not in searching_classes, "❌ state-initial should be removed"
        print("  ✅ Confirmed: state-searching")
        
        # Check visual properties (searching state)
        opacity = plus_btn.value_of_css_property("opacity")
        cursor = plus_btn.value_of_css_property("cursor")
        print(f"  ✅ Searching state - opacity: {opacity}, cursor: {cursor}")
        
        # 3. Complete search (simulate results state)
        driver.execute_script("""
            if (window.SearchLifecycleState) {
                window.SearchLifecycleState.setResultsState();
            }
            if (window.GuestFilterStateManager) {
                window.GuestFilterStateManager.enable();
            }
        """)
        
        time.sleep(0.5)  # Wait for state change
        
        # Check results state
        print("  📍 Checking Results State...")
        results_classes = plus_btn.get_attribute("class")
        assert "state-results" in results_classes, f"❌ Should be in state-results: {results_classes}"
        assert "state-searching" not in results_classes, "❌ state-searching should be removed"
        print("  ✅ Confirmed: state-results")
        
        # Check visual properties (enabled state)
        opacity = plus_btn.value_of_css_property("opacity")
        cursor = plus_btn.value_of_css_property("cursor")
        color = plus_btn.value_of_css_property("color")
        print(f"  ✅ Results state - opacity: {opacity}, cursor: {cursor}")
        print(f"  ✅ Results state - color: {color} (should be green)")
        
        # 4. Reset to initial state (via Reset button)
        driver.execute_script("""
            if (window.SearchLifecycleState) {
                window.SearchLifecycleState.handleReset();
            }
        """)
        
        time.sleep(0.5)  # Wait for state change
        
        # Check back to initial state
        print("  📍 Checking Back to Initial State...")
        back_to_initial = plus_btn.get_attribute("class")
        assert "state-initial" in back_to_initial, f"❌ Should be back to state-initial: {back_to_initial}"
        assert "state-results" not in back_to_initial, "❌ state-results should be removed"
        print("  ✅ Confirmed: back to state-initial")
        
        print("✅ State Transitions Test PASSED")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        driver.quit()


def test_css_properties():
    """Test specific CSS properties for each state"""
    print("\n🧪 Test 3: CSS Properties per State")
    
    driver = setup_driver()
    try:
        # Load page
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        plus_btn = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "plus")))
        
        # Test each state
        states = ['initial', 'searching', 'results']
        
        for state in states:
            print(f"  📍 Testing CSS for state: {state}")
            
            # Set state
            driver.execute_script(f"""
                const plusBtn = document.querySelector('.plus');
                const minusBtn = document.querySelector('.minus');
                ['state-initial', 'state-searching', 'state-results'].forEach(cls => {{
                    plusBtn.classList.remove(cls);
                    minusBtn.classList.remove(cls);
                }});
                plusBtn.classList.add('state-{state}');
                minusBtn.classList.add('state-{state}');
            """)
            
            time.sleep(0.3)
            
            # Get computed styles
            opacity = plus_btn.value_of_css_property("opacity")
            cursor = plus_btn.value_of_css_property("cursor")
            background = plus_btn.value_of_css_property("background-color")
            border = plus_btn.value_of_css_property("border-color")
            
            print(f"    - Opacity: {opacity}")
            print(f"    - Cursor: {cursor}")
            print(f"    - Background: {background}")
            print(f"    - Border: {border}")
            
            # State-specific validations
            if state == 'initial':
                # Should be very transparent and disabled
                assert float(opacity) <= 0.5, f"Initial state opacity should be low: {opacity}"
            
            elif state == 'searching':
                # Should be slightly more visible than initial
                assert float(opacity) <= 0.7, f"Searching state opacity should be medium: {opacity}"
                assert cursor == 'wait', f"Searching state cursor should be 'wait': {cursor}"
            
            elif state == 'results':
                # Should be fully visible and interactive
                assert float(opacity) >= 0.9, f"Results state opacity should be high: {opacity}"
                assert cursor == 'pointer', f"Results state cursor should be 'pointer': {cursor}"
            
            print(f"  ✅ CSS properties valid for state: {state}")
        
        print("✅ CSS Properties Test PASSED")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False
        
    finally:
        driver.quit()


def run_all_tests():
    """Run all guest button state tests"""
    print("=" * 70)
    print("🚀 Guest Button State Differentiation Test Suite")
    print("=" * 70)
    
    tests = [
        ("Initial State", test_initial_state),
        ("State Transitions", test_state_transitions),
        ("CSS Properties", test_css_properties),
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
    
    return failed == 0


if __name__ == "__main__":
    import sys
    success = run_all_tests()
    sys.exit(0 if success else 1)
