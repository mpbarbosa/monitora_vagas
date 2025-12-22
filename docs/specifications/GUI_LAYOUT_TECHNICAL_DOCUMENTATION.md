# GUI Layout Technical Documentation - index.html

## Document Information

- **Version**: 2.0.1
- **Last Updated**: 2024-12-18
- **Document Type**: Technical Layout Specification
- **Related Files**: 
  - `public/index.html`
  - `src/styles/main.css`
  - `src/styles/index-page.css`

---

## 1. Overview

This document provides comprehensive technical documentation for the GUI layout architecture of the Monitora Vagas AFPESP application. The layout implements a modern, responsive design using Bootstrap 5.3.3 with a fixed header pattern and state-driven UI elements.

### 1.1 Design Principles

- **Responsive First**: Mobile-friendly design that adapts to all screen sizes
- **Fixed Header Navigation**: Always-accessible search controls
- **State-Driven UI**: Visual elements respond to application state (initial, searching, result)
- **Semantic HTML**: Proper use of HTML5 semantic elements
- **Accessibility**: ARIA attributes and keyboard navigation support

---

## 2. Document Structure

### 2.1 HTML Document Head

```html
Lines 4-32
```

**Key Components:**

- **Meta Tags** (Lines 5-10): SEO, viewport configuration, description
- **Title** (Line 13): "Busca de Vagas em Hotéis Sindicais - AFPESP"
- **Bootstrap 5.3.3** (Line 16): Primary CSS framework
- **Custom Fonts** (Lines 18-22): Material Design Icons, Font Awesome, Roboto
- **Vendor CSS** (Lines 24-26): Select2, DateRangePicker
- **Custom CSS** (Lines 28-30): Application-specific styles

### 2.2 Semantic Versioning

The application displays version **v2.0.0** in two locations:

- **Navbar** (Line 59): `<small class="text-light">v2.0.0</small>`
- **Footer** (Line 160): `<small>v2.0.0</small>`

---

## 3. Fixed Header Architecture

### 3.1 Header Container

```html
Lines 36-126: <header class="fixed-header">
```

The fixed header remains visible at the top of the viewport during scrolling, containing:

1. Navigation Bar
2. Search Form
3. Reset Button

### 3.2 Navigation Bar (Lines 37-65)

**Structure:**

```text
navbar (Bootstrap 5.3.3)
├── navbar-brand (Logo + App Name)
├── navbar-toggler (Mobile menu toggle)
└── navbar-collapse
    └── navbar-nav
        ├── Search link (active)
        ├── About link
        └── Version display (v2.0.0)
```

**Key Features:**

- **Dark theme**: `navbar-dark bg-primary`
- **Responsive collapse**: Mobile-first navigation
- **Icon integration**: Font Awesome icons for visual enhancement
- **Version indicator**: Displays semantic version in navbar

### 3.3 Search Form (Lines 68-114)

**Container:** `header-form-container`

**Form Layout (Lines 69-104):**

```text
Row with 5 columns (Bootstrap grid):
├── col-md-3: Hotel Select (with tooltip)
├── col-md-2: Check-In Date
├── col-md-2: Check-Out Date
├── col-md-2: Guest Number Control
└── col-md-2: Search Button
```

#### 3.3.1 Hotel Select (Lines 71-78)

- **ID**: `hotel-select`
- **Type**: `<select>` with `form-select-sm`
- **Features**:
  - Bootstrap tooltip integration (`data-bs-toggle="tooltip"`)
  - Custom tooltip class: `cache-status-tooltip`
  - Dynamic loading message
  - Cache status displayed on hover

#### 3.3.2 Date Inputs (Lines 79-88)

**Check-In (Lines 79-83):**

- **ID**: `input-checkin`
- **Type**: `date` input with `form-control-sm`
- **Help text**: `checkin-help` (for validation messages)

**Check-Out (Lines 84-88):**

- **ID**: `input-checkout`
- **Type**: `date` input with `form-control-sm`
- **Help text**: `checkout-help` (for validation messages)

#### 3.3.3 Guest Number Control (Lines 89-98)

**ID**: `guest-filter-card`

**Structure:**

```html
<div class="col-md-2" id="guest-filter-card">
    <label>Hóspedes</label>
    <div class="input-group input-group-sm js-number-input" style="display: flex; align-items: stretch;">
        <input class="quantity" value="2" readonly style="flex: 1;">
        <div class="icon-con" style="display: flex; flex-direction: column; justify-content: space-between;">
            <span class="plus" aria-disabled="true">+</span>
            <span class="minus" aria-disabled="true">-</span>
        </div>
    </div>
</div>
```

**Key Features:**

- **Label**: Single "Hóspedes" label (no redundancy)
- **Input**: Read-only, displays current guest count (no "Hóspedes" word in value)
- **Layout**: Flexbox layout ensuring vertical alignment of input and buttons
  - Input and button container aligned at top and bottom points
  - Buttons stacked vertically within icon-con
  - No overlapping with guest number buttons
- **Controls**: Plus/minus buttons with state management
  - Initial state: `aria-disabled="true"`
  - State classes: Applied dynamically based on search lifecycle

**Button States (FR-004B):**

- **Initial State**: Disabled (opacity: 0.5, cursor: not-allowed)
- **Searching State**: Enabled (cursor: pointer when enabled)
- **Result State**: Enabled (cursor: pointer when enabled, not-allowed when aria-disabled)
- **Cursor Logic**: Properly reflects button state - pointer for enabled, not-allowed for disabled

**Alignment:**
- **Vertical Alignment**: Input field (`#guest-filter-card > div > input`) and button container (`#guest-filter-card > div > div`) are aligned at top and bottom points using flexbox with `align-items: stretch`
- **Horizontal Alignment**: All guest filter elements aligned to the right
  - `#guest-filter-card > div > input`: Right-aligned
  - `#guest-filter-card > div`: Right-aligned
  - `#guest-filter-card`: Right-aligned
  - Plus and minus buttons: Right-aligned within their container
- Ensures consistent height and visual alignment across all elements

#### 3.3.4 Search Button (Lines 99-103)

- **ID**: `search-button`
- **Type**: `submit`
- **Style**: `btn-warning btn-sm w-100`
- **Icon**: Font Awesome search icon
- **Text**: "Buscar"

#### 3.3.5 Holiday Package Notice (Lines 106-113)
- **ID**: `holiday-package-notice`
- **Initially hidden**: `display: none`
- **Purpose**: Display holiday package information when applicable
- **Style**: Warning alert with emoji indicator (🎄)

### 3.4 Reset Button (Lines 116-124)

**Compliance**: AC-008A.39

**Location**: Outside form element (important for compliance)

**Structure:**
```html
<div class="row g-2 mt-1">
    <div class="col-md-11"></div>
    <div class="col-md-1">
        <button id="reset-btn" type="button" class="btn btn-info btn-sm w-100" 
                style="display: none;">
            🔄
        </button>
    </div>
</div>
```

**Key Features:**
- **Type**: `button` (not submit)
- **Outside form**: Prevents form submission
- **Function**: Resets page to initial state only (no search trigger)
- **Initially hidden**: Shows only after first search
- **Icon**: Emoji indicator (🔄)

---

## 4. Main Content Area

### 4.1 Page Wrapper (Lines 128-162)

**Structure:**
```
page-wrapper (bg-color-1 p-t-395 p-b-120)
└── wrapper--w1070
    └── card-7
        └── card-body
            └── results-container
```

**Spacing:**
- **Top padding**: `p-t-395` (accommodates fixed header)
- **Bottom padding**: `p-b-120`
- **No spacing issue**: Top points aligned correctly

### 4.2 Results Container (Lines 134-155)

**ID**: `results-container`

**Sub-components:**

#### 4.2.1 Results Header (Lines 135-140)
- **Title**: "📊 Resultados da Busca"
- **Counter**: `results-counter` (dynamic update via filter)

#### 4.2.2 Hotels Cards Container (Lines 143-145)
- **ID**: `hotels-cards-container`
- **Purpose**: Dynamic injection of hotel availability cards
- **Content**: Populated via JavaScript after search

#### 4.2.3 Results Actions (Lines 147-154)
**Copy Results Button:**
- **ID**: `copy-results-btn`
- **Icon**: 📋
- **Function**: Copy search results to clipboard

**Clear Results Button:**
- **ID**: `clear-results-btn`
- **Icon**: 🗑️
- **Function**: Clear displayed results

### 4.3 Footer (Lines 159-161)
- **Class**: `version-footer`
- **Content**: Semantic version display (v2.0.0)

---

## 5. JavaScript Architecture

### 5.1 Script Loading Order (Lines 164-189)

**Vendor Libraries:**
1. Bootstrap 5.3.3 Bundle (Line 165) - Includes Popper
2. jQuery (Line 168)
3. Select2 (Line 170)
4. jQuery Validate (Line 171)
5. Moment.js (Line 172)
6. DateRangePicker (Line 173)

**Import Map (Lines 176-182):**
```json
{
    "imports": {
        "ibira.js": "./node_modules/ibira.js/src/index.js"
    }
}
```

**Application Scripts:**
1. **global.js** (Line 185): Global utilities and initialization
2. **guestNumberFilter.js** (Line 186): Guest filter logic (FR-004B)
3. **guestCounter.js** (Line 187): Guest counter UI management
4. **searchLifecycleState.js** (Line 188): State management
5. **hotelSearch.js** (Line 189): Main search functionality (ES module)

---

## 6. State Management

### 6.1 Search Lifecycle States

The application implements three distinct states:

#### 6.1.1 Initial State
- **Guest buttons**: Disabled (aria-disabled="true")
- **Reset button**: Hidden
- **Results container**: Empty
- **Form**: Ready for input

#### 6.1.2 Searching State
- **Guest buttons**: Enabled (state classes applied)
- **Search button**: May show loading indicator
- **Form**: Inputs may be disabled during search

#### 6.1.3 Result State
- **Guest buttons**: Enabled (filtering available)
- **Reset button**: Visible
- **Results container**: Populated with hotel cards
- **Form**: Re-enabled for new searches

### 6.2 State-Driven CSS Classes

**Pattern:** Elements receive state-specific classes:
- `.state-initial`
- `.state-searching`
- `.state-result`

**Implementation:** See `searchLifecycleState.js`

---

## 7. Responsive Design

### 7.1 Bootstrap Grid Breakpoints

**Form Columns:**
- **md (≥768px)**: 5-column layout (3-2-2-2-2)
- **sm (<768px)**: Stack vertically

**Navigation:**
- **lg (≥992px)**: Horizontal navbar
- **sm (<992px)**: Collapsed hamburger menu

### 7.2 Mobile Considerations
- Touch-friendly button sizes (btn-sm)
- Adequate spacing (g-2 gutters)
- Readable text sizes
- Collapsible navigation

---

## 8. Accessibility Features

### 8.1 ARIA Attributes
- **aria-disabled**: On guest control buttons
- **aria-current**: On active navigation link
- **aria-controls**: On navbar toggle
- **aria-expanded**: On navbar toggle
- **aria-label**: On navbar toggle

### 8.2 Form Labels
- All inputs have associated `<label>` elements
- Help text for date inputs
- Semantic form structure

### 8.3 Keyboard Navigation
- Tab order follows logical flow
- Form inputs accessible via keyboard
- Buttons respond to Enter/Space keys

---

## 9. Styling Architecture

### 9.1 CSS Load Order
1. **Bootstrap 5.3.3**: Base framework
2. **Vendor CSS**: Third-party components
3. **main.css**: Global application styles
4. **index-page.css**: Page-specific styles

**Reason for Order:** Custom styles load last to override Bootstrap defaults

### 9.2 Custom CSS Classes

**Layout Classes:**
- `.fixed-header`: Header positioning
- `.header-form-container`: Form wrapper in header
- `.page-wrapper`: Main content wrapper
- `.results-container`: Results display area

**Component Classes:**
- `.icon-con`: Guest button container
- `.quantity`: Guest count input
- `.cache-status-tooltip`: Custom tooltip styling
- `.holiday-package-notice`: Holiday alert styling

### 9.3 Spacing Utilities
- `p-t-395`: Top padding (accommodates fixed header)
- `p-b-120`: Bottom padding
- `g-2`: Grid gutter spacing
- `mt-1`: Margin top (reset button row)

---

## 10. Integration Points

### 10.1 Hotel Select Integration
- Populated dynamically by `hotelSearch.js`
- Cache status tooltip shows data freshness
- Select2 enhancement for search/filter

### 10.2 Date Picker Integration
- DateRangePicker library integration
- Holiday package detection
- Validation with help text display

### 10.3 Guest Filter Integration
- Module ID: FR-004B
- Manages +/- button states
- Updates readonly input display
- Integrates with search lifecycle

### 10.4 Results Display Integration
- Hotel cards dynamically generated
- Filter updates counter
- Copy/clear actions manage results

---

## 11. Performance Considerations

### 11.1 CDN Usage
- Bootstrap loaded from CDN (jsdelivr)
- Google Analytics asynchronously loaded
- Vendor libraries from local files

### 11.2 Script Optimization
- ES6 modules for modern browsers
- Async loading for analytics
- Deferred non-critical scripts

### 11.3 CSS Optimization
- Media="all" for all stylesheets
- Minified vendor CSS
- Combined custom CSS files

---

## 12. Browser Compatibility

### 12.1 Supported Features
- ES6 modules (importmap)
- HTML5 input types (date)
- Bootstrap 5.3.3 requirements
- Modern CSS (flexbox, grid)

### 12.2 Minimum Requirements
- Modern evergreen browsers
- JavaScript enabled
- CSS3 support
- Viewport meta tag support

---

## 13. Known Issues and Limitations

### 13.1 Fixed Header Overlap
- **Issue**: Content must account for fixed header height
- **Solution**: `p-t-395` on page-wrapper
- **Status**: Resolved

### 13.2 Guest Input Overlap
- **Issue**: Previously overlapped guest buttons
- **Solution**: Reduced input width
- **Status**: Resolved

### 13.3 Redundant Labels
- **Issue**: "Hóspedes" shown twice
- **Solution**: Removed from input value
- **Status**: Resolved

---

## 14. Maintenance Guidelines

### 14.1 Version Updates
- Update version in both navbar (Line 59) and footer (Line 160)
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Document changes in CHANGELOG.md

### 14.2 Layout Modifications
- Test responsive behavior at all breakpoints
- Verify state transitions after changes
- Update this documentation
- Run accessibility checks

### 14.3 Bootstrap Updates
- Verify integrity hashes when updating CDN links
- Test all Bootstrap components after updates
- Check for breaking changes in Bootstrap release notes

---

## 15. Testing Recommendations

### 15.1 Visual Regression Testing
- Initial state rendering
- Search state rendering
- Result state rendering
- Responsive breakpoints

### 15.2 Functional Testing
- Form submission
- Reset button behavior (AC-008A.39)
- Guest number controls
- Tooltip display

### 15.3 Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- ARIA attribute validation
- Color contrast ratios

---

## 16. Related Documentation

### 16.1 Functional Requirements
- **FR-004B**: Guest Number Filter
- **AC-008A.39**: Reset Button Compliance

### 16.2 Implementation Guides
- `styling/FIXED_HEADER.md`: Fixed header implementation details
- `styling/FORM_IN_HEADER_IMPLEMENTATION.md`: Form integration
- `styling/GUEST_BUTTONS_COMPLETE_GUIDE.md`: Complete guest buttons implementation (layout, states, visibility, cursor)
- `styling/CACHE_STATUS_TOOLTIP.md`: Tooltip implementation
- `features/RESET_BUTTON_FIX_AC008A39.md`: Reset button compliance

### 16.3 API Documentation
- `docs/api/API_CONFIGURATION.md`: API configuration
- `docs/testing/`: Test suites and validation

---

## 17. Conclusion

This GUI layout implements a modern, accessible, and maintainable interface for the Monitora Vagas AFPESP application. The architecture emphasizes:

- **State-driven UI**: Clear visual feedback for user actions
- **Responsive design**: Works across all device sizes
- **Accessibility**: WCAG compliance and keyboard navigation
- **Maintainability**: Semantic HTML and modular CSS
- **Performance**: Optimized loading and rendering

For questions or clarifications, refer to the related documentation or consult the development team.

---

**Document End**
