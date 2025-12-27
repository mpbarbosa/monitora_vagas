# Skeleton Screen Implementation

## Overview
Skeleton screens provide content-shaped placeholders during loading states to improve perceived performance and user experience.

## Implementation Date
December 26, 2024

## Files Created
1. **`src/styles/components/skeleton.css`** - Skeleton screen styles
2. **`src/js/skeletonLoader.js`** - Skeleton screen JavaScript module

## Files Modified
1. **`src/styles/main.css`** - Added import for skeleton.css
2. **`src/js/hotelSearch.js`** - Integrated skeleton loader into search flow

## Features

### 1. Skeleton Components
- **Hotel Card Skeleton**: Mimics the structure of hotel result cards
- **Counter Skeleton**: Placeholder for results counter
- **Text Skeletons**: Various sizes (short, medium, long, full, title)
- **Badge Skeletons**: For status badges
- **Button Skeletons**: For action buttons

### 2. Animations
- Smooth shimmer effect (left-to-right gradient animation)
- Fade-in animation when skeleton appears
- Respects `prefers-reduced-motion` accessibility preference

### 3. Dark Mode Support
- Automatic color adjustment based on `prefers-color-scheme`
- Manual theme toggle support via `data-theme="dark"`

### 4. Responsive Design
- Mobile-optimized layouts
- Grid adjustments for smaller screens
- Proper spacing and padding

## Usage

### Basic Usage
```javascript
import { showResultsSkeleton, hideResultsSkeleton } from './skeletonLoader.js';

// Show skeleton during loading
const container = document.getElementById('results-container');
showResultsSkeleton(container, 3); // Show 3 skeleton cards

// Hide skeleton when data is ready
hideResultsSkeleton(container);
```

### Integration in Search Flow
```javascript
// Before API call
showResultsSkeleton(resultsContainer, 3);

try {
    const results = await apiClient.searchVacancies(...);
    hideResultsSkeleton(resultsContainer);
    displayResults(results);
} catch (error) {
    hideResultsSkeleton(resultsContainer);
    showError(error);
}
```

### Using withSkeleton Wrapper
```javascript
import { withSkeleton } from './skeletonLoader.js';

const results = await withSkeleton(
    container,
    () => apiClient.searchVacancies(...),
    {
        skeletonType: 'results',
        cardCount: 3,
        onError: (error) => showError(error)
    }
);
```

## API Reference

### Functions

#### `createHotelCardsSkeleton(count = 3)`
Creates HTML for hotel card skeletons.
- **Parameters**: `count` - Number of skeleton cards (default: 3)
- **Returns**: HTML string

#### `createCounterSkeleton()`
Creates HTML for results counter skeleton.
- **Returns**: HTML string

#### `showResultsSkeleton(container, cardCount = 3)`
Shows skeleton in results container.
- **Parameters**:
  - `container` - HTMLElement to show skeleton in
  - `cardCount` - Number of skeleton cards (default: 3)

#### `hideResultsSkeleton(container)`
Hides skeleton from results container.
- **Parameters**: `container` - HTMLElement containing skeleton

#### `withSkeleton(container, asyncOperation, options)`
Wrapper to show skeleton during async operation.
- **Parameters**:
  - `container` - HTMLElement
  - `asyncOperation` - Async function to execute
  - `options` - Configuration object
- **Returns**: Promise with operation result

## CSS Classes

### Base Classes
- `.skeleton` - Base skeleton class with shimmer animation
- `.skeleton-container` - Container with fade-in animation

### Component Classes
- `.skeleton-hotel-card` - Hotel card structure
- `.skeleton-hotel-card__header` - Card header section
- `.skeleton-hotel-card__badges` - Badge area
- `.skeleton-hotel-card__info` - Info grid section
- `.skeleton-hotel-card__footer` - Card footer

### Utility Classes
- `.skeleton-text` - Text line placeholder
- `.skeleton-text--title` - Title text (60% width, 1.5em height)
- `.skeleton-text--short` - Short text (40% width)
- `.skeleton-text--medium` - Medium text (60% width)
- `.skeleton-text--long` - Long text (80% width)
- `.skeleton-text--full` - Full width text
- `.skeleton-avatar` - Circular avatar (48x48px)
- `.skeleton-button` - Button placeholder (100px x 38px)
- `.skeleton-badge` - Badge placeholder (60px x 24px)

## Accessibility

### Screen Reader Support
- `role="status"` on skeleton containers
- `aria-label` describing loading state
- `.visually-hidden` text for screen readers
- `aria-busy="true"` on containers during loading

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
    .skeleton {
        animation: none;
        background: var(--skeleton-base);
    }
}
```

## Performance Considerations

1. **CSS Animations**: GPU-accelerated `background-position` animation
2. **Minimal DOM**: Reuses existing container elements
3. **No JavaScript Animation**: Pure CSS for better performance
4. **Lazy Loading**: Skeleton shown only when needed

## Benefits

### User Experience
- **Better Perceived Performance**: Content appears to load faster
- **Reduced Cognitive Load**: Shows expected content structure
- **Professional Appearance**: Modern, polished loading state
- **Context Awareness**: Users know what content is coming

### Technical
- **Non-Blocking**: Pure CSS animations
- **Accessible**: Screen reader compatible
- **Responsive**: Works on all screen sizes
- **Themeable**: Supports light/dark modes

## Best Practices

1. **Match Content Structure**: Skeleton should mirror actual content layout
2. **Appropriate Timing**: Show for operations taking >300ms
3. **Smooth Transitions**: Fade out skeleton, fade in content
4. **Accessible Labels**: Always include ARIA labels
5. **Consistent Count**: Show expected number of items

## Testing

### Manual Testing
1. Slow network simulation (DevTools Network throttling)
2. Verify skeleton appears during search
3. Check responsive behavior on mobile
4. Test dark mode appearance
5. Verify accessibility with screen reader

### Integration Points
- Hotel search form submission
- Initial hotel list loading (future)
- Guest filter application (future)

## Future Enhancements

1. **Skeleton for Hotel Select**: Show skeleton while loading hotel list
2. **Dynamic Sizing**: Adjust skeleton count based on viewport
3. **Partial Loading**: Show skeletons for individual cards
4. **Staggered Animation**: Cards appear sequentially
5. **Custom Shapes**: More skeleton types for different components

## Related Documentation
- `docs/features/PROGRESS_INDICATORS.md`
- `docs/features/OPTIMISTIC_UI.md`
- `docs/styling/RESPONSIVE_DESIGN.md`
- `.github/MOBILE_FIRST_GUIDE.md`

## Notes
- Replaces "Loading..." text with visual placeholders
- Combines well with progress indicators
- Part of broader UX improvement initiative
- Follows industry best practices (Facebook, LinkedIn style)
