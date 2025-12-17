# End-to-End (E2E) Tests for API Client

## Overview

This directory contains E2E tests for the BuscaVagasAPIClient service. These tests verify real API interactions with the backend server.

## Prerequisites

**IMPORTANT**: These tests require the backend API server to be running!

### Starting the Backend Server

1. Navigate to the backend repository (busca_vagas)
2. Start the server:
   ```bash
   python3 app.py
   ```
3. The server should be running on `http://localhost:3001`

### Test Database

The backend server must have test data available for comprehensive testing.

## Running E2E Tests

```bash
# Run all E2E tests (requires backend server running)
npm run test:e2e

# Run with specific API URL
TEST_API_URL=http://localhost:3001/api npm run test:e2e

# Run with watch mode
npm run test:e2e:watch

# Run with coverage
npm run test:e2e:coverage
```

## Test Structure

The E2E test suite covers:

1. **Health Check Endpoint** - Verify API connectivity
2. **Hotel List Endpoint** - Fetch and cache hotel data
3. **Scraping Endpoint** - Trigger data collection
4. **Search Functionality** - Test vacancy search with various parameters
5. **Weekend Search** - Test multi-weekend search functionality
6. **Error Handling** - Verify proper error responses
7. **Performance & Concurrency** - Test timeouts and parallel requests
8. **Cache Behavior** - Verify caching mechanism
9. **End-to-End Workflows** - Complete user scenarios

## Expected Behavior

- Tests will fail with 404/network errors if backend server is not running
- This is expected behavior for E2E tests
- Run unit tests (`npm run test:api`) for offline testing

## Troubleshooting

### "HTTP error! status: 404"
- The backend server is not running
- Start the server as described in Prerequisites

### "fetch failed" or "ECONNREFUSED"
- Backend server is not accessible
- Check if server is running on the correct port
- Verify TEST_API_URL environment variable

### Timeout errors
- Backend server is slow or unresponsive
- Check server logs for errors
- Increase TEST_TIMEOUT if needed

## CI/CD Integration

E2E tests should be run in CI/CD pipelines with:
1. Backend server started as a service
2. Test database seeded with required data
3. Proper environment variables set

Example GitHub Actions workflow:
```yaml
- name: Start Backend Server
  run: |
    cd backend
    python3 app.py &
    sleep 5  # Wait for server to start

- name: Run E2E Tests
  run: npm run test:e2e
  env:
    TEST_API_URL: http://localhost:3001/api
```
