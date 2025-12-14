# Monitora Vagas API Documentation

**Version:** 2.0.0  
**Last Updated:** 2025-12-14  
**API Version:** Based on busca_vagas API v1.4.1 (compatible with v1.2.1+)

---

## Table of Contents

1. [Overview](#overview)
2. [API Client Service](#api-client-service)
3. [Endpoints](#endpoints)
4. [Request/Response Formats](#requestresponse-formats)
5. [Error Handling](#error-handling)
6. [Caching Strategy](#caching-strategy)
7. [Usage Examples](#usage-examples)
8. [Testing](#testing)

---

## Overview

The Monitora Vagas application integrates with the `busca_vagas` API to search for hotel vacancies in AFPESP (Associação dos Funcionários Públicos do Estado de São Paulo) hotels. The API uses Puppeteer-based web scraping to provide real-time availability data.

### Key Features

- **Puppeteer-based scraping** - 40-60% more resource-efficient than Selenium
- **Headless browser automation** - Fast and reliable
- **Browser instance pooling** - Reuses instances for up to 5 minutes
- **Automatic retry logic** - Handles transient failures
- **Persistent caching** - Minimizes redundant API calls
- **Comprehensive timeout handling** - Configurable per operation type

### Base URLs

- **Production:** `https://www.mpbarbosa.com/api`
- **Development:** `http://localhost:3001/api`

---

## API Client Service

### Class: `BuscaVagasAPIClient`

Located at: `src/services/apiClient.js`

#### Initialization

```javascript
import { apiClient } from './services/apiClient.js';

// Singleton instance ready to use
// Automatically detects production/development environment
```

#### Configuration

```javascript
{
  apiBaseUrl: 'https://www.mpbarbosa.com/api', // or localhost in dev
  timeout: {
    default: 30000,        // 30 seconds
    search: 60000,         // 60 seconds for vacancy search
    weekendSearch: 600000  // 10 minutes for weekend search
  },
  cacheDuration: 300000    // 5 minutes
}
```

---

## Endpoints

### 1. Health Check

**Endpoint:** `GET /api/health`

**Purpose:** Verify API availability and status

**Timeout:** 30 seconds

**Request:**
```javascript
await apiClient.checkHealth();
```

**Response:**
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2025-12-14T22:30:00.000Z",
  "uptime": 3600
}
```

---

### 2. Get Hotels (Static List)

**Endpoint:** `GET /api/vagas/hoteis`

**Purpose:** Retrieve the static list of available hotels

**Timeout:** 30 seconds

**Caching:** Persistent cache with localStorage (valid until cache is cleared)

**Request:**
```javascript
// Use cache if available
const hotels = await apiClient.getHotels();

// Force refresh from API
const hotels = await apiClient.getHotels(true);
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Amparo",
      "value": "Amparo"
    },
    {
      "id": "2",
      "name": "Appenzell",
      "value": "Appenzell"
    }
  ]
}
```

**Notes:**
- Cached data persists across browser sessions
- Use `forceRefresh` parameter to bypass cache
- Cache can be cleared with `apiClient.clearCache()`

---

### 3. Scrape Hotels (Dynamic List)

**Endpoint:** `GET /api/vagas/hoteis/scrape`

**Purpose:** Scrape current hotel list from AFPESP website (includes "Todas" option)

**Timeout:** 60 seconds

**Request:**
```javascript
const scrapedHotels = await apiClient.scrapeHotels();
```

**Response:**
```json
{
  "success": true,
  "method": "puppeteer",
  "data": [
    {
      "name": "Todas",
      "value": "-1",
      "type": "All"
    },
    {
      "name": "Amparo",
      "value": "Amparo",
      "type": "Hotel"
    }
  ]
}
```

**Notes:**
- Returns actual dropdown options from AFPESP website
- Includes "Todas" option with value "-1"
- Each item has a `type` field: "All" or "Hotel"
- Use when you need the most current hotel list

---

### 4. Search Vacancies

**Endpoint:** `GET /api/vagas/search`

**Purpose:** Search for hotel vacancies between two dates

**Timeout:** 60 seconds

**Required Parameters:**
- `checkin` - Check-in date in ISO 8601 format (YYYY-MM-DD)
- `checkout` - Check-out date in ISO 8601 format (YYYY-MM-DD)

**Optional Parameters:**
- `hotel` - Hotel filter (default: "-1" for all hotels)

**Request:**
```javascript
// Search all hotels
const results = await apiClient.searchVacancies(
  '2025-04-03',  // checkin
  '2025-04-05',  // checkout
  '-1'           // hotel (optional, default: '-1')
);

// Search specific hotel
const results = await apiClient.searchVacancies(
  new Date('2025-04-03'),  // Can use Date objects
  new Date('2025-04-05'),
  'Amparo'
);
```

**Response Structure:**

```json
{
  "success": true,
  "method": "puppeteer",
  "headlessMode": true,
  "resourceSavings": "40-60% compared to Selenium",
  "hotelFilter": "-1",
  "data": {
    "success": true,
    "date": "4/3/2025",
    "hasAvailability": true,
    "result": {
      "hasAvailability": true,
      "status": "AVAILABLE",
      "summary": "Found vacancies in 4 hotel(s): Amparo, Appenzell, Areado, Avaré",
      "vacancies": [
        "Amparo: COQUEIROS (até 3 pessoas)01/06 - 01/07 (30 dias livres) - 38 Quarto(s)",
        "Appenzell: STANDARD01/06 - 30/06 (29 dias livres) - 12 Quarto(s)"
      ],
      "hotelGroups": {
        "Amparo": [
          "COQUEIROS (até 3 pessoas)01/06 - 01/07 (30 dias livres) - 38 Quarto(s)"
        ],
        "Appenzell": [
          "STANDARD01/06 - 30/06 (29 dias livres) - 12 Quarto(s)"
        ]
      }
    }
  }
}
```

**No Availability Response:**

```json
{
  "success": true,
  "method": "puppeteer",
  "data": {
    "success": true,
    "date": "4/3/2025",
    "hasAvailability": false,
    "result": {
      "hasAvailability": false,
      "status": "NO AVAILABILITY",
      "summary": "No período escolhido não há nenhum quarto disponível",
      "vacancies": [],
      "hotelGroups": {}
    }
  }
}
```

**Client Method Returns:**

The `searchVacancies()` method returns only the `data` object for convenience:

```javascript
{
  "success": true,
  "date": "4/3/2025",
  "hasAvailability": true,
  "result": {
    "hasAvailability": true,
    "status": "AVAILABLE",
    "summary": "...",
    "vacancies": [...],
    "hotelGroups": {...}
  }
}
```

---

### 5. Search Weekend Vacancies

**Endpoint:** `GET /api/vagas/search/weekends`

**Purpose:** Search for vacancies across multiple upcoming weekends

**Timeout:** 10 minutes (600 seconds)

**Parameters:**
- `count` - Number of weekends to search (1-12, default: 8)

**Request:**
```javascript
// Search next 8 weekends (default)
const weekendResults = await apiClient.searchWeekendVacancies();

// Search next 12 weekends
const weekendResults = await apiClient.searchWeekendVacancies(12);
```

**Response Structure:**

```json
{
  "success": true,
  "method": "puppeteer",
  "data": {
    "success": true,
    "searchDetails": {
      "totalWeekendsSearched": 8,
      "searchStartTime": "2025-12-14T22:30:00.000Z",
      "searchEndTime": "2025-12-14T22:35:00.000Z"
    },
    "availability": {
      "hasAvailability": true,
      "weekendsWithVacancies": 3,
      "totalVacanciesFound": 12
    },
    "results": [
      {
        "weekend": "2025-12-20 to 2025-12-22",
        "checkin": "2025-12-20",
        "checkout": "2025-12-22",
        "hasAvailability": true,
        "result": {
          "status": "AVAILABLE",
          "summary": "Found vacancies in 2 hotel(s): Amparo, Avaré",
          "vacancies": [...],
          "hotelGroups": {...}
        }
      }
    ]
  }
}
```

**Notes:**
- Weekend defined as Friday to Sunday (3 days)
- Can take several minutes to complete (searches multiple date ranges)
- Returns array of results, one per weekend
- Each result has same structure as single vacancy search

---

## Request/Response Formats

### Date Format

**Required Format:** ISO 8601 (YYYY-MM-DD)

**Examples:**
- `2025-04-03` ✅ Correct
- `2025-4-3` ❌ Incorrect
- `04/03/2025` ❌ Incorrect
- `2025/04/03` ❌ Incorrect

**Helper Method:**
```javascript
const isoDate = apiClient.formatDateISO(new Date());
// Returns: "2025-12-14"
```

### Hotel Filter Values

| Value | Description | Use Case |
|-------|-------------|----------|
| `-1` | All hotels ("Todas") | Default search |
| `"Amparo"` | Specific hotel name | Filter to single hotel |
| `"Appenzell"` | Specific hotel name | Filter to single hotel |

**Note:** Hotel names are case-sensitive and must match exactly.

### Response Field Descriptions

#### Top-Level Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean | Whether the API call succeeded |
| `method` | String | Scraping method used ("puppeteer") |
| `headlessMode` | Boolean | Whether browser ran in headless mode |
| `resourceSavings` | String | Resource efficiency compared to Selenium |
| `hotelFilter` | String | Hotel filter applied to search |
| `data` | Object | Main response data |

#### Data Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean | Whether the search operation succeeded |
| `date` | String | Search date in M/D/YYYY format |
| `hasAvailability` | Boolean | Whether any vacancies were found |
| `result` | Object | Search results details |

#### Result Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `hasAvailability` | Boolean | Whether vacancies exist |
| `status` | String | "AVAILABLE" or "NO AVAILABILITY" |
| `summary` | String | Human-readable summary message |
| `vacancies` | Array | List of vacancy strings |
| `hotelGroups` | Object | Vacancies grouped by hotel name |

---

## Error Handling

### Error Types

#### 1. Network Errors

```javascript
try {
  const results = await apiClient.searchVacancies(checkin, checkout);
} catch (error) {
  if (error.message === 'Request timeout - please try again') {
    // Handle timeout
  }
}
```

#### 2. HTTP Errors

```javascript
catch (error) {
  if (error.message.includes('HTTP 404')) {
    // Endpoint not found
  } else if (error.message.includes('HTTP 5')) {
    // Server error (automatically retried)
  }
}
```

#### 3. API Errors

```javascript
// API returns success: false
{
  "success": false,
  "error": "Invalid date format"
}
// Automatically thrown as Error by client
```

### Retry Logic

The API client implements automatic retry with exponential backoff:

- **Max retries:** 3 attempts
- **Backoff schedule:** 1s, 2s, 4s
- **Retry conditions:** HTTP 5xx errors only
- **No retry:** Timeouts, HTTP 4xx errors

```javascript
// Automatically retried
await apiClient.searchVacancies(checkin, checkout);
// Failed attempts logged to console:
// ⚠️ Retry attempt 1/3 after 1000ms...
// ⚠️ Retry attempt 2/3 after 2000ms...
```

---

## Caching Strategy

### Hotel List Cache

**Storage:** localStorage (persistent)  
**Duration:** Until manually cleared  
**Key:** `hotelCache_v1`

**Cache Operations:**

```javascript
// Get from cache (automatic in getHotels)
const hotels = await apiClient.getHotels();

// Force refresh
const hotels = await apiClient.getHotels(true);

// Clear cache
apiClient.clearCache();

// Get cache statistics
const stats = apiClient.getCacheStats();
// Returns: { hasCache: true, itemCount: 15, lastUpdated: "..." }
```

### Cache Invalidation

The hotel cache should be invalidated when:
- User explicitly requests refresh
- API returns different hotel count
- Hotels appear outdated (manual judgment)

**Recommendation:** Implement a "Refresh Hotels" button in UI for user control.

---

## Usage Examples

### Example 1: Basic Vacancy Search

```javascript
import { apiClient } from './services/apiClient.js';

async function searchHotelVacancies() {
  try {
    // Search all hotels for a date range
    const results = await apiClient.searchVacancies(
      '2025-04-03',
      '2025-04-05'
    );
    
    if (results.hasAvailability) {
      console.log('✅', results.result.summary);
      console.log('Found vacancies:', results.result.vacancies.length);
      
      // Group by hotel
      Object.entries(results.result.hotelGroups).forEach(([hotel, rooms]) => {
        console.log(`${hotel}: ${rooms.length} room types`);
      });
    } else {
      console.log('😔 No vacancies found');
      console.log(results.result.summary);
    }
  } catch (error) {
    console.error('Search failed:', error.message);
  }
}
```

### Example 2: Weekend Search with Progress

```javascript
async function searchWeekends() {
  console.log('🔍 Searching weekends...');
  console.log('⏳ This may take several minutes...');
  
  try {
    const results = await apiClient.searchWeekendVacancies(8);
    
    const available = results.results.filter(w => w.hasAvailability);
    console.log(`✅ Found vacancies in ${available.length} weekend(s)`);
    
    available.forEach(weekend => {
      console.log(`📅 ${weekend.weekend}`);
      console.log(`   ${weekend.result.summary}`);
    });
  } catch (error) {
    console.error('Weekend search failed:', error.message);
  }
}
```

### Example 3: Hotel List with Cache Management

```javascript
async function loadHotels() {
  try {
    // Check cache stats
    const stats = apiClient.getCacheStats();
    if (stats.hasCache) {
      console.log('📦 Using cached hotels from', stats.lastUpdated);
    }
    
    // Load hotels (uses cache if available)
    const hotels = await apiClient.getHotels();
    
    // Populate dropdown
    const dropdown = document.getElementById('hotel-select');
    hotels.forEach(hotel => {
      const option = document.createElement('option');
      option.value = hotel.value;
      option.textContent = hotel.name;
      dropdown.appendChild(option);
    });
    
    console.log(`✅ Loaded ${hotels.length} hotels`);
  } catch (error) {
    console.error('Failed to load hotels:', error.message);
  }
}

async function refreshHotels() {
  console.log('🔄 Refreshing hotel list...');
  const hotels = await apiClient.refreshHotels();
  console.log(`✅ Refreshed ${hotels.length} hotels`);
}
```

### Example 4: Error Handling with User Feedback

```javascript
async function searchWithFeedback(checkin, checkout) {
  const loadingEl = document.getElementById('loading');
  const resultsEl = document.getElementById('results');
  const errorEl = document.getElementById('error');
  
  try {
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    resultsEl.style.display = 'none';
    
    const results = await apiClient.searchVacancies(checkin, checkout);
    
    loadingEl.style.display = 'none';
    resultsEl.style.display = 'block';
    
    // Render results
    renderResults(results);
    
  } catch (error) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    
    if (error.message.includes('timeout')) {
      errorEl.textContent = 'A busca demorou muito. Por favor, tente novamente.';
    } else if (error.message.includes('HTTP 5')) {
      errorEl.textContent = 'Erro no servidor. Tente novamente em alguns minutos.';
    } else {
      errorEl.textContent = 'Erro na busca: ' + error.message;
    }
  }
}
```

---

## Testing

### Health Check Test

```javascript
// Test API availability
const health = await apiClient.checkHealth();
console.assert(health.success === true, 'API health check failed');
```

### Integration Test File

Location: `test-api-integration.html`

**Features:**
- Test basic vacancy search
- Test API Client wrapper methods
- Validate response structure
- Pretty-printed JSON output
- Visual success/error feedback

**How to Run:**

```bash
# Start local server
python3 -m http.server 8000

# Open test page
open http://localhost:8000/test-api-integration.html
```

### Manual Testing Checklist

- [ ] Health check returns success
- [ ] Hotel list loads (cached and fresh)
- [ ] Vacancy search with valid dates
- [ ] Vacancy search with no availability
- [ ] Weekend search (1-12 weekends)
- [ ] Error handling for invalid dates
- [ ] Error handling for network timeout
- [ ] Cache persistence across page reload
- [ ] Force refresh invalidates cache

### Automated Tests

```bash
# Run UI tests
python3 tests/simple_ui_test.py

# Run E2E tests (requires API server)
python3 tests/e2e_test_suite.py
```

---

## API Client Methods Reference

### Core Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `checkHealth()` | None | `Promise<Object>` | Check API health status |
| `getHotels(forceRefresh)` | `forceRefresh: Boolean` | `Promise<Array>` | Get hotel list (cached) |
| `scrapeHotels()` | None | `Promise<Array>` | Scrape current hotel list |
| `searchVacancies(checkin, checkout, hotel)` | `checkin: String/Date`<br>`checkout: String/Date`<br>`hotel: String` | `Promise<Object>` | Search vacancies |
| `searchWeekendVacancies(count)` | `count: Number (1-12)` | `Promise<Object>` | Search weekend vacancies |

### Utility Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `formatDateISO(date)` | `date: Date` | `String` | Format date to ISO 8601 |
| `clearCache()` | None | `void` | Clear all caches |
| `getCacheStats()` | None | `Object` | Get cache statistics |
| `refreshHotels()` | None | `Promise<Array>` | Force hotel list refresh |

### Internal Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `fetchWithTimeout(url, options, timeout)` | URL, options, timeout | `Promise<Object>` | Fetch with timeout |
| `fetchWithRetry(fetchFn, maxRetries)` | Function, retries | `Promise<Object>` | Fetch with retry logic |

---

## Related Documentation

- **busca_vagas API:** [DATA_FLOW_DOCUMENTATION.md](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/DATA_FLOW_DOCUMENTATION.md)
- **Integration Guide:** [API_INTEGRATION_UPDATE.md](./API_INTEGRATION_UPDATE.md)
- **Implementation Guide:** [IMPLEMENTATION_GUIDE.md](../architecture/IMPLEMENTATION_GUIDE.md)
- **Quick Start:** [QUICKSTART.md](../../QUICKSTART.md)

---

## Support & Troubleshooting

### Common Issues

**Issue:** "Request timeout"  
**Solution:** The search operation took longer than 60 seconds. This is normal during high traffic. Retry the request.

**Issue:** "HTTP 503 Service Unavailable"  
**Solution:** The API server may be starting up or under maintenance. Wait 1-2 minutes and retry.

**Issue:** No vacancies found when you expect them  
**Solution:** The AFPESP website may have updated data. This is real-time data, not cached.

**Issue:** Hotels not loading  
**Solution:** Clear cache with `apiClient.clearCache()` and refresh.

### Debug Mode

Enable verbose logging:

```javascript
// Check console for detailed logs:
// ✅ BuscaVagasAPIClient initialized with base URL: ...
// 🔍 Searching vacancies: ...
// ⚠️ Retry attempt 1/3 after 1000ms...
```

### API Status

Check API health: `https://www.mpbarbosa.com/api/health`

---

**Documentation Version:** 2.0.0  
**Last Updated:** 2025-12-14  
**Maintained By:** Monitora Vagas Team
