# Contextual Help Tooltip System

## Overview

The Contextual Help system provides accessible, non-intrusive help tooltips for complex UI elements. Users can access explanatory information without cluttering the interface.

**Version**: 1.0.0  
**Since**: v2.3.0  
**Status**: ✅ Implemented

## Features

### Visual Design
- **Help Icons**: Small circular "?" icons next to form labels
- **Bootstrap Tooltips**: Powered by Bootstrap 5.3.3 tooltip component
- **Responsive**: Optimized for mobile and desktop
- **Accessible**: Full keyboard navigation and screen reader support

### User Experience
- **Hover**: Display tooltip on mouse hover (300ms delay)
- **Focus**: Display tooltip when focused via keyboard
- **Auto-dismiss**: Tooltip hides when focus/hover is removed
- **Touch-friendly**: Larger touch targets on mobile (22x22px)

## Implementation

### Files

```
src/
├── js/
│   └── contextualHelp.js        # Main module
└── styles/
    └── components/
        └── help-tooltip.css     # Tooltip styles
```

### HTML Integration

The system is automatically initialized when the DOM loads. No manual initialization required.

```html
<!-- CSS -->
<link href="../src/styles/components/help-tooltip.css" rel="stylesheet">

<!-- JavaScript (ES6 Module) -->
<script type="module" src="../src/js/contextualHelp.js"></script>
```

### Help Content Locations

Current help tooltips are added to:

1. **Guest Counter** - Explains guest selection functionality
2. **Booking Rules Toggle** - Describes rule filtering behavior
3. **Check-In Date** - Provides date selection guidance
4. **Check-Out Date** - Explains date constraints

## Usage

### Adding New Help Content

Edit `HELP_CONTENT` in `contextualHelp.js`:

```javascript
const HELP_CONTENT = {
    myNewField: {
        title: 'Field Title',
        text: 'Detailed explanation of what this field does and how to use it.'
    }
};
```

Then add the help icon in `initializeContextualHelp()`:

```javascript
addHelpIcon('my-field-id', 'myNewField');
// For checkboxes:
addHelpIcon('my-checkbox-id', 'myNewField', true);
```

### API

#### `initializeContextualHelp()`
Auto-initializes all help tooltips when DOM is ready.

#### `cleanupContextualHelp()`
Disposes all Bootstrap tooltip instances. Called automatically on page unload.

#### `addHelpIcon(targetId, helpKey, isCheckbox)`
Adds a help icon to a form element.

**Parameters**:
- `targetId` (string): Element ID or parent container ID
- `helpKey` (string): Key to lookup help content
- `isCheckbox` (boolean): Special placement for checkbox labels

## Styling

### CSS Classes

- `.help-icon` - Base help icon style
- `.help-icon-light` - Variant for light backgrounds
- `.help-tooltip` - Custom Bootstrap tooltip styling

### Customization

Override CSS variables or classes in your custom stylesheet:

```css
.help-icon {
    background-color: var(--your-brand-color);
}

.help-tooltip .tooltip-inner {
    max-width: 320px; /* Wider tooltips */
}
```

## Accessibility

### WCAG 2.1 Compliance
- ✅ **Keyboard Accessible**: Full tab navigation
- ✅ **Screen Readers**: `aria-label` on help icons
- ✅ **Focus Visible**: Clear focus indicators
- ✅ **Touch Targets**: 44x44px minimum on mobile (Level AAA)

### Keyboard Navigation
- `Tab` - Focus help icon
- `Enter/Space` - Show tooltip (via focus)
- `Esc` - Hide tooltip
- `Tab` away - Auto-hide tooltip

### Screen Reader Support
```html
<span role="button" 
      tabindex="0" 
      aria-label="Ajuda: Contador de Hóspedes">
    ?
</span>
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires Bootstrap 5.3.3 for tooltip functionality.

## Performance

- **Lazy Loading**: Tooltips initialized only when needed
- **Cleanup**: Automatic disposal on page unload
- **Lightweight**: ~5KB total (CSS + JS)

## Testing

### Manual Testing
1. Hover over "?" icon → Tooltip appears
2. Tab to "?" icon → Tooltip appears on focus
3. Press Esc → Tooltip disappears
4. Resize to mobile → Larger touch targets
5. Test with screen reader → Announces help content

### Automated Testing
```javascript
// Example test
test('Help icon has accessible label', () => {
    const helpIcon = document.querySelector('.help-icon');
    expect(helpIcon.getAttribute('aria-label')).toContain('Ajuda:');
});
```

## Future Enhancements

- [ ] More help content for additional fields
- [ ] Rich HTML tooltips with links/formatting
- [ ] Tooltip positioning logic for edge cases
- [ ] Analytics tracking (help icon clicks)
- [ ] Multilingual support

## Related Documentation

- [Accessibility Guide](../guides/ACCESSIBILITY_GUIDE.md)
- [Bootstrap 5 Tooltips](https://getbootstrap.com/docs/5.3/components/tooltips/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

For issues or questions:
- **Bug Reports**: GitHub Issues
- **Feature Requests**: GitHub Issues with "enhancement" label
