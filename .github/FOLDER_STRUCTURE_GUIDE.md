# Folder Structure Guide - Monitora Vagas

> A comprehensive guide for the Monitora Vagas (Trade Union Hotel Search Platform) project structure and organization

**Version**: 2.1.0  
**Last Updated**: 2024-12-23  
**Status**: Production Ready

---

## Table of Contents

1. [Introduction](#introduction)
2. [Current Project Structure](#current-project-structure)
3. [Folder Organization](#folder-organization)
4. [File Type Guidelines](#file-type-guidelines)
5. [Development Workflow](#development-workflow)
6. [Best Practices](#best-practices)
7. [Testing Structure](#testing-structure)
8. [Documentation Structure](#documentation-structure)
9. [Resources](#resources)

---

## Introduction

Monitora Vagas is a modern web application for searching hotel vacancies through trade union partnerships. The project has evolved from a Selenium-based automation script to a production-ready web application with:

- **Bootstrap 5.3.3** UI framework
- **ES6 Modules** architecture
- **API Integration** with Busca Vagas backend
- **Referential Transparency** in code design
- **Comprehensive Testing** (Jest + Python)
- **Production Deployment** on live server

### Architecture

- **Frontend**: Vanilla JavaScript (ES6+) with Bootstrap 5.3.3
- **Backend Integration**: REST API calls to Busca Vagas service
- **Data Flow**: Functional programming with pure functions
- **State Management**: Centralized state lifecycle management
- **Caching**: LocalStorage with TTL for hotel data

---

## Current Project Structure

```plaintext
monitora_vagas/
├── .github/                        # GitHub configuration
│   ├── workflows/                  # GitHub Actions
│   │   └── docs-organize.yml      # Documentation automation
│   ├── FOLDER_STRUCTURE_GUIDE.md  # This file
│   ├── HTML_CSS_JS_SEPARATION.md  # Separation of concerns
│   ├── HIGH_COHESION_GUIDE.md     # Cohesion principles
│   ├── LOW_COUPLING_GUIDE.md      # Coupling principles
│   ├── MOBILE_FIRST_GUIDE.md      # Mobile-first design
│   └── REFERENTIAL_TRANSPARENCY.md # Functional programming
│
├── .ai_workflow/                   # AI workflow automation
│   ├── backlog/                   # Archived workflows
│   ├── logs/                      # Workflow execution logs
│   └── summaries/                 # Workflow summaries
│
├── public/                         # Static assets
│   ├── vendor/                    # Third-party libraries
│   │   ├── bootstrap-wizard/     # Bootstrap wizard
│   │   ├── datepicker/           # Date range picker
│   │   ├── font-awesome-4.7/     # Font Awesome icons
│   │   ├── jquery/               # jQuery library
│   │   ├── jquery-validate/      # jQuery validation
│   │   ├── mdi-font/             # Material Design Icons
│   │   └── select2/              # Select2 dropdown
│   ├── archived-versions/         # Archived HTML versions
│   ├── index.html                # Main application entry
│   ├── sw.js                     # Service worker
│   └── favicon.ico               # Site favicon
│
├── src/                           # Source code
│   ├── assets/                   # Dynamic assets
│   │   ├── fonts/               # Web fonts
│   │   ├── icons/               # SVG icons
│   │   └── images/              # Images
│   │
│   ├── components/               # Reusable UI components (future)
│   │
│   ├── config/                   # Configuration
│   │   ├── constants.js         # Application constants
│   │   └── environment.js       # Environment detection
│   │
│   ├── services/                 # API & business logic
│   │   ├── apiClient.js         # Pure functional API client
│   │   ├── hotelCache.js        # Hotel data caching
│   │   └── logger.js            # Centralized logging
│   │
│   ├── js/                       # JavaScript modules
│   │   ├── global.js            # Global initialization
│   │   ├── guestCounter.js      # Guest counter component
│   │   ├── guestNumberFilter.js # Guest filtering logic
│   │   ├── hotelSearch.js       # Search functionality
│   │   └── searchLifecycleState.js # FR-008A state management
│   │
│   ├── styles/                   # CSS stylesheets
│   │   ├── components/          # Component styles
│   │   ├── global/              # Global styles
│   │   └── pages/               # Page-specific styles
│   │
│   └── utils/                    # Utility functions
│
├── docs/                          # Documentation
│   ├── api/                      # API documentation
│   │   ├── README.md            # API overview
│   │   ├── API_DOCUMENTATION.md # Complete API reference
│   │   ├── API_INTEGRATION_*.md # Integration guides
│   │   └── ...
│   │
│   ├── architecture/             # Architecture docs
│   │   ├── IMPLEMENTATION_GUIDE.md
│   │   ├── STATE_DRIVEN_UI_PATTERN.md
│   │   ├── MD3_*.md             # Material Design 3 docs
│   │   └── ...
│   │
│   ├── features/                 # Feature requirements
│   │   ├── FUNCTIONAL_REQUIREMENTS.md
│   │   ├── FR-*.md              # Individual feature docs
│   │   └── ...
│   │
│   ├── guides/                   # User guides
│   │   ├── README.md            # Documentation index
│   │   ├── QUICKSTART.md        # Quick start guide
│   │   ├── DEVELOPMENT_TOOLS_GUIDE.md
│   │   └── ...
│   │
│   ├── specifications/           # Technical specifications
│   │   ├── MAIN_JS_TECHNICAL_SPECIFICATION.md
│   │   ├── HTML_SPECIFICATION.md
│   │   └── ...
│   │
│   ├── standards/                # Coding standards
│   │   ├── CENTRALIZED_LOGGER.md
│   │   ├── CONSTANTS_EXTRACTION.md
│   │   ├── ES6_MODULE_CONVERSION.md
│   │   └── ...
│   │
│   ├── styling/                  # UI/CSS documentation
│   │   ├── BOOTSTRAP_INTEGRATION.md
│   │   ├── FORM_IN_HEADER_IMPLEMENTATION.md
│   │   └── ...
│   │
│   ├── testing/                  # Test documentation
│   │   ├── TEST_VALIDATION_SUMMARY.md
│   │   └── ...
│   │
│   ├── troubleshooting/          # Troubleshooting guides
│   │   ├── UNICODE_EMOJI_CORRUPTION_GUIDE.md
│   │   └── ...
│   │
│   ├── workflows/                # Workflow documentation
│   │   └── WORKFLOW_EXECUTION_CONTEXT_*.md
│   │
│   ├── ADAPTIVE_WORKFLOW_GUIDE.md # Adaptive workflow guide
│   └── README.md                 # Documentation root
│
├── tests/                         # Test suites
│   ├── e2e/                      # End-to-end tests
│   │   ├── README.md
│   │   ├── INDEX.md
│   │   ├── QUICK_START.md
│   │   └── E2E_TEST_GUIDE.md
│   ├── apiClient.test.js         # API client unit tests (Jest)
│   ├── test_*.py                 # UI tests (Python/Selenium)
│   ├── run-*.sh                  # Test runner scripts
│   └── *_README.md               # Test documentation
│
├── scripts/                       # Build & utility scripts
│   └── (various utility scripts)
│
├── legacy/                        # Legacy code (archived)
│   └── (old implementations)
│
├── .vscode/                       # VS Code configuration
│   └── settings.json             # Editor settings
│
├── coverage/                      # Test coverage reports
│
├── test_screenshots/              # Screenshot artifacts
│
├── .gitignore                     # Git ignore rules
├── .eslintrc.json                # ESLint configuration
├── eslint.config.js              # ESLint config (new format)
├── jest.config.js                # Jest test configuration
├── vite.config.js                # Vite build configuration
├── .markdownlint.json            # Markdown linting
├── .remarkrc                     # Remark configuration
├── .nvmrc                        # Node version specification
├── .npmrc                        # NPM configuration
├── package.json                  # NPM dependencies
├── package-lock.json             # Locked dependencies
├── requirements.txt              # Python dependencies
├── CHANGELOG.md                  # Version changelog
├── README.md                     # Project README
└── LICENSE                       # License file
```

---

## Folder Organization

### `/public` - Static Assets

**Purpose**: Files served directly without build processing

**Contents**:

- `index.html` - Main HTML entry point
- `vendor/` - Third-party JavaScript libraries
- `archived-versions/` - Historical HTML versions
- `sw.js` - Service worker for PWA support

**Guidelines**:

- ✅ Place files that don't need preprocessing
- ✅ Use for vendor libraries loaded via CDN fallback
- ✅ Keep HTML files for direct browser access
- ❌ Don't put source code that needs transpilation
- ❌ Avoid large binary files (use CDN)

### `/src` - Source Code

**Purpose**: Application source code (processable by build tools)

#### `/src/config` - Configuration

```javascript
// constants.js - Application-wide constants
export const API_ENDPOINTS = {
  HEALTH: '/health',
  HOTELS: '/vagas/hoteis',
  SEARCH: '/vagas/search'
};

// environment.js - Environment detection
export const isProduction = () => window.location.hostname !== 'localhost';
```

**Guidelines**:

- ✅ Export const objects for constants
- ✅ Use uppercase for constant names
- ✅ Group related constants
- ❌ Don't include secrets or API keys

#### `/src/services` - API & Business Logic

**Purpose**: Pure functions for external communication

```javascript
// apiClient.js - Referentially transparent API client
export function createAPIClient(config) {
  return {
    searchVacancies: (checkin, checkout, options) => { ... },
    fetchHotels: () => { ... }
  };
}
```

**Principles**:

- ✅ **Referential Transparency**: Pure functions, no side effects
- ✅ **Dependency Injection**: Pass dependencies as parameters
- ✅ **Immutability**: Never mutate input parameters
- ✅ **Error Handling**: Return Result types or throw specific errors
- ❌ No global state or variables
- ❌ No direct DOM manipulation

#### `/src/js` - JavaScript Modules

**Purpose**: Application logic and UI interactions

**Organization**:

- `global.js` - Application bootstrap and initialization
- `hotelSearch.js` - Search functionality
- `guestCounter.js` - Guest counter component
- `guestNumberFilter.js` - Client-side filtering
- `searchLifecycleState.js` - State management (FR-008A)

**Guidelines**:

- ✅ Use ES6 module imports/exports
- ✅ One primary responsibility per file
- ✅ Prefix private functions with underscore
- ✅ Document public API with JSDoc comments
- ❌ Avoid circular dependencies
- ❌ Don't mix UI and business logic

#### `/src/styles` - CSS Organization

**Structure**:

```text
styles/
├── global/          # Global styles
│   ├── reset.css
│   ├── typography.css
│   └── variables.css
├── components/      # Component-specific styles
│   ├── buttons.css
│   ├── forms.css
│   └── cards.css
└── pages/           # Page-specific styles
    └── index-page.css
```

**Guidelines**:

- ✅ Use BEM naming convention
- ✅ Leverage Bootstrap utilities
- ✅ Use CSS custom properties (variables)
- ✅ Mobile-first responsive design
- ❌ Avoid !important unless necessary
- ❌ Don't inline styles in HTML

### `/docs` - Documentation

**Organization by Purpose**:

| Folder | Purpose | Examples |
|--------|---------|----------|
| `api/` | API integration docs | API_DOCUMENTATION.md |
| `architecture/` | System design | STATE_DRIVEN_UI_PATTERN.md |
| `features/` | Feature requirements | FUNCTIONAL_REQUIREMENTS.md |
| `guides/` | User guides | QUICKSTART.md |
| `specifications/` | Technical specs | MAIN_JS_TECHNICAL_SPECIFICATION.md |
| `standards/` | Coding standards | ES6_MODULE_CONVERSION.md |
| `styling/` | UI/CSS docs | BOOTSTRAP_INTEGRATION.md |
| `testing/` | Test documentation | TEST_VALIDATION_SUMMARY.md |
| `troubleshooting/` | Issue resolution | UNICODE_EMOJI_CORRUPTION_GUIDE.md |
| `workflows/` | Process docs | WORKFLOW_EXECUTION_CONTEXT.md |

**Guidelines**:

- ✅ Use descriptive UPPERCASE filenames with underscores
- ✅ Include README.md in each directory
- ✅ Cross-reference related documents
- ✅ Keep docs close to relevant code
- ❌ Don't duplicate information
- ❌ Avoid orphaned documents

### `/tests` - Test Suites

**Organization**:

```text
tests/
├── e2e/                    # End-to-end tests
│   ├── README.md
│   ├── QUICK_START.md
│   └── apiClient.e2e.test.js
├── apiClient.test.js       # Unit tests (Jest)
├── test_*.py               # UI tests (Python/Selenium)
├── *.test.js               # Jest test files
├── run-*.sh                # Test runners
└── *_README.md             # Test documentation
```

**Testing Strategy**:

- **Unit Tests**: Jest for JavaScript modules
- **Integration Tests**: API client with mock responses
- **E2E Tests**: Python/Selenium for full user flows
- **UI Tests**: Visual regression and component testing

**Guidelines**:

- ✅ Name test files with `.test.js` or `test_*.py`
- ✅ Group tests by feature or module
- ✅ Use descriptive test names
- ✅ Include setup and teardown
- ❌ Don't test implementation details
- ❌ Avoid brittle selectors

---

## File Type Guidelines

### JavaScript Files

**Naming Convention**: `camelCase.js`

```javascript
// ✅ Good
hotelSearch.js
guestCounter.js
apiClient.js

// ❌ Bad
HotelSearch.js
hotel_search.js
hotel-search.js
```

**Module Structure**:

```javascript
// 1. Imports
import { API_ENDPOINTS } from '../config/constants.js';
import { createLogger } from './logger.js';

// 2. Constants (private)
const MAX_RETRIES = 3;
const TIMEOUT_MS = 60000;

// 3. Helper functions (private)
function _validateParams(params) {
  // ...
}

// 4. Main functions (public)
export function searchVacancies(params) {
  // ...
}

// 5. Initialization (if needed)
export function init() {
  // ...
}
```

### CSS Files

**Naming Convention**: `kebab-case.css`

```css
/* ✅ Good */
index-page.css
guest-counter.css
form-controls.css

/* ❌ Bad */
IndexPage.css
guest_counter.css
formControls.css
```

**Organization**:

```css
/* 1. Imports/Variables */
@import 'variables.css';

/* 2. Component Base */
.component-name {
  /* Base styles */
}

/* 3. Component Modifiers */
.component-name--variant {
  /* Variant styles */
}

/* 4. Component States */
.component-name.is-active {
  /* State styles */
}

/* 5. Responsive */
@media (min-width: 768px) {
  .component-name {
    /* Tablet+ styles */
  }
}
```

### Markdown Documentation

**Naming Convention**: `UPPERCASE_WITH_UNDERSCORES.md`

```text
✅ Good
FUNCTIONAL_REQUIREMENTS.md
API_DOCUMENTATION.md
QUICK_START.md

❌ Bad
functional-requirements.md
apiDocumentation.md
quick_start.md
```

**Document Structure**:

```markdown
# Document Title

**Version**: X.Y.Z
**Last Updated**: YYYY-MM-DD
**Status**: Draft/Review/Active

---

## Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)

---

## Section 1

Content...

### Subsection

More content...

---

## References

- [Related Doc](#related-documentation)
- [External Link](https://example.com)
```

---

## Development Workflow

### Adding a New Feature

1. **Plan**:
   - Create feature documentation in `docs/features/FR-XXX.md`
   - Define acceptance criteria
   - Identify dependencies

2. **Implement**:

   ```bash
   # Create feature branch
   git checkout -b feature/FR-XXX-description
   
   # Develop
   # - Add code to src/
   # - Add tests to tests/
   # - Update docs in docs/
   ```

3. **Test**:

   ```bash
   # Run linting
   npm run lint
   
   # Run tests
   npm run test:all
   
   # Check coverage
   npm run test:api:coverage
   ```

4. **Document**:
   - Update `CHANGELOG.md`
   - Update feature documentation
   - Add inline code comments

5. **Review & Merge**:
   - Create pull request
   - Code review
   - Merge to main

### File Placement Decision Tree

```text
Is it a third-party library?
├─ Yes → /public/vendor/
└─ No
   ├─ Is it configuration?
   │  └─ Yes → /src/config/
   └─ No
      ├─ Is it an API or service?
      │  └─ Yes → /src/services/
      └─ No
         ├─ Is it UI logic?
         │  └─ Yes → /src/js/
         └─ No
            ├─ Is it styling?
            │  └─ Yes → /src/styles/
            └─ No
               ├─ Is it a test?
               │  └─ Yes → /tests/
               └─ No
                  └─ Is it documentation?
                     └─ Yes → /docs/[category]/
```

---

## Best Practices

### Code Organization

#### ✅ DO

- **Single Responsibility**: One primary purpose per file
- **Clear Naming**: Descriptive names that explain purpose
- **Consistent Structure**: Follow established patterns
- **Documentation**: Comment complex logic
- **Pure Functions**: Prefer functions without side effects
- **Error Handling**: Handle errors explicitly
- **Type Checking**: Use JSDoc for type hints

```javascript
/**
 * Searches for hotel vacancies in a date range
 * @param {string} checkin - Check-in date (ISO 8601)
 * @param {string} checkout - Check-out date (ISO 8601)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Search results
 * @throws {ValidationError} If dates are invalid
 */
export async function searchVacancies(checkin, checkout, options = {}) {
  // Implementation
}
```

#### ❌ DON'T

- Mix concerns in one file
- Use vague names like `utils.js` or `helpers.js`
- Create circular dependencies
- Inline everything in `index.html`
- Use global variables
- Ignore errors with empty catch blocks

### Import/Export Guidelines

```javascript
// ✅ Good: Named exports
export function searchHotels() { }
export function fetchHotels() { }

// ✅ Good: Import specific functions
import { searchHotels, fetchHotels } from './api.js';

// ❌ Bad: Default exports for multiple items
export default {
  searchHotels,
  fetchHotels
};

// ❌ Bad: Import everything
import * as api from './api.js';
```

### State Management

**Centralized State (FR-008A Pattern)**:

```javascript
// searchLifecycleState.js
const state = {
  current: 'initial', // 'initial' | 'searching' | 'results'
  data: null,
  error: null
};

export function setSearchingState() {
  state.current = 'searching';
  _updateUI();
}

export function setResultsState(data) {
  state.current = 'results';
  state.data = data;
  _updateUI();
}

function _updateUI() {
  // Update DOM based on state
}
```

**Guidelines**:

- ✅ Centralize state transitions
- ✅ UI updates triggered by state changes
- ✅ Immutable state updates
- ❌ Don't scatter state across files
- ❌ Avoid direct DOM manipulation

### Performance

- **Lazy Loading**: Load resources when needed
- **Caching**: Use LocalStorage for hotel data (5-min TTL)
- **Debouncing**: Debounce rapid user inputs
- **Minification**: Minify production assets
- **CDN**: Use CDN for vendor libraries

---

## Testing Structure

### Test Organization

```text
tests/
├── unit/                      # Unit tests
│   ├── apiClient.test.js     # API client tests
│   └── utils.test.js         # Utility tests
│
├── integration/               # Integration tests
│   └── search-flow.test.js   # Full search flow
│
├── e2e/                       # End-to-end tests
│   ├── user-journey.test.js  # Complete user flows
│   └── api-integration.e2e.test.js
│
└── ui/                        # UI tests
    ├── test_web_ui.py        # Selenium UI tests
    └── test_components.py    # Component tests
```

### Test Naming

```javascript
// ✅ Good: Descriptive test names
describe('APIClient', () => {
  describe('searchVacancies', () => {
    it('should return results for valid date range', async () => {
      // Test
    });
    
    it('should throw error for invalid dates', async () => {
      // Test
    });
    
    it('should handle API timeout gracefully', async () => {
      // Test
    });
  });
});

// ❌ Bad: Vague test names
test('test 1', () => { });
test('search works', () => { });
```

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Major user journeys
- **UI Tests**: Key interactions tested

---

## Documentation Structure

### Document Types

| Type | Filename Pattern | Location | Purpose |
|------|-----------------|----------|---------|
| README | `README.md` | Any folder | Folder overview |
| Guide | `*_GUIDE.md` | `docs/guides/` | How-to guides |
| Spec | `*_SPECIFICATION.md` | `docs/specifications/` | Technical specs |
| Requirements | `FR-*.md` | `docs/features/` | Feature requirements |
| Implementation | `*_IMPLEMENTATION*.md` | `docs/features/` | Implementation details |
| Analysis | `*_ANALYSIS.md` | `docs/architecture/` | Design analysis |
| Summary | `*_SUMMARY.md` | Any | Quick summaries |

### Cross-Referencing

```markdown
<!-- Relative links within docs/ -->
See [API Documentation](../docs/api/API_DOCUMENTATION.md)

<!-- Links to source code -->
Implementation: `src/services/apiClient.js`

<!-- External links -->
Based on [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/)
```

---

## Resources

### Internal Documentation

- [HTML/CSS/JS Separation](./HTML_CSS_JS_SEPARATION.md)
- [High Cohesion Guide](./HIGH_COHESION_GUIDE.md)
- [Low Coupling Guide](./LOW_COUPLING_GUIDE.md)
- [Referential Transparency](./REFERENTIAL_TRANSPARENCY.md)
- [Mobile-First Guide](./MOBILE_FIRST_GUIDE.md)

### Project Documentation

- [README.md](../README.md) - Project overview
- [CHANGELOG.md](../CHANGELOG.md) - Version history
- [docs/README.md](../docs/README.md) - Documentation index
- [docs/guides/QUICKSTART.md](../docs/guides/QUICKSTART.md) - Quick start

### External Resources

- [Bootstrap 5.3 Documentation](https://getbootstrap.com/docs/5.3/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Jest Testing](https://jestjs.io/)
- [ESLint](https://eslint.org/)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.1.0 | 2024-12-23 | Complete rewrite for current structure |
| 2.0.0 | 2024-12-17 | Bootstrap 5.3.3 integration |
| 1.0.0 | 2024-11-01 | Initial structure guide |

---

**Last Updated**: 2024-12-23  
**Maintained By**: Monitora Vagas Development Team  
**Status**: Active and Current
