#!/usr/bin/env python3
"""
Use Case Test Suite - Setup and Validation
Validates test environment and provides setup instructions.
"""

import sys
import subprocess
import importlib.util

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    print(f"✓ Python {version.major}.{version.minor}.{version.micro}")
    if version.major >= 3 and version.minor >= 8:
        return True
    print("  ⚠️  Python 3.8+ recommended")
    return False

def check_package(package_name, install_name=None):
    """Check if Python package is installed"""
    install_name = install_name or package_name
    spec = importlib.util.find_spec(package_name)
    if spec is not None:
        print(f"✓ {package_name} installed")
        return True
    else:
        print(f"✗ {package_name} NOT installed")
        print(f"  Install with: pip install {install_name}")
        return False

def check_command(command, name=None):
    """Check if command is available"""
    name = name or command
    try:
        result = subprocess.run(['which', command], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✓ {name} available: {result.stdout.strip()}")
            return True
        else:
            print(f"✗ {name} NOT found")
            return False
    except Exception:
        print(f"✗ {name} NOT found")
        return False

def main():
    print("=" * 70)
    print("Use Case Test Suite - Environment Validation")
    print("=" * 70)
    print()
    
    print("Checking Python Environment:")
    python_ok = check_python_version()
    print()
    
    print("Checking Python Packages:")
    selenium_ok = check_package('selenium')
    colorama_ok = check_package('colorama')
    print()
    
    print("Checking System Commands:")
    chrome_ok = check_command('google-chrome', 'Google Chrome') or \
                check_command('chromium-browser', 'Chromium') or \
                check_command('chromium', 'Chromium')
    chromedriver_ok = check_command('chromedriver', 'ChromeDriver')
    print()
    
    # Summary
    all_ok = all([python_ok, selenium_ok, colorama_ok, chrome_ok, chromedriver_ok])
    
    print("=" * 70)
    if all_ok:
        print("✅ All dependencies satisfied!")
        print()
        print("You can now run use case tests:")
        print("  npm run test:uc              # Run all tests locally")
        print("  npm run test:uc:production   # Run all tests in production")
        print("  npm run test:uc:all          # Run comprehensive test suite")
    else:
        print("⚠️  Some dependencies are missing")
        print()
        print("Setup Instructions:")
        print()
        
        if not selenium_ok or not colorama_ok:
            print("Install Python packages:")
            print("  pip install selenium colorama")
            print()
        
        if not chromedriver_ok:
            print("Install ChromeDriver:")
            print("  # Ubuntu/Debian:")
            print("  sudo apt-get install chromium-chromedriver")
            print()
            print("  # Or download from:")
            print("  https://chromedriver.chromium.org/downloads")
            print()
        
        if not chrome_ok:
            print("Install Google Chrome:")
            print("  # Ubuntu/Debian:")
            print("  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb")
            print("  sudo dpkg -i google-chrome-stable_current_amd64.deb")
            print()
    
    print("=" * 70)
    return 0 if all_ok else 1

if __name__ == '__main__':
    sys.exit(main())
