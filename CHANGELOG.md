# Changelog

All notable changes to the Trade Union Hotel Search Platform are documented in this file.

## [2024-12-02] - API Test Page Update for v1.2.1

### Changed
- **API Test Suite** (`src/api-test.html`):
  - Updated to support busca_vagas API v1.2.1
  - Added handling for new `type` field in hotel responses ("All" vs "Hotel")
  - Updated hotel list and scrape result displays to show breakdown by type
  - Added "New in v1.2.1" indicator for "Todas" option inclusion
  - Enhanced result formatting to distinguish between "All" options and actual hotels

## [2024-12-02] - API Integration Implementation

### Added
- **API Client Service** (`src/services/apiClient.js`):
  - Centralized API integration with busca_vagas backend
  - Automatic environment detection (localhost vs production)
  - Timeout handling (30s default, 60s search, 10min weekend)
  - Retry logic with exponential backoff (3 attempts)
  - Response validation (`success` field checking)
  - Caching for hotel list (5 minutes TTL)
  - ISO 8601 date formatting for API compatibility

- **API Test Suite** (`src/api-test.html`):
  - Interactive test page for all API endpoints
  - Visual success/failure indicators
  - Response time measurement
  - Pretty-printed JSON responses
  - Test results summary

- **Comprehensive Documentation**:
  - `API_CLIENT_USAGE_REVIEW.md` - Detailed review of integration issues
  - `API_INTEGRATION_CHANGES.md` - Implementation summary
  - `IMPLEMENTATION_GUIDE.md` - Quick start and troubleshooting

### Changed
- **QuickSearch Component** (`src/components/QuickSearch/QuickSearch.js`):
  - Replaced client-side simulation with real API calls
  - Fixed date formatting from DD/MM/YYYY to YYYY-MM-DD (API requirement)
  - Removed 1000+ lines of legacy CORS workaround code
  - Updated `queryVacancies()` to use `apiClient.searchVacancies()`
  - Updated `searchWeekendVacancies()` to use `apiClient.searchWeekendVacancies()`
  - Added `transformAPIResponse()` for API data transformation
  - Removed popup search experimental feature

- **Environment Configuration** (`src/config/environment.js`):
  - Auto-detection based on hostname
  - `localhost` → `http://localhost:3000/api`
  - Production → `https://www.mpbarbosa.com/api`

- **index.html**:
  - Replaced hardcoded URL with API client import
  - Converted to ES6 module script
  - Uses `apiClient.scrapeHotels()` for hotel dropdown

### Removed
- All client-side simulation code
- CORS workaround attempts (popup windows, iframes)
- Legacy `performAfpespSearch()` function
- `simulateVacancyQuery()` function
- `tryPopupWindowAutomation()` function
- Experimental popup search button

### Technical Details
- **API Endpoints Used**:
  - `GET /api/health` - Health check (30s timeout)
  - `GET /api/vagas/hoteis` - Static hotel list (cached, 30s timeout)
  - `GET /api/vagas/hoteis/scrape` - Scrape hotels (60s timeout)
  - `GET /api/vagas/search?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD` - Search vacancies (60s timeout)
  - `GET /api/vagas/search/weekends?count=8` - Search weekends (10min timeout)

- **Architecture Improvements**:
  - Singleton API client pattern
  - Environment-aware base URL selection
  - Automatic retry for server errors (HTTP 5xx)
  - Proper error propagation and user messaging
  - Cache invalidation after 5 minutes

### Migration Impact
- ✅ Users now get real AFPESP vacancy data
- ⏳ Searches take longer (30-60s) but provide accurate results
- ⚠️ Backend API must be running for functionality
- ✅ Cleaner codebase with reusable API client

### Documentation Updates
- Updated README.md with API integration details
- Added prerequisites section for backend API
- Updated installation steps
- Added API testing instructions
- Updated project structure diagram

---

## [2024-12-02] - Portuguese Localization & Guest Counter Enhancement

### Added
- **Guest Counter Functionality**: Created `src/js/guestCounter.js` to handle increment/decrement of guest count
- **Interactive Plus/Minus Buttons**: Functional +/- controls for guest selection with minimum value of 1

### Changed
- **Portuguese Localization**: Translated interface elements from English to Portuguese
  - "going to" → "Hotéis"
  - "guests" → "hóspedes"
  - "2 Guests" → "2 Hóspedes"
  - Date format placeholder: "mm/dd/yyyy" → "dd/mm/aaaa"
- **Form Field IDs**: Renamed for semantic clarity
  - `id="input-start"` → `id="input-checkin"`
  - `id="input-end"` → `id="input-checkout"`

### Files Modified
- `src/index.html` - Form field translations, ID updates, date format changes
- `src/index.html` - Added script reference to `guestCounter.js`

### Files Created
- `src/js/guestCounter.js` - Guest counter increment/decrement handler (41 lines)

### Technical Details
- **Script Size**: guestCounter.js is 41 lines with IIFE pattern
- **Event Handling**: Click listeners on .plus and .minus spans with preventDefault
- **Validation**: Minimum guest count enforced at 1
- **Localization**: Dynamic text updates maintain "Hóspedes" suffix

---

## [2024-12-01] - Colorlib Template Integration & Navigation Removal

### Added
- **Colorlib Template Integration**: Complete replacement of index.html with modern Colorlib search template
- **Vendor CSS Libraries**: Downloaded and integrated 5 CSS files (Material Design, Font Awesome, Select2, DateRangePicker, Main)
- **Web Font Assets**: Integrated 7 font files in multiple formats for cross-browser compatibility
- **Blue Gradient Theme**: Implemented modern blue gradient background (#4481eb to #04befe)

### Changed
- **HTML Structure**: Reduced from 692 to 90 lines with card-based layout design
- **Typography**: Switched from Inter to Roboto font family
- **Color Scheme**: Updated from purple gradients to blue gradients matching Colorlib template
- **Responsive Design**: Enhanced mobile breakpoints at 768px and 480px

### Removed
- **Navigation System**: Eliminated app-nav element and all navigation JavaScript/CSS
- **Multi-View Architecture**: Simplified to single-page design removing view routing
- **Navigation Styles**: Removed .app-nav, .nav-link, .nav-brand, .app-header CSS rules
- **Event Listeners**: Removed nav-link click handlers and popstate navigation

### Files Modified
- `src/index.html` - Complete replacement with Colorlib template
- `src/main.js` - Removed navigation methods (navigateTo, renderHomeView, renderSearchView, renderHistoryView)
- `src/styles/main.css` - Removed all navigation-related CSS
- `TRANSFORMATION_SUMMARY.md` - Updated with latest changes

### Files Created
- `src/vendor/mdi-font/css/material-design-iconic-font.min.css`
- `src/vendor/mdi-font/fonts/Material-Design-Iconic-Font.{woff2,woff,ttf}`
- `src/vendor/font-awesome-4.7/css/font-awesome.min.css`
- `src/vendor/font-awesome-4.7/fonts/fontawesome-webfont.{woff2,woff,ttf,eot}`
- `src/vendor/select2/select2.min.css`
- `src/vendor/datepicker/daterangepicker.css`
- `src/css/main.css` (834 lines of template styles)
- `CHANGELOG.md` (this file)

### Technical Details
- **Total Assets**: 876KB (CSS + fonts)
- **Template Source**: https://colorlib.com/etc/searchf/colorlib-search-14/
- **Browser Support**: Modern browsers with fallback fonts for legacy support

---

For complete transformation history, see [TRANSFORMATION_SUMMARY.md](./TRANSFORMATION_SUMMARY.md)
