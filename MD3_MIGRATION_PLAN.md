# Material Design 3 - Full Migration Plan

**Date:** 2024-12-03  
**Option:** Full MD3 Migration (Option 1)  
**Timeline:** 2-3 days  
**Status:** 🚀 In Progress

---

## 📋 Migration Checklist

### Phase 1: Setup & Dependencies ✅
- [x] Install Material Web Components
- [x] Add Material Symbols font
- [x] Configure MD3 color system
- [x] Setup CSS custom properties (design tokens)

### Phase 2: Component Migration 🔄
- [ ] Replace select dropdown with MD3 Select
- [ ] Replace text inputs with MD3 TextField (Filled variant)
- [ ] Replace buttons with MD3 Button (Filled variant)
- [ ] Implement guest counter with MD3 components
- [ ] Update results display with MD3 Card

### Phase 3: Styling & Theme 🔄
- [ ] Implement MD3 typography scale
- [ ] Add state layers (hover, focus, pressed)
- [ ] Implement elevation system
- [ ] Add proper spacing using MD3 tokens
- [ ] Implement dynamic color theming

### Phase 4: Icons & Assets 
- [ ] Replace Material Design Iconic Font with Material Symbols
- [ ] Update all icon references
- [ ] Ensure proper icon sizing

### Phase 5: Testing & Validation
- [ ] Test all form interactions
- [ ] Verify API integration still works
- [ ] Test responsive behavior
- [ ] Validate accessibility (ARIA)
- [ ] Browser compatibility testing

---

## 🎨 MD3 Design System

### Color Tokens
```css
:root {
  /* Primary */
  --md-sys-color-primary: #6750A4;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #EADDFF;
  --md-sys-color-on-primary-container: #21005D;
  
  /* Secondary */
  --md-sys-color-secondary: #625B71;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #E8DEF8;
  --md-sys-color-on-secondary-container: #1D192B;
  
  /* Surface */
  --md-sys-color-surface: #FFFBFE;
  --md-sys-color-on-surface: #1C1B1F;
  --md-sys-color-surface-variant: #E7E0EC;
  --md-sys-color-on-surface-variant: #49454F;
  
  /* Background */
  --md-sys-color-background: #FFFBFE;
  --md-sys-color-on-background: #1C1B1F;
  
  /* Error */
  --md-sys-color-error: #B3261E;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #F9DEDC;
  --md-sys-color-on-error-container: #410E0B;
  
  /* Outline */
  --md-sys-color-outline: #79747E;
  --md-sys-color-outline-variant: #CAC4D0;
}
```

### Typography Scale
```css
:root {
  /* Display */
  --md-sys-typescale-display-large: 57px/64px Roboto;
  --md-sys-typescale-display-medium: 45px/52px Roboto;
  --md-sys-typescale-display-small: 36px/44px Roboto;
  
  /* Headline */
  --md-sys-typescale-headline-large: 32px/40px Roboto;
  --md-sys-typescale-headline-medium: 28px/36px Roboto;
  --md-sys-typescale-headline-small: 24px/32px Roboto;
  
  /* Title */
  --md-sys-typescale-title-large: 22px/28px Roboto;
  --md-sys-typescale-title-medium: 16px/24px Roboto 500;
  --md-sys-typescale-title-small: 14px/20px Roboto 500;
  
  /* Body */
  --md-sys-typescale-body-large: 16px/24px Roboto;
  --md-sys-typescale-body-medium: 14px/20px Roboto;
  --md-sys-typescale-body-small: 12px/16px Roboto;
  
  /* Label */
  --md-sys-typescale-label-large: 14px/20px Roboto 500;
  --md-sys-typescale-label-medium: 12px/16px Roboto 500;
  --md-sys-typescale-label-small: 11px/16px Roboto 500;
}
```

### Elevation Levels
```css
:root {
  --md-sys-elevation-level0: 0px 0px 0px 0px rgba(0,0,0,0);
  --md-sys-elevation-level1: 0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15);
  --md-sys-elevation-level2: 0px 1px 2px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15);
  --md-sys-elevation-level3: 0px 1px 3px 0px rgba(0,0,0,0.3), 0px 4px 8px 3px rgba(0,0,0,0.15);
  --md-sys-elevation-level4: 0px 2px 3px 0px rgba(0,0,0,0.3), 0px 6px 10px 4px rgba(0,0,0,0.15);
  --md-sys-elevation-level5: 0px 4px 4px 0px rgba(0,0,0,0.3), 0px 8px 12px 6px rgba(0,0,0,0.15);
}
```

### Shape Tokens
```css
:root {
  --md-sys-shape-corner-none: 0px;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-full: 9999px;
}
```

---

## 🔧 Implementation Details

### 1. Material Web Components Setup

**Import Method:**
```html
<!-- Use CDN for Material Web Components -->
<script type="importmap">
{
  "imports": {
    "@material/web/": "https://esm.run/@material/web/"
  }
}
</script>

<!-- Import specific components -->
<script type="module">
  import '@material/web/button/filled-button.js';
  import '@material/web/button/outlined-button.js';
  import '@material/web/textfield/filled-text-field.js';
  import '@material/web/select/filled-select.js';
  import '@material/web/select/select-option.js';
  import '@material/web/icon/icon.js';
</script>
```

### 2. Component Mapping

#### Original → MD3 Component

| Original | MD3 Component | Notes |
|----------|---------------|-------|
| `<select class="input--style-1">` | `<md-filled-select>` | Hotels dropdown |
| `<input type="text" class="input--style-1">` | `<md-filled-text-field>` | Check-in/out dates |
| `<button class="btn-submit">` | `<md-filled-button>` | Search button |
| Copy/Clear buttons | `<md-filled-tonal-button>` | Action buttons |
| Guest counter | Custom MD3 component | With +/- buttons |

### 3. HTML Structure Changes

**Before:**
```html
<div class="input-group input--large">
    <label class="label">Hotéis</label>
    <select class="input--style-1" name="going" id="hotel-select">
        <option value="">Loading hotels...</option>
    </select>
</div>
```

**After:**
```html
<md-filled-select id="hotel-select" label="Hotéis">
    <md-select-option value="">
        <div slot="headline">Loading hotels...</div>
    </md-select-option>
</md-filled-select>
```

---

## 📦 File Structure

```
src/
├── index.html (migrated to MD3)
├── css/
│   ├── md3-theme.css (NEW - MD3 design tokens)
│   ├── md3-components.css (NEW - Custom MD3 styles)
│   └── main.css (DEPRECATED - will be replaced)
├── js/
│   ├── global.js (UPDATE - remove old dependencies)
│   └── guestCounter.js (UPDATE - MD3 compatible)
└── services/
    └── apiClient.js (NO CHANGES - keep as-is)
```

---

## ⚠️ Breaking Changes

### Removed Dependencies
- ❌ `vendor/mdi-font/` - Replaced by Material Symbols
- ❌ `vendor/font-awesome-4.7/` - Not needed
- ❌ `vendor/select2/` - Replaced by MD3 Select
- ❌ `vendor/datepicker/` - Replaced by MD3 TextField with date input

### Updated Dependencies
- ✅ Material Symbols (Google Fonts)
- ✅ Material Web Components (ESM)
- ✅ Roboto font (updated weights)

---

## 🧪 Testing Strategy

### Unit Testing
- [ ] Test hotel dropdown population
- [ ] Test date input validation
- [ ] Test guest counter increment/decrement
- [ ] Test form submission
- [ ] Test results display

### Integration Testing
- [ ] Test API integration flow
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test copy/clear functionality

### Visual Testing
- [ ] Compare screenshots before/after
- [ ] Verify MD3 design spec compliance
- [ ] Check responsive breakpoints
- [ ] Validate color contrast (WCAG AA)

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

---

## 📈 Success Metrics

- ✅ 100% MD3 component usage
- ✅ No custom CSS overrides (use tokens only)
- ✅ WCAG AA accessibility compliance
- ✅ Preserved all functionality
- ✅ Improved loading performance
- ✅ Enhanced mobile experience

---

## 🚀 Deployment Plan

### Step 1: Development
- Implement MD3 components locally
- Test thoroughly

### Step 2: Staging
- Deploy to test environment
- Run full test suite
- Get user feedback

### Step 3: Production
- Gradual rollout
- Monitor for issues
- Rollback plan ready

---

## 📚 Resources

- [Material Design 3](https://m3.material.io/)
- [Material Web Components](https://github.com/material-components/material-web)
- [Material Symbols](https://fonts.google.com/icons)
- [MD3 Theme Builder](https://m3.material.io/theme-builder)
- [Component Gallery](https://material-web.dev/)

---

**Status:** 🚀 Ready to implement  
**Next Step:** Phase 1 - Setup & Dependencies
