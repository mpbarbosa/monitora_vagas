# API Integration Implementation Guide

## 🚀 Quick Start

The application uses modern ES6 modules with the busca_vagas backend API v1.4.1 for vacancy searches.

### What's Implemented (v2.2.0):
✅ Real vacancy data from AFPESP via backend API  
✅ ES6 module-based API client with pure functions  
✅ **ibira.js integration** for advanced API fetching with retries  
✅ LocalStorage-based hotel caching with 24h TTL  
✅ Referential transparency and dependency injection  
✅ **Centralized logger service** with environment-aware levels  
✅ **Constants management** (TIME, API, CACHE, UI, VALIDATION)  
✅ Proper timeout and error handling  
✅ ISO 8601 date formatting  
✅ Environment detection (dev/prod)

---

## 📋 Testing the Implementation

### 1. Test Search Functionality

Open the application and test the search functionality:

```bash
# Start a local server (from project root)
npm start
# or
python3 -m http.server 8080

# Open http://localhost:8080/public/index.html in browser
```

**Test scenarios:**
1. ✅ Hotel selection and vacancy search
2. ✅ Date range validation (ISO 8601 format)
3. ✅ Guest number filtering (FR-004A/B)
4. ✅ Booking rules toggle (FR-014)
5. ✅ Search lifecycle state management (FR-008A)
6. ✅ Error handling (invalid dates, timeouts)

### 2. Verify API Integration

Check browser console for logger output:
- `[DEBUG] API call initiated` - API request started
- `[INFO] Search completed successfully` - Success response
- `[ERROR]` messages for failures
- Cache hit/miss statistics

---

### Configuration

The application uses environment detection to configure API endpoints:

```javascript
// In src/config/environment.js
const env = {
    apiBaseUrl: detectEnvironment() === 'production' 
        ? 'https://www.mpbarbosa.com/api'
        : 'http://localhost:3001/api',
    isDevelopment: detectEnvironment() === 'development',
    isProduction: detectEnvironment() === 'production'
};
```

### Backend API Requirements

⚠️ **Important:** The busca_vagas backend API must be accessible.

**Production:**
- API: `https://www.mpbarbosa.com/api`
- Should be running and accessible

**Development:**
```bash
# Start the busca_vagas backend
cd /path/to/busca_vagas
npm start
# API will run on http://localhost:3000
```

---

## 📁 Implementation Files

### `src/services/apiClient.js`
Main API client service with pure functions and dependency injection (v2.2.0):

**Key Features:**
- Pure functional design with no side effects
- Dependency injection for logger and time functions
- **ibira.js** for API fetching (CDN + local fallback)
- Automatic retry logic with exponential backoff (via ibira.js)
- 5-minute response caching (via ibira.js)
- 24-hour hotel list caching (via hotelCache)

### `src/services/logger.js`
Centralized logging service with environment-aware levels:

**Key Features:**
- Production: ERROR level only (optimized performance)
- Development: Full DEBUG logging
- LocalStorage override for debugging
- Structured format: `[ISO-8601][context] LEVEL: message`
- Performance measurement: `time()`, `timeEnd()`
- Log grouping: `group()`, `groupEnd()`

### `src/config/constants.js`
Centralized configuration management (273 lines):

**Key Features:**
- TIME constants (timeouts, cache TTL, retry delays)
- API constants (retry limits, status codes)
- CACHE constants (storage keys, size limits)
- UI constants (animations, breakpoints, z-index)
- VALIDATION constants (guest limits, date ranges)
- FEATURE flags (caching, retry, analytics, debug)

### `src/js/hotelSearch.js`
Main search workflow module (815 lines):

**Key Features:**
- Pure helper functions (formatDateISO, isValidWeekendCount, URL builders)
- Dependency injection for logger
- Integration with hotelCache service
- Environment-based API URL configuration
- Referential transparency improvements

**Key Methods:**
```javascript
class HotelVacancyService {
    constructor() {
        this.apiBaseUrl = 'https://www.mpbarbosa.com/api';
        this.timeout = 60000; // 60 seconds
    }
    
    // Search vacancies for date range
    async queryVacancies(startDate, endDate)
    
    // Search multiple weekends
    async searchWeekendVacancies(count = 8)
    
    // Get hotel list
    async getHotels()
    
    // Format date to ISO 8601
    formatDateISO(date)
}
```

**API Endpoints Used:**
- `GET /api/vagas/search?checkin={date}&checkout={date}`
- `GET /api/vagas/search/weekends?count={number}`
- `GET /api/vagas/hoteis`

### `src/services/apiClient.js`
Shared API client (used by index.html):
- Hotel scraping functionality
- Shared by both components where appropriate

---

## 🐛 Troubleshooting

### Issue: "Request timeout" or "Search timeout"
**Cause:** Search is taking longer than expected (>60 seconds for regular search)  
**Solution:** This is normal for comprehensive searches. Weekend searches can take up to 10 minutes.

### Issue: "HTTP 500" or "HTTP 502"
**Cause:** Backend API is not running or encountered an error  
**Solution:** 
1. Check if the backend API is running
2. Check backend logs for errors
3. Restart the backend API
4. Verify API endpoint: `curl https://www.mpbarbosa.com/api/health`

### Issue: "Failed to fetch" or Network error
**Cause:** Backend API is not accessible  
**Solution:**
1. Verify backend is running
2. Check CORS configuration in backend
3. Verify firewall/network settings
4. Check API URL in browser console logs

### Issue: Results show parsing errors
**Cause:** API response format mismatch  
**Solution:**
1. Check API response format in browser console
2. Verify `result.success` and `result.data` exist
3. Check backend API version compatibility

---

## 📊 API Response Times

Expected response times:

| Endpoint | Expected Time | Timeout |
|----------|--------------|---------|
| Search Vacancies | 30-60 seconds | 60s |
| Weekend Search (8) | 5-10 minutes | 10min |
| Hotel List | < 1 second | 30s |
| Hotel Scraping | 30-60 seconds | 60s |

---

## 🔄 Architecture Overview

```
User Interface (QuickSearch Component)
    ↓
Native Fetch API (Direct Calls)
    ↓
Backend API (busca_vagas)
    ↓
Puppeteer Scraping
    ↓
AFPESP Website
```

**Benefits:**
- Direct, transparent API calls
- No intermediate abstraction layer
- Better timeout and error control
- Standards-based implementation

---

## 📚 Documentation

- **API Integration Changes:** [API_INTEGRATION_CHANGES.md](../api/API_INTEGRATION_CHANGES.md)
- **API Usage Review:** [API_CLIENT_USAGE_REVIEW.md](../api/API_CLIENT_USAGE_REVIEW.md)
- **Backend API Docs:** [busca_vagas API Documentation](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API_CLIENT_DOCUMENTATION.md)

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Backend API is running at https://www.mpbarbosa.com/api
- [ ] Test search functionality with real dates
- [ ] Test weekend search (allow 10 minutes)
- [ ] Verify error handling works correctly
- [ ] Check browser console for errors
- [ ] Test with slow network conditions
- [ ] Verify timeout settings are appropriate
- [ ] Monitor API response times

---

## 💡 Tips

1. **Real searches take time** - warn users in the UI
2. **Timeouts are generous** but can be adjusted in constructor
3. **Error messages are descriptive** - check console for details
4. **AbortController** handles timeout cancellation automatically
5. **Direct API calls** mean transparent debugging

---

## 🎯 Implementation Status

✅ Direct API integration in QuickSearch  
✅ ISO 8601 date formatting  
✅ Timeout handling with AbortController  
✅ HTTP status validation  
✅ API response validation  
✅ Three API methods implemented  
⚠️ Environment detection (hardcoded URL for now)  
⚠️ Retry logic (not yet implemented)  
⚠️ Caching (not yet implemented)  

---

## 🚀 Next Steps

1. Add environment-aware configuration
2. Implement retry logic with exponential backoff
3. Add request caching for recent searches
4. Add progress indicators for long searches
5. Implement cancel functionality

---

**Last Updated:** 2025-12-02  
**Status:** ✅ Direct API Integration Complete
