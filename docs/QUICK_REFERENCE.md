# Quick Reference: Command Line Tools

## 🐍 **Python**
```bash
python3 script.py                    # Run Python script
python3 -m http.server 8080         # Start HTTP server
python3 -m pip install package      # Install package
python3 -c "print('test')"          # Execute code
python3 -m pytest tests/            # Run tests
```

## 📝 **Git**
```bash
git status                          # Check repository status
git add .                           # Stage all changes
git commit -m "message"             # Commit with message
git push origin main                # Push to main branch
git pull origin main                # Pull latest changes
git checkout -b feature-name        # Create new branch
```

## 🔍 **Search & Replace**
```bash
grep -r "pattern" .                 # Search in all files
grep -n "pattern" file.txt          # Search with line numbers
sed 's/old/new/g' file.txt          # Replace all occurrences
find . -name "*.py"                 # Find Python files
find . -type f -name "test_*.py"    # Find test files
```

## 🌐 **Web Development**
```bash
python3 -m http.server 8080 --directory src/   # Serve from src/
lsof -i :8080                                   # Check port usage
kill -9 $(lsof -ti:8080)                      # Kill process on port
```

## 🧪 **Testing**
```bash
# Complete test suite (16+ tests)
python3 test_web_ui.py                                      # Run all tests with screenshots

# Specific test categories
python3 -m unittest test_web_ui.TradeUnionWebUITest.test_01_home_page_loads -v                    # Page loading
python3 -m unittest test_web_ui.TradeUnionWebUITest.test_09_no_scroll_quick_search -v             # QuickSearch
python3 -m unittest test_web_ui.TradeUnionWebUITest.test_16_button_visibility_and_contrast -v     # Button fixes
python3 -m unittest test_web_ui.TradeUnionWebUITest.test_15_quicksearch_hotel_vacancy_integration -v # AFPESP integration

# Test debugging
ls -la test_screenshots/                                    # View test screenshots
python3 -c "import test_web_ui; print('Test module loaded')" # Verify test imports

# Alternative test runners
python3 -m pytest test_web_ui.py -v                        # Pytest runner
python3 -m pytest -k "button_visibility" -v               # Pattern matching
python3 -m pytest --tb=short test_web_ui.py               # Short traceback
```

## 📁 **File Operations**
```bash
ls -la                              # List files with details
chmod +x script.py                 # Make file executable
tar -czf backup.tar.gz folder/     # Create compressed archive
tar -xzf archive.tar.gz            # Extract archive
```

## ⚠️ **Common Mistakes to Avoid**
- ❌ `python` → ✅ `python3` (Always use python3 explicitly)
- ❌ `python -m unittest` → ✅ `python3 -m unittest`
- ❌ `pip install` → ✅ `python3 -m pip install`
- ❌ Generic ports → ✅ Check port availability first
- ❌ Missing file permissions → ✅ Use `chmod +x`
- ❌ Command shortcuts → ✅ Use full explicit commands for clarity