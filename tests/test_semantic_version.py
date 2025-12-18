#!/usr/bin/env python3
"""
Semantic Versioning Test Suite
Tests the version number display in public/index.html
"""

import re
import json
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options


def get_package_version():
    """Get version from package.json"""
    package_path = Path(__file__).parent.parent / "package.json"
    with open(package_path, 'r') as f:
        package_data = json.load(f)
    return package_data.get('version')


def validate_semver_format(version_string):
    """
    Validate semantic versioning format: MAJOR.MINOR.PATCH
    Returns True if valid, False otherwise
    """
    # Remove 'v' prefix if present
    version = version_string.lstrip('v')
    
    # Semantic versioning pattern: X.Y.Z or X.Y.Z-prerelease+build
    semver_pattern = r'^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$'
    
    return bool(re.match(semver_pattern, version))


def test_version_in_html_file():
    """Test that version exists in HTML file"""
    print("\n🧪 Test 1: Version exists in HTML file")
    
    html_path = Path(__file__).parent.parent / "public" / "index.html"
    with open(html_path, 'r') as f:
        html_content = f.read()
    
    # Check for version footer
    assert 'version-footer' in html_content, "❌ version-footer class not found in HTML"
    print("✅ version-footer class found in HTML")
    
    # Extract version number
    version_pattern = r'<small>v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+)?)</small>'
    match = re.search(version_pattern, html_content)
    
    assert match, "❌ Version number not found in HTML"
    version = match.group(1)
    print(f"✅ Version found in HTML: v{version}")
    
    return version


def test_version_format():
    """Test that version follows semantic versioning format"""
    print("\n🧪 Test 2: Version format validation")
    
    html_path = Path(__file__).parent.parent / "public" / "index.html"
    with open(html_path, 'r') as f:
        html_content = f.read()
    
    version_pattern = r'<small>(v?\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+)?)</small>'
    match = re.search(version_pattern, html_content)
    
    assert match, "❌ Version not found"
    version_string = match.group(1)
    
    assert validate_semver_format(version_string), f"❌ Invalid semantic version format: {version_string}"
    print(f"✅ Version follows semantic versioning format: {version_string}")


def test_version_matches_package_json():
    """Test that HTML version matches package.json version"""
    print("\n🧪 Test 3: Version matches package.json")
    
    # Get version from HTML
    html_path = Path(__file__).parent.parent / "public" / "index.html"
    with open(html_path, 'r') as f:
        html_content = f.read()
    
    version_pattern = r'<small>v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+)?)</small>'
    match = re.search(version_pattern, html_content)
    
    assert match, "❌ Version not found in HTML"
    html_version = match.group(1)
    
    # Get version from package.json
    package_version = get_package_version()
    
    assert html_version == package_version, f"❌ Version mismatch: HTML={html_version}, package.json={package_version}"
    print(f"✅ Versions match: v{html_version}")


def test_version_css_styling():
    """Test that version footer CSS exists"""
    print("\n🧪 Test 4: CSS styling exists")
    
    css_path = Path(__file__).parent.parent / "public" / "src" / "styles" / "index-page.css"
    with open(css_path, 'r') as f:
        css_content = f.read()
    
    assert '.version-footer' in css_content, "❌ .version-footer CSS class not found"
    print("✅ .version-footer CSS class found")
    
    # Check for basic styling properties
    assert 'text-align' in css_content, "❌ text-align property not found in CSS"
    assert 'padding' in css_content, "❌ padding property not found in CSS"
    print("✅ CSS styling properties found")


def test_version_display_selenium():
    """Test version display using Selenium WebDriver"""
    print("\n🧪 Test 5: Version display in browser (Selenium)")
    
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    
    driver = None
    try:
        driver = webdriver.Chrome(options=chrome_options)
        
        # Load the page
        html_path = Path(__file__).parent.parent / "public" / "index.html"
        driver.get(f"file://{html_path.absolute()}")
        
        # Wait for version footer
        wait = WebDriverWait(driver, 10)
        version_element = wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "version-footer"))
        )
        
        assert version_element.is_displayed(), "❌ Version footer is not visible"
        print("✅ Version footer is visible in browser")
        
        # Get version text
        version_text = version_element.text.strip()
        assert version_text, "❌ Version text is empty"
        assert validate_semver_format(version_text), f"❌ Invalid version format: {version_text}"
        print(f"✅ Version displayed correctly: {version_text}")
        
        # Check CSS styling
        font_size = version_element.find_element(By.TAG_NAME, "small").value_of_css_property("font-size")
        text_align = version_element.value_of_css_property("text-align")
        
        print(f"✅ CSS applied - text-align: {text_align}, font-size: {font_size}")
        
        return True
        
    except Exception as e:
        print(f"❌ Selenium test failed: {e}")
        return False
        
    finally:
        if driver:
            driver.quit()


def test_version_accessibility():
    """Test version accessibility features"""
    print("\n🧪 Test 6: Version accessibility")
    
    html_path = Path(__file__).parent.parent / "public" / "index.html"
    with open(html_path, 'r') as f:
        html_content = f.read()
    
    # Check for semantic HTML (footer and small tags)
    assert '<footer class="version-footer">' in html_content, "❌ Semantic <footer> tag not used"
    print("✅ Semantic <footer> tag used")
    
    assert '<small>' in html_content, "❌ <small> tag not used for version text"
    print("✅ <small> tag used for version text (proper semantic HTML)")


def run_all_tests():
    """Run all version tests"""
    print("=" * 60)
    print("🚀 Semantic Versioning Test Suite")
    print("=" * 60)
    
    tests = [
        ("Version in HTML file", test_version_in_html_file),
        ("Version format validation", test_version_format),
        ("Version matches package.json", test_version_matches_package_json),
        ("CSS styling", test_version_css_styling),
        ("Version display (Selenium)", test_version_display_selenium),
        ("Accessibility", test_version_accessibility),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            if result is not False:
                passed += 1
        except AssertionError as e:
            print(f"❌ Test failed: {e}")
            failed += 1
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed} passed, {failed} failed")
    print("=" * 60)
    
    return failed == 0


if __name__ == "__main__":
    import sys
    success = run_all_tests()
    sys.exit(0 if success else 1)
