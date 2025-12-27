# Monitora Vagas - Terminology Glossary

**Version:** 2.2.0  
**Last Updated:** 2024-12-22  
**Purpose:** Clarify terminology used across codebase and documentation

---

## Table of Contents

1. [Component Names](#component-names)
2. [Feature Requirements](#feature-requirements)
3. [UI Elements](#ui-elements)
4. [API Terminology](#api-terminology)
5. [State Management](#state-management)
6. [Common Confusions](#common-confusions)

---

## Component Names

### Guest Counter vs Guest Filter

**IMPORTANT:** These are **two related but distinct components** that work together:

#### 1. Guest Counter (`guestCounter.js`)
**Purpose:** UI component for selecting number of guests  
**Location:** `src/js/guestCounter.js`  
**Responsibilities:**
- Render increment/decrement buttons
- Display current guest count (e.g., "👥 2 pessoas")
- Manage guest selection state
- Trigger filter updates when count changes
- **FR-004A:** Guest Filter State Management

**Key Functions:**
```javascript
GuestFilterStateManager.init()
GuestFilterStateManager.enable()
GuestFilterStateManager.disable()
```

**What it does:**
- Shows the guest counter UI card
- Handles enable/disable states
- Updates visual feedback (enabled/disabled styling)

#### 2. Guest Number Filter (`guestNumberFilter.js`)
**Purpose:** Business logic for filtering results  
**Location:** `src/js/guestNumberFilter.js`  
**Responsibilities:**
- Parse room capacity from API results ("até N pessoas")
- Filter/hide rooms that don't match guest count
- Update result statistics (visible/total hotels)
- Apply filtering logic to DOM elements
- **FR-004B:** Client-Side Guest Number Filtering

**Key Functions:**
```javascript
GuestNumberFilter.applyFilter(selectedCount)
GuestNumberFilter.parseCapacity(text)
GuestNumberFilter.updateStatistics()
```

**What it does:**
- Reads current guest count
- Compares with room capacities
- Shows/hides vacancy cards
- Updates "Showing X of Y" count

#### Relationship

```
┌─────────────────────────────────────┐
│   Guest Counter (guestCounter.js)   │
│   - UI Component                    │
│   - User Interaction                │
│   - State Management (FR-004A)      │
└──────────────┬──────────────────────┘
               │ User clicks +/-
               │ Guest count changes
               ▼
┌─────────────────────────────────────┐
│  Guest Filter (guestNumberFilter.js)│
│  - Business Logic                   │
│  - Result Filtering                 │
│  - DOM Manipulation (FR-004B)       │
└─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Filtered Results (DOM)             │
│  - Only matching rooms visible      │
│  - "Showing X of Y hotels"          │
└─────────────────────────────────────┘
```

**Summary:**
- **Guest Counter** = UI for selecting guest count
- **Guest Filter** = Logic for filtering results
- **Both work together** to provide the complete feature

---

## Feature Requirements

### FR-004: Guest-Based Filtering

**FR-004A: Guest Filter State Management**
- Manages visual state of guest counter UI
- Enable/disable filter card
- Visual feedback (styling, aria attributes)
- **Implemented in:** `guestCounter.js`

**FR-004B: Client-Side Guest Number Filtering**
- Actual filtering logic
- Capacity parsing from text
- Show/hide vacancy cards
- Statistics updates
- **Implemented in:** `guestNumberFilter.js`

### FR-008A: Search Lifecycle UI State Management
- Controls when guest counter appears
- Manages transitions between search states
- **States:** initial, searching, results, error
- **Implemented in:** `searchLifecycleState.js`

### FR-014: Booking Rules Toggle Feature
- Enable/disable booking validation rules
- API parameter: `applyBookingRules`
- Toggle switch UI component
- **Implemented in:** `hotelSearch.js`, API client

---

## UI Elements

### Button Terminology

| Element | ID | Label | Purpose |
|---------|-----|-------|---------|
| **Search Button** | `search-btn` | "Buscar Vagas" | Initiate hotel search |
| **Reset Button** | `reset-btn` | "Reset" | Clear results, return to initial state |
| **Guest Counter Buttons** | `decrement-btn`, `increment-btn` | "-", "+" | Adjust guest count |

**Important:** The button previously called "Start New Search" is now called **"Reset"** (v2.0.1+)

### Cards and Containers

| Element | ID | Description |
|---------|-----|-------------|
| **Guest Filter Card** | `guest-filter-card` | Guest counter UI container |
| **Results Container** | `results` | API search results display |
| **Error Container** | `error` | Error message display |
| **Loading Indicator** | `loading` | Spinner during API calls |

---

## API Terminology

### Endpoints

| Name | URL | Purpose |
|------|-----|---------|
| **Health Check** | `/health` | API status verification |
| **Hotels List** | `/vagas/hoteis` | Get all available hotels |
| **Date Range Search** | `/vagas/:hotel/:checkin/:checkout` | Search by date range |
| **Weekend Search** | `/vagas-fds/:hotel/:checkin/:qtd_fds` | Search by weekend count |

### Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `hotel` | string | Hotel ID or "-1" (all) | "hotel-guaruja" |
| `checkin` | string | ISO date (YYYY-MM-DD) | "2024-12-25" |
| `checkout` | string | ISO date (YYYY-MM-DD) | "2024-12-27" |
| `qtd_fds` | number | Weekend count (1-12) | 3 |
| `applyBookingRules` | boolean | Enable booking rules | true |

### Response Properties

| Property | Type | Description |
|----------|------|-------------|
| `success` | boolean | Request success status |
| `data` | object | Response data payload |
| `message` | string | Status/error message |
| `vacancies` | array | List of available rooms |
| `hotel_name` | string | Hotel name |

---

## State Management

### Search Lifecycle States

| State | Description | Visible Elements |
|-------|-------------|------------------|
| **initial** | Before first search | Search form only |
| **searching** | API call in progress | Loading indicator, disabled search button |
| **results** | Results received | Search form, guest counter, results, reset button |
| **error** | API error occurred | Error message, search form, reset button |

### Guest Filter States

| State | Description | Visual Indicators |
|-------|-------------|------------------|
| **disabled** | Not active (no results) | Gray styling, aria-disabled="true" |
| **enabled** | Active (results visible) | Normal styling, aria-disabled="false" |

---

## Common Confusions

### 1. "Guest Counter" vs "Guest Filter"

❌ **Wrong:** "Guest counter filters the results"  
✅ **Correct:** "Guest counter lets user select count; guest filter applies filtering logic"

❌ **Wrong:** "These are the same component"  
✅ **Correct:** "Two separate modules that work together"

### 2. "Reset" vs "Start New Search"

❌ **Wrong:** "Start New Search button"  
✅ **Correct:** "Reset button" (renamed in v2.0.1)

**What it does:**
- Clears results
- Returns to initial state
- Does NOT submit a new search
- User must click "Buscar Vagas" to search again

### 3. "Search Button" vs "Reset Button"

| Button | Label | Action | When Visible |
|--------|-------|--------|--------------|
| **Search Button** | "Buscar Vagas" | Submit search form | Always |
| **Reset Button** | "Reset" | Clear results, reset state | After search (results/error states) |

### 4. "API Client" vs "ibira.js"

❌ **Wrong:** "ibira.js is the API client"  
✅ **Correct:** "ibira.js is the HTTP library; API client uses ibira.js"

**Relationship:**
```
apiClient.js (BuscaVagasAPIClient)
    └── Uses ibira.js (IbiraAPIFetchManager)
        └── Makes HTTP requests to Busca Vagas API
```

### 5. "Caching" - Multiple Layers

| Cache | Location | TTL | Purpose |
|-------|----------|-----|---------|
| **Hotel List Cache** | LocalStorage | 24 hours | Avoid re-fetching hotel dropdown |
| **API Response Cache** | ibira.js (in-memory) | 5 minutes | Reduce redundant API calls |
| **Browser Cache** | Browser | Varies | Static assets (CSS, JS) |

### 6. "State" vs "State Management"

❌ **Wrong:** "State management is just CSS classes"  
✅ **Correct:** "State management includes: DOM state, CSS classes, aria attributes, and data state"

**Components:**
- **Visual State:** CSS classes, visibility
- **Accessibility State:** ARIA attributes
- **Data State:** JavaScript variables
- **Lifecycle State:** initial → searching → results → error

---

## Module Naming Patterns

### File Naming Convention

| Pattern | Example | Purpose |
|---------|---------|---------|
| `camelCase.js` | `guestCounter.js` | UI component modules |
| `camelCase.js` | `apiClient.js` | Service modules |
| `SCREAMING_SNAKE_CASE.md` | `FUNCTIONAL_REQUIREMENTS.md` | Documentation |
| `kebab-case.html` | `test-api-integration.html` | HTML files |

### Variable Naming

| Pattern | Example | Usage |
|---------|---------|-------|
| `camelCase` | `guestCount` | Variables, functions |
| `PascalCase` | `GuestNumberFilter` | Classes, constructors |
| `SCREAMING_SNAKE_CASE` | `API_BASE_URL` | Constants |
| `kebab-case` | `guest-filter-card` | HTML IDs, CSS classes |

---

## Quick Reference

### When to Use Each Term

| Context | Use This Term | Not This |
|---------|---------------|----------|
| UI component for selecting guests | Guest Counter | Guest Filter |
| Logic for filtering results | Guest Filter | Guest Counter |
| Both together (feature) | Guest-Based Filtering (FR-004) | N/A |
| Button to clear results | Reset button | Start New Search |
| Button to search | Search button | Submit button |
| HTTP library | ibira.js | API client |
| Application API wrapper | API Client | ibira.js |

---

## Related Documentation

- **[Functional Requirements](./features/FUNCTIONAL_REQUIREMENTS.md)** - All feature specifications
- **[FR-004A Implementation](./features/FR-004A-IMPLEMENTATION.md)** - Guest counter details
- **[FR-004B Implementation](./features/FR-004B-QUICK-REFERENCE.md)** - Filter logic details
- **[Architecture Overview](./architecture/ARCHITECTURE_OVERVIEW.md)** - System design
- **[API Documentation](./api/API_DOCUMENTATION.md)** - API reference

---

## Version History

### v2.2.0 (2024-12-22)
- Added FR-014 terminology (Booking Rules Toggle)
- Updated API parameter names

### v2.0.1 (2024-12-17)
- Renamed "Start New Search" → "Reset"
- Clarified state-driven UI pattern

### v2.0.0 (2024-12-16)
- Major restructure
- Guest counter/filter separation documented

---

**Need clarification?** Check related documentation or ask in GitHub Issues.

**Last Updated:** 2024-12-22  
**Author:** Monitora Vagas Development Team
