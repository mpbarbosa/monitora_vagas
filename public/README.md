# Public Directory

**Purpose:** Static assets and public-facing files served by the web application

## 📁 Structure

```
public/
├── index.html              # Main application entry point
├── sw.js                   # Service worker (Progressive Web App)
├── favicon.ico             # Site favicon
├── archived-versions/      # Historical HTML versions
├── test_screenshots/       # Test failure screenshots (gitignored)
└── vendor/                 # Third-party libraries
    ├── jquery/
    ├── bootstrap-wizard/
    ├── datepicker/
    ├── select2/
    ├── font-awesome-4.7/
    └── mdi-font/
```

## 🎯 Purpose

This directory contains all **static assets** that are served directly to the browser without processing. It represents the production-ready public interface of the application.

## 📄 Key Files

### `index.html`
Main application entry point. Uses relative paths to access source files:
- CSS: `../src/styles/`
- JavaScript: `../src/js/`
- Node modules: `../node_modules/`

### `sw.js`
Service worker for Progressive Web App (PWA) capabilities:
- Offline functionality
- Caching strategies
- Background sync

### `favicon.ico`
Site favicon displayed in browser tabs and bookmarks.

## 📚 Vendor Libraries

Third-party libraries are stored in `vendor/` subdirectory:

| Library | Version | Purpose |
|---------|---------|---------|
| jQuery | Latest | DOM manipulation (legacy support) |
| Bootstrap Wizard | Latest | Multi-step form wizard |
| Datepicker | Latest | Date range selection |
| Select2 | Latest | Enhanced dropdown/select |
| Font Awesome | 4.7 | Icon library |
| MDI Font | Latest | Material Design icons |

### Why Vendor Directory?

- **Reliability:** Local copies ensure availability even if CDNs fail
- **Performance:** Faster loading from same domain
- **Offline Support:** Works with service worker for offline capability
- **Version Control:** Specific versions guaranteed

## 🚫 What's NOT Here

The following are **NOT** in this directory (they're symlinked or referenced from parent directories):

- ❌ `css/` - CSS files are in `../src/styles/`
- ❌ `src/` - Source JavaScript is in `../src/js/`
- ❌ `node_modules/` - Dependencies are in `../node_modules/`

**Why?** Separation of concerns:
- `public/` = Production-ready static assets
- `src/` = Source code for processing/bundling
- `node_modules/` = Development dependencies

## 🔗 Path References

All paths in `index.html` use relative references:

```html
<!-- CSS from src -->
<link href="../src/styles/main.css" rel="stylesheet">

<!-- JavaScript from src -->
<script type="module" src="../src/js/hotelSearch.js"></script>

<!-- Node modules -->
<script type="importmap">
{
  "imports": {
    "ibira.js": "../node_modules/ibira.js/src/index.js"
  }
}
</script>

<!-- Vendor assets (local) -->
<script src="vendor/jquery/jquery.min.js"></script>
```

## 📦 Deployment

When deploying to production:

1. **This directory** is served as-is
2. **Source files** (`../src/`) may be bundled/minified (future)
3. **Vendor files** are included in deployment
4. **Service worker** handles caching and offline support

## 🔧 Development

### Local Development Server

```bash
# From project root
cd public
python3 -m http.server 8080

# Or use npm script
npm start
```

### Accessing the Application

```
http://localhost:8080/index.html
```

## 📝 Archived Versions

The `archived-versions/` subdirectory contains historical HTML versions:
- Preserved for reference
- Not used in production
- Useful for understanding evolution

## 🧪 Test Screenshots

The `test_screenshots/` directory stores:
- Screenshots from test failures
- Gitignored (not committed)
- Automatically created by test scripts
- Useful for debugging test failures

## 🚀 Progressive Web App

The `sw.js` service worker enables:
- **Offline Mode:** Cache assets for offline use
- **Fast Loading:** Serve cached resources instantly
- **Background Sync:** Queue requests when offline
- **Push Notifications:** (Future capability)

## 📚 Related Documentation

- **[Project Structure](../docs/architecture/PROJECT_STRUCTURE.md)** - Complete structure guide
- **[HTML/CSS/JS Separation](../.github/HTML_CSS_JS_SEPARATION.md)** - Separation principles
- **[Implementation Guide](../docs/architecture/IMPLEMENTATION_GUIDE.md)** - Architecture overview
- **[README.md](../README.md)** - Main project documentation

## ⚡ Performance

Optimizations for this directory:
- ✅ Vendor files minified
- ✅ Service worker caching
- ✅ Relative paths (no symlinks)
- ✅ Proper MIME types
- ✅ No unnecessary files served

## 🔐 Security

Security considerations:
- ✅ No sensitive data in public files
- ✅ No API keys or secrets
- ✅ Environment-specific configs in `src/config/`
- ✅ CORS properly configured
- ✅ Content Security Policy (CSP) headers

---

**Status:** Production  
**Version:** 2.1.0  
**Last Updated:** 2024-12-23
