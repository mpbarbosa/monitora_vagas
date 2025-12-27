# Skeleton Screens - Quick Reference

## Import
```javascript
import { 
    showResultsSkeleton, 
    hideResultsSkeleton,
    createHotelCardsSkeleton,
    withSkeleton 
} from './skeletonLoader.js';
```

## Basic Usage

### Show/Hide Pattern
```javascript
// Show skeleton
const container = document.getElementById('results-container');
showResultsSkeleton(container, 3); // 3 skeleton cards

try {
    const data = await fetchData();
    hideResultsSkeleton(container);
    displayData(data);
} catch (error) {
    hideResultsSkeleton(container);
    showError(error);
}
```

### Wrapper Pattern
```javascript
const data = await withSkeleton(
    container,
    () => fetchData(),
    { 
        skeletonType: 'results',
        cardCount: 3,
        onError: handleError
    }
);
```

## CSS Classes

### Base
- `.skeleton` - Shimmer animation
- `.skeleton-container` - Fade-in wrapper

### Components
- `.skeleton-hotel-card` - Full card
- `.skeleton-text` - Text line
- `.skeleton-avatar` - Circle (48px)
- `.skeleton-button` - Button (100x38px)
- `.skeleton-badge` - Badge (60x24px)

### Modifiers
- `.skeleton-text--title` - 60% width, 1.5em
- `.skeleton-text--short` - 40% width
- `.skeleton-text--medium` - 60% width
- `.skeleton-text--long` - 80% width
- `.skeleton-text--full` - 100% width

## API

### `showResultsSkeleton(container, cardCount)`
Shows skeleton loading state in results.

### `hideResultsSkeleton(container)`
Removes skeleton loading state.

### `createHotelCardsSkeleton(count)`
Generates HTML for skeleton cards.

### `withSkeleton(container, asyncOp, options)`
Wraps async operation with skeleton handling.

## Accessibility

```html
<div class="skeleton" role="status" aria-label="Carregando">
    <span class="visually-hidden">Carregando dados...</span>
</div>
```

## Dark Mode

Automatic:
```css
@media (prefers-color-scheme: dark) { /* ... */ }
```

Manual:
```css
[data-theme="dark"] .skeleton { /* ... */ }
```

## Performance

- Pure CSS animation (GPU-accelerated)
- No JavaScript overhead
- ~11.5KB total size
- 60 FPS smooth animation

## Browser Support
Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Full Documentation
See `docs/features/SKELETON_SCREENS.md`
