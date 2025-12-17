# API Client Service - Functional Requirements

**Document Version:** 1.0  
**Date:** 2025-12-17  
**Author:** Monitora Vagas Development Team  
**Service:** `src/services/apiClient.js` - API Communication Layer  
**API Version:** busca_vagas v1.4.1

---

## 1. Overview

### 1.1 Purpose

This document specifies the functional requirements for the API Client Service, which provides a centralized interface for all communication with the Busca Vagas API backend. The service handles HTTP requests, caching, error handling, and retry logic.

### 1.2 Scope

The API Client Service encompasses:

- Health check endpoint communication
- Hotel list retrieval with persistent caching
- Hotel list scraping from AFPESP website
- Vacancy search for date ranges
- Weekend vacancy search
- Automatic retry with exponential backoff
- Cache management and statistics
- Timeout handling for long-running operations

### 1.3 Target Users

- Frontend application modules (hotelSearch.js)
- Development and testing environments
- Production monitoring systems

---

## 2. Service Architecture

### 2.1 Class Structure

**Class:** `BuscaVagasAPIClient`  
**Type:** ES6 Class (Singleton Pattern)  
**Export:** Named export `{ apiClient }` (singleton instance)

### 2.2 Dependencies

**External Libraries:**

- `ibira.js` - API fetch manager with caching and retry logic

**Internal Services:**

- `src/config/environment.js` - Environment configuration
- `src/services/hotelCache.js` - Persistent hotel caching

### 2.3 Configuration

```javascript
{
    apiBaseUrl: string,        // Production: 'https://www.mpbarbosa.com/api'
                               // Development: 'http://localhost:3001/api'
    timeout: {
        default: 30000,        // 30 seconds for standard requests
        search: 60000,         // 60 seconds for vacancy search
        weekendSearch: 600000  // 10 minutes for weekend search
    },
    fetchManager: {
        maxCacheSize: 100,
        cacheExpiration: 300000,  // 5 minutes
        maxRetries: 3,
        retryDelay: 1000,
        retryMultiplier: 2
    }
}
```

---

## 3. Functional Requirements

### FR-API-001: Service Initialization

**Priority:** High  
**Status:** ✅ Implemented

#### Description

The API Client Service shall initialize as a singleton instance with environment-specific configuration on first import.

#### Acceptance Criteria

- **AC-001.1:** Service shall detect environment (production/development) on initialization
- **AC-001.2:** Service shall set appropriate API base URL based on environment
- **AC-001.3:** Service shall initialize ibira.js fetch manager with retry configuration
- **AC-001.4:** Service shall configure timeout values for different operation types
- **AC-001.5:** Service shall log initialization status to console
- **AC-001.6:** Service shall expose singleton instance via named export

#### Configuration Rules

**Production Environment:**

- Base URL: `https://www.mpbarbosa.com/api`
- HTTPS required
- Full retry logic enabled

**Development Environment:**

- Base URL: `http://localhost:3001/api`
- HTTP allowed
- Full retry logic enabled

#### Implementation

```javascript
constructor() {
    const env = getEnvironment();
    this.apiBaseUrl = env.API_BASE_URL || (env.isProduction 
        ? 'https://www.mpbarbosa.com/api'
        : 'http://localhost:3001/api');
    
    this.timeout = {
        default: 30000,
        search: 60000,
        weekendSearch: 600000
    };
    
    this.fetchManager = new IbiraAPIFetchManager({
        maxCacheSize: 100,
        cacheExpiration: 5 * 60 * 1000,
        maxRetries: 3,
        retryDelay: 1000,
        retryMultiplier: 2
    });
}
```

#### Related Requirements

- Environment configuration (FR-ENV-001)
- Logging service (FR-LOG-001)

---

### FR-API-002: Health Check

**Priority:** Medium  
**Status:** ✅ Implemented

#### Description

The API Client Service shall provide a method to check the health status of the backend API.

#### Acceptance Criteria

- **AC-002.1:** Method shall send GET request to `/api/health` endpoint
- **AC-002.2:** Request shall use default timeout (30 seconds)
- **AC-002.3:** Response shall include API status information
- **AC-002.4:** Method shall log health check initiation
- **AC-002.5:** Method shall log health status on success
- **AC-002.6:** Method shall throw error on health check failure

#### Method Signature

```javascript
async checkHealth(): Promise<object>
```

#### Response Structure

```javascript
{
    success: true,
    status: "OK",
    timestamp: "2025-12-17T15:00:00.000Z",
    version: "1.4.1"
}
```

#### Error Handling

- Timeout after 30 seconds
- Network errors propagated to caller
- Invalid response structure throws error

#### Usage Example

```javascript
try {
    const health = await apiClient.checkHealth();
    console.log('API is healthy:', health.status);
} catch (error) {
    console.error('API health check failed:', error.message);
}
```

---

### FR-API-003: Hotel List Retrieval

**Priority:** High  
**Status:** ✅ Implemented

#### Description

The API Client Service shall retrieve the static hotel list with persistent caching to minimize API calls.

#### Acceptance Criteria

- **AC-003.1:** Method shall check persistent cache before API call
- **AC-003.2:** If cached data exists and not expired, return cached data
- **AC-003.3:** If cache miss or expired, fetch from `/api/vagas/hoteis`
- **AC-003.4:** Response data shall be saved to persistent cache
- **AC-003.5:** Method shall support force refresh parameter to bypass cache
- **AC-003.6:** Method shall use default timeout (30 seconds)
- **AC-003.7:** Method shall log cache hits and API calls
- **AC-003.8:** Method shall return array of hotel objects

#### Method Signature

```javascript
async getHotels(forceRefresh: boolean = false): Promise<Array<Hotel>>
```

#### Hotel Object Structure

```javascript
{
    hotelId: string,      // Unique hotel identifier
    name: string,         // Hotel display name
    code: string,         // Hotel code (optional)
    location: string      // Hotel location (optional)
}
```

#### Caching Strategy

**Cache Location:** `localStorage` (via hotelCache service)  
**Cache Key:** `busca_vagas_hotels`  
**Cache TTL:** 5 minutes  
**Cache Invalidation:** Manual refresh or TTL expiry

#### Business Rules

- First call: Fetch from API and cache
- Subsequent calls: Return from cache if valid
- Force refresh: Bypass cache and update
- Cache miss: Fetch and save to cache

#### Implementation Flow

```text
1. Check forceRefresh parameter
2. If not force refresh, check hotelCache.get()
3. If cache hit and valid, return cached data
4. If cache miss or expired, call API
5. Save API response to hotelCache.set()
6. Return hotel array
```

#### Usage Example

```javascript
// Normal call (uses cache)
const hotels = await apiClient.getHotels();

// Force refresh (bypasses cache)
const freshHotels = await apiClient.getHotels(true);
```

#### Related Requirements

- FR-CACHE-001: Persistent Hotel Cache
- FR-001: Hotel Selection (FUNCTIONAL_REQUIREMENTS.md)

---

### FR-API-004: Hotel List Scraping

**Priority:** Medium  
**Status:** ✅ Implemented

#### Description

The API Client Service shall provide a method to scrape the dynamic hotel list directly from the AFPESP website.

#### Acceptance Criteria

- **AC-004.1:** Method shall send GET request to `/api/vagas/hoteis/scrape`
- **AC-004.2:** Request shall use search timeout (60 seconds)
- **AC-004.3:** Response shall include all dropdown options from AFPESP site
- **AC-004.4:** Response shall include "Todas" option with type: "All"
- **AC-004.5:** Response shall include individual hotels with type: "Hotel"
- **AC-004.6:** Method shall log scraping initiation and results
- **AC-004.7:** Method shall return array of option objects with type field

#### Method Signature

```javascript
async scrapeHotels(): Promise<Array<HotelOption>>
```

#### HotelOption Structure

```javascript
{
    hotelId: string,      // Option value
    name: string,         // Display text
    type: "All" | "Hotel" // Option type
}
```

#### Response Example

```javascript
[
    { hotelId: "-1", name: "Todas", type: "All" },
    { hotelId: "1", name: "ANDRADE", type: "Hotel" },
    { hotelId: "2", name: "CABO FRIO", type: "Hotel" },
    // ... more hotels
]
```

#### Business Rules

- Scraping is performed server-side using Puppeteer
- Response includes the exact structure from AFPESP dropdown
- "Todas" option is always first in array
- Type field distinguishes between "All" and individual hotels

#### Use Cases

**Primary Use Case:**

- Dynamic hotel list population with "All Hotels" option
- User interface dropdown population

**Secondary Use Case:**

- Verify API static list against live website
- Detect new hotels added to AFPESP system

#### Performance Considerations

- Scraping involves browser automation (slower than static list)
- Use static list (getHotels) for performance-critical scenarios
- Use scraping for accuracy-critical scenarios

#### Usage Example

```javascript
const options = await apiClient.scrapeHotels();
const allOption = options.find(opt => opt.type === 'All');
const hotelOptions = options.filter(opt => opt.type === 'Hotel');
```

---

### FR-API-005: Vacancy Search

**Priority:** High  
**Status:** ✅ Implemented

#### Description

The API Client Service shall search for hotel room vacancies between specified check-in and check-out dates.

#### Acceptance Criteria

- **AC-005.1:** Method shall accept check-in date, check-out date, and hotel filter
- **AC-005.2:** Method shall convert Date objects to ISO 8601 format (YYYY-MM-DD)
- **AC-005.3:** Method shall accept date strings in ISO format
- **AC-005.4:** Hotel parameter shall default to '-1' (all hotels)
- **AC-005.5:** Request shall use search timeout (60 seconds)
- **AC-005.6:** Method shall construct URL with query parameters
- **AC-005.7:** Method shall log search parameters and results
- **AC-005.8:** Method shall return vacancy data structure
- **AC-005.9:** Method shall handle holiday package detection

#### Method Signature

```javascript
async searchVacancies(
    checkinDate: Date | string,
    checkoutDate: Date | string,
    hotel: string = '-1'
): Promise<VacancySearchResult>
```

#### Request Format

```text
GET /api/vagas/search?hotel={hotelId}&checkin={yyyy-MM-dd}&checkout={yyyy-MM-dd}
```

**Parameters:**

- `hotel`: Hotel ID or '-1' for all hotels
- `checkin`: Check-in date in ISO format (YYYY-MM-DD)
- `checkout`: Check-out date in ISO format (YYYY-MM-DD)

#### Response Structure

```javascript
{
    success: boolean,
    method: string,              // "cached" | "puppeteer" | "static"
    headlessMode: boolean,
    resourceSavings: object,
    hotelFilter: string,
    data: {
        success: boolean,
        date: string,
        hasAvailability: boolean,
        result: {
            status: string,
            vacancies: Array<string>,
            hotelGroups: {
                [hotelName]: Array<string>
            }
        }
    },
    holidayPackage?: {
        type: "CHRISTMAS" | "NEW_YEAR",
        name: string,
        duration: string,
        dates: {
            checkin: string,
            checkout: string
        }
    }
}
```

#### Date Format Conversion

```javascript
// Accepts Date objects
await apiClient.searchVacancies(
    new Date('2025-12-20'),
    new Date('2025-12-22'),
    '5'
);

// Accepts ISO strings
await apiClient.searchVacancies('2025-12-20', '2025-12-22', '5');
```

#### Business Rules

**Hotel Filter:**

- '-1': Search all hotels
- Specific ID: Search only that hotel

**Date Validation:**

- Dates must be in ISO format (YYYY-MM-DD)
- Check-out must be same or after check-in (validated server-side)
- Holiday periods may require package dates (validated server-side)

**Holiday Packages (Booking Rules BR-18, BR-19):**

- Christmas: Dec 22 → Dec 27 (mandatory)
- New Year: Dec 27 → Jan 2 (mandatory)
- Server returns 400 error if dates violate rules

#### Error Handling

**Timeout:**

- 60 second timeout for search operations
- Throws 'Request timeout' error

**Booking Rule Violations:**

- HTTP 400 with error code and message
- Client displays booking rule error inline

**Network Errors:**

- Propagated to caller
- Retry logic handled by ibira.js (3 attempts)

#### Performance Optimization

**Server-Side Caching:**

- API caches recent searches
- Repeat searches return cached results
- Cache indicated by `method: "cached"` in response

**Resource Savings:**

- Server reports resource savings when using cache
- Client logs optimization information

#### Usage Example

```javascript
try {
    const result = await apiClient.searchVacancies(
        '2025-12-20',
        '2025-12-22',
        '-1'
    );
    
    if (result.data.hasAvailability) {
        console.log('Vacancies found:', result.data.result.vacancies);
    } else {
        console.log('No vacancies available');
    }
    
    if (result.holidayPackage) {
        console.log('Holiday package detected:', result.holidayPackage.name);
    }
} catch (error) {
    if (error.code === 'BOOKING_RULE_VIOLATION') {
        // Display booking rule error to user
        showBookingRuleError(error.message);
    } else {
        // Handle other errors
        console.error('Search failed:', error.message);
    }
}
```

#### Related Requirements

- FR-005: Vacancy Search Execution (FUNCTIONAL_REQUIREMENTS.md)
- BR-18: Christmas Package Booking Rule
- BR-19: New Year Package Booking Rule

---

### FR-API-006: Weekend Vacancy Search

**Priority:** Low  
**Status:** ✅ Implemented

#### Description

The API Client Service shall provide a method to search for vacancies across multiple consecutive weekends.

#### Acceptance Criteria

- **AC-006.1:** Method shall accept weekend count parameter (1-12)
- **AC-006.2:** Method shall default to 8 weekends if not specified
- **AC-006.3:** Method shall validate count is between 1 and 12
- **AC-006.4:** Method shall throw error if count is invalid
- **AC-006.5:** Request shall use weekend search timeout (10 minutes)
- **AC-006.6:** Method shall log search initiation with duration warning
- **AC-006.7:** Method shall log search completion with statistics
- **AC-006.8:** Method shall return weekend search results

#### Method Signature

```javascript
async searchWeekendVacancies(count: number = 8): Promise<WeekendSearchResult>
```

#### Request Format

```text
GET /api/vagas/search/weekends?count={1-12}
```

**Parameter:**
- `count`: Number of weekends to search (1-12, default: 8)

#### Response Structure

```javascript
{
    success: boolean,
    data: {
        searchDetails: {
            totalWeekendsSearched: number,
            startDate: string,
            endDate: string
        },
        availability: {
            weekendsWithVacancies: number,
            totalVacancies: number
        },
        results: Array<{
            weekend: string,
            checkin: string,
            checkout: string,
            hasVacancy: boolean,
            hotels: Array<string>
        }>
    }
}
```

#### Validation Rules

**Weekend Count:**

- Minimum: 1 weekend
- Maximum: 12 weekends
- Default: 8 weekends

**Validation Error:**

```javascript
throw new Error('Weekend count must be between 1 and 12');
```

#### Performance Considerations

**Operation Duration:**

- 1 weekend: ~30-60 seconds
- 8 weekends: ~4-8 minutes
- 12 weekends: ~6-10 minutes

**Timeout:**

- 10 minute timeout (600,000ms)
- Sufficient for maximum 12 weekends

**User Feedback:**

- Method logs duration warning
- UI should show progress indicator
- Consider async notification pattern

#### Business Rules

**Weekend Definition:**

- Friday to Sunday (2 nights)
- Consecutive weekends from current date
- Automatically calculates future dates

**Search Behavior:**
- Searches ALL hotels for each weekend
- Returns aggregated results
- Identifies weekends with ANY availability

#### Usage Example

```javascript
// Search next 8 weekends (default)
const weekends = await apiClient.searchWeekendVacancies();

// Search next 4 weekends (faster)
const shortSearch = await apiClient.searchWeekendVacancies(4);

// Search next 12 weekends (maximum)
const longSearch = await apiClient.searchWeekendVacancies(12);

// Display results
weekends.data.results.forEach(weekend => {
    if (weekend.hasVacancy) {
        console.log(`Vacancy available: ${weekend.weekend}`);
        console.log(`Hotels: ${weekend.hotels.join(', ')}`);
    }
});
```

#### Use Cases

**Primary Use Case:**
- Planning tool for weekend trips
- Quick overview of availability

**Secondary Use Case:**
- Automated availability monitoring
- Vacation planning assistance

#### Related Requirements

- FR-005: Vacancy Search Execution
- Weekend search documentation (API docs)

---

### FR-API-007: Date Formatting

**Priority:** High  
**Status:** ✅ Implemented

#### Description

The API Client Service shall provide a utility method to format JavaScript Date objects to ISO 8601 format required by the API.

#### Acceptance Criteria

- **AC-007.1:** Method shall accept JavaScript Date object
- **AC-007.2:** Method shall return date string in YYYY-MM-DD format
- **AC-007.3:** Format shall comply with ISO 8601 standard
- **AC-007.4:** Method shall handle timezone conversions correctly
- **AC-007.5:** Method shall be used internally by search methods

#### Method Signature

```javascript
formatDateISO(date: Date): string
```

#### Implementation

```javascript
formatDateISO(date) {
    return date.toISOString().split('T')[0];
}
```

#### Format Examples

| Input | Output |
|-------|--------|
| `new Date('2025-12-20T00:00:00')` | `'2025-12-20'` |
| `new Date('2025-01-05T15:30:00')` | `'2025-01-05'` |
| `new Date('2025-03-15')` | `'2025-03-15'` |

#### Business Rules

- Always use UTC timezone for consistency
- Remove time component (only date)
- Zero-pad month and day

#### Usage

**Internal Usage:**
```javascript
// In searchVacancies method
const checkin = checkinDate instanceof Date 
    ? this.formatDateISO(checkinDate) 
    : checkinDate;
```

**External Usage (if needed):**
```javascript
const isoDate = apiClient.formatDateISO(new Date());
// Returns: '2025-12-17'
```

---

### FR-API-008: Fetch with Timeout

**Priority:** High  
**Status:** ✅ Implemented

#### Description

The API Client Service shall provide a generic fetch wrapper with timeout handling and automatic retry logic via ibira.js.

#### Acceptance Criteria

- **AC-008.1:** Method shall accept URL and timeout parameters
- **AC-008.2:** Method shall use ibira.js fetch manager
- **AC-008.3:** Method shall apply configured timeout to request
- **AC-008.4:** Method shall validate API response structure
- **AC-008.5:** Method shall throw error if success is false
- **AC-008.6:** Method shall handle timeout errors specifically
- **AC-008.7:** Method shall propagate other errors to caller

#### Method Signature

```javascript
async fetchWithTimeout(url: string, timeoutMs: number): Promise<object>
```

#### Error Handling

**Timeout Errors:**
```javascript
if (error.name === 'AbortError') {
    throw new Error('Request timeout - please try again');
}
```

**API Errors:**
```javascript
if (result.success === false) {
    throw new Error(result.error || 'API returned error without message');
}
```

#### Retry Logic (via ibira.js)

**Configuration:**
- Max retries: 3 attempts
- Initial delay: 1000ms
- Backoff multiplier: 2x

**Retry Sequence:**
1. First attempt: Immediate
2. Second attempt: After 1 second
3. Third attempt: After 2 seconds
4. Fourth attempt: After 4 seconds

**Retry Conditions:**
- Network errors
- Timeout errors
- 5xx server errors

**No Retry:**
- 4xx client errors (including booking rules)
- Successful responses (200 OK)

#### Usage

**Internal Usage:**
```javascript
// In getHotels method
const result = await this.fetchWithTimeout(url, this.timeout.default);

// In searchVacancies method
const result = await this.fetchWithTimeout(url, this.timeout.search);

// In searchWeekendVacancies method
const result = await this.fetchWithTimeout(url, this.timeout.weekendSearch);
```

#### Performance Monitoring

**Logging:**
- Request initiation
- Retry attempts
- Response time
- Cache hits

**Statistics:**
- Available via `getCacheStats()`
- Includes retry counts
- Includes timeout occurrences

---

### FR-API-009: Cache Management

**Priority:** Medium  
**Status:** ✅ Implemented

#### Description

The API Client Service shall provide methods to manage and monitor cache state.

#### Acceptance Criteria

- **AC-009.1:** Service shall provide method to clear all caches
- **AC-009.2:** Clear cache shall affect both in-memory and persistent cache
- **AC-009.3:** Service shall provide method to get cache statistics
- **AC-009.4:** Statistics shall include both ibira.js and hotel cache stats
- **AC-009.5:** Service shall provide method to force refresh hotels
- **AC-009.6:** Methods shall log cache operations

#### Methods

**clearCache()**
```javascript
clearCache(): void
```

**Purpose:** Clear all caches (in-memory and persistent)

**Actions:**
- Clear ibira.js fetch manager cache
- Clear persistent hotel cache (localStorage)
- Log cache clearing

**Usage:**
```javascript
apiClient.clearCache();
// Console: '🗑️ All caches cleared'
```

---

**getCacheStats()**
```javascript
getCacheStats(): CacheStatistics
```

**Purpose:** Get comprehensive cache statistics

**Returns:**
```javascript
{
    // From hotelCache
    exists: boolean,
    expired: boolean,
    count: number,
    age: number,        // minutes
    remaining: number,  // minutes
    
    // From ibira.js
    ibiraStats: {
        cacheSize: number,
        hitRate: number,
        totalRequests: number,
        cacheHits: number
    }
}
```

**Usage:**
```javascript
const stats = apiClient.getCacheStats();
console.log(`Cache hit rate: ${stats.ibiraStats.hitRate}%`);
console.log(`Hotels cached: ${stats.count}`);
```

---

**refreshHotels()**
```javascript
async refreshHotels(): Promise<Array<Hotel>>
```

**Purpose:** Force refresh hotel list bypassing cache

**Implementation:**
```javascript
async refreshHotels() {
    console.log('🔄 Forcing hotel list refresh...');
    return this.getHotels(true);
}
```

**Usage:**
```javascript
const freshHotels = await apiClient.refreshHotels();
```

#### Related Requirements

- FR-CACHE-001: Persistent Hotel Cache
- FR-001: Hotel Selection

---

## 4. Error Handling

### 4.1 Error Types

**Network Errors:**
- Connection refused
- DNS resolution failure
- Network timeout

**Timeout Errors:**
- Request exceeds configured timeout
- Special handling with user-friendly message

**API Errors:**
- `success: false` in response
- Error message in response.error field

**Booking Rule Errors:**
- HTTP 400 with booking rule violation
- Special error code for holiday packages

**Validation Errors:**
- Invalid parameters
- Out of range values

### 4.2 Error Handling Strategy

**Automatic Retry:**
- Network errors: 3 retries with backoff
- Timeout errors: 3 retries with backoff
- 5xx errors: 3 retries with backoff

**No Retry:**
- 4xx client errors
- Booking rule violations
- Validation errors

**Error Propagation:**
- All errors thrown to caller
- Detailed error messages
- Stack trace preserved

### 4.3 Error Messages

**User-Facing Messages:**
```javascript
'Request timeout - please try again'
'Hotel list unavailable - please refresh'
'Search failed - please try different dates'
'Weekend count must be between 1 and 12'
```

**Developer Messages:**
```javascript
'API returned error without message'
'Invalid response structure'
'Network request failed'
```

---

## 5. Performance Characteristics

### 5.1 Response Times

| Operation | Typical | Maximum | Timeout |
|-----------|---------|---------|---------|
| Health Check | < 100ms | 1s | 30s |
| Get Hotels (cached) | < 10ms | 100ms | N/A |
| Get Hotels (API) | 200-500ms | 2s | 30s |
| Scrape Hotels | 2-5s | 10s | 60s |
| Vacancy Search | 3-10s | 30s | 60s |
| Weekend Search (8) | 4-8min | 10min | 10min |

### 5.2 Caching Strategy

**In-Memory Cache (ibira.js):**
- Size: 100 requests
- TTL: 5 minutes
- LRU eviction

**Persistent Cache (hotelCache):**
- Storage: localStorage
- TTL: 5 minutes
- Manual invalidation

### 5.3 Optimization Techniques

**Cache-First Strategy:**
- Check cache before API call
- Return cached data if valid
- Background refresh optional

**Retry with Backoff:**
- Exponential backoff (1s, 2s, 4s)
- Reduces server load
- Improves success rate

**Request Deduplication:**
- Ibira.js prevents duplicate concurrent requests
- Returns same promise for identical URLs
- Reduces unnecessary API calls

---

## 6. Security Considerations

### 6.1 HTTPS Enforcement

**Production:**
- Always use HTTPS for API calls
- Base URL: `https://www.mpbarbosa.com/api`

**Development:**
- HTTP allowed for localhost
- Base URL: `http://localhost:3001/api`

### 6.2 Data Validation

**Input Validation:**
- Date format validation
- Parameter range validation
- Type checking

**Response Validation:**
- Structure validation
- Success flag checking
- Data integrity verification

### 6.3 Sensitive Data

**No Sensitive Data:**
- Service does not handle authentication
- No user credentials
- No payment information

**API Keys:**
- Not required for current implementation
- Future enhancement if needed

---

## 7. Testing

### 7.1 Test Coverage

**Unit Tests:**
- Method behavior testing
- Error handling
- Date formatting
- Cache operations

**Integration Tests:**
- API endpoint communication
- Response parsing
- Retry logic
- Timeout handling

**E2E Tests:**
- Full search workflows
- Cache persistence
- Error recovery

### 7.2 Test Scenarios

**Health Check:**
```javascript
test('checkHealth returns success', async () => {
    const result = await apiClient.checkHealth();
    expect(result.success).toBe(true);
    expect(result.status).toBe('OK');
});
```

**Hotel List Caching:**
```javascript
test('getHotels uses cache on second call', async () => {
    await apiClient.getHotels();  // First call (API)
    const cached = await apiClient.getHotels();  // Second call (cache)
    expect(cached).toBeDefined();
});
```

**Vacancy Search:**
```javascript
test('searchVacancies returns results', async () => {
    const result = await apiClient.searchVacancies(
        '2025-12-20',
        '2025-12-22',
        '-1'
    );
    expect(result.data).toBeDefined();
    expect(result.data.hasAvailability).toBeDefined();
});
```

**Error Handling:**
```javascript
test('throws error on timeout', async () => {
    await expect(
        apiClient.searchVacancies('2025-12-20', '2025-12-22', '-1')
    ).rejects.toThrow('Request timeout');
});
```

---

## 8. Usage Examples

### 8.1 Basic Hotel Search

```javascript
import { apiClient } from './services/apiClient.js';

// Initialize (automatic on import)

// Load hotels
const hotels = await apiClient.getHotels();
console.log(`Loaded ${hotels.length} hotels`);

// Search for vacancies
const result = await apiClient.searchVacancies(
    '2025-12-20',
    '2025-12-22',
    '-1'  // All hotels
);

if (result.data.hasAvailability) {
    console.log('Vacancies found!');
    Object.keys(result.data.result.hotelGroups).forEach(hotel => {
        console.log(`${hotel}:`);
        result.data.result.hotelGroups[hotel].forEach(vacancy => {
            console.log(`  - ${vacancy}`);
        });
    });
}
```

### 8.2 Force Refresh Hotels

```javascript
// Get fresh hotel list
const freshHotels = await apiClient.refreshHotels();

// Or use getHotels with force parameter
const hotels = await apiClient.getHotels(true);
```

### 8.3 Weekend Planning

```javascript
// Search next 4 weekends
const weekends = await apiClient.searchWeekendVacancies(4);

// Filter weekends with availability
const available = weekends.data.results.filter(w => w.hasVacancy);

console.log(`${available.length} weekends have availability`);
available.forEach(weekend => {
    console.log(`Weekend: ${weekend.weekend}`);
    console.log(`Hotels: ${weekend.hotels.join(', ')}`);
});
```

### 8.4 Error Handling

```javascript
try {
    const result = await apiClient.searchVacancies(
        '2025-12-25',  // Christmas period
        '2025-12-26',
        '-1'
    );
} catch (error) {
    if (error.message.includes('Holiday package required')) {
        // Handle booking rule violation
        console.log('Please book complete holiday package');
    } else if (error.message.includes('timeout')) {
        // Handle timeout
        console.log('Search took too long, please try again');
    } else {
        // Handle other errors
        console.error('Search failed:', error.message);
    }
}
```

### 8.5 Cache Management

```javascript
// Get cache statistics
const stats = apiClient.getCacheStats();
console.log(`Cache age: ${stats.age} minutes`);
console.log(`Expires in: ${stats.remaining} minutes`);
console.log(`Hit rate: ${stats.ibiraStats.hitRate}%`);

// Clear all caches
apiClient.clearCache();

// Refresh specific cache
await apiClient.refreshHotels();
```

---

## 9. Dependencies

### 9.1 External Dependencies

**ibira.js (v1.x)**
- Purpose: API fetch management with retry and caching
- Features: Request deduplication, automatic retry, LRU cache
- License: MIT

### 9.2 Internal Dependencies

**src/config/environment.js**
- Purpose: Environment detection and configuration
- Exports: `getEnvironment()` function

**src/services/hotelCache.js**
- Purpose: Persistent hotel list caching
- Storage: localStorage
- Methods: get(), set(), clear(), getStats()

---

## 10. API Compatibility

### 10.1 Supported API Versions

**Current:** busca_vagas v1.4.1  
**Minimum:** busca_vagas v1.2.1  
**Tested:** v1.2.1, v1.3.0, v1.4.0, v1.4.1

### 10.2 Breaking Changes

None - Client is forward compatible with v1.x.x releases

### 10.3 API Documentation

**Official API Docs:**
- https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API_CLIENT_DOCUMENTATION.md

**Data Flow:**
- https://github.com/mpbarbosa/busca_vagas/blob/main/docs/DATA_FLOW_DOCUMENTATION.md

---

## 11. Future Enhancements

### 11.1 Planned Features

**Authentication:**
- API key support
- Token-based authentication
- User session management

**Advanced Caching:**
- Service worker integration
- IndexedDB for large datasets
- Cache warming strategies

**Monitoring:**
- Performance metrics
- Error rate tracking
- Usage analytics

**Optimization:**
- Request batching
- GraphQL support
- WebSocket for real-time updates

### 11.2 Out of Scope

- User authentication
- Payment processing
- Booking management
- Email notifications

---

## 12. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-17 | Monitora Vagas Team | Initial functional requirements for API Client Service |

---

## 13. References

### 13.1 Related Documents

- [FUNCTIONAL_REQUIREMENTS.md](./FUNCTIONAL_REQUIREMENTS.md) - Application functional requirements
- [MAIN_JS_TECHNICAL_SPECIFICATION.md](../specifications/MAIN_JS_TECHNICAL_SPECIFICATION.md) - Technical specifications
- [API_DOCUMENTATION.md](../api/API_DOCUMENTATION.md) - API endpoint documentation

### 13.2 External References

- [Busca Vagas API GitHub](https://github.com/mpbarbosa/busca_vagas)
- [ibira.js Documentation](https://github.com/mpbarbosa/ibira.js)
- [ISO 8601 Date Format](https://en.wikipedia.org/wiki/ISO_8601)

---

**Document Status:** ✅ Complete and Approved  
**Implementation Status:** ✅ Fully Implemented  
**Test Coverage:** ✅ Integration tests recommended  
**Next Review Date:** 2026-01-17
