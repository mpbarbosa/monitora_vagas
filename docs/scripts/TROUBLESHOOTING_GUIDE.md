# Scripts Troubleshooting Guide

**Version:** 1.0.0  
**Last Updated:** 2024-12-23  
**For:** Monitora Vagas Project Scripts

This guide provides comprehensive troubleshooting solutions for common issues with project scripts.

---

## 📋 Table of Contents

- [Quick Diagnosis](#quick-diagnosis)
- [Script Execution Issues](#script-execution-issues)
- [Server and Port Issues](#server-and-port-issues)
- [Dependency Issues](#dependency-issues)
- [Browser and Selenium Issues](#browser-and-selenium-issues)
- [Test Failures](#test-failures)
- [API Connection Issues](#api-connection-issues)
- [CSS and Style Issues](#css-and-style-issues)
- [Performance Issues](#performance-issues)
- [Debug Techniques](#debug-techniques)

---

## 🔍 Quick Diagnosis

### Common Error Patterns

| Error Message | Likely Cause | Quick Fix | Section |
|--------------|--------------|-----------|---------|
| `Permission denied` | Script not executable | `chmod +x script.sh` | [Script Execution](#1-permission-denied) |
| `Address already in use` | Port conflict | `kill -9 $(lsof -ti:PORT)` | [Server Issues](#1-port-already-in-use) |
| `Module not found` | Missing dependency | `pip install -r requirements.txt` | [Dependencies](#1-python-module-not-found) |
| `SessionNotCreatedException` | ChromeDriver mismatch | Update Chrome or Selenium | [Browser Issues](#2-chromedriver-version-mismatch) |
| `Connection refused` | Server not running | Start server | [API Issues](#1-api-connection-refused) |
| `CSS not loading` | Symlink issue | Run `fix-css-symlink.sh` | [CSS Issues](#1-css-files-not-loading) |
| `Test timeout` | Slow/hanging operation | Increase timeout or check logs | [Test Failures](#3-tests-timeout-or-hang) |

---

## 🚀 Script Execution Issues

### 1. Permission Denied

**Error:**
```bash
bash: ./script.sh: Permission denied
```

**Cause:** Script doesn't have execute permissions.

**Solution:**
```bash
# Make script executable
chmod +x script.sh

# Run the script
./script.sh
```

**Permanent Fix for All Scripts:**
```bash
# Make all .sh files executable
find . -name "*.sh" -type f -exec chmod +x {} \;
```

---

### 2. Command Not Found

**Error:**
```bash
./script.sh: command not found
```

**Causes:**
1. Wrong path to script
2. Script not in current directory
3. Missing shebang line

**Solutions:**

**Wrong Path:**
```bash
# Use absolute path
/home/user/project/script.sh

# Or navigate to directory first
cd /home/user/project
./script.sh
```

**Missing Shebang:**
```bash
# Add to first line of script
#!/bin/bash

# Or run explicitly with bash
bash script.sh
```

---

### 3. Bad Interpreter

**Error:**
```bash
bash: ./script.sh: /bin/bash^M: bad interpreter
```

**Cause:** Windows line endings (CRLF) instead of Unix (LF).

**Solution:**
```bash
# Convert with dos2unix
dos2unix script.sh

# Or with sed
sed -i 's/\r$//' script.sh

# Or with tr
tr -d '\r' < script.sh > script_fixed.sh
```

---

## 🌐 Server and Port Issues

### 1. Port Already in Use

**Error:**
```bash
Error: listen EADDRINUSE: address already in use :::8080
Address already in use: 0.0.0.0:8080
```

**Cause:** Another process is using the port.

**Solutions:**

**Find Process Using Port:**
```bash
# Linux/Mac
lsof -ti:8080

# Show details
lsof -i:8080

# Windows
netstat -ano | findstr :8080
```

**Kill Process:**
```bash
# Kill specific port (Linux/Mac)
kill -9 $(lsof -ti:8080)

# Or find and kill by PID
lsof -ti:8080
kill -9 PID

# Windows
taskkill /PID <PID> /F
```

**Use Different Port:**
```bash
# Set port environment variable
SERVER_PORT=8081 ./script.sh

# Or edit script configuration
```

---

### 2. Cannot Start Server

**Error:**
```bash
Failed to start server
Server startup failed
```

**Diagnosis:**
```bash
# Check port availability
nc -zv localhost 8080

# Check server logs
tail -f server.log

# Check permissions
ls -la script.sh
```

**Solutions:**

**Permission Issues:**
```bash
# Run with sudo (if needed)
sudo ./start-server.sh

# Or change port to non-privileged (>1024)
SERVER_PORT=8080 ./script.sh
```

**Missing Dependencies:**
```bash
# Python server
python3 -m http.server 8080

# Node.js server
npx http-server -p 8080
```

---

### 3. Server Runs But Not Accessible

**Symptoms:**
- Server starts successfully
- Cannot access via browser
- Connection refused/timeout errors

**Diagnosis:**
```bash
# Check if server is listening
netstat -tuln | grep 8080

# Test local connection
curl http://localhost:8080

# Test network connection
curl http://127.0.0.1:8080
```

**Solutions:**

**Firewall Blocking:**
```bash
# Allow port through firewall (Linux)
sudo ufw allow 8080/tcp

# Check firewall status
sudo ufw status
```

**Wrong Interface:**
```bash
# Ensure server binds to 0.0.0.0, not just 127.0.0.1
python3 -m http.server 8080 --bind 0.0.0.0
```

---

## 📦 Dependency Issues

### 1. Python Module Not Found

**Error:**
```python
ModuleNotFoundError: No module named 'selenium'
ImportError: No module named 'pytest'
```

**Solutions:**

**Install All Dependencies:**
```bash
# From requirements.txt
pip install -r requirements.txt

# Upgrade if needed
pip install --upgrade -r requirements.txt
```

**Install Specific Module:**
```bash
# Install selenium
pip install selenium

# Install pytest
pip install pytest

# Install with specific version
pip install selenium==4.39.0
```

**Virtual Environment Issues:**
```bash
# Activate virtual environment first
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Then install
pip install -r requirements.txt
```

**Check Installation:**
```bash
# List installed packages
pip list | grep selenium

# Show package details
pip show selenium

# Verify import
python3 -c "import selenium; print(selenium.__version__)"
```

---

### 2. npm Package Not Found

**Error:**
```bash
Error: Cannot find module 'package-name'
npm ERR! missing: package-name
```

**Solutions:**

**Reinstall All Dependencies:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use clean-install
npm ci
```

**Install Specific Package:**
```bash
# Install as dependency
npm install package-name

# Install as dev dependency
npm install --save-dev package-name
```

**Fix Corrupted Installation:**
```bash
# Clear npm cache
npm cache clean --force

# Verify cache
npm cache verify

# Reinstall
rm -rf node_modules
npm install
```

---

### 3. Version Conflicts

**Error:**
```bash
npm WARN ERESOLVE overriding peer dependency
peer dep missing: package@version
```

**Solutions:**

**Use Phased Update Script:**
```bash
# Run safe updates
./scripts/update-dependencies.sh safe

# Review and test
npm run test:all
```

**Force Resolution:**
```bash
# Use --force (careful!)
npm install --force

# Or use --legacy-peer-deps
npm install --legacy-peer-deps
```

**Check Compatibility:**
```bash
# View dependency tree
npm list

# Check for conflicts
npm ls package-name
```

---

## 🌐 Browser and Selenium Issues

### 1. Browser Not Found

**Error:**
```python
selenium.common.exceptions.WebDriverException: Message: 'chromedriver' executable needs to be in PATH
```

**Solutions:**

**Install ChromeDriver (Automatic):**
```bash
# Selenium 4+ manages ChromeDriver automatically
pip install --upgrade selenium

# Verify
python3 -c "from selenium import webdriver; driver = webdriver.Chrome()"
```

**Manual ChromeDriver Install:**
```bash
# Download from https://chromedriver.chromium.org/
# Match Chrome version: chrome://version

# Linux - Move to PATH
sudo mv chromedriver /usr/local/bin/
sudo chmod +x /usr/local/bin/chromedriver

# Verify
chromedriver --version
```

**Install Chrome Browser:**
```bash
# Ubuntu/Debian
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt-get install -f

# Fedora/RHEL
sudo dnf install google-chrome-stable

# Mac
brew install --cask google-chrome
```

---

### 2. ChromeDriver Version Mismatch

**Error:**
```
SessionNotCreatedException: This version of ChromeDriver only supports Chrome version XX
```

**Solutions:**

**Update Chrome Browser:**
```bash
# Check current version
google-chrome --version

# Update (Linux)
sudo apt update && sudo apt upgrade google-chrome-stable

# Mac
brew upgrade --cask google-chrome
```

**Update Selenium:**
```bash
# Upgrade to Selenium 4+ (auto-manages drivers)
pip install --upgrade selenium

# Verify
python3 -c "import selenium; print(selenium.__version__)"
```

**Manual ChromeDriver Update:**
```bash
# Download matching version
# Get Chrome version: chrome://version
# Download from: https://chromedriver.chromium.org/

# Replace existing
sudo rm /usr/local/bin/chromedriver
sudo mv chromedriver /usr/local/bin/
sudo chmod +x /usr/local/bin/chromedriver
```

---

### 3. Headless Mode Issues

**Error:**
```
Element not interactable
Element not visible
```

**Diagnosis:**
```python
# Disable headless mode temporarily
# In test script, change:
options.add_argument('--headless')  # Comment out
# Run test and observe browser behavior
```

**Solutions:**

**Increase Wait Times:**
```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Explicit wait for element
wait = WebDriverWait(driver, 10)
element = wait.until(EC.element_to_be_clickable((By.ID, "element-id")))
```

**Set Proper Window Size:**
```python
options.add_argument('--window-size=1920,1080')
options.add_argument('--start-maximized')
```

**Additional Headless Flags:**
```python
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
```

---

## 🧪 Test Failures

### 1. Assertion Failures

**Error:**
```
AssertionError: Expected X but got Y
```

**Diagnosis:**
```bash
# Run with verbose output
VERBOSE=1 ./tests/script.sh

# Add debug output to test
print(f"Actual value: {actual_value}")
print(f"Expected value: {expected_value}")

# Take screenshot
driver.save_screenshot('debug_screenshot.png')
```

**Solutions:**

**Check Test Data:**
```python
# Verify test preconditions
assert server_is_running(), "Server not running"
assert element.is_displayed(), "Element not visible"
```

**Update Expected Values:**
```python
# If application behavior changed correctly
expected_value = new_correct_value
```

**Fix Timing Issues:**
```python
# Add waits for dynamic content
time.sleep(2)  # Temporary
# Better: Use explicit waits
WebDriverWait(driver, 10).until(EC.presence_of_element_located(...))
```

---

### 2. Flaky Tests

**Symptoms:**
- Tests pass sometimes, fail sometimes
- Different results on different runs
- Timing-dependent failures

**Solutions:**

**Use Explicit Waits:**
```python
# Bad - implicit wait only
driver.implicitly_wait(5)

# Good - explicit waits
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, 10)
element = wait.until(EC.presence_of_element_located((By.ID, "element")))
```

**Retry Logic:**
```bash
# Retry failed tests
for i in {1..3}; do
    if ./run-tests.sh; then
        break
    fi
    echo "Retry $i..."
    sleep 5
done
```

**Stabilize Test Environment:**
```bash
# Clear state before tests
rm -rf test_cache/
pkill -f "test_server"

# Start fresh
./start-local-testing.sh
sleep 5  # Allow startup
./run-tests.sh
```

---

### 3. Tests Timeout or Hang

**Symptoms:**
- Tests run but never complete
- No output for extended period
- Browser window frozen

**Diagnosis:**
```bash
# Check process status
ps aux | grep python
ps aux | grep chrome

# Monitor system resources
top
htop

# Check logs
tail -f test.log
```

**Solutions:**

**Increase Timeout:**
```bash
# Environment variable
TEST_TIMEOUT=300 ./run-tests.sh

# Or in code
WebDriverWait(driver, 30)  # Increase from 10
```

**Kill Hanging Processes:**
```bash
# Kill specific test run
pkill -f "python.*test"

# Kill all Chrome processes
pkill -f chrome

# Force kill if needed
pkill -9 -f chrome
```

**Add Timeout Wrapper:**
```bash
# Run with timeout command
timeout 300 ./run-tests.sh  # 5 minutes
if [ $? -eq 124 ]; then
    echo "Test timed out"
fi
```

---

## 🌐 API Connection Issues

### 1. API Connection Refused

**Error:**
```
Connection refused
Failed to connect to API
```

**Diagnosis:**
```bash
# Check API availability
curl https://www.mpbarbosa.com/api/health

# Check with verbose output
curl -v https://www.mpbarbosa.com/api/health

# Check network connectivity
ping www.mpbarbosa.com
```

**Solutions:**

**Use Local Mock API:**
```bash
# Start mock API
cd tests
./start-local-testing.sh

# Use local endpoint
API_BASE_URL="http://localhost:3000/api" ./test_api_integration.sh
```

**Check Firewall:**
```bash
# Linux - check firewall
sudo ufw status

# Allow HTTPS
sudo ufw allow 443/tcp
```

**Verify DNS:**
```bash
# Check DNS resolution
nslookup www.mpbarbosa.com

# Try with IP if DNS fails
curl http://IP_ADDRESS/api/health
```

---

### 2. API Timeout

**Error:**
```
Request timeout - API not responding
Timeout waiting for API response
```

**Solutions:**

**Increase Timeout:**
```bash
# Set timeout environment variable
API_TIMEOUT=60 ./test_api_integration.sh
```

**Check API Status:**
```bash
# Health check
curl https://www.mpbarbosa.com/api/health

# Check response time
time curl https://www.mpbarbosa.com/api/health
```

**Use Retry Logic:**
```bash
# Retry with exponential backoff
for i in 1 2 4 8; do
    if curl -m 30 https://www.mpbarbosa.com/api/health; then
        break
    fi
    echo "Retry in ${i}s..."
    sleep $i
done
```

---

### 3. SSL Certificate Errors

**Error:**
```
SSL certificate problem
Certificate verification failed
```

**Solutions:**

**Temporary Bypass (testing only):**
```bash
# curl with insecure flag
curl -k https://www.mpbarbosa.com/api/health

# Python requests
import requests
requests.get(url, verify=False)
```

**Fix Certificate Store:**
```bash
# Update CA certificates
sudo apt-get update
sudo apt-get install --reinstall ca-certificates

# Python certifi
pip install --upgrade certifi
```

---

## 🎨 CSS and Style Issues

### 1. CSS Files Not Loading

**Symptoms:**
- Page loads but no styling
- Plain HTML appearance
- 404 errors for CSS files

**Solutions:**

**Use CSS Fix Script:**
```bash
# Interactive fix
./fix-css-symlink.sh

# Follow prompts to replace symlink with real files
```

**Start Web Server:**
```bash
# Don't use file:// URLs
cd public
python3 -m http.server 8080

# Access via http://localhost:8080
```

**Check File Paths:**
```html
<!-- Verify CSS path in HTML -->
<link rel="stylesheet" href="css/index-page.css">

<!-- Check file exists -->
ls -la public/css/index-page.css
```

**Sync Files Manually:**
```bash
# If using symlink approach
rsync -av --delete src/styles/ public/css/
```

---

### 2. Styles Not Applied

**Symptoms:**
- CSS file loads (200 OK)
- Styles not visible on page
- Different appearance than expected

**Diagnosis:**
```bash
# Browser Developer Tools
# 1. Open DevTools (F12)
# 2. Check Console for errors
# 3. Check Network tab for CSS loading
# 4. Check Elements tab for applied styles
```

**Solutions:**

**Clear Browser Cache:**
```bash
# Hard refresh in browser
# Chrome/Firefox: Ctrl+Shift+R (Linux/Windows)
# Chrome/Firefox: Cmd+Shift+R (Mac)
```

**Check CSS Specificity:**
```css
/* Add !important if needed (temporary debug) */
.my-class {
    background-color: red !important;
}
```

**Verify CSS Syntax:**
```bash
# Use CSS linter
npx stylelint "**/*.css"

# Check for syntax errors
grep -n "}" public/css/*.css
```

---

## ⚡ Performance Issues

### 1. Slow Test Execution

**Symptoms:**
- Tests take much longer than expected
- System becomes slow during tests
- High CPU/memory usage

**Solutions:**

**Reduce Parallel Tests:**
```bash
# Limit concurrent processes
pytest -n 2  # Instead of -n auto

# Run tests sequentially
pytest --workers 1
```

**Optimize Waits:**
```python
# Use shorter implicit waits
driver.implicitly_wait(3)  # Instead of 10

# Use explicit waits only when needed
WebDriverWait(driver, 5).until(...)
```

**Close Resources:**
```python
# Ensure cleanup
try:
    # Test code
finally:
    driver.quit()
    server.stop()
```

---

### 2. High Memory Usage

**Diagnosis:**
```bash
# Monitor memory
free -h
top -o %MEM

# Check for memory leaks
ps aux --sort=-%mem | head -10
```

**Solutions:**

**Restart Between Test Runs:**
```bash
# Add cleanup to script
cleanup() {
    pkill -f chrome
    pkill -f python.*test
}
trap cleanup EXIT
```

**Use Headless Mode:**
```python
# Reduces memory usage
options.add_argument('--headless')
options.add_argument('--disable-gpu')
```

---

## 🔍 Debug Techniques

### Enable Verbose Mode

```bash
# Bash debug mode
bash -x ./script.sh

# Or add to script
set -x  # Enable
# code here
set +x  # Disable

# Script-specific verbose
VERBOSE=1 ./run-tests.sh
```

### Capture Screenshots

```python
# On test failure
try:
    # Test code
except Exception as e:
    driver.save_screenshot('failure_screenshot.png')
    print(f"Screenshot saved: failure_screenshot.png")
    raise
```

### Log Everything

```bash
# Redirect all output to file
./script.sh > debug.log 2>&1

# Or use tee to see and save
./script.sh 2>&1 | tee debug.log
```

### Check Process State

```bash
# List all related processes
ps aux | grep -E "python|chrome|node"

# Check specific PID
ps -fp PID

# Process tree
pstree -p PID
```

### Network Debugging

```bash
# Monitor network requests
tcpdump -i any port 8080

# Check established connections
netstat -an | grep ESTABLISHED

# Trace route to API
traceroute www.mpbarbosa.com
```

---

## 📞 Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Review script documentation in `docs/scripts/SCRIPTS_INDEX.md`
3. ✅ Check error messages carefully
4. ✅ Try verbose/debug mode
5. ✅ Search existing issues on GitHub

### Information to Provide

When reporting issues, include:

```bash
# System information
uname -a
python3 --version
node --version
google-chrome --version

# Error messages (full output)
./script.sh > error.log 2>&1

# Script version
head -20 script.sh | grep -E "Version|Last Updated"

# Steps to reproduce
# 1. ...
# 2. ...
# 3. ...
```

---

## 📚 Related Documentation

- **[Scripts Index](SCRIPTS_INDEX.md)** - Complete script documentation
- **[README.md](../../README.md)** - Project overview
- **[E2E Testing Guide](../guides/E2E_TESTING_GUIDE.md)** - Testing documentation
- **[Local Testing Guide](../guides/LOCAL_TESTING_GUIDE.md)** - Local development setup

---

**Version:** 1.0.0  
**Last Updated:** 2024-12-23  
**Maintained by:** Development Team
