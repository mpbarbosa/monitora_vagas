"""
Selenium WebDriver Configuration
Handles Chrome binary detection across different environments
"""
import os
import shutil
from pathlib import Path

def get_chrome_binary_path():
    """
    Auto-detect Chrome binary location
    Returns: Path to Chrome binary or None
    """
    possible_paths = [
        "/opt/google/chrome/chrome",  # Direct binary (Linux) - REQUIRED for ChromeDriver 143+
        "/opt/google/chrome/google-chrome",  # Wrapper script (may not work)
        "/usr/bin/google-chrome-stable",  # Stable channel symlink
        "/usr/bin/google-chrome",  # Generic symlink
        "/usr/bin/chromium-browser",  # Chromium fallback
        "/snap/chromium/current/usr/lib/chromium-browser/chrome",  # Snap install
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",  # macOS
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",  # Windows
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",  # Windows 32-bit
    ]
    
    print("🔍 Searching for Chrome binary...")
    for path in possible_paths:
        if os.path.exists(path):
            # Check if executable (skip on Windows)
            if os.name != 'nt':
                if not os.access(path, os.X_OK):
                    print(f"   ⚠️ Found but not executable: {path}")
                    continue
            print(f"   ✅ Found Chrome: {path}")
            return path
        else:
            print(f"   ❌ Not found: {path}")
    
    print("   ⚠️ Chrome binary not found in standard locations")
    return None

def get_chromedriver_path():
    """
    Auto-detect ChromeDriver location
    Returns: Path to chromedriver executable
    """
    print("🔍 Searching for ChromeDriver...")
    
    # Try to find in PATH
    driver_path = shutil.which("chromedriver")
    if driver_path:
        print(f"   ✅ Found ChromeDriver: {driver_path}")
        return driver_path
    
    # Fallback to common locations
    fallback_paths = [
        "/usr/bin/chromedriver",
        "/usr/local/bin/chromedriver",
        "/snap/bin/chromedriver",
    ]
    
    for path in fallback_paths:
        if os.path.exists(path):
            print(f"   ✅ Found ChromeDriver: {path}")
            return path
    
    print("   ⚠️ ChromeDriver not found, using default")
    return "chromedriver"  # Let Selenium handle it

def get_chrome_options():
    """
    Get configured Chrome options with proper binary detection
    Returns: Configured Options object
    """
    from selenium.webdriver.chrome.options import Options
    
    options = Options()
    
    # DON'T set binary_location explicitly - let ChromeDriver find Chrome via PATH
    # ChromeDriver 143+ can properly resolve Chrome from system paths
    # Setting explicit path causes "no chrome binary" errors
    print("📍 Using ChromeDriver auto-detection for Chrome binary")
    
    # Headless configuration (Chrome 109+)
    options.add_argument("--headless=new")
    
    # Stability arguments
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    
    # Window size
    options.add_argument("--window-size=1920,1080")
    
    # Disable extensions
    options.add_argument("--disable-extensions")
    
    # Performance optimizations
    options.add_argument("--disable-features=VizDisplayCompositor")
    options.add_argument("--disable-software-rasterizer")
    
    # Reduce logging noise
    options.add_argument("--log-level=3")
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    
    return options

def create_chrome_driver():
    """
    Create and return a configured Chrome WebDriver
    Returns: webdriver.Chrome instance
    """
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    
    print("\n🚀 Initializing Chrome WebDriver...")
    
    # Get configuration
    options = get_chrome_options()
    driver_path = get_chromedriver_path()
    
    # Create service
    service = Service(executable_path=driver_path)
    
    # Create driver
    try:
        driver = webdriver.Chrome(service=service, options=options)
        print("✅ Chrome WebDriver started successfully")
        return driver
    except Exception as e:
        print(f"❌ Failed to start Chrome WebDriver: {e}")
        raise

# Convenience function for tests
def setup_chrome():
    """
    Convenience function to setup Chrome for tests
    Returns: Configured Chrome WebDriver
    """
    return create_chrome_driver()

if __name__ == "__main__":
    # Test the configuration
    print("=" * 60)
    print("Selenium Configuration Test")
    print("=" * 60)
    
    chrome_path = get_chrome_binary_path()
    driver_path = get_chromedriver_path()
    
    print("\n" + "=" * 60)
    print("Configuration Summary")
    print("=" * 60)
    print(f"Chrome Binary: {chrome_path or 'Auto-detect'}")
    print(f"ChromeDriver: {driver_path}")
    
    print("\n" + "=" * 60)
    print("Testing WebDriver Creation...")
    print("=" * 60)
    
    try:
        driver = create_chrome_driver()
        driver.get("https://www.google.com")
        print(f"✅ Page title: {driver.title}")
        driver.quit()
        print("✅ Test successful!")
    except Exception as e:
        print(f"❌ Test failed: {e}")
