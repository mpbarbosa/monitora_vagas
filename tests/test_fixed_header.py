#!/usr/bin/env python3
"""
Fixed Header Test Suite
Tests the fixed header implementation in index.html
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
    chrome_options.add_argument('--window-size=1920,1080')
    
    return webdriver.Chrome(options=chrome_options)


def test_header_exists():
    """Test that fixed header exists in the page"""
    print("\n🧪 Test 1: Fixed Header Exists")
    
    driver = setup_driver()
    try:
        # Load page
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        # Wait for header
        wait = WebDriverWait(driver, 10)
        header = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "fixed-header")))
        
        assert header is not None, "❌ Fixed header not found"
        print("✅ Fixed header element found")
        
        # Check for navbar
        navbar = header.find_element(By.CLASS_NAME, "navbar")
        assert navbar is not None, "❌ Navbar not found"
        print("✅ Navbar element found")
        
        # Check navbar brand
        brand = navbar.find_element(By.CLASS_NAME, "navbar-brand")
        assert "Monitora Vagas AFPESP" in brand.text, "❌ Brand text incorrect"
        print(f"✅ Brand text: {brand.text}")
        
        print("✅ Test PASSED: Fixed Header Exists")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_header_is_fixed():
    """Test that header has fixed positioning"""
    print("\n🧪 Test 2: Header is Fixed (position: fixed)")
    
    driver = setup_driver()
    try:
        # Load page
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        # Wait for header
        wait = WebDriverWait(driver, 10)
        header = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "fixed-header")))
        
        # Check CSS position
        position = header.value_of_css_property("position")
        assert position == "fixed", f"❌ Position should be 'fixed', got '{position}'"
        print(f"✅ Header position: {position}")
        
        # Check z-index
        z_index = header.value_of_css_property("z-index")
        assert int(z_index) >= 1000, f"❌ Z-index should be >= 1000, got {z_index}"
        print(f"✅ Header z-index: {z_index}")
        
        # Check top position
        top = header.value_of_css_property("top")
        assert top == "0px", f"❌ Top should be 0px, got {top}"
        print(f"✅ Header top: {top}")
        
        print("✅ Test PASSED: Header is Fixed")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_header_navigation():
    """Test header navigation elements"""
    print("\n🧪 Test 3: Header Navigation Elements")
    
    driver = setup_driver()
    try:
        # Load page
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        # Wait for header
        wait = WebDriverWait(driver, 10)
        header = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "fixed-header")))
        
        # Check navigation items
        nav_items = header.find_elements(By.CLASS_NAME, "nav-item")
        assert len(nav_items) >= 2, f"❌ Should have at least 2 nav items, found {len(nav_items)}"
        print(f"✅ Found {len(nav_items)} navigation items")
        
        # Check for icons
        icons = header.find_elements(By.TAG_NAME, "i")
        assert len(icons) >= 2, f"❌ Should have at least 2 icons, found {len(icons)}"
        print(f"✅ Found {len(icons)} icons")
        
        # Check version number
        nav_links = header.find_elements(By.CLASS_NAME, "nav-link")
        version_found = False
        for link in nav_links:
            if "v2.0.0" in link.text:
                version_found = True
                print(f"✅ Version number found: {link.text.strip()}")
                break
        
        assert version_found, "❌ Version number not found in header"
        
        print("✅ Test PASSED: Header Navigation Elements")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_header_responsive():
    """Test header responsive behavior"""
    print("\n🧪 Test 4: Header Responsive (Mobile Menu)")
    
    driver = setup_driver()
    try:
        # Load page
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        # Wait for header
        wait = WebDriverWait(driver, 10)
        header = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "fixed-header")))
        
        # Check for navbar toggler (hamburger menu)
        toggler = header.find_element(By.CLASS_NAME, "navbar-toggler")
        assert toggler is not None, "❌ Navbar toggler not found"
        print("✅ Navbar toggler found (hamburger menu)")
        
        # Check toggler attributes
        target = toggler.get_attribute("data-bs-target")
        assert target == "#navbarNav", f"❌ Toggler target incorrect: {target}"
        print(f"✅ Toggler target: {target}")
        
        # Check collapsible nav
        navbar_nav = header.find_element(By.ID, "navbarNav")
        assert navbar_nav is not None, "❌ Collapsible nav not found"
        print("✅ Collapsible navigation found")
        
        print("✅ Test PASSED: Header Responsive")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_body_padding():
    """Test that body has proper padding for fixed header"""
    print("\n🧪 Test 5: Body Padding for Fixed Header")
    
    driver = setup_driver()
    try:
        # Load page
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        # Wait for page load
        time.sleep(1)
        
        # Check body padding-top
        body = driver.find_element(By.TAG_NAME, "body")
        padding_top = body.value_of_css_property("padding-top")
        
        # Should have some padding (at least 50px for header)
        padding_value = float(padding_top.replace("px", ""))
        assert padding_value >= 50, f"❌ Body padding-top should be >= 50px, got {padding_top}"
        print(f"✅ Body padding-top: {padding_top}")
        
        print("✅ Test PASSED: Body Padding")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_header_visibility_on_scroll():
    """Test that header remains visible when scrolling"""
    print("\n🧪 Test 6: Header Remains Visible on Scroll")
    
    driver = setup_driver()
    try:
        # Load page
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        # Wait for header
        wait = WebDriverWait(driver, 10)
        header = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "fixed-header")))
        
        # Get initial position
        initial_rect = header.rect
        print(f"  Initial header position - Top: {initial_rect['y']}, Left: {initial_rect['x']}")
        
        # Scroll down
        driver.execute_script("window.scrollTo(0, 500);")
        time.sleep(0.5)
        
        # Get position after scroll
        after_scroll_rect = header.rect
        print(f"  After scroll header position - Top: {after_scroll_rect['y']}, Left: {after_scroll_rect['x']}")
        
        # Header should stay at top (y position shouldn't change significantly)
        assert abs(initial_rect['y'] - after_scroll_rect['y']) < 5, "❌ Header moved on scroll"
        print("✅ Header remained fixed at top during scroll")
        
        # Check visibility
        assert header.is_displayed(), "❌ Header not visible after scroll"
        print("✅ Header remains visible after scroll")
        
        print("✅ Test PASSED: Header Visibility on Scroll")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def run_all_tests():
    """Run all fixed header tests"""
    print("=" * 70)
    print("🚀 Fixed Header Test Suite")
    print("=" * 70)
    
    tests = [
        ("Header Exists", test_header_exists),
        ("Header is Fixed", test_header_is_fixed),
        ("Navigation Elements", test_header_navigation),
        ("Responsive Design", test_header_responsive),
        ("Body Padding", test_body_padding),
        ("Visibility on Scroll", test_header_visibility_on_scroll),
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
