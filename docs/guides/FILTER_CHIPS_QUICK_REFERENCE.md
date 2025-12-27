# Filter Chips - Quick Reference

## What Are Filter Chips?

Visual badges that show active search filters above results. Users can click to remove individual filters or clear all at once.

## Files

- **Module**: `src/js/filterChips.js`
- **Styles**: `src/styles/components/filter-chips.css`
- **Test**: `test_filter_chips.html`
- **Docs**: `FILTER_CHIPS_IMPLEMENTATION.md`

## Quick Start

```javascript
import { filterChips } from './filterChips.js';

// 1. Initialize once
filterChips.initialize();

// 2. Add filter chip
filterChips.addChip(
    'unique-key',      // Unique ID
    'Label',           // Display label
    'Value',           // Display value
    () => {            // Remove callback
        console.log('Removed!');
    }
);

// 3. Remove chip
filterChips.removeChip('unique-key');

// 4. Clear all
filterChips.clearAll();
```

## API Methods

| Method | Description |
|--------|-------------|
| `initialize()` | Initialize filter chips (call once) |
| `addChip(key, label, value, onRemove)` | Add or update a filter chip |
| `removeChip(key)` | Remove specific chip |
| `updateChip(key, newValue)` | Update chip value |
| `clearAll()` | Remove all chips |
| `hasFilter(key)` | Check if filter exists |
| `getActiveFilters()` | Get all active filters (Map) |

## Active Filters

The system automatically creates chips for:

1. **Hotel**: When specific hotel selected
2. **Dates**: Check-in to check-out range
3. **Guests**: When guest count filter applied
4. **Booking Rules**: When rules disabled

## User Actions

- **Remove Single**: Click × on chip
- **Remove All**: Click "Limpar Todos"
- **View Active**: Chips always visible above results

## Styling

Chips use Bootstrap primary color (blue) with white text. CSS variables support dark mode and high contrast themes.

## Testing

Open `test_filter_chips.html` in browser to test functionality.

## Accessibility

- Full keyboard navigation
- Screen reader support
- WCAG 2.1 Level AA compliant
- Touch targets: 44x44px on mobile

## Browser Support

- Chrome, Firefox, Safari, Edge
- ES6 modules required
- Modern CSS (Flexbox, Grid)

## Integration Example

```javascript
// In hotelSearch.js displayResults()
filterChips.initialize();

// Add hotel filter
if (hotel !== '-1') {
    filterChips.addChip('hotel', 'Hotel', hotelName, () => {
        document.getElementById('hotel-select').value = '';
    });
}

// Add date filter
filterChips.addChip('dates', 'Período', 
    `${formatDate(checkin)} - ${formatDate(checkout)}`,
    () => {
        document.getElementById('input-checkin').focus();
    }
);
```

## Troubleshooting

**Chips not appearing?**
- Check `filterChips.initialize()` called
- Verify container exists: `#filter-chips-container`
- Check CSS loaded: `filter-chips.css`

**Callback not working?**
- Verify callback is a function
- Check for JS errors in console
- Test with `console.log()` in callback

**Styling issues?**
- Check CSS loaded after Bootstrap
- Verify no conflicting styles
- Test dark mode separately

## Version

**v2.2.0** - Initial implementation (2024-12-27)
