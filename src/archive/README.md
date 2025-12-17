# Archive - Orphaned Source Code

**Date Archived:** December 16, 2025  
**Version:** 2.0.0  
**Status:** 🗄️ Archived (Not Used in Current Implementation)

---

## Overview

This folder contains source code files that are **not currently referenced or used** in the active application (`public/index.html` and its dependencies). These files were moved here during the v2.0.0 project restructure to keep the active `src/` folder clean and focused.

---

## Why These Files Were Archived

During the project restructure, we identified two sets of source code:

1. **Active Code:** Files directly used by `public/index.html` and its dependencies
2. **Orphaned Code:** Files that exist but are not imported or referenced anywhere

The **orphaned code** was moved to this archive to:
- Keep the active `src/` folder clean
- Preserve potentially useful code for future features
- Make it clear which files are actually in use
- Prevent confusion during development

---

## Archived Files

### Root Files

- **`App.js`** - Main application component (not currently used)
- **`main.js`** - Application entry point (not currently used)

### Components (`components/`)

All component folders were orphaned as they're not imported in the current implementation:

- **`AdvancedSearchModal/`** - Advanced search modal dialog
  - `AdvancedSearchModal.js`, `AdvancedSearchModal.css`, `index.js`
  
- **`ProgressBar/`** - Search progress indicator
  - `ProgressBar.js`, `ProgressBar.css`, `index.js`
  
- **`QuickSearch/`** - Quick search form
  - `QuickSearch.js`, `QuickSearch.css`, `index.js`
  
- **`SearchForm/`** - Main search form component
  - `SearchForm.js`, `SearchFormHandler.js`, `SearchForm.css`, `index.js`
  
- **`index.js`** - Barrel export for all components

### Pages (`pages/`)

- **`Home/`** - Home page component
  - `Home.js`, `Home.css`, `index.js`

### Configuration (`config/`)

- **`app.js`** - Application configuration
- **`constants.js`** - Application constants
- **`index.js`** - Config barrel export

**Note:** `environment.js` is **still active** (not archived) as it's imported by `apiClient.js`

### Utilities (`utils/`)

- **`dates.js`** - Date manipulation utilities (weekend calculation, formatting)
- **`regex.js`** - Regular expression patterns for hotel vacancy detection

**Note:** These utilities contain useful functions that may be needed for future features.

### JavaScript (`js/`)

- **`noScrollInterface.js`** - No-scroll UI interface implementation

### Styles (`styles/`)

- **`no-scroll-optimizations.css`** - No-scroll UI optimizations

---

## Current Active Implementation

The current application (`public/index.html`) uses:

### Active JavaScript Files:
```
src/js/
├── hotelSearch.js       ✅ Used (imported in index.html)
├── guestCounter.js      ✅ Used (imported in index.html)
├── guestNumberFilter.js ✅ Used (imported in index.html)
└── global.js            ✅ Used (imported in index.html)
```

### Active Services:
```
src/services/
├── apiClient.js         ✅ Used (imported by hotelSearch.js)
└── hotelCache.js        ✅ Used (imported by apiClient.js)
```

### Active Config:
```
src/config/
└── environment.js       ✅ Used (imported by apiClient.js)
```

### Active Styles:
```
src/styles/
├── main.css             ✅ Used (imported in index.html)
└── index-page.css       ✅ Used (imported in index.html)
```

---

## Potential Future Use

### Components Ready for Integration

The archived components are **well-structured** and could be integrated if needed:

1. **`SearchForm/`** - Could replace current inline form implementation
2. **`ProgressBar/`** - Could add visual feedback during search
3. **`AdvancedSearchModal/`** - Could add advanced filtering options
4. **`QuickSearch/`** - Could add quick search functionality

### Utilities Ready for Use

The archived utilities contain useful functions:

**`dates.js`:**
```javascript
export function getNextWeekends(monthsAhead = 2) { ... }
export function formatBrazilianDate(date) { ... }
```

**`regex.js`:**
```javascript
export const HOTEL_VACANCY_PATTERNS = {
  general: /([A-Z][a-z\s]+)\s*\(até\s+\d+\s+pessoas?\)/gi,
  specific: /BLUES\s+Luxo\s*\(até\s+3\s+pessoas?\)/gi
};
```

### App Structure Files

- **`App.js`** and **`main.js`** - Could be entry points for a more structured SPA implementation
- **`pages/Home/`** - Could be used for a multi-page application structure

---

## How to Use Archived Files

### Option 1: Restore Individual Files

If you need a specific file:

```bash
# Example: Restore dates.js utility
cp src/archive/utils/dates.js src/utils/dates.js

# Then import it in your code
import { getNextWeekends } from '../utils/dates.js';
```

### Option 2: Restore Component

If you want to use a component:

```bash
# Example: Restore ProgressBar component
cp -r src/archive/components/ProgressBar src/components/

# Then import it
import { ProgressBar } from '../components/ProgressBar/index.js';
```

### Option 3: Reference for New Implementation

Use the archived code as reference when building similar features:
- Check how components were structured
- Review utility function implementations
- Understand patterns used

---

## Migration Notes

### From Archive to Active

If you restore any archived files, remember to:

1. **Update imports** - Adjust relative paths if needed
2. **Check dependencies** - Ensure all imported modules exist
3. **Test thoroughly** - Verify the restored code works
4. **Update documentation** - Document what was restored and why

### File Organization

The archive maintains the same folder structure as `src/`:
```
src/archive/
├── components/    # Same structure as src/components/
├── config/        # Same structure as src/config/
├── js/            # Same structure as src/js/
├── pages/         # Same structure as src/pages/
├── styles/        # Same structure as src/styles/
└── utils/         # Same structure as src/utils/
```

This makes it easy to restore files to their original locations.

---

## Should I Delete These Files?

**No, keep them!** Here's why:

✅ **Future Features** - Components might be needed later  
✅ **Reference** - Good examples of code structure  
✅ **Utilities** - Useful functions that aren't currently used  
✅ **Low Cost** - Files are small and don't impact the application  
✅ **Documentation** - Shows evolution of the project

### When to Delete

Consider deleting if:
- ❌ Files are truly obsolete (deprecated patterns)
- ❌ Better implementations exist
- ❌ Code quality is poor and shouldn't be used as reference
- ❌ Files contain sensitive information (which these don't)

---

## Related Documentation

- [Project Structure](../../docs/PROJECT_STRUCTURE.md) - Current folder structure
- [Restructure Summary](../../docs/RESTRUCTURE_SUMMARY.md) - v2.0 changes
- [Folder Structure Guide](../../.github/FOLDER_STRUCTURE_GUIDE.md) - Best practices

---

## Questions?

If you're unsure whether to restore or delete a file:

1. **Check if it's referenced** - Search the codebase for imports
2. **Review the code** - Determine if it's still valuable
3. **Test restoration** - Try restoring to see if it works
4. **Document decision** - Update this README if you restore/delete

---

## Archive History

| Date | Action | Files | Reason |
|------|--------|-------|--------|
| 2025-12-16 | Initial Archive | 26 files | v2.0.0 restructure - removed orphaned code |

---

*Last Updated: December 16, 2025*  
*Maintained by: Project Team*
