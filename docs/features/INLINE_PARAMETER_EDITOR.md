# Inline Parameter Editor - Implementation Guide

## Overview

The **Inline Parameter Editor** feature allows users to modify search parameters (hotel, check-in date, check-out date, and booking rules) directly from the results view without returning to the search form. This improves user experience by enabling quick refinement of search criteria.

## Feature ID

**FR-016**: Inline Parameter Editing

## Components

### 1. JavaScript Module
- **File**: `src/js/inlineParameterEditor.js`
- **Class**: `InlineParameterEditor`
- **Export**: `inlineEditor` (singleton instance)

### 2. CSS Styles
- **File**: `src/styles/components/inline-editor.css`
- **Features**:
  - Responsive design (mobile-first)
  - Dark mode support
  - Smooth animations and transitions
  - WCAG accessibility compliant

### 3. Integration
- **Modified**: `src/js/hotelSearch.js`
  - Imports `inlineEditor`
  - Initializes editor after search results
  - Refactored search logic into `performSearch()` function
  - Added `handleInlineParamChange()` callback

## User Interface

### Visual Design

```
┌────────────────────────────────────────────────────┐
│ ⚙️ Refinar Busca                            [^]   │
├────────────────────────────────────────────────────┤
│ [Hotel Select ▼] [Check-In] [Check-Out] [Aplicar] │
│ □ Aplicar regras de reserva                        │
└────────────────────────────────────────────────────┘
```

### Features

1. **Collapsible Header**: Click toggle button to expand/collapse
2. **Hotel Dropdown**: Synced with main form
3. **Date Inputs**: HTML5 date pickers
4. **Booking Rules Checkbox**: Toggle booking rules validation
5. **Apply Button**: Triggers new search with updated parameters

## API

### Initialization

```javascript
import { inlineEditor } from './inlineParameterEditor.js';

// Initialize with current parameters and callback
inlineEditor.init(params, onParamChangeCallback);

// Render in results container
inlineEditor.render(resultsContainer);
```

### Parameters Object

```javascript
const params = {
    hotel: string,           // Hotel ID or empty string
    checkin: string,         // ISO date string (YYYY-MM-DD)
    checkout: string,        // ISO date string (YYYY-MM-DD)
    applyBookingRules: boolean  // Whether to apply booking rules
};
```

### Callback Function

The callback is invoked when user clicks "Apply" button:

```javascript
async function handleInlineParamChange(newParams) {
    // Update main form fields
    // Perform new search
    // Return promise for async handling
    return performSearch(...);
}
```

## State Management

### Synchronization

The inline editor automatically:
1. Clones hotel dropdown options from main form
2. Updates main form fields when parameters change
3. Maintains consistency between form and editor

### Update Mechanism

```javascript
// Update editor with new parameters (e.g., from main form)
inlineEditor.updateParams(newParams);
```

## User Flow

1. **Initial State**: Editor hidden until first search
2. **After Search**: Editor appears above results with current parameters
3. **User Modifies**: User changes hotel, dates, or rules
4. **Apply Changes**: User clicks "Aplicar" button
5. **Validation**: Parameters validated (same as main form)
6. **New Search**: Search executed with new parameters
7. **Results Update**: Results refresh with skeleton loading

## Visual Feedback

### Loading States

- **Button Disabled**: During search execution
- **Spinner Icon**: `<i class="fa fa-spinner fa-spin"></i>`
- **Success State**: ✓ icon with "Aplicado!" message
- **Error State**: ⚠️ icon with "Erro" message

### Animations

- **Collapse/Expand**: Smooth height transition (300ms)
- **Opacity Fade**: Content fade in/out (300ms)
- **Button States**: Transform scale on hover/active

## Accessibility

### ARIA Attributes

```html
<div role="region" aria-label="Editor de parâmetros de busca">
    <button aria-expanded="true" aria-controls="inline-editor-content">
        Toggle Editor
    </button>
    <div id="inline-editor-content">
        <!-- Editor controls -->
    </div>
</div>
```

### Keyboard Support

- **Tab Navigation**: All controls focusable in logical order
- **Enter Key**: Apply changes (in date inputs)
- **Space/Enter**: Toggle collapse button
- **Escape**: (Future) Close editor

## Responsive Design

### Mobile (< 768px)

- Full-width controls stacked vertically
- Larger touch targets (44x44px minimum)
- Reduced padding for compact layout

### Desktop (≥ 768px)

- Horizontal layout with grid columns
- Inline form controls
- Hover effects on buttons

## Dark Mode Support

Automatically adapts to `prefers-color-scheme: dark`:

- Dark background: `#2b3035`
- Light text: `#e9ecef`
- Dark input fields: `#1a1d20`
- Maintained contrast ratios (WCAG AA)

## Integration Example

```javascript
// In hotelSearch.js displayResults()
function displayResults(apiResponse, checkin, checkout, hotel) {
    // ... existing code ...

    // Initialize inline editor
    const currentParams = {
        hotel: hotel,
        checkin: checkin,
        checkout: checkout,
        applyBookingRules: document.getElementById('apply-booking-rules')?.checked ?? true
    };
    
    inlineEditor.init(currentParams, handleInlineParamChange);
    inlineEditor.render(resultsContainer);
}

// Callback handler
async function handleInlineParamChange(newParams) {
    // Sync main form
    document.getElementById('hotel-select').value = newParams.hotel || '';
    document.getElementById('input-checkin').value = newParams.checkin;
    document.getElementById('input-checkout').value = newParams.checkout;
    document.getElementById('apply-booking-rules').checked = newParams.applyBookingRules;

    // Perform new search
    return performSearch(
        newParams.hotel || '-1',
        newParams.checkin,
        newParams.checkout,
        newParams.applyBookingRules
    );
}
```

## Error Handling

### Validation Errors

- Uses existing `formValidator` service
- Displays inline error messages
- Prevents search if validation fails

### Network Errors

- Shows error in button state
- Displays toast notification
- Maintains editor state for retry

### Edge Cases

- **No Hotel Selected**: Defaults to all hotels (`-1`)
- **Same Parameters**: No search triggered (optimization)
- **Missing Elements**: Gracefully handles missing DOM elements

## Performance Considerations

1. **Lazy Rendering**: Editor only created after first search
2. **Event Delegation**: Minimal event listeners
3. **Debounced Updates**: Future enhancement for auto-apply
4. **DOM Efficiency**: Reuses existing hotel options

## Testing

### Manual Testing

1. Perform initial search
2. Verify editor appears above results
3. Modify parameters in editor
4. Click "Aplicar" button
5. Confirm search executes with new parameters
6. Verify results update correctly

### Unit Tests (Future)

```javascript
// Example test cases
describe('InlineParameterEditor', () => {
    test('renders editor with current parameters', () => {});
    test('detects parameter changes', () => {});
    test('triggers callback on apply', () => {});
    test('syncs with main form', () => {});
    test('handles validation errors', () => {});
});
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **IE11**: Not supported (ES6 modules required)
- **Mobile**: iOS Safari 12+, Android Chrome 80+

## Future Enhancements

1. **Auto-Apply**: Debounced automatic search on parameter change
2. **Preset Filters**: Quick filter buttons (e.g., "Next Weekend")
3. **History**: Recently used parameter sets
4. **Comparison**: Compare multiple parameter sets side-by-side
5. **Keyboard Shortcuts**: `Alt+E` to focus editor

## Related Documentation

- [Form Validation](./FORM_VALIDATION.md)
- [Search Lifecycle States](./SEARCH_LIFECYCLE_STATES.md)
- [Accessibility Guidelines](./ACCESSIBILITY_GUIDELINES.md)
- [Mobile-First Design](./MOBILE_FIRST_DESIGN.md)

## Changelog

### Version 2.2.0 (2024-12-26)

- Initial implementation of inline parameter editor
- Integration with hotel search workflow
- Mobile-responsive design
- Dark mode support
- ARIA accessibility attributes

---

**Status**: ✅ Implemented  
**Version**: 2.2.0  
**Last Updated**: 2024-12-26
