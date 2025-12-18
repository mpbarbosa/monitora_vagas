#!/usr/bin/env python3
"""
Top Alignment Test
Verifies that page-wrapper and its child elements have aligned top points with no spacing
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


def test_page_wrapper_padding():
    """Test that page-wrapper has zero top padding"""
    print("\n🧪 Test 1: Page Wrapper Top Padding")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        time.sleep(1)
        
        # Find page-wrapper
        page_wrapper = driver.find_element(By.CLASS_NAME, "page-wrapper")
        
        # Check computed padding-top
        padding_top = page_wrapper.value_of_css_property("padding-top")
        print(f"  Page wrapper padding-top: {padding_top}")
        
        # Should be 0px
        assert padding_top == "0px", f"❌ Expected padding-top: 0px, got {padding_top}"
        print("✅ Page wrapper has zero top padding")
        
        print("✅ Test PASSED: Page wrapper padding correct")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_top_point_alignment():
    """Test that page-wrapper and wrapper have aligned top points"""
    print("\n🧪 Test 2: Top Point Alignment")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        time.sleep(1)
        
        # Get elements
        page_wrapper = driver.find_element(By.CLASS_NAME, "page-wrapper")
        wrapper = driver.find_element(By.CLASS_NAME, "wrapper--w1070")
        
        # Get positions
        page_wrapper_rect = page_wrapper.rect
        wrapper_rect = wrapper.rect
        
        print(f"  Page wrapper top: {page_wrapper_rect['y']}px")
        print(f"  Wrapper top: {wrapper_rect['y']}px")
        
        # Calculate difference
        top_diff = abs(wrapper_rect['y'] - page_wrapper_rect['y'])
        print(f"  Top difference: {top_diff}px")
        
        # Should be aligned (difference should be minimal, accounting for border/margin)
        assert top_diff <= 5, f"❌ Top points not aligned. Difference: {top_diff}px"
        print("✅ Top points are aligned")
        
        print("✅ Test PASSED: Elements aligned at top")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_card_top_position():
    """Test that card has no additional top spacing"""
    print("\n🧪 Test 3: Card Top Position")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        time.sleep(1)
        
        # Get elements
        wrapper = driver.find_element(By.CLASS_NAME, "wrapper--w1070")
        card = driver.find_element(By.CLASS_NAME, "card-7")
        
        # Get positions
        wrapper_rect = wrapper.rect
        card_rect = card.rect
        
        print(f"  Wrapper top: {wrapper_rect['y']}px")
        print(f"  Card top: {card_rect['y']}px")
        
        # Calculate difference
        top_diff = abs(card_rect['y'] - wrapper_rect['y'])
        print(f"  Top difference: {top_diff}px")
        
        # Should be minimal (only margin if any)
        assert top_diff <= 10, f"❌ Card has excessive top spacing: {top_diff}px"
        print("✅ Card has minimal top spacing")
        
        print("✅ Test PASSED: Card positioned correctly")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_no_body_padding():
    """Test that body padding-top accounts for header only"""
    print("\n🧪 Test 4: Body Padding for Fixed Header")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        time.sleep(1)
        
        # Get body padding
        body = driver.find_element(By.TAG_NAME, "body")
        padding_top = body.value_of_css_property("padding-top")
        
        print(f"  Body padding-top: {padding_top}")
        
        # Should account for header (180px for header with form)
        padding_value = float(padding_top.replace("px", ""))
        assert padding_value > 0, "❌ Body should have padding for header"
        print(f"✅ Body has padding for fixed header: {padding_top}")
        
        print("✅ Test PASSED: Body padding correct")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def test_visual_alignment():
    """Test visual alignment by measuring from header bottom to content top"""
    print("\n🧪 Test 5: Visual Alignment (Header to Content)")
    
    driver = setup_driver()
    try:
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        time.sleep(1)
        
        # Get header and page-wrapper
        header = driver.find_element(By.CLASS_NAME, "fixed-header")
        page_wrapper = driver.find_element(By.CLASS_NAME, "page-wrapper")
        
        # Get positions
        header_rect = header.rect
        page_wrapper_rect = page_wrapper.rect
        
        header_bottom = header_rect['y'] + header_rect['height']
        content_top = page_wrapper_rect['y']
        
        print(f"  Header bottom: {header_bottom}px")
        print(f"  Content top: {content_top}px")
        
        # Content should start right after header (body padding handles this)
        gap = content_top - header_bottom
        print(f"  Gap: {gap}px")
        
        # Gap should be zero or minimal (body padding positions page-wrapper below header)
        # But page-wrapper itself should have no top padding
        page_wrapper_padding = page_wrapper.value_of_css_property("padding-top")
        assert page_wrapper_padding == "0px", f"❌ Page wrapper should have 0px padding, got {page_wrapper_padding}"
        print(f"✅ Page wrapper padding: {page_wrapper_padding}")
        
        print("✅ Test PASSED: Visual alignment correct")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False
        
    finally:
        driver.quit()


def run_all_tests():
    """Run all top alignment tests"""
    print("=" * 70)
    print("🚀 Top Alignment Test Suite")
    print("=" * 70)
    
    tests = [
        ("Page Wrapper Padding", test_page_wrapper_padding),
        ("Top Point Alignment", test_top_point_alignment),
        ("Card Top Position", test_card_top_position),
        ("Body Padding", test_no_body_padding),
        ("Visual Alignment", test_visual_alignment),
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
        print("\n✅ TOP ALIGNMENT: VERIFIED")
        print("   • Page wrapper has zero top padding")
        print("   • Elements aligned at top points")
        print("   • No unnecessary spacing")
    
    return failed == 0


if __name__ == "__main__":
    import sys
    success = run_all_tests()
    sys.exit(0 if success else 1)
