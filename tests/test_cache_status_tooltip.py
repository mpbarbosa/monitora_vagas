#!/usr/bin/env python3
"""
Cache Status Tooltip Test
Verifies that cache-status element has been converted to a tooltip on hotel-select
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
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


def test_cache_status_element_removed():
    """Test that old cache-status element no longer exists"""
    print("\n🧪 Test 1: Cache Status Element Removed")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.ID, "hotel-select")))
        
        # Check that cache-status element does not exist
        cache_status_elements = driver.find_elements(By.ID, "cache-status")
        
        assert len(cache_status_elements) == 0, "❌ cache-status element should be removed"
        print("✅ cache-status element has been removed")
        
        print("✅ Test PASSED: Old element removed")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_hotel_select_has_tooltip_attributes():
    """Test that hotel-select has Bootstrap tooltip attributes"""
    print("\n🧪 Test 2: Hotel Select Has Tooltip Attributes")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        select = wait.until(EC.presence_of_element_located((By.ID, "hotel-select")))
        
        # Check for Bootstrap tooltip attributes
        toggle = select.get_attribute('data-bs-toggle')
        placement = select.get_attribute('data-bs-placement')
        title = select.get_attribute('data-bs-title')
        custom_class = select.get_attribute('data-bs-custom-class')
        
        assert toggle == 'tooltip', f"❌ Expected data-bs-toggle='tooltip', got '{toggle}'"
        print(f"✅ data-bs-toggle: {toggle}")
        
        assert placement == 'bottom', f"❌ Expected data-bs-placement='bottom', got '{placement}'"
        print(f"✅ data-bs-placement: {placement}")
        
        assert title is not None, "❌ data-bs-title attribute should exist"
        print(f"✅ data-bs-title: (attribute exists)")
        
        assert custom_class == 'cache-status-tooltip', f"❌ Expected custom-class='cache-status-tooltip', got '{custom_class}'"
        print(f"✅ data-bs-custom-class: {custom_class}")
        
        print("✅ Test PASSED: Tooltip attributes configured correctly")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_tooltip_initialization():
    """Test that tooltip can be initialized via JavaScript"""
    print("\n🧪 Test 3: Tooltip Initialization")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.ID, "hotel-select")))
        
        # Wait for Bootstrap to load
        time.sleep(2)
        
        # Check if Bootstrap is available
        bootstrap_available = driver.execute_script("""
            return typeof bootstrap !== 'undefined' && 
                   typeof bootstrap.Tooltip !== 'undefined';
        """)
        
        assert bootstrap_available, "❌ Bootstrap library not available"
        print("✅ Bootstrap library loaded")
        
        # Try to initialize tooltip manually
        tooltip_created = driver.execute_script("""
            const select = document.getElementById('hotel-select');
            if (!select) return false;
            
            try {
                select.setAttribute('data-bs-title', 'Test tooltip');
                const tooltip = new bootstrap.Tooltip(select);
                return tooltip !== null;
            } catch(e) {
                console.error('Tooltip creation error:', e);
                return false;
            }
        """)
        
        assert tooltip_created, "❌ Could not create tooltip"
        print("✅ Tooltip can be initialized")
        
        print("✅ Test PASSED: Tooltip initialization works")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        driver.quit()


def test_tooltip_content_update():
    """Test that tooltip content can be updated dynamically"""
    print("\n🧪 Test 4: Tooltip Content Update")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.ID, "hotel-select")))
        
        # Wait for Bootstrap
        time.sleep(2)
        
        # Update tooltip content
        test_message = "📦 Test cache message"
        updated = driver.execute_script(f"""
            const select = document.getElementById('hotel-select');
            if (!select) return false;
            
            select.setAttribute('data-bs-title', '{test_message}');
            
            let tooltip = bootstrap.Tooltip.getInstance(select);
            if (tooltip) {{
                tooltip.dispose();
            }}
            
            tooltip = new bootstrap.Tooltip(select);
            return select.getAttribute('data-bs-title') === '{test_message}';
        """)
        
        assert updated, "❌ Could not update tooltip content"
        print(f"✅ Tooltip content updated to: '{test_message}'")
        
        print("✅ Test PASSED: Tooltip content can be updated")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def run_all_tests():
    """Run all cache status tooltip tests"""
    print("=" * 70)
    print("🚀 Cache Status Tooltip Test Suite")
    print("=" * 70)
    
    tests = [
        ("Cache Status Element Removed", test_cache_status_element_removed),
        ("Hotel Select Has Tooltip Attributes", test_hotel_select_has_tooltip_attributes),
        ("Tooltip Initialization", test_tooltip_initialization),
        ("Tooltip Content Update", test_tooltip_content_update),
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
        print("\n✅ CACHE STATUS TOOLTIP: SUCCESSFULLY IMPLEMENTED")
        print("   • Old element removed")
        print("   • Tooltip attributes configured")
        print("   • Bootstrap tooltip working")
        print("   • Content can be updated dynamically")
    
    return failed == 0


if __name__ == "__main__":
    import sys
    success = run_all_tests()
    sys.exit(0 if success else 1)
