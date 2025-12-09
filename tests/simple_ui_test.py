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
    """Run a simple test to verify the setup works"""
    print("\n🧪 Running simple browser test...")
    
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        import time
        import http.server
        import socketserver
        import threading
        import socket
        
        # Start local server
        def find_free_port():
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', 0))
                s.listen(1)
                port = s.getsockname()[1]
            return port
        
        port = find_free_port()
        public_dir = Path(__file__).parent.parent / "public"
        
        print(f"🌐 Starting local server on port {port}...")
        print(f"📁 Serving from: {public_dir}")
        
        class Handler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, directory=str(public_dir), **kwargs)
        
        httpd = socketserver.TCPServer(("", port), Handler)
        server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        server_thread.start()
        time.sleep(2)
        
        # Setup Chrome
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in background
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1920,1080")
        
        print("🚀 Starting Chrome browser...")
        driver = webdriver.Chrome(options=chrome_options)
        
        try:
            # Test the application
            url = f"http://localhost:{port}/index.html"
            print(f"🔗 Loading: {url}")
            
            driver.get(url)
            
            # Wait for title
            WebDriverWait(driver, 10).until(EC.title_contains("Hotéis Sindicais"))
            title = driver.title
            print(f"✅ Page loaded: {title}")
            
            # Check for main elements
            try:
                app_element = driver.find_element(By.ID, "app")
                print("✅ Main app container found")
            except:
                print("⚠️  Main app container not found")
            
            try:
                nav_element = driver.find_element(By.CLASS_NAME, "nav-brand")
                nav_text = nav_element.text
                print(f"✅ Navigation found: {nav_text}")
            except:
                print("⚠️  Navigation not found")
            
            print("✅ Basic test completed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Test failed: {e}")
            return False
        finally:
            driver.quit()
            httpd.shutdown()
            
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

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