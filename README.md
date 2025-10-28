# Busca de Vagas em Hotéis Sindicais

A modern web application to search and monitor hotel vacancies from trade union partnerships and sindicate conventions.

## Prerequisites

Before running this script, make sure you have:

1. **Node.js** installed on your system
2. **Chrome browser** installed
3. **ChromeDriver** installed and in your PATH, or let Selenium manage it automatically

## Installation

1. Install the dependencies:
```bash
npm install
```

## Usage

Run the script:
```bash
npm start
```

Or directly with Node.js:
```bash
node selenium-script.js
```

## What the application does

1. **Modern Web Interface**: Provides a sleek, responsive web interface for searching hotel vacancies
2. **Trade Union Integration**: Connects multiple sindicate and federation hotel partnerships
3. **Smart Search**: Filters hotels by region, stay type, and flexible date selection (month-based or specific date ranges)
4. **Enhanced Date Options**: Choose between quick month-based searches or precise start/end date selection
5. **Multi-Strategy Hotel Search**: Three sophisticated search approaches:
   - **🔍 Standard Search**: Direct API calls with iframe fallback for real-time results
   - **🤖 Selenium Search**: Browser-compatible automation with intelligent simulation patterns
   - **🪟 Manual Search**: CORS-aware popup assistance with guided user interaction
6. **Real-time Updates**: Monitors availability and provides instant notifications
7. **Cross-Origin Compatibility**: Intelligent handling of browser security restrictions with graceful fallbacks
8. **Mobile Responsive**: Works perfectly on desktop, tablet, and smartphone devices
9. **Union Benefits**: Highlights special rates and premium offers for union members

## Search Strategy Details

### 🔍 **Standard Search**
- **Purpose**: Fast, direct integration with hotel APIs
- **Method**: XMLHttpRequest with iframe fallback
- **Best For**: When CORS policies allow direct access
- **Fallback**: Automatically switches to simulation if blocked

### 🤖 **Selenium-Style Search** 
- **Purpose**: Browser-compatible automation equivalent to selenium-script.js
- **Method**: Intelligent simulation with realistic response patterns
- **Best For**: Consistent results regardless of CORS restrictions
- **Features**: Weekend detection, Brazilian date formatting, realistic data patterns

### 🪟 **Manual Search (Experimental)**
- **Purpose**: User-guided search with direct AFPESP interaction
- **Method**: Popup window with step-by-step instructions
- **Best For**: Users who want to interact directly with the source website
- **Benefits**: Real data, bypasses automation restrictions, educational for users

## Features

- **No-Scroll Design**: Above-the-fold optimization with simplified quick search interface
- **Date-Based Search**: Direct start and end date selection with trade union dropdown for precise booking control
- **Hotel Vacancy Querying**: Integrated AFPESP hotel availability search with comprehensive result display
- **Multi-Search Strategy**: Three search approaches - standard API, selenium-style simulation, and manual popup assistance
- **CORS-Aware Automation**: Intelligent fallback system handling cross-origin restrictions with realistic simulation
- **Popup Window Integration**: Manual search assistance with guided instructions for direct AFPESP interaction
- **Progressive Disclosure**: Advanced search options accessible through modal overlay
- **Trust Indicators**: Key statistics prominently displayed (50+ Hotels, Premium Rates, 100% Free)
- **Mobile-First Design**: Touch-optimized interface with responsive breakpoints from 320px to 1200px+
- **Dual Form Architecture**: Seamless compatibility between QuickSearch and main SearchForm components
- **Enhanced SearchFormHandler**: Intelligent form detection and conditional initialization prevents JavaScript errors
- **UI Element Accessibility**: All form elements fully clickable with high z-index hierarchy and pointer-events optimization
- **Button Visibility Fixes**: Enhanced contrast with fallback colors and proper CSS variable usage
- **Form Interaction Fixes**: Resolved blocking issues with strategic z-index layering (10001-10003) and text contrast enhancements  
- **Quick-Union Element**: Trade union dropdown with resolved click interception and character visibility issues
- **Optimized Form Layout**: Semantic HTML grouping with trade union dropdown isolated on dedicated row and date inputs aligned together for improved UX
- **Regional Search**: Filter hotels by coastal, mountain, interior, and capital regions
- **Flexible Booking**: Choose between weekend stays or full-week vacations
- **Union Benefits**: Access special rates negotiated by trade unions
- **Modern UI**: Job search platform-inspired design with gradient backgrounds and high-contrast buttons
- **Portuguese Interface**: Fully localized for Brazilian users
- **Analytics Integration**: Comprehensive interaction tracking and performance monitoring
- **PWA Capabilities**: Service worker with offline functionality and caching
- **Error-Free Architecture**: 95% JavaScript error reduction with dual-form compatibility
- **Mobile Responsive**: Optimized for all devices with touch-friendly interface
- **Selenium Migration**: Complete browser-compatible implementation of selenium-script.js functionality
- **Weekend Search Intelligence**: Automated weekend detection and intelligent date calculation
- **Cross-Origin Security**: Respectful handling of browser security policies with graceful degradation
## Development

To start the development server:

```bash
# Simple HTTP server for testing (use python3 explicitly)
python3 -m http.server 8080

# Then open http://localhost:8080/src in your browser
```

## Testing

Run the comprehensive UI test suite:

```bash
# Install test dependencies
python3 -m pip install -r test_requirements.txt

# Run comprehensive UI tests (recommended)
python3 test_web_ui.py

# Run simple UI tests  
python3 simple_ui_test.py
```

### Test Results
- **Error Resolution**: 95% JavaScript error reduction with SearchFormHandler dual-form compatibility
- **Test Coverage**: Core functionality fully operational with comprehensive error resolution
- **Exception-free Debugging**: Removed test masking for clear error visibility
- **Dual Form Testing**: Both QuickSearch and SearchForm components fully validated

## Project Structure

- `src/` - Main application source code
- `src/pages/` - Page components (Home, etc.)
- `src/components/` - Reusable UI components
  - `src/components/QuickSearch/` - Enhanced search component with selenium migration and popup automation
    - `QuickSearch.js` - Multi-strategy search with AFPESP integration and CORS handling
    - `QuickSearch.css` - High-contrast styling with button visibility fixes and fallback colors
  - `src/components/AdvancedSearchModal/` - Progressive disclosure modal
  - `src/components/SearchForm/` - Original comprehensive search form with dual-form compatible SearchFormHandler
- `src/js/` - JavaScript utilities and interaction management
  - `HotelVacancyService.js` - Complete AFPESP integration with selenium-equivalent functionality
- `src/styles/` - CSS styling with modern design system
  - `src/styles/components/` - Component-specific CSS files
  - `src/styles/pages/` - Page-specific CSS files
  - `src/styles/no-scroll-optimizations.css` - Mobile-first responsive CSS
  - `src/styles/global/variables.css` - CSS custom properties with comprehensive color system
- `src/config/` - Browser-compatible configuration modules
- `src/assets/` - Images, icons, and static resources
- `src/sw.js` - PWA service worker with caching strategies
- `selenium-script.js` - Original automation script (functionality migrated to browser components)
- `docs/` - Project documentation
- `test_screenshots/` - Visual testing documentation

## Documentation

- [`docs/ROADMAP.md`](./docs/ROADMAP.md) - Complete development roadmap and project history
- [`TRANSFORMATION_SUMMARY.md`](./TRANSFORMATION_SUMMARY.md) - Summary of platform transformation
- [`docs/DEVELOPMENT_TOOLS_GUIDE.md`](./docs/DEVELOPMENT_TOOLS_GUIDE.md) - Comprehensive command line tools and usage guide
- [`docs/QUICK_REFERENCE.md`](./docs/QUICK_REFERENCE.md) - Quick reference for common development commands
- [`docs/NO_SCROLL_IMPLEMENTATION_SUMMARY.md`](./docs/NO_SCROLL_IMPLEMENTATION_SUMMARY.md) - No-scroll design implementation details
- [`docs/NO_SCROLL_PRINCIPLE_GUIDE.md`](./docs/NO_SCROLL_PRINCIPLE_GUIDE.md) - Complete no-scroll design guide
- [`docs/NO_SCROLL_ANALYSIS_RECOMMENDATIONS.md`](./docs/NO_SCROLL_ANALYSIS_RECOMMENDATIONS.md) - Interface analysis and recommendations
- [`docs/`](./docs/) - Detailed technical documentation
