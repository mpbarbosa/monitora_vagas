# Project Structure Documentation

## Overview

This document describes the current folder structure of the Trade Union Hotel Search Platform (Monitor de Vagas AFPESP). The structure follows modern web development best practices as outlined in `.github/FOLDER_STRUCTURE_GUIDE.md`.

**Last Updated:** December 16, 2025  
**Project Version:** 2.0.0

---

## Directory Structure

```plaintext
monitora_vagas/
├── public/                      # Static assets (NOT processed by build tools)
│   ├── archived-versions/      # Archived HTML versions
│   ├── vendor/                 # Third-party libraries (jQuery, Bootstrap, etc.)
│   ├── favicon.ico             # Site favicon
│   ├── index.html             # Main HTML file
│   └── sw.js                  # Service Worker
│
├── src/                        # Source code (processed by build tools)
│   ├── assets/                 # Dynamic assets
│   │   ├── fonts/             # Web fonts (ready for use)
│   │   ├── icons/             # SVG icons
│   │   └── images/            # Images (ready for use)
│   │
│   ├── components/             # Reusable UI components (empty - see archive)
│   │
│   ├── services/               # API and external service integrations
│   │   ├── apiClient.js       # API client for backend ✅ ACTIVE
│   │   └── hotelCache.js      # Hotel data caching service ✅ ACTIVE
│   │
│   ├── js/                     # JavaScript modules
│   │   ├── global.js          # Global initialization ✅ ACTIVE
│   │   ├── guestCounter.js    # Guest number counter ✅ ACTIVE
│   │   ├── guestNumberFilter.js # Guest filter ✅ ACTIVE
│   │   └── hotelSearch.js     # Hotel search logic ✅ ACTIVE
│   │
│   ├── utils/                  # Utility functions (empty - see archive)
│   │
│   ├── config/                 # Configuration files
│   │   └── environment.js     # Environment variables ✅ ACTIVE
│   │
│   ├── styles/                 # CSS stylesheets
│   │   ├── components/        # Component-specific styles
│   │   ├── global/            # Global styles
│   │   ├── pages/             # Page-specific styles
│   │   ├── index-page.css     # Index page styles ✅ ACTIVE
│   │   └── main.css           # Main stylesheet ✅ ACTIVE
│   │
│   └── archive/               # 🗄️ Archived orphan code (NOT in use)
│       ├── components/        # Archived UI components
│       │   ├── AdvancedSearchModal/
│       │   ├── ProgressBar/
│       │   ├── QuickSearch/
│       │   └── SearchForm/
│       ├── pages/             # Archived pages (Home/)
│       ├── config/            # Archived config (app.js, constants.js, index.js)
│       ├── utils/             # Archived utils (dates.js, regex.js)
│       ├── js/                # Archived JS (noScrollInterface.js)
│       ├── styles/            # Archived CSS (no-scroll-optimizations.css)
│       ├── App.js             # Archived app component
│       ├── main.js            # Archived entry point
│       └── README.md          # Archive documentation (7KB)
│
├── tests/                      # Test files
│   ├── e2e/                    # End-to-end tests
│   ├── integration/            # Integration tests
│   ├── unit/                   # Unit tests
│   ├── *.py                    # Python test scripts
│   ├── *.html                  # HTML test pages
│   ├── *.js                    # JavaScript test scripts
│   ├── *.sh                    # Shell test scripts
│   └── README.md               # Test documentation
│
├── docs/                       # Project documentation
│   ├── api/                    # API documentation
│   ├── architecture/           # Architecture decisions
│   ├── features/               # Feature documentation
│   ├── guides/                 # User and developer guides
│   ├── implementation/         # Implementation details
│   ├── specifications/         # Technical specifications
│   ├── styling/                # Styling documentation
│   ├── testing/                # Testing documentation
│   ├── troubleshooting/        # Troubleshooting guides
│   ├── workflows/              # Workflow documentation
│   ├── PROJECT_STRUCTURE.md   # This file
│   └── README.md               # Documentation index
│
├── legacy/                     # Legacy code (deprecated)
│   └── prompts/                # Old prompt templates
│
├── .github/                    # GitHub-specific files
│   ├── workflows/              # GitHub Actions (future)
│   ├── FOLDER_STRUCTURE_GUIDE.md
│   ├── HTML_CSS_JS_SEPARATION.md
│   └── *.md                    # Other guides
│
├── node_modules/               # Dependencies (git-ignored)
├── venv/                       # Python virtual environment (git-ignored)
│
├── .gitignore                  # Git ignore rules
├── package.json                # Node.js dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── requirements.txt            # Python dependencies
├── vite.config.js              # Vite build configuration (future)
├── CHANGELOG.md                # Version history
├── QUICKSTART.md               # Quick start guide
├── README.md                   # Project overview
├── run-tests.sh                # Test runner script
└── fix-css-symlink.sh          # CSS symlink fix script

```

---

## Folder Descriptions

### `/public` - Static Assets

**Purpose:** Contains static files that are served directly without processing.

**Contents:**
- `index.html` - Main HTML file
- `vendor/` - Third-party libraries (jQuery, Bootstrap, Font Awesome, etc.)
- `favicon.ico` - Site favicon
- `sw.js` - Service Worker for offline support
- `archived-versions/` - Previous versions of index.html

**Access:** Files are served at root URL (e.g., `/index.html`, `/vendor/jquery/jquery.min.js`)

**Note:** No symlinks should exist in this folder. All source code is in `/src`.

---

### `/src` - Source Code

**Purpose:** Contains all application source code that should be organized and potentially processed by build tools.

#### `/src/assets`
**Purpose:** Dynamic assets (fonts, icons, images) that may be processed by build tools.
- Supports automatic optimization
- Cache busting via hashed filenames
- Tree-shaking for unused assets

#### `/src/components`
**Purpose:** Reusable UI components used across multiple pages.

**Current Status:** Empty (components archived)

⚠️ **Note:** Previous components were moved to `/legacy/` as they were not referenced in the current implementation. Components are now managed in `public/index.html` and `src/js/` modules.

**Archived Components:**
- `AdvancedSearchModal/` - Advanced search modal dialog (archived)
- `ProgressBar/` - Search progress indicator (archived)
- `QuickSearch/` - Quick search form (archived)
- `SearchForm/` - Main search form (archived)

**Convention:** Each component has its own folder with JS, CSS, and index.js files.

#### `/src/pages`
**Purpose:** Page-level components representing distinct routes/views.

**Current Status:** Empty (pages archived)

⚠️ **Note:** Previous pages were moved to `/src/archive/pages/` as they were not referenced. The current implementation uses `public/index.html` directly without page components.

**Archived Pages:**
- `Home/` - Main landing page (archived)

#### `/src/services`
**Purpose:** Business logic and API integrations.

**Current Services:**
- `apiClient.js` - API client for backend communication
- `hotelCache.js` - Hotel data caching with TTL

**Best Practice:** Services return promises and handle errors consistently.

#### `/src/js`
**Purpose:** JavaScript modules for various functionality.

**Current Modules:**
- `global.js` - Global initialization
- `guestCounter.js` - Guest number counter
- `guestNumberFilter.js` - Guest filtering logic
- `hotelSearch.js` - Hotel search form handler
- `noScrollInterface.js` - No-scroll UI implementation

**Note:** Following HTML/CSS/JS separation principles (see `.github/HTML_CSS_JS_SEPARATION.md`)

#### `/src/utils`
**Purpose:** Pure utility functions with no side effects.

**Current Utilities:**
- `dates.js` - Date manipulation (weekend calculation, formatting)
- `regex.js` - Regular expression patterns for hotel vacancy detection

**Best Practice:** Utils should be pure functions, easily testable.

#### `/src/config`
**Purpose:** Configuration objects and environment-specific settings.

**Current Config:**
- `app.js` - Application configuration
- `constants.js` - Application constants
- `environment.js` - Environment variables
- `index.js` - Barrel export for all configs

#### `/src/styles`
**Purpose:** CSS stylesheets organized by scope.

**Structure:**
- `components/` - Component-specific styles
- `global/` - Global styles (reset, typography)
- `pages/` - Page-specific styles
- `main.css` - Main stylesheet (imports all)
- `index-page.css` - Index page specific styles
- `no-scroll-optimizations.css` - No-scroll UI styles

**Best Practice:** Component styles stay with components; global styles here.

#### `/src/archive`
**Purpose:** Archived orphan code that is not currently used in the active application.

**Why Archive?**
During the v2.0.0 restructure, we identified files that exist but are not imported or referenced anywhere. These files were moved to the archive to:
- Keep the active `src/` folder clean
- Preserve potentially useful code for future features
- Make it clear which files are actually in use
- Serve as reference implementations

**Archived Content:**
- **26 total files** organized by type
- `components/` - 4 component folders (AdvancedSearchModal, ProgressBar, QuickSearch, SearchForm)
- `pages/` - Home page component
- `config/` - app.js, constants.js, index.js
- `utils/` - dates.js, regex.js
- `js/` - noScrollInterface.js
- `styles/` - no-scroll-optimizations.css
- Root files: App.js, main.js

**Documentation:**
See `legacy/` folder for:
- Complete list of archived files
- Reasons for archiving
- How to restore files if needed
- Usage examples for archived utilities

**Note:** Archived files are preserved for reference and potential future use. They represent well-structured code that may be integrated when needed.

---

### `/tests` - Test Files

**Purpose:** All test files organized by test type.

**Structure:**
- `e2e/` - End-to-end tests (Selenium, Playwright)
- `integration/` - Multi-component interaction tests
- `unit/` - Individual function/component tests

**Test Files:**
- `*.py` - Python test scripts (Selenium tests)
- `*.html` - HTML test pages
- `*.js` - JavaScript test scripts
- `*.sh` - Shell test runner scripts

**Documentation:**
- Various `*_README.md` files document test suites
- `README.md` - Main test documentation

---

### `/docs` - Documentation

**Purpose:** Comprehensive project documentation organized by topic.

**Structure:**
- `api/` - API documentation and integration guides
- `architecture/` - Architecture decisions and design docs
- `features/` - Feature specifications
- `guides/` - User and developer guides
- `implementation/` - Implementation details
- `specifications/` - Technical specifications
- `styling/` - CSS and design documentation
- `testing/` - Test documentation
- `troubleshooting/` - Problem-solving guides
- `workflows/` - Workflow and process documentation

---

### `/legacy` - Deprecated Code

**Purpose:** Legacy code kept for reference but not actively used.

**Contents:**
- Old prompt templates
- Deprecated scripts

**Note:** Code here should not be imported or used in active development.

---

## Key Files

### Root Configuration Files

- **`package.json`** - Node.js dependencies, scripts, and metadata
- **`package-lock.json`** - Locked dependency versions
- **`requirements.txt`** - Python dependencies
- **`vite.config.js`** - Vite build configuration (for future builds)
- **`.gitignore`** - Git ignore rules

### Documentation Files

- **`README.md`** - Project overview and getting started
- **`CHANGELOG.md`** - Version history and changes
- **`QUICKSTART.md`** - Quick start guide

### Utility Scripts

- **`run-tests.sh`** - Main test runner
- **`fix-css-symlink.sh`** - CSS symlink repair script

---

## File Naming Conventions

### JavaScript Files
- **Components:** `PascalCase.js` (e.g., `SearchForm.js`)
- **Utilities:** `camelCase.js` (e.g., `dateUtils.js`)
- **Constants:** `UPPER_SNAKE_CASE.js` (e.g., `API_CONSTANTS.js`)
- **Config:** `camelCase.js` (e.g., `app.js`)

### CSS Files
- **Global:** `kebab-case.css` (e.g., `main.css`)
- **Components:** `kebab-case.css` (e.g., `search-form.css`)
- **Pages:** `kebab-case.css` (e.g., `index-page.css`)

### Folders
- **Multi-word:** `kebab-case` (e.g., `guest-counter/`)
- **Components:** `PascalCase` (e.g., `SearchForm/`)

---

## Import Paths

### Current (Development Mode)

Since we're serving directly without a build step, use **relative paths**:

```javascript
// In src/js/hotelSearch.js
import { apiClient } from '../services/apiClient.js';

// In HTML
<link href="../src/styles/main.css" rel="stylesheet">
<script type="module" src="../src/js/hotelSearch.js"></script>
```

### Future (With Build Tool)

When using Vite or similar build tools, use **path aliases**:

```javascript
// vite.config.js defines aliases
import { apiClient } from '@services/apiClient.js';
import { formatDate } from '@utils/dates.js';
import '@styles/main.css';
```

---

## Development Workflow

### Starting Development Server

```bash
# Start local server
npm start
# or
npm run dev

# Open browser to http://localhost:8080/public/index.html
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
./run-tests.sh

# Run CSS tests
cd tests && ./run-css-tests.sh
```

### Linting

```bash
# Lint Markdown files
npm run lint:md
```

---

## Migration Notes

### Changes from Previous Structure

**Before (v1.x):**
```plaintext
monitora_vagas/
├── public/
│   ├── css/ (symlink to src/styles)
│   ├── js/ (symlink to src/js)
│   ├── services/ (symlink to src/services)
│   └── config/ (symlink to src/config)
└── src/
```

**After (v2.0):**
```plaintext
monitora_vagas/
├── public/              # Only static files
│   ├── vendor/
│   └── index.html
└── src/                 # All source code
    ├── js/
    ├── styles/
    ├── services/
    └── config/
```

**Key Changes:**
1. ✅ Removed all symlinks from `public/`
2. ✅ All source code is in `src/`
3. ✅ Vendor libraries remain in `public/vendor/`
4. ✅ HTML references source files with relative paths (`../src/`)
5. ✅ Clear separation between static and source files

---

## Best Practices

### 1. Separation of Concerns
- **HTML** in `public/` for structure
- **CSS** in `src/styles/` for presentation
- **JavaScript** in `src/js/` and `src/services/` for behavior

### 2. No Duplication
- Single source of truth for each file
- No duplicate files or symlinks
- Use imports/includes instead of copying

### 3. Organization
- Group related files together
- Use barrel exports (`index.js`) for clean imports
- Keep folder nesting shallow (max 3-4 levels)

### 4. Documentation
- Update this file when structure changes
- Document architectural decisions in `/docs/architecture/`
- Keep README.md focused, deep dives in `/docs/`

---

## Future Improvements

### Short-term
- [ ] Add `.env` file for environment variables
- [ ] Configure ESLint and Prettier
- [ ] Add pre-commit hooks with Husky

### Medium-term
- [ ] Implement Vite build process
- [ ] Add TypeScript support
- [ ] Create component library in `src/ui/`

### Long-term
- [ ] Consider monorepo structure for multiple apps
- [ ] Extract shared utilities to separate package
- [ ] Implement micro-frontends architecture

---

## Related Documentation

- [Folder Structure Guide](../../.github/FOLDER_STRUCTURE_GUIDE.md) - Comprehensive structure guide
- [HTML/CSS/JS Separation](../../.github/HTML_CSS_JS_SEPARATION.md) - Separation principles
- [Quick Start](../guides/QUICKSTART.md) - Getting started guide
- [README](../README.md) - Project overview

---

## Support

For questions or suggestions about the project structure:
1. Check the [Folder Structure Guide](../../.github/FOLDER_STRUCTURE_GUIDE.md)
2. Review [documentation in `/docs`](../README.md)
3. Open an issue on GitHub
4. Contact the development team

---

*Last Updated: December 16, 2025*  
*Maintained by: AFPESP Monitor Team*
