# Functional Requirements Specification

## Hotel Vacancy Search Application

**Document Version:** 1.2  
**Date:** 2025-12-11  
**Author:** Monitora Vagas Development Team  
**Application:** index.html - Hotel Vacancy Search Interface  

---

## 1. Overview

### 1.1 Purpose

This document specifies the functional requirements for the Hotel Vacancy Search web application, which allows users to search for hotel room availability across multiple properties for specified date ranges.

### 1.2 Scope

The application provides a web-based interface for:

- Selecting hotels from a dynamic list

- Specifying check-in and check-out dates
- Defining the number of guests

- Viewing available room vacancies
- Managing search results

### 1.3 Target Users

- Hotel booking agents

- Travel coordinators
- Hospitality staff

- End-users searching for hotel availability

---

## 2. Functional Requirements

### FR-001: Hotel Selection

**Priority:** High  
**Status:** Implemented

#### FR-001 Description

The system shall provide a dropdown list of available hotels loaded dynamically from the API.

#### FR-001 Acceptance Criteria

- **AC-001.1:** On page load, the hotel dropdown displays "Loading hotels..." message

- **AC-001.2:** Hotels are fetched from the API endpoint `/api/vagas/hoteis/scrape` (production) or `/api/vagas/hoteis` (static fallback)
- **AC-001.3:** Hotel dropdown populates with hotel names after successful API response

- **AC-001.4:** Default option "Select a hotel" is displayed as the first option
- **AC-001.5:** If API call fails, display "Error loading hotels" message

- **AC-001.6:** Each hotel option contains hotelId as value and hotel name as display text
- **AC-001.7:** User can select "-1" (all hotels) or specific hotel ID

#### Dependencies

- API endpoints:
  - Primary: `GET /api/vagas/hoteis/scrape` (dynamic hotel list from production)
  - Fallback: `GET /api/vagas/hoteis` (static hotel list)

- apiClient.js service module

#### FR-001 Test Coverage

- `test_04_hotel_select_has_options`

---

### FR-002: Check-In Date Selection

**Priority:** High  
**Status:** Implemented

#### FR-002 Description

The system shall allow users to select a check-in date using an HTML5 date input.

#### FR-002 Acceptance Criteria

- **AC-002.1:** Check-in input field is of type "date"

- **AC-002.2:** Input accepts dates in ISO 8601 format (yyyy-MM-dd)
- **AC-002.3:** Input field has label "Check-In"

- **AC-002.4:** Input field has unique ID "input-checkin"
- **AC-002.5:** Browser's native date picker is available

- **AC-002.6:** Field can be cleared after selection
- **AC-002.7:** Field is required for form submission

#### Check-In Input Format

- **Display Format:** Browser-dependent (based on user locale)

- **Internal Format:** yyyy-MM-dd (ISO 8601)

#### Check-In Validation Rules

- Must be a valid date

- Must be provided before form submission
- No past date restriction (business rule to be determined)

#### FR-002 Test Coverage

- `test_05_checkin_input_accepts_text`

- `test_29_checkin_date_format_validation`
- `test_32_datepicker_clear_functionality`

---

### FR-003: Check-Out Date Selection

**Priority:** High  
**Status:** Implemented

#### FR-003 Description

The system shall allow users to select a check-out date using an HTML5 date input.

#### FR-003 Acceptance Criteria

- **AC-003.1:** Check-out input field is of type "date"

- **AC-003.2:** Input accepts dates in ISO 8601 format (yyyy-MM-dd)
- **AC-003.3:** Input field has label "Check-Out"

- **AC-003.4:** Input field has unique ID "input-checkout"
- **AC-003.5:** Browser's native date picker is available

- **AC-003.6:** Field can be cleared after selection
- **AC-003.7:** Field is required for form submission

- **AC-003.8:** System allows same-day check-in/check-out (validation on submit)

#### Check-Out Input Format

- **Display Format:** Browser-dependent (based on user locale)

- **Internal Format:** yyyy-MM-dd (ISO 8601)

#### Validation Rules

- Must be a valid date

- Must be provided before form submission
- Should be same as or after check-in date (business rule to be enforced)

#### FR-003 Test Coverage

- `test_06_checkout_input_accepts_text`

- `test_30_checkout_date_format_validation`
- `test_33_datepicker_sequential_dates`

- `test_34_datepicker_same_day_selection`

---

### FR-004: Guest Counter

**Priority:** Medium  
**Status:** Implemented

#### FR-004 Description

The system shall provide an interactive guest counter with increment/decrement controls.

#### FR-004 Acceptance Criteria

- **AC-004.1:** Guest input displays default value "2 Hóspedes"

- **AC-004.2:** Plus (+) button increments guest count
- **AC-004.3:** Minus (-) button decrements guest count

- **AC-004.4:** Guest count displays in format "N Hóspedes" (Portuguese)
- **AC-004.5:** Plus button is visible and clickable

- **AC-004.6:** Minus button is visible and clickable
- **AC-004.7:** Minimum guest count is enforced (to be defined)

- **AC-004.8:** Maximum guest count is enforced (to be defined)

#### FR-004 Business Rules

- Default: 2 guests

- Format: "{count} Hóspedes"
- Interactive buttons for increment/decrement

#### FR-004 Test Coverage

- `test_07_guest_counter_plus_button_exists`

- `test_08_guest_counter_minus_button_exists`

---

### FR-004A: Guest Filter State Management

**Priority:** Medium  
**Status:** Planned

#### FR-004A Description

The system shall control the enabled/disabled state of the "Hóspedes" (Guests) filter card based on search completion status.

#### FR-004A Acceptance Criteria

- **AC-004A.1:** On initial page load, the "Hóspedes"/"Guests" filter card shall be disabled
- **AC-004A.2:** The disabled state shall prevent user interaction with the filter
- **AC-004A.3:** Visual indication of disabled state shall be clearly displayed (e.g., greyed out, reduced opacity)
- **AC-004A.4:** After search completion (successful or failed), the "Hóspedes" filter card shall be enabled
- **AC-004A.5:** The enabled state shall allow full user interaction with guest count controls
- **AC-004A.6:** The state transition shall occur immediately upon search completion
- **AC-004A.7:** The filter card shall remain enabled after being activated until page reload

#### FR-004A Business Rules

- **Initial State:** Disabled (on page load)
- **Trigger Event:** Search execution completion
- **Final State:** Enabled (after first search)
- **Persistence:** State persists across multiple searches within same session
- **Reset Condition:** Page reload resets to disabled state

#### User Flow

```text
1. Page Load → Guest filter card is DISABLED
2. User fills in required search fields (hotel, dates)
3. User clicks "busca vagas" button
4. Search executes (API call)
5. Search completes (with results or error)
6. Guest filter card becomes ENABLED
7. User can now interact with guest count controls
```

#### Visual States

**Disabled State:**

- Opacity: 0.5 or 0.6
- Cursor: not-allowed or default
- Pointer-events: none (optional)
- Background: greyed or muted
- Interactive elements (+ / -) non-functional

**Enabled State:**

- Opacity: 1.0
- Cursor: pointer (on interactive elements)
- Pointer-events: auto
- Background: normal colors
- Interactive elements (+ / -) fully functional

#### Implementation Notes

- Use CSS classes to toggle states (e.g., `.filter-disabled` / `.filter-enabled`)
- JavaScript event listener on search completion
- Consider accessibility (ARIA attributes: `aria-disabled="true"`)
- Ensure keyboard navigation respects disabled state
- Screen reader support for state changes

#### Internationalization (Filter Label)

- **Portuguese (pt-BR):** "Hóspedes"
- **English (en-US):** "Guests"

#### FR-004A Test Coverage (Guest Filter State Management)

To be defined:

- `test_guest_filter_initial_disabled_state`
- `test_guest_filter_enabled_after_search`
- `test_guest_filter_visual_indication`
- `test_guest_filter_interaction_blocked_when_disabled`

#### FR-004A Dependencies

- FR-005: Vacancy Search Execution (triggers state change)
- FR-004: Guest Counter (component being controlled)

#### Related Requirements

- FR-005: Search execution triggers the state change
- FR-006: Results display (occurs simultaneously with filter enablement)

---

### FR-004B: Client-Side Guest Number Filtering

**Priority:** High  
**Status:** ✅ Implemented (v1.4.6 - 2025-12-11)

#### Description

The system shall provide client-side filtering of hotel vacancy results based on the number of guests selected by the user. The filter shall parse vacancy information to determine room capacity and show/hide results accordingly.

#### Acceptance Criteria

- **AC-004B.1:** All filtering logic shall be implemented entirely on the client-side (no server requests)
- **AC-004B.2:** Filter shall parse guest capacity from vacancy result strings
- **AC-004B.3:** Filter shall extract numeric value from "até N pessoas" pattern
- **AC-004B.4:** Hotel vacancy cards shall remain visible if capacity ≥ selected guest count
- **AC-004B.5:** Hotel vacancy cards shall become hidden if capacity < selected guest count
- **AC-004B.6:** Filter shall be applied immediately whenever guest count changes
- **AC-004B.7:** Filter shall re-evaluate all visible vacancy cards on each guest count change
- **AC-004B.8:** Hidden cards shall not be removed from DOM, only CSS visibility changed

#### Business Rules

- **Filter Application:** Client-side only (JavaScript)
- **Trigger Event:** Guest count increment/decrement
- **Filter Logic:** Capacity >= Guest Count → Visible; Capacity < Guest Count → Hidden
- **Parsing Pattern:** Extract number from "até {N} pessoas" in result string
- **Default Behavior:** If capacity cannot be parsed, assume visible (fail-safe)

#### Data Format Example

**Input Result Line:**

```plaintext
ANDRADE (até 2 pessoas)13/12 - 15/12 (2 dias livres) - 24 Quarto(s)
```

**Parsed Information:**

- Hotel Name: "ANDRADE"
- Capacity: 2 (extracted from "até 2 pessoas")
- Dates: 13/12 - 15/12
- Available Rooms: 24

**Filter Logic:**

```javascript
// Guest count: 2
if (capacity >= guestCount) {  // 2 >= 2 → true
    // Show card
} else {
    // Hide card
}
```

#### Parsing Algorithm

**Step 1:** Extract capacity pattern

```javascript
const regex = /até\s+(\d+)\s+pessoas?/i;
const match = resultString.match(regex);
```

**Step 2:** Extract numeric value

```javascript
const capacity = match ? parseInt(match[1]) : null;
```

**Step 3:** Apply filter

```javascript
if (capacity !== null && capacity < guestCount) {
    // Hide card
    card.style.display = 'none';
} else {
    // Show card
    card.style.display = 'block';
}
```

#### User Flow

```text
1. User completes initial search → Results displayed
2. Guest filter becomes enabled (FR-004A)
3. User increments guest count (e.g., 2 → 3)
   ├─> Filter triggers immediately
   ├─> Parse all vacancy cards
   ├─> Check: capacity >= 3?
   ├─> Hide cards with capacity < 3
   └─> Keep visible cards with capacity >= 3
4. User decrements guest count (e.g., 3 → 2)
   ├─> Filter triggers immediately
   ├─> Re-evaluate all cards
   └─> Show previously hidden cards if capacity >= 2
```

#### FR-004B Implementation Notes

**Event Listener:**

```javascript
plusBtn.addEventListener('click', function() {
    guestCount++;
    updateDisplay();
    applyGuestFilter(guestCount);  // Apply filter
});

minusBtn.addEventListener('click', function() {
    if (guestCount > 1) {
        guestCount--;
        updateDisplay();
        applyGuestFilter(guestCount);  // Apply filter
    }
});
```

**Filter Function:**

```javascript
function applyGuestFilter(selectedGuestCount) {
    const vacancyCards = document.querySelectorAll('.hotel-card');
    
    vacancyCards.forEach(card => {
        const vacancies = card.querySelectorAll('.vacancy-item');
        let hasVisibleVacancy = false;
        
        vacancies.forEach(vacancy => {
            const text = vacancy.textContent;
            const match = text.match(/até\s+(\d+)\s+pessoas?/i);
            
            if (match) {
                const capacity = parseInt(match[1]);
                if (capacity >= selectedGuestCount) {
                    vacancy.style.display = 'block';
                    hasVisibleVacancy = true;
                } else {
                    vacancy.style.display = 'none';
                }
            } else {
                // No capacity info - keep visible (fail-safe)
                vacancy.style.display = 'block';
                hasVisibleVacancy = true;
            }
        });
        
        // Hide entire hotel card if no vacancies match
        card.style.display = hasVisibleVacancy ? 'block' : 'none';
    });
}
```

#### Visual Feedback

**Filter Active:**

- Card visibility changes instantly
- Smooth CSS transition (optional)
- Counter updates to show "X of Y hotels"

**Filter Result Examples:**

##### Guest Count: 2

```plaintext
✓ ANDRADE (até 2 pessoas) → VISIBLE
✓ PRAIA GRANDE (até 3 pessoas) → VISIBLE
✓ GUARUJÁ (até 4 pessoas) → VISIBLE
```

#### Guest Count: 3

```plaintext
✗ ANDRADE (até 2 pessoas) → HIDDEN
✓ PRAIA GRANDE (até 3 pessoas) → VISIBLE
✓ GUARUJÁ (até 4 pessoas) → VISIBLE
```

#### Guest Count: 5

```text
✗ ANDRADE (até 2 pessoas) → HIDDEN
✗ PRAIA GRANDE (até 3 pessoas) → HIDDEN
✗ GUARUJÁ (até 4 pessoas) → HIDDEN
```

#### Performance Considerations

- **DOM Manipulation:** Minimize reflows by batching updates
- **Regex Efficiency:** Pre-compile regex patterns
- **Debouncing:** Not required (instant feedback desired)
- **Large Results:** Filter should handle 50+ cards efficiently

#### FR-004B Edge Cases

##### Case 1: Missing Capacity Information

```text
"ANDRADE 13/12 - 15/12 - 24 Quarto(s)"  // No "até N pessoas"
```

**Behavior:** Keep visible (fail-safe)

#### Case 2: Multiple Capacity Formats

```text
"até 1 pessoa"   → Extract: 1
"até 2 pessoas"  → Extract: 2
"Até 3 Pessoas"  → Extract: 3 (case-insensitive)
"ate 4 pessoas"  → Extract: 4 (with/without accent)
```

#### Case 3: Invalid Capacity

```text
"até pessoas"    → No number, keep visible
"até 0 pessoas"  → Invalid, keep visible
"até -1 pessoas" → Invalid, keep visible
```

#### Case 4: Empty Results

- No cards match filter → Display "No vacancies for N guests" message

#### Accessibility

- **Screen Readers:** Announce "Showing X hotels for Y guests"
- **ARIA Live Region:** Update count dynamically
- **Focus Management:** Maintain focus when cards hide/show
- **Keyboard Navigation:** Filter respects keyboard interactions

#### Internationalization (Capacity Pattern)

- **Portuguese (pt-BR):** "até {N} pessoa(s)"
- **English (en-US):** "up to {N} guest(s)" (future support)

#### FR-004B Test Coverage (Client-Side Guest Number Filtering)

✅ Implemented (100% pass rate):

- `test_guest_number_filter.py::test_01_filter_module_loaded`
- `test_guest_number_filter.py::test_02_parsing_capacity`
- `test_guest_number_filter.py::test_03_filter_shows_matching_cards`
- `test_guest_number_filter.py::test_04_filter_hides_non_matching_cards`
- `test_guest_number_filter.py::test_05_filter_triggers_on_guest_change`
- `test_guest_number_filter.py::test_06_filter_re_evaluates_all_cards`
- `test_guest_number_filter.py::test_07_filter_uses_css_display`
- `test_guest_number_filter.py::test_08_filter_handles_missing_capacity`

#### FR-004B Implementation Files

- **Module:** `public/js/guestNumberFilter.js` (233 lines)
- **Integration:** `public/js/guestCounter.js` (event handlers)
- **HTML:** `public/index.html` (classes, data attributes)
- **CSS:** `public/css/main.css` (transitions, styling)
- **Tests:** `tests/test_guest_number_filter.py` (8 test cases)

#### FR-004B Dependencies

- FR-004: Guest Counter (provides guest count value)
- FR-004A: Guest Filter State Management (enables filter after search)
- FR-006: Results Display (provides vacancy cards to filter)

#### FR-004B Integration Points

**Guest Counter Component:**

- Triggers `applyGuestFilter()` on +/- button click

**Results Display Component:**

- Provides hotel cards with consistent class names
- Vacancy items must have parseable text content

**Search Component:**

- Initial filter application after results loaded

---

### FR-005: Vacancy Search Execution

**Priority:** High  
**Status:** Implemented

#### FR-005 Description

The system shall execute a vacancy search when the user submits the form.

#### FR-005 Acceptance Criteria

- **AC-005.1:** Search button displays text "busca vagas"

- **AC-005.2:** Search button is visible and enabled by default
- **AC-005.3:** Form submission is prevented from page reload (preventDefault)

- **AC-005.4:** Date inputs are validated before API call
- **AC-005.5:** Alert displays "Por favor, selecione as datas de check-in e check-out" if dates missing

- **AC-005.6:** Button text changes to "🔍 Buscando..." during search
- **AC-005.7:** Button is disabled during search execution

- **AC-005.8:** Previous results are hidden when new search starts
- **AC-005.9:** API call uses GET method with query parameters

- **AC-005.10:** API endpoint: `/api/vagas/search?hotel={id}&checkin={date}&checkout={date}`

#### API Integration

```text
Endpoint: GET /api/vagas/search
Parameters:

  - hotel: string (hotelId or "-1" for all)
  - checkin: string (yyyy-MM-dd format)
  - checkout: string (yyyy-MM-dd format)
Response: JSON array of hotel vacancy data
```

#### Error Handling

- Missing dates: Alert message to user

- Date validation: HTML5 native validation (browser handles format checking)
- API errors: Logged to console and displayed to user

#### FR-005 Test Coverage

- `test_09_form_validates_empty_dates`

- `test_10_search_button_text`
- `test_24_full_search_workflow`

---

### FR-006: Results Display

**Priority:** High  
**Status:** Implemented

#### FR-006 Description

The system shall display search results in a structured format with hotel cards.

#### FR-006 Acceptance Criteria

- **AC-006.1:** Results container is hidden by default (display: none)

- **AC-006.2:** Results container becomes visible after successful search
- **AC-006.3:** Results display title "📊 Resultados da Busca"

- **AC-006.4:** Hotel cards are displayed in vertical layout (flex-direction: column)
- **AC-006.5:** Each hotel card shows hotel-specific vacancy information

- **AC-006.6:** Cards have consistent spacing (gap: 20px)
- **AC-006.7:** Results container has unique ID "results-container"

- **AC-006.8:** Hotel cards container has unique ID "hotels-cards-container"

#### Display Structure

```text
Results Container
├── Title: "📊 Resultados da Busca"
├── Hotels Cards Container
│   ├── Hotel Card 1
│   ├── Hotel Card 2
│   └── Hotel Card N
└── Action Buttons (Copy/Clear)
```

#### Test Coverage

- `test_03_results_container_initially_hidden`

- `test_13_hotels_cards_container_exists`

---

### FR-007: Copy Results to Clipboard

**Priority:** Medium  
**Status:** Implemented

#### FR-007 Description

The system shall allow users to copy search results to the clipboard.

#### FR-007 Acceptance Criteria

- **AC-007.1:** Copy button displays "📋 Copiar Resultados"

- **AC-007.2:** Copy button has ID "copy-results-btn"
- **AC-007.3:** Copy button is styled with green background (#4CAF50)

- **AC-007.4:** Copy button is hidden when results are hidden
- **AC-007.5:** Copy button is visible when results are displayed

- **AC-007.6:** Clicking button copies formatted results to clipboard
- **AC-007.7:** Button has descriptive text content in HTML

#### FR-007 User Interaction

1. User clicks "📋 Copiar Resultados" button
2. System copies formatted hotel vacancy data to clipboard
3. User can paste results into other applications

#### FR-007 Test Coverage

- `test_11_copy_results_button_exists`

- `test_18_buttons_have_text`

---

### FR-008: Clear Results

**Priority:** Medium  
**Status:** Implemented

#### FR-008 Description

The system shall allow users to clear displayed search results.

#### FR-008 Acceptance Criteria

- **AC-008.1:** Clear button displays "🗑️ Limpar Resultados"

- **AC-008.2:** Clear button has ID "clear-results-btn"
- **AC-008.3:** Clear button is styled with red background (#f44336)

- **AC-008.4:** Clear button is hidden when results are hidden
- **AC-008.5:** Clear button is visible when results are displayed

- **AC-008.6:** Clicking button hides results container
- **AC-008.7:** Clicking button clears hotel cards container

- **AC-008.8:** Button has descriptive text content in HTML

#### FR-008 User Interaction

1. User clicks "🗑️ Limpar Resultados" button
2. System hides results container
3. System clears all hotel cards from display
4. Form remains populated with previous search parameters

#### FR-008 Test Coverage

- `test_12_clear_results_button_exists`

- `test_18_buttons_have_text`

---

### FR-009: Responsive Design

**Priority:** High  
**Status:** Implemented

#### FR-009 Description

The system shall be responsive and function correctly across different device sizes.

#### FR-009 Acceptance Criteria

- **AC-009.1:** Page renders correctly on mobile devices (375px width)

- **AC-009.2:** Page renders correctly on tablet devices (768px width)
- **AC-009.3:** Page renders correctly on desktop devices (1920px width)

- **AC-009.4:** Search button remains visible and functional on all screen sizes
- **AC-009.5:** Form inputs are usable on touch devices

- **AC-009.6:** Content does not overflow on small screens
- **AC-009.7:** Viewport meta tag is properly configured

#### Supported Viewports

- **Mobile:** 375x667 (iPhone 6/7/8)

- **Tablet:** 768x1024 (iPad)
- **Desktop:** 1920x1080 (Full HD)

#### FR-009 Test Coverage

- `test_14_mobile_viewport`

- `test_15_tablet_viewport`
- `test_16_desktop_viewport`

---

### FR-010: Accessibility

**Priority:** High  
**Status:** Implemented

#### FR-010 Description

The system shall meet basic accessibility standards for users with disabilities.

#### FR-010 Acceptance Criteria

- **AC-010.1:** All form inputs have associated label elements

- **AC-010.2:** Minimum 3 labels present on the page
- **AC-010.3:** All buttons have descriptive text content

- **AC-010.4:** Date inputs have appropriate type attribute
- **AC-010.5:** Form is navigable via keyboard

- **AC-010.6:** Semantic HTML elements are used appropriately
- **AC-010.7:** Page has meaningful title

#### WCAG Compliance

- Labels associated with inputs (WCAG 1.3.1)

- Buttons have descriptive text (WCAG 2.4.4)
- Form uses semantic HTML (WCAG 1.3.1)

#### FR-010 Test Coverage

- `test_17_form_labels_exist`

- `test_18_buttons_have_text`
- `test_19_inputs_have_placeholders` (validates type attribute)

---

### FR-011: JavaScript Integration

**Priority:** High  
**Status:** Implemented

#### FR-011 Description

The system shall properly load and integrate required JavaScript libraries and modules.

#### FR-011 Acceptance Criteria

- **AC-011.1:** jQuery library is loaded and available

- **AC-011.2:** ES6 module scripts are present and loaded
- **AC-011.3:** apiClient service module is imported successfully

- **AC-011.4:** Global JavaScript utilities are loaded
- **AC-011.5:** Guest counter JavaScript is loaded

- **AC-011.6:** No severe JavaScript errors in browser console

#### Required Libraries

- jQuery (vendor/jquery/jquery.min.js)

- Select2 (vendor/select2/select2.min.js)
- jQuery Validate (vendor/jquery-validate/jquery.validate.min.js)

- Bootstrap Wizard (vendor/bootstrap-wizard/)
- Datepicker (vendor/datepicker/)

#### Custom Scripts

- global.js

- guestCounter.js
- apiClient.js (ES6 module)

#### FR-011 Test Coverage

- `test_20_jquery_loaded`

- `test_21_module_script_loaded`
- `test_23_no_javascript_errors`

---

### FR-012: Performance

**Priority:** Medium  
**Status:** Implemented

#### FR-012 Description

The system shall load and respond within acceptable performance thresholds.

#### FR-012 Acceptance Criteria

- **AC-012.1:** Page loads in less than 5 seconds

- **AC-012.2:** CSS files are loaded successfully
- **AC-012.3:** External resources (fonts, icons) are loaded

- **AC-012.4:** API responses are handled efficiently
- **AC-012.5:** UI remains responsive during API calls

#### Performance Targets

- Page Load Time: < 5 seconds

- Time to Interactive: < 3 seconds
- API Response Display: < 1 second after response

#### FR-012 Test Coverage

- `test_22_page_load_time`

- `test_25_css_files_loaded`
- `test_26_external_resources_loaded`

---

### FR-013: Date Picker Functionality

**Priority:** High  
**Status:** Implemented

#### FR-013 Description

The system shall provide functional date picker controls for date selection.

#### FR-013 Acceptance Criteria

- **AC-013.1:** Check-in date picker opens on click

- **AC-013.2:** Check-out date picker opens on click
- **AC-013.3:** Date inputs accept valid ISO format dates

- **AC-013.4:** Date inputs can be cleared
- **AC-013.5:** Sequential date entry is supported

- **AC-013.6:** Same-day selection is allowed
- **AC-013.7:** Date inputs have type="date" attribute

- **AC-013.8:** Date picker UI is accessible (native or custom)

#### Browser Support

- Chrome/Edge: Native date picker

- Firefox: Native date picker
- Safari: Native date picker

- Fallback: Daterangepicker library (vendor/datepicker/)

#### FR-013 Test Coverage

- `test_27_checkin_datepicker_opens`

- `test_28_checkout_datepicker_opens`
- `test_31_datepicker_has_required_attribute`

- `test_35_datepicker_placeholder_text` (validates type)
- `test_36_datepicker_readonly_attribute`

---

## 3. Non-Functional Requirements

### NFR-001: Browser Compatibility

The application shall function correctly on:

- Chrome (latest 2 versions)

- Firefox (latest 2 versions)
- Safari (latest 2 versions)

- Edge (latest 2 versions)

### NFR-002: API Availability

The application requires:

- API server accessible at `https://www.mpbarbosa.com/api/`

- Fallback to local API on port 3001 for development
- API health endpoint: `/api/health`

### NFR-003: Security

- No sensitive data stored in client-side storage

- HTTPS for production API calls
- Input validation to prevent XSS

- No robots indexing (noindex, follow)

### NFR-004: Maintainability

- Code follows ES6+ standards

- Modular architecture with separate service files
- CSS organized with vendor and custom separation

- Comprehensive test coverage (36 E2E tests)

---

## 4. User Workflows

### 4.1 Primary Workflow: Search for Hotel Vacancies

```text

1. User navigates to the application
2. System loads hotels from API
3. User selects a hotel (or leaves as default for all hotels)
4. User selects check-in date
5. User selects check-out date
6. User adjusts guest count (optional)
7. User clicks "busca vagas" button
8. System validates inputs
9. System displays loading state
10. System calls API with search parameters
11. System displays results in card format
12. User can copy results or clear results
```

### 4.2 Alternative Workflow: Clear Results

```text

1. User has results displayed
2. User clicks "🗑️ Limpar Resultados" button
3. System hides results container
4. System clears hotel cards
5. User can perform new search
```

### 4.3 Alternative Workflow: Copy Results

```text

1. User has results displayed
2. User clicks "📋 Copiar Resultados" button
3. System copies formatted results to clipboard
4. User pastes results in external application
```

---

## 5. Data Specifications

### 5.1 Hotel Object

```json
{
  "hotelId": "string",
  "name": "string"
}
```

### 5.2 Search Parameters

```json
{
  "hotel": "string (hotelId or '-1')",
  "checkin": "string (yyyy-MM-dd)",
  "checkout": "string (yyyy-MM-dd)"
}
```

### 5.3 API Response Format

```json
[
  {
    "hotelId": "string",
    "hotelName": "string",
    "vacancies": [
      {
        "date": "string",
        "available": "number",
        "total": "number"
      }
    ]
  }
]
```

---

## 6. Validation Rules

### 6.1 Form Validation

| Field     | Required | Format         | Validation Message                                       |
| --------- | -------- | -------------- | -------------------------------------------------------- |
| Hotel     | No       | -              | -                                                        |
| Check-In  | Yes      | yyyy-MM-dd     | "Por favor, selecione as datas de check-in e check-out"  |
| Check-Out | Yes      | yyyy-MM-dd     | "Por favor, selecione as datas de check-in e check-out"  |
| Guests    | No       | "{N} Hóspedes" | -                                                        |

### 6.2 Date Validation

- Check-in and check-out dates must be provided

- Dates must be in valid ISO 8601 format (yyyy-MM-dd)
- No restriction on past/future dates (business rule TBD)

- Same-day check-in/check-out is allowed

---

## 7. Error Handling

### 7.1 API Errors

- **Hotels Load Failure:** Display "Error loading hotels" in dropdown

- **Search API Failure:** Log to console, display error to user
- **Network Errors:** Graceful degradation with user notification

### 7.2 User Input Errors

- **Missing Dates:** Alert "Por favor, selecione as datas de check-in e check-out"

- **Date Format:** HTML5 native date inputs use ISO 8601 format (yyyy-mm-dd) with browser-provided date picker
- **Form Validation:** Prevent submission if required fields missing

### 7.3 Console Logging

- All errors logged to browser console

- API request/response logged for debugging
- Search flow logged with emoji indicators (🚀, 📝, ✅, 🌐, 📤)

---

## 8. Test Coverage Summary

| Category              | Test Count | Coverage |
| --------------------- | ---------- | -------- |
| Page Load             | 3          | Complete |
| Form Interaction      | 5          | Complete |
| Form Validation       | 2          | Complete |
| UI Components         | 3          | Complete |
| Responsive Design     | 3          | Complete |
| Accessibility         | 3          | Complete |
| JavaScript Integration| 2          | Complete |
| Performance           | 2          | Complete |
| Integration           | 2          | Complete |
| Date Picker           | 10         | Complete |
| **Total**             | **36**     | **100%** |

---

## 9. Dependencies

### 9.1 External Libraries

- jQuery 3.x

- Select2
- jQuery Validate

- Bootstrap Wizard
- Moment.js

- Daterangepicker

### 9.2 Custom Modules

- apiClient.js (ES6 module)

- global.js
- guestCounter.js

### 9.3 API Dependencies

- Hotels Endpoints:
  - Primary: `GET /api/vagas/hoteis/scrape` (dynamic list from production)
  - Fallback: `GET /api/vagas/hoteis` (static list)

- Search Endpoint: `GET /api/vagas/search`
- Health Endpoint: `GET /api/health`

### 9.4 Font & Icon Resources

- Google Fonts (Roboto)

- Material Design Iconic Font
- Font Awesome 4.7

---

## 10. Future Enhancements (Out of Scope)

- User authentication/authorization

- Saved search history
- Email notification for results

- Advanced filtering options
- Multi-language support

- Export results to PDF/Excel
- Calendar view for vacancies

- Real-time availability updates
- Mobile native applications

- Booking integration

---

## 11. Approval & Sign-off

| Role              | Name | Signature | Date |
| ----------------- | ---- | --------- | ---- |
| Product Owner     |      |           |      |
| Development Lead  |      |           |      |
| QA Lead           |      |           |      |
| UX Designer       |      |           |      |

---

## 12. Revision History

| Version | Date       | Author              | Changes                                         |
| ------- | ---------- | ------------------- | ----------------------------------------------- |
| 1.0     | 2025-12-09 | Monitora Vagas Team | Initial functional requirements document        |
| 1.1     | 2025-12-11 | Monitora Vagas Team | Added FR-004A: Guest Filter State Management    |
| 1.2     | 2025-12-11 | Monitora Vagas Team | Added FR-004B: Client-Side Guest Number Filtering |

---

**Document Status:** ✅ Approved for Implementation  
**Next Review Date:** 2026-01-09
