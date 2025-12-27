# Architecture Patterns - Monitora Vagas

**Version:** 2.2.0  
**Last Updated:** 2025-12-26

## Architectural Principles

### 1. ES6 Module Architecture
- **Standard:** All JavaScript uses ES6 modules (`import`/`export`)
- **No IIFEs:** Deprecated pattern - use ES6 modules instead
- **Extension Required:** Always include `.js` in imports
- **No Globals:** No window namespace pollution

```javascript
// ✅ Correct
import { logger } from '../services/logger.js';
export function myFunction() { }

// ❌ Incorrect
(function() { window.myFunction = function() { } })(); // IIFE pattern
```

---

## State Management Patterns

### Pattern Choice: ES6 Classes for Stateful Components

After evaluating multiple patterns, we chose **ES6 Classes** for stateful components because:

1. **`this` keyword is allowed in class context** (ESLint compliant)
2. **Clear encapsulation** of state and methods
3. **Standard JavaScript** - no framework dependency
4. **Easy to test** with dependency injection
5. **Compatible with TypeScript** migration path

---

## Pattern Guidelines

### ✅ **Use ES6 Classes For:**
- Stateful UI components (SearchLifecycleState, GuestFilterStateManager)
- Services with internal state (Logger, HotelCache, ApiClient)
- Singleton services (instantiate once, export instance)

```javascript
/**
 * Stateful component using ES6 Class
 * Use for components that maintain internal state
 */
class GuestFilterStateManager {
    constructor() {
        this.filterCard = null;
        this.isEnabled = false;
    }
    
    init() {
        this.filterCard = document.getElementById('guest-filter-card');
        this.disable();
    }
    
    enable() {
        this.isEnabled = true;
        this.filterCard?.classList.remove('d-none');
    }
    
    disable() {
        this.isEnabled = false;
        this.filterCard?.classList.add('d-none');
    }
}

// Export singleton instance
export const guestFilterState = new GuestFilterStateManager();
```

### ✅ **Use Pure Functions For:**
- Utilities without state (validators, formatters, calculators)
- Data transformations
- Business logic that doesn't depend on external state

```javascript
/**
 * Pure function - no state, no side effects
 * Use for utilities and transformations
 */
export function parseCapacity(text) {
    const regex = /até\s+(\d+)\s+pessoas?/i;
    const match = text.match(regex);
    return match ? parseInt(match[1], 10) : null;
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}
```

### ✅ **Use Factory Functions For:**
- Creating multiple instances with different configurations
- HTML element creation
- Complex object initialization

```javascript
/**
 * Factory function - returns new instances
 * Use for creating configured objects
 */
export function createHotelCard(hotel, availability) {
    const card = document.createElement('div');
    card.className = 'hotel-card';
    card.dataset.hotelId = hotel.id;
    
    card.innerHTML = `
        <h3>${hotel.name}</h3>
        <p>${availability.vacancies} vagas disponíveis</p>
    `;
    
    return card;
}
```

### ❌ **Avoid Object Literals with Methods:**
- Object literals using `this` are banned (ESLint rule: `no-restricted-syntax`)
- Causes pattern confusion - unclear if stateful or functional
- Use ES6 classes instead for stateful objects

```javascript
// ❌ BANNED - Object literal with 'this'
const Manager = {
    prop: null,
    method: function() {
        this.prop = value; // ESLint error!
    }
};

// ✅ Use ES6 Class instead
class Manager {
    constructor() {
        this.prop = null;
    }
    
    method() {
        this.prop = value; // Allowed in classes
    }
}
```

---

## Service Layer Architecture

### Centralized Services

All shared functionality lives in `src/services/`:

| Service | Purpose | Type | State |
|---------|---------|------|-------|
| **logger.js** | Centralized logging | Class | Stateful |
| **apiClient.js** | API communication | Class | Stateful (cache) |
| **hotelCache.js** | LocalStorage wrapper | Class | Stateful |
| **ibira-loader.js** | CDN/fallback loader | Pure functions | Stateless |

### Service Pattern

```javascript
/**
 * Service class with singleton export
 */
class ApiClient {
    constructor() {
        this.baseUrl = 'https://www.mpbarbosa.com/api';
        this.cache = new Map();
    }
    
    async getHotels() {
        // Implementation
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
```

### Service Usage

```javascript
// ✅ Import singleton instance
import { apiClient } from '../services/apiClient.js';
import { logger } from '../services/logger.js';

async function loadHotels() {
    try {
        const hotels = await apiClient.getHotels();
        logger.info('Hotels loaded', 'HotelLoader');
        return hotels;
    } catch (error) {
        logger.error('Failed to load hotels', error, 'HotelLoader');
        throw error;
    }
}
```

---

## Constants & Configuration

### No Magic Numbers Rule

All literal values must be extracted to `src/config/constants.js`:

```javascript
// ❌ Incorrect - Magic numbers
setTimeout(fn, 5000);
if (guests > 50) { }

// ✅ Correct - Use constants
import { TIME, VALIDATION } from '../config/constants.js';

setTimeout(fn, TIME.TIMEOUT.DEFAULT);
if (guests > VALIDATION.GUESTS.MAX) { }
```

### Constants Organization

```javascript
// src/config/constants.js
export const TIME = {
    TIMEOUT: {
        DEFAULT: 5000,
        SEARCH: 30000,
        API: 10000
    },
    CACHE_TTL: 86400000 // 24 hours
};

export const VALIDATION = {
    GUESTS: {
        MIN: 1,
        MAX: 50
    }
};

export const API = {
    STATUS: {
        OK: 200,
        NOT_FOUND: 404,
        ERROR: 500
    }
};
```

---

## Separation of Concerns

### HTML, CSS, JavaScript Isolation

**See:** `.github/HTML_CSS_JS_SEPARATION.md`

**Rule:** No mixing of concerns

```html
<!-- ❌ Incorrect - inline styles and scripts -->
<button style="color: red;" onclick="handleClick()">Click</button>

<!-- ✅ Correct - clean HTML -->
<button class="btn-primary" id="submit-btn">Click</button>
```

```css
/* styles/components/buttons.css */
.btn-primary {
    color: var(--primary-color);
    padding: 0.75rem 1.5rem;
}
```

```javascript
// js/buttonHandlers.js
document.getElementById('submit-btn')
    .addEventListener('click', handleSubmit);
```

---

## Dependency Injection

### DOM Dependency Injection

**Problem:** Direct DOM access makes code untestable

```javascript
// ❌ Incorrect - tight coupling
function updateCounter() {
    const counter = document.getElementById('counter');
    counter.textContent = value;
}
```

**Solution:** Pass DOM references as parameters

```javascript
// ✅ Correct - dependency injection
function updateCounter(counterElement, value) {
    counterElement.textContent = value;
}

// Initialize with real DOM
const counter = document.getElementById('counter');
updateCounter(counter, 42);

// Test with mock
const mockCounter = { textContent: null };
updateCounter(mockCounter, 42);
assert(mockCounter.textContent === 42);
```

---

## Error Handling

### Global Error Boundaries

**Location:** `src/js/global.js`

```javascript
// Unhandled promise rejections
window.addEventListener('unhandledrejection', handleUnhandledRejection);

// Runtime errors
window.addEventListener('error', handleUncaughtError);
```

### Error Handling Wrappers

```javascript
import { withErrorHandling, safeAsync } from './global.js';

// ✅ Async operation with logging
const hotels = await withErrorHandling(
    async () => await apiClient.getHotels(),
    'HotelLoading'
);

// ✅ UI event handler with user notification
button.addEventListener('click', () => safeAsync(
    async () => await apiClient.search(),
    'SearchButton',
    'Search failed. Please try again.'
));
```

---

## Testing Strategy

### Unit Tests (Jest)

**Location:** `tests/unit/`

```javascript
import { parseCapacity } from '../../src/js/guestNumberFilter.js';

describe('parseCapacity', () => {
    it('should parse capacity from text', () => {
        expect(parseCapacity('até 20 pessoas')).toBe(20);
    });
});
```

### E2E Tests (Selenium)

**Location:** `tests/e2e/`

```python
from selenium import webdriver

def test_hotel_search():
    driver = webdriver.Chrome()
    driver.get('http://localhost:8080')
    # Test implementation
```

---

## Code Quality Gates

### ESLint Rules

**Key Rules:**
- `no-console`: Use logger instead
- `no-restricted-syntax`: Ban object literals with `this`
- `no-unused-vars`: Clean up unused imports
- `no-magic-numbers`: Extract to constants

### Pre-commit Hook

**Location:** `.git/hooks/pre-commit`

Automatically runs:
1. ESLint on staged `.js` files
2. Blocks commit if errors found
3. Requires `--max-warnings 0`

---

## Migration Guidelines

### Refactoring Object Literals to Classes

**Before:**
```javascript
const Manager = {
    state: null,
    init: function() { this.state = {}; },
    update: function(val) { this.state.value = val; }
};
export default Manager;
```

**After:**
```javascript
class Manager {
    constructor() {
        this.state = null;
    }
    
    init() {
        this.state = {};
    }
    
    update(val) {
        this.state.value = val;
    }
}

export const manager = new Manager();
```

---

## Design Patterns in Use

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Singleton** | Services (logger, apiClient) | Single instance |
| **Factory** | HTML generators (createHotelCard) | Object creation |
| **State Machine** | SearchLifecycleState | UI state management |
| **Observer** | Event listeners | DOM event handling |
| **Dependency Injection** | Function parameters | Testability |

---

## File Organization

```
src/
├── config/             # Configuration and constants
│   ├── constants.js    # All magic numbers
│   └── environment.js  # Environment detection
├── services/           # Singleton services
│   ├── apiClient.js    # API communication
│   ├── hotelCache.js   # Caching layer
│   ├── logger.js       # Logging service
│   └── ibira-loader.js # Library loader
├── js/                 # UI components and logic
│   ├── global.js       # Global initialization
│   ├── hotelSearch.js  # Search workflow
│   └── *.js            # Feature modules
├── styles/             # CSS modules
│   ├── components/     # Component styles
│   ├── global/         # Global styles
│   └── pages/          # Page-specific styles
└── utils/              # Pure utility functions
```

---

## Future Considerations

### Potential Improvements

1. **TypeScript Migration:** ES6 classes provide smooth migration path
2. **Web Components:** Consider for highly reusable UI components
3. **State Management Library:** Evaluate Redux/MobX if state becomes complex
4. **Build Optimization:** Tree-shaking with Rollup/Webpack

### Anti-Patterns to Avoid

❌ **God Module:** Keep files under 300 LOC  
❌ **Tight Coupling:** Use dependency injection  
❌ **Magic Strings:** Extract to constants  
❌ **Inline Styles:** Use CSS classes  
❌ **Direct DOM Access:** Pass references as parameters

---

## References

- **HTML/CSS/JS Separation:** `.github/HTML_CSS_JS_SEPARATION.md`
- **Functional Programming:** `.github/REFERENTIAL_TRANSPARENCY.md`
- **Mobile-First CSS:** `.github/MOBILE_FIRST_GUIDE.md`
- **High Cohesion:** `.github/HIGH_COHESION_GUIDE.md`
- **Low Coupling:** `.github/LOW_COUPLING_GUIDE.md`

---

## Questions?

For questions about architectural decisions, open a GitHub Issue with the label `architecture`.
