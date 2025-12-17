# API Client Quick Reference Guide

## Overview

Quick reference for using the enhanced BuscaVagasAPIClient with referential transparency improvements.

---

## Installation & Setup

```javascript
import { BuscaVagasAPIClient } from './services/apiClient.js';

// Basic initialization
const client = new BuscaVagasAPIClient();

// With custom logger
const customLogger = {
    log: (msg) => console.log(`[API] ${msg}`)
};
const client = new BuscaVagasAPIClient({ logger: customLogger });
```

---

## API Methods

### Health Check

```javascript
// Check API health status
const health = await client.checkHealth();
// Returns: { status: 'ok', timestamp: '2025-12-17T...' }
```

### Get Hotels

```javascript
// Get hotels (uses cache if available)
const hotels = await client.getHotels();

// Force refresh (bypass cache)
const hotels = await client.getHotels(true);

// With custom time for testing
const hotels = await client.getHotels(false, Date.now());
```

### Search Vacancies

```javascript
// Search all hotels
const results = await client.searchVacancies(
    '2025-12-20',  // checkin date
    '2025-12-22'   // checkout date
);

// Search specific hotel
const results = await client.searchVacancies(
    '2025-12-20',
    '2025-12-22',
    'hotel-123'    // hotel ID
);

// Using Date objects
const checkin = new Date('2025-12-20');
const checkout = new Date('2025-12-22');
const results = await client.searchVacancies(checkin, checkout);
```

### Weekend Search

```javascript
// Search next 8 weekends (default)
const weekends = await client.searchWeekendVacancies();

// Search specific number of weekends (1-12)
const weekends = await client.searchWeekendVacancies(4);
```

### Cache Management

```javascript
// Clear all caches
client.clearCache();

// Get cache statistics
const stats = client.getCacheStats();
// Returns: { isExpired: false, lastFetch: 1234567890, ... }

// Refresh hotel cache
await client.refreshHotels();
```

---

## Pure Helper Functions

All helper functions are exported and can be used independently:

### Date Formatting

```javascript
import { formatDateISO, ensureISOFormat } from './services/apiClient.js';

// Format Date object to ISO string
const isoDate = formatDateISO(new Date());
// Returns: '2025-12-17'

// Ensure ISO format (handles both Date and string)
const iso1 = ensureISOFormat(new Date());
const iso2 = ensureISOFormat('2025-12-17');
// Both return: '2025-12-17'
```

### Validation

```javascript
import { isValidWeekendCount, getWeekendCountError } from './services/apiClient.js';

// Validate weekend count
const valid = isValidWeekendCount(8);    // true
const invalid = isValidWeekendCount(15); // false

// Get error message
const error = getWeekendCountError(15);
// Returns: 'Weekend count must be between 1 and 12'
```

### URL Builders

```javascript
import { 
    buildHealthCheckUrl,
    buildHotelsUrl,
    buildSearchUrl,
    buildWeekendSearchUrl
} from './services/apiClient.js';

const baseUrl = 'http://localhost:3001/api';

// Build various URLs
const healthUrl = buildHealthCheckUrl(baseUrl);
const hotelsUrl = buildHotelsUrl(baseUrl);
const searchUrl = buildSearchUrl(baseUrl, '2025-12-20', '2025-12-22', 'hotel-123');
const weekendUrl = buildWeekendSearchUrl(baseUrl, 8);
```

---

## Error Handling

```javascript
try {
    const results = await client.searchVacancies(checkin, checkout);
} catch (error) {
    if (error.message.includes('timeout')) {
        // Handle timeout
        console.error('Request timed out');
    } else if (error.message.includes('HTTP error')) {
        // Handle HTTP error
        console.error('Server error:', error.message);
    } else {
        // Handle other errors
        console.error('Unexpected error:', error);
    }
}
```

---

## Testing

### Unit Tests

```bash
# Run unit tests (tests pure functions)
npm run test:api

# Watch mode
npm run test:api:watch

# With coverage
npm run test:api:coverage
```

### E2E Tests

```bash
# Requires backend server running
npm run test:e2e

# With custom API URL
TEST_API_URL=http://localhost:3001/api npm run test:e2e
```

### Test Pure Functions

```javascript
import { formatDateISO, isValidWeekendCount } from './services/apiClient.js';

// Test date formatting
expect(formatDateISO(new Date('2025-12-17'))).toBe('2025-12-17');

// Test validation
expect(isValidWeekendCount(8)).toBe(true);
expect(isValidWeekendCount(13)).toBe(false);
```

---

## Configuration

### Timeouts

```javascript
const client = new BuscaVagasAPIClient();

// Default timeouts (in milliseconds)
client.timeout.default        // 30000  (30 seconds)
client.timeout.search         // 60000  (60 seconds)
client.timeout.weekendSearch  // 600000 (10 minutes)
```

### API Base URL

Automatically configured based on environment:

- **Development**: `http://localhost:3001/api`
- **Production**: `https://www.mpbarbosa.com/api`

Override via environment:
```javascript
process.env.API_BASE_URL = 'https://custom-api.com/api';
```

---

## Best Practices

### 1. Use Pure Functions for Testing

```javascript
// Good: Test pure function directly
import { formatDateISO } from './services/apiClient.js';
test('formats date correctly', () => {
    expect(formatDateISO(new Date('2025-12-17'))).toBe('2025-12-17');
});

// Avoid: Testing through client (requires mocking)
test('formats date correctly', async () => {
    const client = new BuscaVagasAPIClient();
    // More complex setup needed
});
```

### 2. Inject Dependencies for Testability

```javascript
// Good: Inject logger for testing
const mockLogger = { log: jest.fn() };
const client = new BuscaVagasAPIClient({ logger: mockLogger });

// Avoid: Using default logger (harder to test)
const client = new BuscaVagasAPIClient();
```

### 3. Handle Cache Appropriately

```javascript
// Good: Clear cache when data changes
await client.searchVacancies(checkin, checkout);
// ... data updated on server ...
client.clearCache();
await client.searchVacancies(checkin, checkout); // Fresh data

// Good: Force refresh for critical operations
const hotels = await client.getHotels(true);
```

### 4. Use Date Objects or ISO Strings

```javascript
// Good: Use Date objects
const results = await client.searchVacancies(
    new Date('2025-12-20'),
    new Date('2025-12-22')
);

// Good: Use ISO strings
const results = await client.searchVacancies(
    '2025-12-20',
    '2025-12-22'
);

// Avoid: Use other date formats
const results = await client.searchVacancies(
    '12/20/2025',  // Will fail
    '12/22/2025'
);
```

---

## Common Patterns

### Search with Loading State

```javascript
async function searchWithLoading(checkin, checkout) {
    showLoadingIndicator();
    try {
        const results = await client.searchVacancies(checkin, checkout);
        displayResults(results);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoadingIndicator();
    }
}
```

### Retry on Failure

```javascript
async function searchWithRetry(checkin, checkout, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await client.searchVacancies(checkin, checkout);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

### Cache-First Strategy

```javascript
async function getHotelsWithCache() {
    // Try cache first
    const stats = client.getCacheStats();
    if (!stats.isExpired) {
        return await client.getHotels(false);
    }
    
    // Refresh if expired
    return await client.refreshHotels();
}
```

---

## Performance Tips

1. **Use Cache**: Don't force refresh unless necessary
2. **Batch Requests**: Use weekend search for multiple dates
3. **Clear Old Cache**: Call `clearCache()` periodically
4. **Monitor Timeouts**: Adjust based on network conditions
5. **Test Pure Functions**: They're fast and don't need API

---

## Troubleshooting

### "HTTP error! status: 404"
- Backend server not running
- Incorrect API URL
- Endpoint doesn't exist

### "Request timeout"
- Server is slow
- Network issues
- Increase timeout configuration

### "Weekend count must be between 1 and 12"
- Invalid weekend count parameter
- Use `isValidWeekendCount()` to validate first

### "fetch is not defined"
- Node.js version too old
- Install node-fetch: `npm install node-fetch`

---

## Related Documentation

- **Implementation Summary**: `docs/features/FR-008A_IMPLEMENTATION_SUMMARY.md`
- **Functional Requirements**: `docs/features/API_CLIENT_FUNCTIONAL_REQUIREMENTS.md`
- **E2E Test Guide**: `tests/e2e/README.md`
- **Referential Transparency**: `.github/REFERENTIAL_TRANSPARENCY.md`

---

## Version History

- **v1.1.0** (2025-12-17): Referential transparency improvements
- **v1.0.0**: Initial implementation

---

**Last Updated**: 2025-12-17
