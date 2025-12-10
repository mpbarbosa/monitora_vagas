# Quick Start - Run the Project

## The Problem You're Experiencing

Your `index.html` appears **unstyled** because `public/css` is a **symbolic link** that doesn't work when you open files directly in the browser (`file://` protocol).

## Quick Fix (30 seconds)

### Option 1: Start a Web Server (Recommended) ⭐

```bash
cd /home/mpb/Documents/GitHub/monitora_vagas/public
python3 -m http.server 8080
```

Then open in your browser: **http://localhost:8080**

✅ **CSS will load!**  
✅ **Page will be styled!**

---

### Option 2: Copy CSS Files (If you can't use a server)

```bash
cd /home/mpb/Documents/GitHub/monitora_vagas
./fix-css-symlink.sh
```

Follow the prompts, then open `public/index.html` normally.

---

## Why This Happens

```
public/
├── index.html
├── css -> ../src/styles    ← This is a SYMLINK (symbolic link)
└── vendor/

Browsers block symlinks with file:// URLs for security
Web servers (http://) handle symlinks correctly
```

---

## Available Commands

```bash
# Start development server
cd public && python3 -m http.server 8080

# Alternative: Node.js server
npx http-server public -p 8080

# Alternative: PHP server
cd public && php -S localhost:8080

# Fix symlink permanently
./fix-css-symlink.sh
```

---

## What to Expect

### ✅ When Working Correctly

- Styled page with colors and layout
- Roboto font family
- Font Awesome and Material Design icons visible
- Proper form element styling
- Responsive design

### ❌ When CSS Not Loading

- Plain white background
- Default browser fonts
- No icons
- Unstyled form elements
- No layout structure

---

## Troubleshooting

### "Port 8080 already in use"

Use a different port:
```bash
python3 -m http.server 8081
```

### "Python not found"

Install Python:
```bash
sudo apt install python3  # Ubuntu/Debian
```

Or use Node.js instead:
```bash
npx http-server public -p 8080
```

### CSS still not loading?

Check browser console (F12) for errors and see full documentation:
**docs/CSS_LOADING_ISSUE.md**

---

## Documentation

- **Full issue guide**: `docs/CSS_LOADING_ISSUE.md`
- **Fix script**: `fix-css-symlink.sh`
- **CSS tests**: `tests/test-css-loading.html`

---

**TL;DR**: Don't open `file://` directly! Use `python3 -m http.server 8080` and open `http://localhost:8080`
