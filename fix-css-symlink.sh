#!/bin/bash
#
# CSS Loading Fix Script
# Replaces symlink with real directory to fix file:// URL loading
#
# Version: 1.0.0
# Last Updated: 2024-12-23
#
# Usage:
#   ./fix-css-symlink.sh
#
# Prerequisites:
#   - Bash shell
#   - Basic Unix utilities (rm, mkdir, cp)
#   - Optional: tree command for directory display
#
# Environment Variables:
#   None required
#

cd /home/mpb/Documents/GitHub/monitora_vagas/public

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                     CSS LOADING FIX SCRIPT                                ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Problem: public/css is a symbolic link that doesn't work with file:// URLs"
echo "Solution: Replace symlink with actual CSS files"
echo ""

# Backup the current symlink info
echo "📋 Current setup:"
ls -lh css
echo ""

# Ask for confirmation
read -p "Do you want to replace the symlink with real files? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔧 Removing symlink..."
    rm css
    
    echo "📁 Creating real css directory..."
    mkdir -p css
    
    echo "📄 Copying CSS files from src/styles..."
    cp -rv ../src/styles/* css/
    
    echo ""
    echo "✅ Done! CSS files copied to public/css/"
    echo ""
    echo "Directory structure:"
    tree css -L 2
    
    echo ""
    echo "File sizes:"
    du -sh css/*
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✓ CSS files are now accessible via file:// URLs"
    echo "✓ Open public/index.html in your browser - styles should load!"
    echo ""
    echo "Note: To keep src/styles and public/css in sync, run:"
    echo "  rsync -av --delete src/styles/ public/css/"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo ""
    echo "❌ Operation cancelled."
    echo ""
    echo "Alternative solution: Use a web server instead of file://"
    echo ""
    echo "Option 1 - Python HTTP Server:"
    echo "  cd public && python3 -m http.server 8080"
    echo "  Then open: http://localhost:8080"
    echo ""
    echo "Option 2 - Node.js HTTP Server:"
    echo "  npx http-server public -p 8080"
    echo "  Then open: http://localhost:8080"
    echo ""
    echo "Option 3 - PHP Built-in Server:"
    echo "  cd public && php -S localhost:8080"
    echo "  Then open: http://localhost:8080"
    echo ""
fi
