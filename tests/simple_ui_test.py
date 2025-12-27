#!/usr/bin/env python3
"""
Simple Selenium UI Test Runner
Simplified version that tests the Trade Union Hotel Search Platform
"""

import subprocess
import sys
import os
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    # Check Python
    try:
        import subprocess
        result = subprocess.run([sys.executable, '--version'], capture_output=True, text=True)
        print(f"✅ Python: {result.stdout.strip()}")
    except Exception as e:
        print(f"❌ Python check failed: {e}")
        return False
    
    # Check Selenium
    try:
        import selenium
        from selenium.webdriver.chrome.service import Service
        print(f"✅ Selenium: {selenium.__version__}")
    except ImportError:
        print("❌ Selenium not installed")
        print("💡 Install with: pip install selenium")
        return False
    
    # Check Chrome/Chromium
    chrome_found = False
    for cmd in ['google-chrome', 'chromium-browser', 'chromium']:
        try:
            result = subprocess.run([cmd, '--version'], capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Browser: {result.stdout.strip()}")
                chrome_found = True
                break
        except FileNotFoundError:
            continue
    
    if not chrome_found:
        print("❌ Chrome/Chromium not found")
        print("💡 Install Chrome or Chromium browser")
        return False
    
    return True

def install_selenium():
    """Install Selenium if not present"""
    print("📦 Installing Selenium...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'selenium'], check=True)
        print("✅ Selenium installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install Selenium: {e}")
        return False

def run_simple_test():
    """
    Run a simple test to verify the setup works
    Uses pytest to leverage fixtures and better error reporting
    """
    print("\n🧪 Running simple browser test via pytest...")
    
    import subprocess
    import sys
    
    # Run pytest with this test file
    result = subprocess.run(
        [sys.executable, "-m", "pytest", __file__, "-v", "--tb=short"],
        capture_output=False
    )
    
    return result.returncode == 0


# ============================================================================
# Pytest Test Cases (using conftest.py fixtures)
# ============================================================================

def test_page_loads(driver_function, web_server):
    """
    Test that the main page loads successfully
    Uses session-scoped web server and function-scoped driver
    """
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    url = f"{web_server}/index.html"
    print(f"🔗 Loading: {url}")
    
    driver_function.get(url)
    
    # Wait for title
    WebDriverWait(driver_function, 10).until(
        EC.title_contains("Hotéis Sindicais")
    )
    
    title = driver_function.title
    print(f"✅ Page loaded: {title}")
    assert "Hotéis Sindicais" in title


def test_main_container_exists(driver_function, web_server):
    """Test that the results container element exists"""
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    url = f"{web_server}/index.html"
    driver_function.get(url)
    
    # Wait for results container
    WebDriverWait(driver_function, 10).until(
        EC.presence_of_element_located((By.ID, "results-container"))
    )
    
    results_element = driver_function.find_element(By.ID, "results-container")
    assert results_element is not None
    print("✅ Results container found")


def test_navigation_exists(driver_function, web_server):
    """Test that navigation element exists"""
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    url = f"{web_server}/index.html"
    driver_function.get(url)
    
    # Wait for navigation
    WebDriverWait(driver_function, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "navbar-brand"))
    )
    
    nav_element = driver_function.find_element(By.CLASS_NAME, "navbar-brand")
    nav_text = nav_element.text
    print(f"✅ Navigation found: {nav_text}")
    assert len(nav_text) > 0

def main():
    """Main test runner"""
    print("=" * 60)
    print("🏨 Busca de Vagas em Hotéis Sindicais - UI Test")
    print("=" * 60)
    
    # Check current directory
    current_dir = Path.cwd()
    print(f"📂 Current directory: {current_dir}")
    
    # Check if we're in the right place
    if not (current_dir / "public" / "index.html").exists():
        print("❌ index.html not found in public/ directory")
        print("💡 Make sure you're in the project root directory")
        return False
    
    # Check dependencies
    if not check_dependencies():
        print("\n📦 Attempting to install missing dependencies...")
        if not install_selenium():
            return False
        print("🔄 Please restart the test after installation")
        return False
    
    # Run the test
    success = run_simple_test()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 TEST PASSED - Your web UI is working!")
    else:
        print("❌ TEST FAILED - Check the errors above")
    print("=" * 60)
    
    return success

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⏹️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)