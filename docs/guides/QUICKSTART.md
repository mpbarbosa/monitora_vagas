# Quick Start Guide

**Version:** 2.0.0  
**Last Updated:** December 16, 2025

## 🚀 Start the Application (30 seconds)

### Using npm (Recommended) ⭐

```bash
cd /home/mpb/Documents/GitHub/monitora_vagas
npm start
```

Then open in your browser: **http://localhost:8080/public/index.html**

### Using Python Directly

```bash
cd /home/mpb/Documents/GitHub/monitora_vagas
python3 -m http.server 8080
```

Then open in your browser: **http://localhost:8080/public/index.html**

✅ **CSS loads correctly!**  
✅ **JavaScript modules work!**  
✅ **API integration functional!**

---

## 📝 What Changed in v2.0

### No More Symlinks! 🎉

**Before (v1.x):**
```
public/
├── index.html
├── css -> ../src/styles    ← Symlink (caused issues)
├── js -> ../src/js         ← Symlink (caused issues)
└── vendor/
```

**After (v2.0):**
```
public/
├── index.html              ← References ../src/styles directly
├── vendor/                 ← Static third-party libraries
└── (no symlinks!)

src/
├── styles/                 ← All CSS source files
├── js/                     ← All JavaScript source files
├── services/               ← API services
└── ...                     ← Other source code
```

### Key Improvements

✅ **No symlink issues** - Direct file references  
✅ **Better organization** - Clear src/ and public/ separation  
✅ **Follows best practices** - Modern web development structure  
✅ **Build-ready** - Prepared for Vite/Webpack integration

---

## 📁 File Locations

### HTML File
```
📄 public/index.html
```

### CSS Files
```
📁 src/styles/
   ├── main.css              # Main stylesheet
   ├── index-page.css        # Index page styles
   ├── components/           # Component styles
   ├── global/               # Global styles
   └── pages/                # Page styles
```

### JavaScript Files
```
📁 src/js/
   ├── hotelSearch.js        # Hotel search logic
   ├── guestCounter.js       # Guest counter
   ├── guestNumberFilter.js  # Guest filter
   ├── global.js             # Global initialization
   └── noScrollInterface.js  # No-scroll UI
```

### Services
```
📁 src/services/
   ├── apiClient.js          # API client
   └── hotelCache.js         # Hotel caching
```

---

## 🌐 Available Commands

```bash
# Start development server (npm)
npm start

# Start development server (Python)
python3 -m http.server 8080

# Run tests
npm test

# Lint Markdown files
npm run lint:md
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
