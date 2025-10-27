# Git Best Practices Guide

## Overview

This guide establishes best practices for Git operations in the **Trade Union Hotel Search Platform (monitora_vagas)** project, ensuring proper version control, file history preservation, and clear change tracking for our web application development.

## Table of Contents

1. [File Operations](#file-operations)
2. [Commit Best Practices](#commit-best-practices)
3. [Branch Management](#branch-management)
4. [Web Application File Management](#web-application-file-management)
5. [Collaboration Guidelines](#collaboration-guidelines)
6. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
7. [Quick Reference Commands](#quick-reference-commands)

## File Operations

### Moving and Renaming Files

**❌ WRONG: Using system `mv` command**
```bash
# This breaks git history tracking
mv old-file.md new-file.md
git add -A
git commit -m "Rename file"
```

**✅ CORRECT: Using `git mv` command**
```bash
# This preserves git history and tracks the move properly
git mv old-file.md new-file.md
git commit -m "rename: Move old-file.md to new-file.md for better organization"
```

### Why `git mv` is Superior

1. **Preserves File History**: Git can track that the file was moved, not deleted and recreated
2. **Better Diff Display**: Shows as a rename operation, not deletion + addition
3. **Cleaner Git Log**: History follows the file through its moves
4. **Automatic Staging**: The move operation is automatically staged
5. **Atomic Operation**: Move and stage happen together, reducing errors

### File Organization Operations

**Moving files between directories:**
```bash
# Create target directory if needed
mkdir -p src/components/SearchForm

# Move files with git mv
git mv src/old-component.js src/components/SearchForm/SearchForm.js
git mv src/search-styles.css src/styles/components/search-form.css

# Commit the reorganization
git commit -m "refactor: Reorganize search component structure

- Move old-component.js to src/components/SearchForm/SearchForm.js
- Move search-styles.css to src/styles/components/search-form.css
- Improve component organization and maintainability"
```

**Batch file operations:**
```bash
# Move multiple CSS files to components directory
git mv src/search-form.css src/styles/components/
git mv src/progress-bar.css src/styles/components/  
git mv src/home.css src/styles/pages/

# Or use a loop for many files
for file in src/styles/temp/*.css; do
    git mv "$file" src/styles/components/
done

git commit -m "style: Reorganize CSS files into component structure

- Move component styles to src/styles/components/
- Move page styles to src/styles/pages/  
- Improve CSS architecture and maintainability
- Follow modern web development best practices"
```

### Deleting Files

**✅ CORRECT: Using `git rm`**
```bash
# Remove file from both working directory and git
git rm obsolete-file.md

# Remove file from git but keep in working directory
git rm --cached sensitive-file.txt

# Force remove (if file has uncommitted changes)
git rm -f problematic-file.md
```

## Commit Best Practices

### Commit Message Format

Follow the conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `rename`: File/directory renaming or moving
- `remove`: File/directory removal

**Examples:**
```bash
# Simple rename
git commit -m "rename: Move CONTRIBUTING.md to .github/ for better visibility"

# Web application feature reorganization
git commit -m "feat: Reorganize search functionality components

- Move SearchForm.js to src/components/SearchForm/
- Move SearchFormHandler.js to src/components/SearchForm/
- Update imports in main.js and Home.js
- Improve component modularity for hotel search features

Fixes #45 - Better component organization"
```

### Staging Best Practices

**Check what you're committing:**
```bash
# Review staged changes
git diff --staged

# Review file status
git status

# Add specific files
git add path/to/specific/file.md

# Add all changes (use with caution)
git add -A
```

## Branch Management

### Branch Naming Conventions

```bash
# Feature branches
git checkout -b feature/enhanced-date-selection
git checkout -b feature/hotel-booking-integration
git checkout -b feature/pwa-offline-support

# Bug fix branches  
git checkout -b fix/search-form-validation
git checkout -b fix/mobile-responsive-layout
git checkout -b hotfix/security-cors-issue

# Documentation branches
git checkout -b docs/api-documentation
git checkout -b docs/deployment-guide
```

### Safe Branch Operations

```bash
# Create and switch to new branch
git checkout -b refactor/component-reorganization

# Make your changes using git mv, git rm, etc.
git mv src/SearchForm.js src/components/SearchForm/
git mv src/ProgressBar.js src/components/ProgressBar/
git commit -m "refactor: Reorganize components into modular structure"

# Push new branch
git push origin refactor/component-reorganization

# Switch back to main when done
git checkout main
```

## Web Application File Management

### Organizing Components and Assets

When reorganizing the web application structure, follow these patterns:

```bash
# Component reorganization
git mv src/SearchForm.js src/components/SearchForm/SearchForm.js
git mv src/SearchFormHandler.js src/components/SearchForm/SearchFormHandler.js
git mv src/components/SearchForm/index.js src/components/SearchForm/index.js

# Update imports in affected files
# Edit src/main.js, src/pages/Home/Home.js to update import paths

git commit -m "refactor: Organize SearchForm into component directory

- Move SearchForm.js and SearchFormHandler.js to components/SearchForm/
- Update import paths in main.js and Home.js
- Improve component modularity and maintainability"
```

### CSS and Asset File Organization

```bash
# Organize CSS files by component structure
git mv src/search-form.css src/styles/components/search-form.css
git mv src/progress-bar.css src/styles/components/progress-bar.css
git mv src/home.css src/styles/pages/home.css

# Move assets to proper directories
git mv src/logo.svg src/assets/icons/logo.svg
git mv src/favicon.svg src/assets/icons/favicon.svg

# Update references in HTML and CSS files
# Edit src/index.html, src/styles/main.css to reflect new paths

git commit -m "style: Reorganize CSS and assets into structured directories

- Move component styles to src/styles/components/
- Move page styles to src/styles/pages/  
- Move icons to src/assets/icons/
- Update all references to new file paths
- Follow modern web development architecture"
```

### Test File Organization Workflow

```bash
# Organize test files to match source structure
git mv test_web_ui.py tests/ui/test_web_ui.py
git mv simple_ui_test.py tests/ui/simple_ui_test.py
git mv run_ui_tests.sh tests/scripts/run_ui_tests.sh

# Update test configuration and scripts
# Edit test paths and imports as needed

git commit -m "test: Reorganize test files into structured directories

- Move UI tests to tests/ui/ directory
- Move test scripts to tests/scripts/
- Update test runner configurations
- Improve test organization and maintainability"
```

## Collaboration Guidelines

### Before Making Changes

```bash
# Always sync with remote before major reorganizations
git fetch origin
git pull origin main

# Check if anyone else has pending changes
git log --oneline origin/main..HEAD
```

### After File Operations

```bash
# Verify your changes
git status
git log --oneline -5
git diff HEAD~1

# Check that moved files preserved history
git log --follow path/to/moved-file.md
```

## Common Pitfalls and Solutions

### Problem: Used `mv` instead of `git mv`

**Solution:**
```bash
# If you already used mv but haven't committed:
git add -A
git status  # Will show as deleted + new file

# To fix this, reset and use git mv:
git reset HEAD
git mv old/location/file.md new/location/file.md
git commit -m "rename: Move file.md to new location"

# If you already committed with mv:
# The history is broken, but you can add a note in the commit:
git commit --amend -m "rename: Move file.md to new location

Note: File history may be broken due to using mv instead of git mv"
```

### Problem: Large Component Reorganization

**Solution:**
```bash
# Break into logical commits
git mv src/components/*.js src/components/SearchForm/
git commit -m "refactor: Move search components to SearchForm directory"

git mv src/styles/*.css src/styles/components/
git commit -m "refactor: Move component styles to components directory"

# Update imports in separate commit
# Edit main.js, Home.js and other files
git add src/main.js src/pages/Home/Home.js
git commit -m "refactor: Update import paths for reorganized components"
```

### Problem: Conflicting File Moves

**Solution:**
```bash
# If someone else moved files while you were working:
git fetch origin
git status

# If conflicts occur:
git merge origin/main
# Resolve conflicts manually
git add -A
git commit -m "resolve: Merge remote file reorganization changes"
```

## Quick Reference Commands

### File Operations
```bash
# Move/rename files
git mv old-name.md new-name.md
git mv file.md new-directory/

# Remove files
git rm file.md
git rm --cached file.md  # Remove from git but keep locally

# Batch operations
### Batch operations
for file in src/styles/*.css; do git mv "$file" src/styles/components/; done
```

### Checking Changes
```bash
# See what files were moved/renamed
git status
git diff --staged --name-status

# Follow file history through renames
git log --follow path/to/file.md

# See rename detection in log
git log --stat -M
```

### Committing
```bash
# Good commit messages for file operations
git commit -m "rename: Move file.md to better location"
git commit -m "docs: Reorganize documentation structure"
git commit -m "remove: Delete obsolete configuration files"
```

### Web Application Updates
```bash
# Update service worker after file moves
git add src/sw.js
git commit -m "chore: Update service worker cache paths after reorganization"

# Update package.json scripts if paths changed
git add package.json
git commit -m "chore: Update build scripts for new file structure"
```

## Integration with Development Workflow

### Pre-commit Checklist

Before committing file reorganization:

- [ ] Used `git mv` instead of `mv`
- [ ] Used `git rm` instead of `rm`
- [ ] Updated import paths in JavaScript files
- [ ] Updated CSS references in HTML files
- [ ] Tested that the web application still works
- [ ] Verified file history is preserved with `git log --follow`
- [ ] Wrote descriptive commit message
- [ ] Updated service worker cache paths if applicable
- [ ] Ran tests to ensure functionality is preserved

### Automation Scripts

Create a script for common web application reorganization tasks:

```bash
#!/bin/bash
# File: scripts/reorganize-components.sh

set -e  # Exit on error

echo "Starting component reorganization..."

# Create component directories
mkdir -p src/components/SearchForm
mkdir -p src/components/ProgressBar
mkdir -p src/styles/components
mkdir -p src/styles/pages

# Move files with git mv
git mv src/SearchForm.js src/components/SearchForm/
git mv src/SearchFormHandler.js src/components/SearchForm/
git mv src/ProgressBar.js src/components/ProgressBar/

# Move CSS files
git mv src/search-form.css src/styles/components/
git mv src/progress-bar.css src/styles/components/
git mv src/home.css src/styles/pages/

# Update import references (requires manual editing)
echo "Update import paths in:"
echo "- src/main.js"
echo "- src/pages/Home/Home.js"
echo "- src/index.html"

echo "Component reorganization complete. Ready to commit."
echo "Run: git commit -m 'refactor: Reorganize components and styles'"
```

## Conclusion

Following these Git best practices ensures:

- **Clean History**: File moves are properly tracked for the web application
- **Better Collaboration**: Changes are clear to team members working on the hotel search platform
- **Easier Debugging**: History is preserved through component reorganizations
- **Professional Standards**: Consistent with modern web development practices
- **Maintainable Codebase**: Organized structure for the Trade Union Hotel Search Platform

Always remember: **Use `git mv` for moves, `git rm` for deletions, and write clear commit messages describing the reorganization rationale for better web application maintainability.**

---

**Last Updated**: October 27, 2025  
**Repository**: monitora_vagas (Trade Union Hotel Search Platform)  
**Author**: MP Barbosa  
**Version**: 2.0.0 - Adapted for Web Application Development