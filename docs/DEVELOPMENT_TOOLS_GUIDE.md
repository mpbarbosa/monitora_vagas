# Development Tools & Command Line Guide

This document provides standardized command line usage for development tools to ensure consistency and avoid common issues like using `python` instead of `python3`.

## 📋 **Tool Usage Standards**

### **Python Commands**

#### ✅ **Correct Usage**
```bash
# Always use python3 explicitly
python3 script.py
python3 -m http.server 8080
python3 -m pip install package
python3 -c "print('Hello World')"
python3 -m pytest tests/
python3 -m venv venv_name
```

#### ❌ **Avoid These**
```bash
# Don't use generic python command
python script.py                    # May use Python 2.x
python -m http.server               # Version ambiguity  
python -m unittest                  # Version ambiguity
pip install package                 # Use python3 -m pip instead
```

#### **Python Package Management**
```bash
# Preferred package installation
python3 -m pip install selenium
python3 -m pip install -r requirements.txt
python3 -m pip list
python3 -m pip show package_name

# Virtual environment management
python3 -m venv project_env
source project_env/bin/activate  # Linux/Mac
# project_env\Scripts\activate   # Windows
```

---

### **Git Commands**

#### **Basic Operations**
```bash
# Repository status and changes
git status
git diff
git diff --staged
git log --oneline -10

# Staging and committing
git add file.txt
git add .
git add -A
git commit -m "Descriptive commit message"
git commit -am "Add and commit tracked files"

# Branch operations
git branch
git branch feature-name
git checkout main
git checkout -b new-feature
git merge feature-name
git branch -d feature-name

# Remote operations
git remote -v
git fetch origin
git pull origin main
git push origin main
git push origin feature-name
```

#### **Advanced Git Operations**
```bash
# Viewing changes
git show HEAD
git show commit-hash
git log --graph --pretty=oneline
git blame filename.py

# Undoing changes
git restore filename.py         # Undo working directory changes
git restore --staged filename.py # Unstage file
git reset HEAD~1                # Undo last commit (keep changes)
git reset --hard HEAD~1         # Undo last commit (discard changes)

# Stashing
git stash
git stash pop
git stash list
git stash drop
```

---

### **File Operations (sed, grep, find)**

#### **grep - Text Search**
```bash
# Basic text search
grep "pattern" filename.txt
grep -r "pattern" directory/
grep -i "pattern" file.txt        # Case insensitive
grep -n "pattern" file.txt        # Show line numbers
grep -v "pattern" file.txt        # Invert match (exclude pattern)

# Advanced grep
grep -E "pattern1|pattern2" file.txt    # Extended regex (OR)
grep -l "pattern" *.txt                 # List filenames only
grep -c "pattern" file.txt              # Count matches
grep -A 3 -B 3 "pattern" file.txt      # Show 3 lines after/before
```

#### **sed - Stream Editor**
```bash
# Basic substitution
sed 's/old/new/' file.txt              # Replace first occurrence per line
sed 's/old/new/g' file.txt             # Replace all occurrences
sed 's/old/new/gi' file.txt            # Case insensitive global replace

# In-place editing
sed -i 's/old/new/g' file.txt          # Linux
sed -i '' 's/old/new/g' file.txt       # macOS

# Line operations
sed -n '5p' file.txt                   # Print line 5
sed '5d' file.txt                      # Delete line 5
sed -n '1,10p' file.txt                # Print lines 1-10
```

#### **find - File Search**
```bash
# Find files by name
find . -name "*.py"
find . -name "test_*.py"
find . -iname "*.CSS"                  # Case insensitive

# Find by type and size
find . -type f -name "*.log"           # Files only
find . -type d -name "src"             # Directories only
find . -size +100M                     # Files larger than 100MB

# Execute commands on found files
find . -name "*.py" -exec python3 -m py_compile {} \;
find . -name "*.tmp" -delete
```

---

### **Web Development Tools**

#### **HTTP Servers**
```bash
# Python HTTP server (recommended)
python3 -m http.server 8080
python3 -m http.server 8080 --directory src/

# Node.js alternatives
npx http-server -p 8080
npx live-server --port=8080

# PHP development server
php -S localhost:8080
```

#### **Node.js & npm**
```bash
# Package management
npm install
npm install package-name
npm install -g package-name
npm update
npm list
npm list -g

# Script execution
npm start
npm test
npm run build
npm run dev

# Project initialization
npm init
npm init -y
```

---

### **Testing Tools**

#### **Selenium WebDriver**
```bash
# Running tests
python3 test_web_ui.py
python3 -m pytest tests/
python3 -m pytest tests/ -v
python3 -m pytest tests/test_specific.py::test_method

# Installing dependencies
python3 -m pip install selenium
python3 -m pip install pytest
python3 -m pip install webdriver-manager
```

#### **Test File Patterns**
```bash
# Discover and run tests
python3 -m pytest                     # Run all tests
python3 -m pytest tests/             # Run tests in directory
python3 -m pytest -k "test_login"    # Run tests matching pattern
python3 -m pytest --maxfail=1        # Stop after first failure
python3 -m pytest -x                 # Stop after first failure (short)
```

---

### **System & Process Management**

#### **Process Management**
```bash
# View processes
ps aux | grep python
ps aux | grep node
htop
top

# Kill processes
pkill -f "python3 -m http.server"
kill PID_NUMBER
killall python3

# Background processes
nohup python3 server.py &
python3 server.py > /dev/null 2>&1 &
```

#### **Port Management**
```bash
# Check port usage
lsof -i :8080
netstat -tlnp | grep :8080
ss -tlnp | grep :8080

# Kill process on specific port
lsof -ti:8080 | xargs kill -9
```

---

### **File Permissions & Ownership**

#### **Permission Management**
```bash
# View permissions
ls -la
ls -la filename.py

# Change permissions
chmod +x script.py                    # Make executable
chmod 755 script.py                   # rwxr-xr-x
chmod 644 file.txt                    # rw-r--r--

# Change ownership
sudo chown user:group filename.py
sudo chown -R user:group directory/
```

---

### **Archive & Compression**

#### **tar Archives**
```bash
# Create archives
tar -czf archive.tar.gz directory/
tar -czf backup.tar.gz --exclude='*.log' project/

# Extract archives
tar -xzf archive.tar.gz
tar -xzf archive.tar.gz -C /destination/

# List archive contents
tar -tzf archive.tar.gz
```

#### **zip Archives**
```bash
# Create zip
zip -r archive.zip directory/
zip -r project.zip . -x "*.log" "*.tmp"

# Extract zip
unzip archive.zip
unzip archive.zip -d destination/

# List zip contents
unzip -l archive.zip
```

---

## 🔧 **Environment-Specific Commands**

### **Linux/Unix Systems**
```bash
# System information
uname -a
lsb_release -a
cat /etc/os-release

# Package management (Ubuntu/Debian)
sudo apt update
sudo apt install python3-pip
sudo apt install git

# Package management (CentOS/RHEL)
sudo yum install python3-pip
sudo yum install git
```

### **macOS Systems**
```bash
# Package management with Homebrew
brew install python3
brew install git
brew install node

# System information
sw_vers
system_profiler SPSoftwareDataType
```

### **Windows Systems (PowerShell/CMD)**
```bash
# Python usage
python.exe -m pip install package
py -3 script.py
py -3 -m http.server 8080

# Git usage (same as Linux/Mac)
git status
git add .
git commit -m "message"
```

---

## ⚡ **Quick Reference Commands**

### **Daily Development Workflow**
```bash
# 1. Update repository
git pull origin main

# 2. Create feature branch
git checkout -b feature/quick-union-fix

# 3. Start development server
python3 -m http.server 8080 --directory src/

# 4. Run tests
python3 test_web_ui.py

# 5. Stage and commit changes
git add .
git status
git commit -m "Fix: resolve click interception issue"

# 6. Push changes
git push origin feature/quick-union-fix
```

### **Troubleshooting Commands**
```bash
# Check versions
python3 --version
git --version
node --version
npm --version

# Check running processes
ps aux | grep python
lsof -i :8080

# Check system resources
df -h                    # Disk usage
free -h                  # Memory usage
du -sh directory/        # Directory size
```

---

## 📝 **Best Practices**

### **Command Line Standards**
1. **Always use explicit versions**: `python3` instead of `python`
2. **Use full paths when necessary**: `/usr/bin/python3` for scripts
3. **Check command availability**: `which python3` before using
4. **Use meaningful commit messages**: Follow conventional commit format
5. **Test commands in safe environment**: Use `--dry-run` flags when available

### **Error Prevention**
1. **Verify tool versions** before executing critical commands
2. **Use virtual environments** for Python projects
3. **Check file permissions** before executing scripts
4. **Backup important files** before bulk operations
5. **Use version control** for all code changes

### **Script Headers**
```bash
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script description here
"""

#!/bin/bash
set -e  # Exit on error
set -u  # Exit on undefined variable
```

---

## 🚨 **Common Pitfalls & Solutions**

### **Python Version Issues**
```bash
# Problem: python command not found or wrong version
which python
python --version

# Solution: Use explicit python3
which python3
python3 --version
alias python=python3  # Optional alias
```

### **Permission Denied Errors**
```bash
# Problem: Permission denied when executing scripts
ls -la script.py

# Solution: Make executable
chmod +x script.py
```

### **Port Already in Use**
```bash
# Problem: Address already in use
python3 -m http.server 8080

# Solution: Find and kill process
lsof -i :8080
kill -9 PID_NUMBER
```

### **Git Repository Issues**
```bash
# Problem: Merge conflicts
git status
git diff

# Solution: Resolve conflicts
git add resolved_files
git commit -m "Resolve merge conflicts"
```

## 🧪 **Testing Framework**

### **Comprehensive Web UI Testing**

#### **Full Test Suite Execution**
```bash
# Run complete test suite with all 16+ tests
python3 test_web_ui.py

# Run with verbose output
python3 test_web_ui.py -v

# Run specific test class
python3 -m unittest test_web_ui.TradeUnionWebUITest.test_16_button_visibility_and_contrast
```

#### **Test Categories**

**🏠 Core Functionality Tests**
```bash
# Basic page loading and initialization
test_01_home_page_loads               # Page loads successfully
test_02_application_initializes       # JavaScript app initializes
test_03_navigation_elements           # Navigation components present
```

**🎨 UI & Design Tests**
```bash
# Visual and layout testing
test_04_hero_section_content          # Hero section displays correctly
test_05_feature_cards                 # Feature cards are visible  
test_06_responsive_design             # Mobile/tablet/desktop layouts
test_11_mobile_optimization           # Touch-friendly mobile interface
```

**🔍 Search Functionality Tests**
```bash
# QuickSearch component testing
test_09_no_scroll_quick_search        # Above-fold optimization
test_09_quicksearch_form_blocking_fix # Form elements not blocked
test_12_date_selection_functionality  # Date input validation
test_15_quicksearch_hotel_vacancy_integration # AFPESP integration
test_16_button_visibility_and_contrast # Button visibility fixes
```

**⚙️ Technical Integration Tests**
```bash
# Architecture and compatibility
test_07_javascript_errors            # No JS errors in console
test_08_page_performance             # Page load performance
test_10_progressive_disclosure_modal # Advanced search modal
test_13_searchformhandler_dual_form_compatibility # Form compatibility
test_14_quicksearch_layout_restructuring # Semantic HTML structure
```

#### **Test Output Analysis**

**✅ Success Indicators**
- All form elements clickable and accessible
- Button colors: Primary `rgb(99, 102, 241)`, Text `rgb(255, 255, 255)`
- Page load times under 2 seconds
- No severe JavaScript errors in console
- Mobile viewport properly optimized

**⚠️ Common Test Issues**
```bash
# Button click interception (layout issues)
ElementClickInterceptedException: Element not clickable

# Date validation edge cases
AssertionError: '2025-10-28' != '2025-10-27'

# CSS background transparency
AssertionError: 'rgba(0, 0, 0, 0)' should have background color
```

#### **Testing Environment Setup**

**Prerequisites**
```bash
# Install testing dependencies
python3 -m pip install selenium webdriver-manager

# Verify Chrome/Chromium installation
google-chrome --version
chromium-browser --version
```

**Test Server Setup**
```bash
# Start development server (automatic in tests)
python3 -m http.server 8080 --directory src &

# Manual server start for debugging
cd src && python3 -m http.server 8080
```

#### **Screenshot Documentation**
```bash
# Screenshots automatically saved to:
test_screenshots/
├── button_visibility_error_[timestamp].png
├── desktop_view_[timestamp].png
├── mobile_view_[timestamp].png
├── tablet_view_[timestamp].png
└── [test_name]_error_[timestamp].png
```

#### **Advanced Testing Commands**

**Debugging Failed Tests**
```bash
# Run single test with maximum output
python3 -m unittest test_web_ui.TradeUnionWebUITest.test_16_button_visibility_and_contrast -v

# Check test screenshots for visual debugging
ls -la test_screenshots/

# Analyze browser console logs
# (automatic in test suite - check test output)
```

**Custom Test Development**
```bash
# Create new test file
touch test_new_feature.py

# Test template structure
class NewFeatureTest(unittest.TestCase):
    def setUp(self):
        # Setup WebDriver and server
    def test_new_functionality(self):
        # Test implementation
    def tearDown(self):
        # Cleanup
```

---

*Last Updated: October 27, 2025*  
*Version: 1.1.0 - Enhanced Testing Framework*  
*Project: Trade Union Hotel Search Platform Development Guide*