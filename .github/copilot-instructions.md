# GitHub Copilot Instructions

## Project Context

**Project Name**: Monitora Vagas  
**Type**: Client-side SPA (Single Page Application)  
**Version**: 2.2.0  
**Tech Stack**: JavaScript (ES6+), Bootstrap 5.3.3, Python (testing)

## Architecture Patterns

### 1. ES6 Modules
- Use ES6 module imports/exports (not IIFE)
- No global namespace pollution
- Explicit dependencies via imports
- Example: `import { logger } from '../services/logger.js'`

### 2. Functional Programming
- Prefer pure functions (no side effects)
- Use dependency injection for testability
- ESLint `no-this` rule enforced in functional code
- See: `.github/REFERENTIAL_TRANSPARENCY.md`

### 3. Centralized Services
- **Logger**: `src/services/logger.js` - Use for all logging (not console.log)
- **Constants**: `src/config/constants.js` - No magic numbers allowed
- **API Client**: `src/services/apiClient.js` - All API calls go through this
- **Cache**: `src/services/hotelCache.js` - LocalStorage wrapper with TTL

### 4. Separation of Concerns
- HTML for structure only (no inline styles/scripts)
- CSS in `src/styles/` (modular organization)
- JavaScript in `src/js/` (ES6 modules)
- See: `.github/HTML_CSS_JS_SEPARATION.md`

## Coding Standards

### JavaScript
- Use ES6+ features (const/let, arrow functions, template literals)
- Module imports must include `.js` extension
- Use `logger` for debugging (never console.log in production code)
- Extract ALL magic numbers to `src/config/constants.js`
- Follow naming: camelCase for variables/functions, PascalCase for classes

### CSS
- Mobile-first responsive design
- Bootstrap 5.3.3 utilities preferred over custom CSS
- Custom CSS in modular files under `src/styles/`
- See: `.github/MOBILE_FIRST_GUIDE.md` (if exists)

### Documentation
- Keep README.md updated with new features
- Document in `docs/` with category-based organization
- Use markdown (.md) files
- Follow standards in `docs/standards/DOCUMENTATION_AUTOMATION.md`

## File Organization

```
src/
├── config/          # Configuration and constants
│   ├── constants.js # All magic numbers, timeouts, limits
│   └── environment.js # Environment detection
├── services/        # Reusable services (API, cache, logger)
│   ├── apiClient.js # Pure functional API client
│   ├── hotelCache.js # LocalStorage caching with TTL
│   ├── ibira-loader.js # ibira.js CDN + local fallback loader
│   └── logger.js    # Centralized logging service
├── js/              # JavaScript modules
│   ├── global.js    # Global initialization
│   ├── guestCounter.js # Guest counter component
│   ├── guestNumberFilter.js # Guest filtering logic
│   ├── hotelSearch.js # Search workflow
│   └── searchLifecycleState.js # UI state management
├── styles/          # CSS files (modular)
│   ├── components/ # Component-specific styles
│   ├── global/     # Global styles
│   └── pages/      # Page-specific styles
├── components/      # Future React components
└── utils/           # Utility functions

public/
├── index.html       # Main HTML file
└── vendor/          # Third-party libraries (Bootstrap, jQuery)

docs/
├── api/             # API documentation
├── architecture/    # Design decisions
├── features/        # Feature specifications
├── guides/          # User/developer guides
├── implementation/  # Implementation details
├── specifications/  # Technical specifications
├── standards/       # Coding standards (if exists)
├── styling/         # CSS and visual design
├── testing/         # Test documentation
└── troubleshooting/ # Problem solving guides
```

## Testing

- **Python**: Selenium WebDriver for E2E tests
- **Jest**: JavaScript unit tests (ES6 module support)
- **ESLint**: Code quality (no-this rule enabled)
- Run tests: `./run-tests.sh`

## Key Features

### Implemented (v2.2.0)
- FR-004A: Guest Filter State Management
- FR-004B: Client-Side Guest Number Filtering
- FR-008A: Search Lifecycle UI State Management
- FR-014: Booking Rules Toggle Feature
- Centralized Logger Service
- Constants Extraction
- ES6 Module Architecture

### API Integration
- Busca Vagas API v1.4.1
- Base URL: `https://www.mpbarbosa.com/api`
- **ibira.js** for API fetching (CDN + local fallback)
- LocalStorage caching (24h TTL for hotel list)
- API response caching via ibira.js (5min TTL, exponential backoff retries)

## When Suggesting Code

### DO:
- Import from centralized services (logger, constants, apiClient)
- Use ES6 modules with explicit imports/exports
- Extract magic numbers to constants.js
- Add JSDoc comments for functions
- Use semantic HTML5 elements
- Follow mobile-first CSS approach
- Write testable, pure functions
- Use `logger.debug()`, `logger.info()`, `logger.warn()`, `logger.error()`

### DON'T:
- Use global variables or window object
- Use console.log (use logger instead)
- Hard-code values (use constants)
- Use jQuery for new code (Bootstrap 5 uses vanilla JS)
- Create IIFE patterns (use ES6 modules)
- Mix concerns (inline styles/scripts in HTML)
- Create magic numbers (always use constants)

## Logger Usage

```javascript
import { logger } from '../services/logger.js';

// Basic logging
logger.debug('Detailed debug info', 'COMPONENT_NAME');
logger.info('General information', 'COMPONENT_NAME');
logger.warn('Warning message', 'COMPONENT_NAME');
logger.error('Error occurred', errorObject, 'COMPONENT_NAME');

// Performance measurement
logger.time('API Request');
const result = await apiClient.getHotels();
logger.timeEnd('API Request');

// Grouped logging
logger.group('Search Process');
logger.debug('Step 1: Validate inputs');
logger.debug('Step 2: Call API');
logger.debug('Step 3: Process results');
logger.groupEnd();
```

## Constants Usage

```javascript
import { TIME, API, VALIDATION, CACHE } from '../config/constants.js';

// Use timeouts
setTimeout(fetchData, TIME.TIMEOUT.DEFAULT);

// Use API constants
if (response.status === API.STATUS.OK) { ... }

// Use validation limits
if (guestCount > VALIDATION.GUESTS.MAX) { ... }

// Use cache keys
localStorage.setItem(CACHE.KEYS.HOTEL_LIST, data);
```

## Documentation References

- **Architecture**: `docs/architecture/`
- **API Docs**: `docs/api/API_DOCUMENTATION.md`
- **Standards**: `docs/standards/` (if exists)
- **Best Practices**: `.github/` guides

## Version History

- **v2.2.0** (2024-12-22): FR-014, logger service, constants extraction
- **v2.1.0** (2024-12-22): Documentation restructure, infrastructure updates
- **v2.0.0** (2024-12-16): Major restructure, removed symlinks
- **v1.5.0** (2024-12-14): Booking rules implementation

## Support

- **Issues**: GitHub Issues
- **Documentation**: `docs/README.md`
- **Quick Start**: `docs/guides/QUICKSTART.md`
