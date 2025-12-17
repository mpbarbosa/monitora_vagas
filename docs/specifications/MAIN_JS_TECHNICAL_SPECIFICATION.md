# Technical Specification: Application Architecture

**Document Version:** 2.0  
**Date:** 2025-12-16  
**Author:** Monitora Vagas Development Team  
**Module:** `public/index.html` (Inline JavaScript Implementation)  
**Type:** Single Page Application - Inline JavaScript Architecture

---

## 1. Overview

### 1.1 Purpose

This document provides a comprehensive technical specification for the Hotel Vacancy Search application's actual implementation. The application uses an **inline JavaScript architecture** embedded within `public/index.html`, rather than the modular component-based architecture in the `src/` folder.

**Note:** The `src/` folder contains a modular architecture that is currently **not in use** and is considered orphaned code. The working application is entirely contained within `public/index.html` with supporting files in `public/js/` and `public/services/`.

### 1.2 Scope

The application encompasses:

- Hotel list loading with caching mechanism
- Manual refresh capability for hotel list
- Date selection and validation
- Guest counter with filtering
- Vacancy search workflow
- Results display with hotel cards
- Guest number filtering (client-side)
- Copy and clear results functionality
- Holiday package detection and display
- Error handling and user feedback

### 1.3 Dependencies

**External Dependencies (Vendor Libraries):**

- jQuery 3.x (`vendor/jquery/jquery.min.js`)
- Select2 (`vendor/select2/select2.min.js`)
- jQuery Validate (`vendor/jquery-validate/jquery.validate.min.js`)
- Bootstrap Wizard (`vendor/bootstrap-wizard/`)
- Moment.js (`vendor/datepicker/moment.min.js`)
- Daterangepicker (`vendor/datepicker/daterangepicker.js`)

**Internal Dependencies (Working Code):**

- `public/js/global.js` - Global utilities
- `public/js/guestNumberFilter.js` - Guest filtering logic
- `public/js/guestCounter.js` - Guest counter component
- `public/services/apiClient.js` - API communication module (ES6 module)

**Orphaned Dependencies (Not Used):**

- `src/main.js` - Unused entry point
- `src/config/*` - Unused configuration
- `src/components/*` - Unused component architecture
- `src/pages/*` - Unused page components

---

## 2. Architecture

### 2.1 Design Pattern

**Pattern:** Inline JavaScript with Direct DOM Manipulation

**Implementation Style:** Monolithic inline script with modular supporting files

**Characteristics:**

- Single HTML file with embedded JavaScript
- Direct DOM manipulation via vanilla JavaScript
- Event listeners attached directly to form elements
- ES6 module import for API client only
- Supporting JavaScript files loaded via script tags

### 2.2 Application Structure

```text
public/index.html
├── HTML Structure
│   ├── Hotel Selection (select dropdown)
│   ├── Refresh Button (🔄)
│   ├── Check-In/Check-Out (date inputs)
│   ├── Guest Counter (plus/minus controls)
│   ├── Search Button (submit)
│   └── Results Container (dynamic cards)
├── Vendor Scripts (loaded via <script> tags)
│   ├── jQuery
│   ├── Select2
│   ├── Datepicker libraries
│   └── Bootstrap Wizard
├── Custom Scripts (loaded via <script> tags)
│   ├── js/global.js
│   ├── js/guestNumberFilter.js
│   └── js/guestCounter.js
└── Inline JavaScript (ES6 module)
    ├── API Client Import
    ├── Hotel Loading
    ├── Form Submission Handler
    ├── Results Display
    └── Button Event Handlers
```

### 2.3 Data Flow

```text
User Action → Direct Event Handler → API Call → Response Processing → DOM Update
```

**Example Flow:**

1. User submits search form
2. Form 'submit' event listener triggered
3. Input values extracted from DOM
4. API called directly with fetch()
5. Response received and validated
6. Results rendered by creating DOM elements
7. Results container displayed
8. Guest filter enabled (FR-004A)

---

## 3. Function Specifications

### 3.1 Hotel Loading Functions

#### 3.1.1 updateCacheStatus()

```javascript
function updateCacheStatus()
```

**Purpose:** Display hotel cache status information to the user.

**Algorithm:**

1. Get cache statistics from API client
2. Query `#cache-status` element
3. If cache exists and not expired:
   - Display cached hotel count
   - Show cache age and expiry time
   - Set color to green (#4CAF50)
4. If cache expired:
   - Display "Cache expired" message
   - Set color to orange (#FF9800)
5. If no cache:
   - Clear status text

**Display Format:**
- Active: `📦 Cached {count} hotels ({age} min ago, expires in {remaining} min)`
- Expired: `⏰ Cache expired, fetching fresh data...`
- Error: `❌ Error: {message}`

**Related FR:** FR-001 (Hotel Selection)

---

#### 3.1.2 loadHotels(forceRefresh)

```javascript
async function loadHotels(forceRefresh = false)
```

**Purpose:** Load hotel list from API with caching support.

**Parameters:**
- `forceRefresh` (boolean): If true, bypass cache and fetch fresh data

**Algorithm:**

1. Get references to select element and refresh button
2. Disable refresh button during load
3. Change refresh button text to ⏳
4. Set select dropdown to "Loading..."
5. Call `apiClient.getHotels(forceRefresh)`
6. On success:
   - Clear select dropdown
   - Add "Select a hotel" option
   - Add hotel options to dropdown
   - Update cache status display
7. On error:
   - Display error message in dropdown
   - Show error in cache status
   - Set color to red (#f44336)
8. Finally:
   - Re-enable refresh button
   - Restore refresh button text to 🔄

**Side Effects:**
- Modifies select dropdown innerHTML
- Updates cache status display
- Temporarily disables refresh button

**API Integration:**
- Uses `apiClient.getHotels()` from ES6 module
- Respects cache unless `forceRefresh = true`

**Related FR:** FR-001 (Hotel Selection)

**Related AC:**
- AC-001.1: On page load, displays "Loading hotels..." message
- AC-001.5: If API call fails, display "Error loading hotels" message

---

### 3.2 Form Submission Handler

#### 3.2.1 Form Submit Event Listener

```javascript
form.addEventListener('submit', async (event) => { ... })
```

**Purpose:** Handle vacancy search workflow when form is submitted.

**Algorithm:**

1. Prevent default form submission (`event.preventDefault()`)
2. Log search start
3. Extract input values from DOM:
   - Hotel ID from `#hotel-select` (default: '-1' for all)
   - Check-in date from `#input-checkin`
   - Check-out date from `#input-checkout`
4. Validate dates (both required)
5. If validation fails:
   - Show alert message
   - Return early
6. Update button state:
   - Change text to "🔍 Buscando..."
   - Disable button
7. Hide previous results
8. Clear results container
9. Make API call:
   - Build URL with query parameters
   - Use GET method
   - Set headers (Accept, Content-Type)
10. Process response:
    - Parse JSON
    - Check HTTP status
    - Handle booking rule errors (400 status)
    - Validate response structure
11. Display results via `displayResults()`
12. On error:
    - Create error HTML
    - Display in results container
    - Show alert (except for booking rule errors)
13. Finally:
    - Restore button state
    - Enable guest filter (FR-004A)

**State Management:**
- Button text: "busca vagas" → "🔍 Buscando..." → "busca vagas"
- Button disabled: false → true → false
- Results container: hidden → visible

**Related FR:**
- FR-005 (Vacancy Search Execution)
- FR-004A (Guest Filter State Management - enables filter after search)

**Related AC:**
- AC-005.4: Date inputs are validated before API call
- AC-005.5: Alert displays if dates missing
- AC-005.6: Button text changes to "🔍 Buscando..." during search
- AC-005.7: Button is disabled during search execution
- AC-005.8: Previous results are hidden when new search starts

---

### 3.3 Results Display Functions

#### 3.3.1 displayResults(apiResponse, checkin, checkout, hotel)

```javascript
function displayResults(apiResponse, checkin, checkout, hotel)
```

**Purpose:** Render search results as hotel cards with vacancies.

**Parameters:**
- `apiResponse` (Object): API response containing results and metadata
- `checkin` (string): Check-in date (ISO format)
- `checkout` (string): Check-out date (ISO format)
- `hotel` (string): Hotel ID or '-1' for all hotels

**Response Structure:**
```javascript
{
    success: boolean,
    data: {
        hasAvailability: boolean,
        result: {
            vacancies: Array,
            hotelGroups: {
                [hotelName]: [vacancyStrings]
            }
        }
    },
    holidayPackage: {
        type: string,      // 'CHRISTMAS' | 'NEW_YEAR'
        name: string,
        duration: string
    }
}
```

**Algorithm:**

1. Clear previous results from container
2. If holiday package exists:
   - Create gradient banner with icon
   - Display package name and duration
   - Append to results container
3. If vacancies exist (`hasAvailability` is true):
   - Iterate through `hotelGroups` object
   - For each hotel:
     - Create hotel card with header
     - Display hotel name and vacancy count
     - Create vacancies list
     - For each vacancy:
       - Create vacancy item with styling
       - Add data attribute for filtering
       - Number each vacancy
     - Add FlexReserva link button
     - Append hotel card to container
4. If no vacancies:
   - Create empty state card
   - Display sad emoji 😔
   - Show "Sem vagas disponíveis" message
5. Show results container
6. Smooth scroll to results
7. Log success message

**Styling:**
- Holiday banner: Gradient purple background
- Hotel cards: White with border and shadow
- Vacancy items: Light gray background with green left border
- Empty state: White with gray border

**Related FR:**
- FR-006 (Results Display)
- FR-004B (Guest Number Filtering - cards have filter classes)

**Related AC:**
- AC-006.2: Results container becomes visible after successful search
- AC-006.3: Results display title (shown in cards)
- AC-006.4: Hotel cards displayed in vertical layout
- AC-006.5: Each hotel card shows hotel-specific vacancy information

---

### 3.4 FR-008A Implementation: Search Lifecycle UI State Management

**Status:** ⚠️ **PARTIALLY IMPLEMENTED**

**Current Implementation:**

The current inline JavaScript implementation includes **some** FR-008A requirements but is **incomplete**. The following sections document what is implemented and what is missing.

#### 3.4.1 Implemented State Management

**During Search Execution (Implemented):**

```javascript
// In form submit handler - IMPLEMENTED
submitButton.textContent = '🔍 Buscando...';  // AC-008A.10 ✅
submitButton.disabled = true;                   // AC-008A.9 ✅
resultsContainer.style.display = 'none';        // Hide previous results ✅
```

**After Search Completion (Partially Implemented):**

```javascript
// In finally block - IMPLEMENTED
submitButton.textContent = originalText;        // Restore button text ✅
submitButton.disabled = false;                  // Re-enable button ❌ (Should stay disabled)

// Guest filter enablement - IMPLEMENTED
if (window.GuestFilterStateManager) {
    window.GuestFilterStateManager.enable();    // AC-008A.16 ✅
    console.log('✅ Guest filter enabled after search completion (FR-004A)');
}
```

#### 3.4.2 Missing State Management (Required by FR-008A)

**NOT IMPLEMENTED:**

- ❌ **AC-008A.5-8:** Hotel selector and date inputs are NOT disabled during search
- ❌ **AC-008A.13-15:** Hotel selector and date inputs are NOT kept disabled after search
- ❌ **AC-008A.17:** Search button is re-enabled after search (should stay disabled)
- ❌ **AC-008A.18:** "Start New Search" button does not exist
- ❌ **AC-008A.26-37:** "Start New Search" functionality not implemented
- ❌ **AC-008A.12:** No visual indication (opacity/cursor) for disabled elements
- ❌ State transition functions not implemented

**Current Behavior:**
- All inputs remain enabled throughout entire workflow
- User can modify search parameters during search
- User can click search button multiple times (concurrent searches)
- No "Start New Search" button - user clicks same "busca vagas" button
- Results can be cleared but inputs are not locked

**Expected Behavior (FR-008A):**
```javascript
// State transitions needed:
// Initial State → Searching State → Results State → Initial State (via Start New Search)
```

#### 3.4.3 Required Implementation for FR-008A Compliance

**1. Add State Management Functions:**

```javascript
function setSearchingState() {
    // Disable all inputs
    document.getElementById('hotel-select').disabled = true;
    document.getElementById('input-checkin').disabled = true;
    document.getElementById('input-checkout').disabled = true;
    document.getElementById('search-button').disabled = true;
    document.getElementById('search-button').textContent = '🔍 Buscando...';
    
    // Disable guest counter
    if (window.GuestCounter) {
        window.GuestCounter.disable();
    }
    
    // Apply visual styling
    applyDisabledStyling();
}

function setResultsState() {
    // Keep disabled: hotel, dates, search button
    document.getElementById('hotel-select').disabled = true;
    document.getElementById('input-checkin').disabled = true;
    document.getElementById('input-checkout').disabled = true;
    document.getElementById('search-button').disabled = true;
    
    // Enable guest controls
    if (window.GuestFilterStateManager) {
        window.GuestFilterStateManager.enable();
    }
    
    // Show "Start New Search" button
    document.getElementById('start-new-search-btn').style.display = 'block';
}

function setInitialState() {
    // Enable all inputs
    document.getElementById('hotel-select').disabled = false;
    document.getElementById('input-checkin').disabled = false;
    document.getElementById('input-checkout').disabled = false;
    document.getElementById('search-button').disabled = false;
    document.getElementById('search-button').textContent = 'busca vagas';
    
    // Disable guest counter
    if (window.GuestCounter) {
        window.GuestCounter.disable();
    }
    
    // Hide "Start New Search" button
    document.getElementById('start-new-search-btn').style.display = 'none';
    
    // Clear results
    document.getElementById('results-container').style.display = 'none';
    
    // Remove visual styling
    removeDisabledStyling();
}
```

**2. Add "Start New Search" Button to HTML:**

```html
<button id="start-new-search-btn"
        style="padding: 10px 20px;
               background: #2196F3;
               color: white;
               border: none;
               border-radius: 5px;
               cursor: pointer;
               font-size: 14px;
               display: none;">
    🔄 Nova Busca
</button>
```

**3. Update Form Submit Handler:**

```javascript
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // ... validation ...
    
    setSearchingState();  // NEW: Apply searching state
    
    try {
        // ... API call ...
        displayResults(result, checkin, checkout, hotel);
        setResultsState();  // NEW: Apply results state
    } catch (error) {
        // ... error handling ...
        setResultsState();  // NEW: Show Start New Search even on error
    }
});
```

**4. Add "Start New Search" Handler:**

```javascript
document.getElementById('start-new-search-btn')?.addEventListener('click', () => {
    setInitialState();
    
    // Reset guest counter to default
    if (window.GuestCounter) {
        window.GuestCounter.reset();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

#### 3.4.4 Implementation Priority

**High Priority (Prevents Issues):**
1. Disable inputs during search (prevent concurrent searches)
2. Add "Start New Search" button
3. Lock date/hotel inputs after search (maintain result consistency)

**Medium Priority (UX Enhancement):**
4. Visual styling for disabled states
5. Focus management
6. ARIA attributes

**Low Priority (Nice to Have):**
7. Smooth transitions
8. Loading animations

**Related FR:** FR-008A (Search Lifecycle UI State Management)

**Implementation Status:** 🔴 **INCOMPLETE - Requires Development Work**

---

### 3.5 Results Button Handlers

#### 3.5.1 setupResultsButtons()

```javascript
function setupResultsButtons()
```

**Purpose:** Initialize event handlers for Copy and Clear Results buttons.

**Algorithm:**

1. Query for button elements:
   - `#copy-results-btn`
   - `#clear-results-btn`
2. Attach copy button handler:
   - Get text content from results container
   - Use Clipboard API (navigator.clipboard.writeText)
   - Fallback to document.execCommand('copy')
   - Show success feedback (✅ Copiado!)
   - Reset button text after 2 seconds
3. Attach clear button handler:
   - Clear hotels cards container innerHTML
   - Hide results container

**Clipboard Handling:**
- Primary: `navigator.clipboard.writeText()` (modern browsers)
- Fallback: Create temporary textarea, select, execCommand('copy'), remove

**User Feedback:**
- Button text changes: "📋 Copiar Resultados" → "✅ Copiado!" → "📋 Copiar Resultados"
- Timeout: 2000ms

**Initialization:**
- Called after DOMContentLoaded or immediately if DOM ready

**Related FR:**
- FR-007 (Copy Results to Clipboard)
- FR-008 (Clear Results)

**Related AC:**
- AC-007.6: Clicking button copies formatted results to clipboard
- AC-008.6: Clicking button hides results container
- AC-008.7: Clicking button clears hotel cards container





---

## 4. Error Handling

### 4.1 Error Display in Results Container

**Method:** Inline error HTML rendering

**Implementation:**

```javascript
catch (error) {
    console.error('❌ Search failed:', error);
    
    if (error.isBookingRuleError) {
        // Special handling for booking rule violations
        hotelsCardsContainer.innerHTML = createBookingRuleErrorHTML(error);
    } else {
        // Generic error display
        hotelsCardsContainer.innerHTML = `
            <div style="background: white; border: 2px solid #f44336; ...">
                <div style="font-size: 48px;">❌</div>
                <h4 style="color: #f44336;">Erro na Busca</h4>
                <p>${error.message}</p>
                <p style="color: #999;">Por favor, tente novamente.</p>
            </div>
        `;
    }
    resultsContainer.style.display = 'block';
    
    // Alert shown only for non-booking-rule errors
    if (!error.isBookingRuleError) {
        alert(`Erro na busca: ${error.message}`);
    }
}
```

**Error Types:**

1. **Network Errors:** Connection failures, timeouts
2. **HTTP Errors:** 400, 404, 500 status codes
3. **Booking Rule Errors:** Date validation, package requirements (400 status with code)
4. **API Response Errors:** `success: false` in response

**Error Styling:**
- Red border (#f44336)
- Large error emoji (❌)
- White background
- Centered text
- Error message in gray

**Related FR:** Section 7 (Error Handling)

---

### 4.2 Booking Rule Errors

**Special Handling:** Booking rule violations display structured error information instead of generic error.

**Error Structure:**
```javascript
{
    isBookingRuleError: true,
    code: string,           // Error code from API
    message: string,        // User-friendly message
    details: Object         // Additional error context
}
```

**Display:** Uses `createBookingRuleErrorHTML()` function to format error with appropriate styling and messaging.

---

## 5. State Management (Current Implementation)

### 5.1 Application State

**Note:** The inline implementation does NOT use a centralized state object like the `src/` architecture.

**State is managed through:**
- DOM element states (disabled, value, textContent)
- Button text content
- Container visibility (display: none/block)
- Window global objects (GuestFilterStateManager, GuestCounter)

**No explicit state object exists.**

### 5.2 State Tracking

**Implicit State Indicators:**
- Search button text: "busca vagas" (idle) vs "🔍 Buscando..." (active)
- Results container display: 'none' (no results) vs 'block' (has results)
- Guest filter: disabled (before search) vs enabled (after search)

### 5.3 State Persistence

**No persistence:** Application state resets on page reload.

**Future Enhancement:** Could implement localStorage for:
- Last search parameters
- Hotel selection
- Date range preferences

---

## 6. API Integration

### 6.1 Hotel List API

**Endpoint:** Via `apiClient.getHotels(forceRefresh)`

**Caching:** API client handles caching internally

**Cache Duration:** Configurable in apiClient module

**Cache Status Display:** Real-time cache stats shown to user

### 6.2 Vacancy Search API

**Endpoint:** `https://www.mpbarbosa.com/api/vagas/search`

**Method:** GET

**Parameters:**
- `hotel`: Hotel ID or '-1' for all hotels
- `checkin`: Date in ISO format (yyyy-MM-dd)
- `checkout`: Date in ISO format (yyyy-MM-dd)

**Headers:**
```javascript
{
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}
```

**Response Handling:**
1. Parse JSON response
2. Check `response.ok` status
3. Handle 400 errors specially (booking rules)
4. Validate `result.success` flag
5. Extract `result.data` for display

---

## 7. DOM Element References

### 7.1 Form Input Elements

| Element ID | Purpose | Type |
|------------|---------|------|
| `hotel-select` | Hotel selection dropdown | select |
| `input-checkin` | Check-in date input | input[type="date"] |
| `input-checkout` | Check-out date input | input[type="date"] |
| `guest-filter-card` | Guest counter container | div |
| `search-button` | Submit search button | button[type="submit"] |
| `refresh-hotels-btn` | Manual hotel list refresh | button |

### 7.2 Display Elements

| Element ID | Purpose | Initial State |
|------------|---------|--------------|
| `cache-status` | Hotel cache status text | empty/hidden |
| `results-container` | Results wrapper | display: none |
| `hotels-cards-container` | Hotel cards container | empty |
| `results-counter` | Filtered results count | display: none |
| `holiday-package-notice` | Holiday package banner | display: none |
| `checkin-help` | Check-in help text | empty |
| `checkout-help` | Checkout help text | empty |

### 7.3 Button Elements

| Element ID | Purpose | Initial State |
|------------|---------|--------------|
| `copy-results-btn` | Copy results to clipboard | visible when results exist |
| `clear-results-btn` | Clear displayed results | visible when results exist |
| `start-new-search-btn` | Reset for new search | **NOT IMPLEMENTED** |

---

## 8. Performance Considerations

### 8.1 Hotel List Caching

**Benefit:** Reduces API calls for frequently accessed hotel list

**Implementation:** Handled by `apiClient` module

**User Control:** Manual refresh button allows force refresh

**Cache Display:** Real-time stats visible to user

### 8.2 Results Rendering

**Method:** Direct innerHTML assignment

**Performance:** Fast for typical result sets (1-20 hotels)

**Consideration:** May slow with very large result sets (50+ hotels)

**Optimization:** Results filtered client-side, not re-fetched

### 8.3 Guest Filtering

**Method:** Client-side JavaScript filtering

**Benefit:** No API calls for filter changes

**Performance:** Fast DOM manipulation with CSS display toggles

**Implementation:** See `guestNumberFilter.js`

---

---

## 9. Browser Compatibility

### 9.1 Required Features

- ES6 Modules (`import`/`export`) - for apiClient only
- Fetch API
- Async/await syntax
- Template literals
- Arrow functions
- HTML5 date input
- Clipboard API (with fallback)

### 9.2 Supported Browsers

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 61+ | Full support |
| Firefox | 60+ | Full support |
| Safari | 11+ | Full support |
| Edge | 79+ (Chromium) | Full support |

### 9.3 Fallbacks

**Clipboard API:**
- Primary: `navigator.clipboard.writeText()`
- Fallback: `document.execCommand('copy')`

**Date Input:**
- Native HTML5 date picker used
- Daterangepicker library loaded but may not be actively used

---

## 10. Functional Requirements Coverage

### 10.1 Implemented Requirements

✅ **FR-001:** Hotel Selection - COMPLETE
- Hotel list loaded from API
- Caching implemented
- Manual refresh available

✅ **FR-002/FR-003:** Date Selection - COMPLETE
- HTML5 date inputs
- Validation on submit
- ISO format handling

✅ **FR-004:** Guest Counter - COMPLETE
- Implemented in `guestCounter.js`

✅ **FR-004A:** Guest Filter State Management - COMPLETE
- Enabled after search completion
- Managed by `GuestFilterStateManager`

✅ **FR-004B:** Client-Side Guest Filtering - COMPLETE
- Implemented in `guestNumberFilter.js`
- Real-time filtering

✅ **FR-005:** Vacancy Search Execution - COMPLETE
- Form validation
- API integration
- Button state management

✅ **FR-006:** Results Display - COMPLETE
- Hotel cards layout
- Vacancy lists
- FlexReserva links

✅ **FR-007:** Copy Results - COMPLETE
- Clipboard integration
- Fallback support

✅ **FR-008:** Clear Results - COMPLETE
- Clear functionality
- Hide container

### 10.2 Incomplete Requirements

🔴 **FR-008A:** Search Lifecycle UI State Management - **INCOMPLETE**

**Missing Components:**
- Disable inputs during search
- Lock hotel/date inputs after search
- "Start New Search" button
- Complete state transitions
- Visual styling for disabled states
- ARIA attributes

**Implementation Required:** See Section 3.4 for detailed requirements

---

## 11. Code Architecture Issues

### 11.1 Orphaned Code

**Location:** `src/` folder

**Status:** Not used by application

**Contents:**
- `src/main.js` - Unused entry point
- `src/config/` - Configuration modules
- `src/components/` - React-style components
- `src/pages/` - Page components
- `src/utils/` - Utility functions

**Issue:** Duplication and confusion between working code (`public/`) and unused code (`src/`)

**Recommendation:**
1. **Option A (Clean):** Delete `src/` folder entirely
2. **Option B (Migrate):** Refactor application to use `src/` architecture
3. **Option C (Document):** Clearly mark `src/` as experimental/future

### 11.2 Current Working Files

**Active Code:**
- `public/index.html` - Main application (inline JavaScript)
- `public/js/global.js` - Global utilities
- `public/js/guestCounter.js` - Guest counter logic
- `public/js/guestNumberFilter.js` - Guest filtering
- `public/services/apiClient.js` - API communication (ES6 module)
- `public/css/main.css` - Styling
- `public/vendor/` - Third-party libraries

### 11.3 Architecture Recommendation

**Current State:** Inline JavaScript (working but not scalable)

**Recommended Approach:**

**Option 1: Keep Inline (Short-term)**
- Continue with inline implementation
- Delete `src/` folder to reduce confusion
- Add missing FR-008A functionality
- Document inline architecture

**Option 2: Migrate to Modular (Long-term)**
- Complete `src/` architecture implementation
- Build system (Webpack/Vite)
- Component-based structure
- Better maintainability
- Testing infrastructure











---

## 12. Security Considerations

### 12.1 XSS Prevention

**Current Risk:** Low - API data is trusted

**Template Literals:** Used for HTML generation

**Mitigation:**
- API data comes from trusted backend
- No user input directly rendered
- Consider CSP headers for production

### 12.2 HTTPS

**Production:** Uses HTTPS (`https://www.mpbarbosa.com/api/`)

**Development:** May use HTTP for local testing

---

## 13. Testing

### 13.1 Current Test Coverage

**Test Location:** `tests/` folder

**Test Framework:** Pytest with Selenium

**E2E Tests:** See test files in `tests/` directory

**Coverage:** Documented in FUNCTIONAL_REQUIREMENTS.md Section 8

### 13.2 Missing Tests for FR-008A

**Required Tests:**
- UI state transitions (initial → searching → results)
- Input disable/enable functionality
- Button visibility changes
- "Start New Search" workflow
- Visual styling verification
- ARIA attribute validation
- Focus management

---

## 14. Maintenance Recommendations

### 14.1 Immediate Actions (High Priority)

1. **Implement FR-008A:** Complete search lifecycle state management
2. **Clean up `src/` folder:** Delete or clearly mark as unused
3. **Add "Start New Search" button:** Implement missing UI element
4. **Document inline architecture:** Update all docs to reflect reality

### 14.2 Short-term Improvements (Medium Priority)

5. **Add TypeScript:** Type safety for inline scripts
6. **Extract inline scripts:** Move to separate .js files
7. **Improve error handling:** Better user feedback
8. **Add loading states:** Visual progress indicators

### 14.3 Long-term Considerations (Low Priority)

9. **Migrate to modular architecture:** Use `src/` structure properly
10. **Build system:** Webpack/Vite for bundling
11. **Component framework:** React/Vue for better structure
12. **State management:** Redux/Vuex for complex state



---

## 15. Revision History

| Version | Date       | Author              | Changes                                           |
|---------|------------|---------------------|---------------------------------------------------|
| 1.0     | 2025-12-16 | Monitora Vagas Team | Initial technical specification for main.js (src/)       |
| 2.0     | 2025-12-16 | Monitora Vagas Team | **MAJOR REWRITE**: Updated to reflect actual inline JavaScript implementation in public/index.html. Added FR-008A implementation documentation. Identified src/ folder as orphaned code. |

---

## 16. References

### 16.1 Related Documents

- [FUNCTIONAL_REQUIREMENTS.md](../features/FUNCTIONAL_REQUIREMENTS.md) - Functional requirements (see FR-008A)
- [HTML_SPECIFICATION.md](./HTML_SPECIFICATION.md) - HTML structure specification
- [SPECIFICATION_FORMATS_README.md](./SPECIFICATION_FORMATS_README.md) - Documentation standards

### 16.2 Code Dependencies (Active)

**Working Implementation:**
- `public/index.html` - **Main application file** (inline JavaScript)
- `public/services/apiClient.js` - API communication module (ES6 module)
- `public/js/global.js` - Global utilities
- `public/js/guestCounter.js` - Guest counter logic
- `public/js/guestNumberFilter.js` - Guest filtering implementation
- `public/css/main.css` - Application styles
- `public/vendor/` - Third-party libraries

**Orphaned Code (Not Used):**
- `src/main.js` - ❌ Unused entry point
- `src/config/` - ❌ Unused configuration modules
- `src/components/` - ❌ Unused component architecture
- `src/pages/` - ❌ Unused page components
- `src/utils/` - ❌ Unused utility functions

---

## 17. Implementation Action Items

### 17.1 Critical (Must Fix)

1. ✅ **Document actual architecture** - COMPLETE (this document)
2. 🔴 **Implement FR-008A** - State management incomplete
3. 🔴 **Add "Start New Search" button** - Missing UI element
4. 🔴 **Disable inputs during/after search** - Not implemented

### 17.2 Important (Should Fix)

5. 🟡 **Clean up src/ folder** - Remove or mark as experimental
6. 🟡 **Extract inline JavaScript** - Move to separate files
7. 🟡 **Add visual styling for disabled states** - UX improvement
8. 🟡 **Implement ARIA attributes** - Accessibility compliance

### 17.3 Nice to Have

9. ⚪ **Add TypeScript** - Type safety
10. ⚪ **Build system** - Webpack/Vite
11. ⚪ **Component framework** - React/Vue migration
12. ⚪ **State management library** - Redux/Vuex

---

**Document Status:** ✅ Updated to Reflect Reality  
**Implementation Status:** 🔴 FR-008A Incomplete  
**Architecture Status:** ⚠️ Inline JavaScript (Working) + Orphaned src/ Folder  
**Next Review Date:** 2026-01-16
