# API Configuration Guide

## Overview

The Monitora Vagas application can work with different API endpoints depending on your needs:
- **Production API** (default) - Live data from `https://www.mpbarbosa.com/api`
- **Local Mock API** - Test data from `http://localhost:3001/api`
- **Local Busca Vagas API** - Full API running locally

## Default Configuration

By default, the application uses the **production API** regardless of where you access it from:
- `http://localhost:8080/public/index.html` → Production API ✅
- `https://yourdomain.com/` → Production API ✅

This ensures the app works out-of-the-box without needing to run a local API server.

## Using Local API

If you want to use a local API (for development or testing), add the `?useLocalAPI=true` query parameter:

```
http://localhost:8080/public/index.html?useLocalAPI=true
```

### Option 1: Mock API Server (Recommended for Testing)

The mock API server provides test data without external dependencies.

1. **Start the mock server:**
   ```bash
   node docs/api/mock-api-server.js
   ```
   
   Output:
   ```
   Mock API Server running on http://localhost:3001
   ```

2. **Access the app:**
   ```
   http://localhost:8080/public/index.html?useLocalAPI=true
   ```

### Option 2: Full Busca Vagas API

For full API functionality with real scraping capabilities:

1. **Clone and setup:**
   ```bash
   git clone https://github.com/mpbarbosa/busca_vagas.git
   cd busca_vagas
   npm install
   ```

2. **Start the API:**
   ```bash
   PORT=3001 node src/server.js
   ```

3. **Access the app:**
   ```
   http://localhost:8080/public/index.html?useLocalAPI=true
   ```

## Environment Detection

The configuration is handled in `public/src/config/environment.js`:

```javascript
API_BASE_URL: (new URLSearchParams(window.location.search).get('useLocalAPI') === 'true')
    ? 'http://localhost:3001/api'
    : 'https://www.mpbarbosa.com/api'
```

### Configuration Logic

| URL Parameter | API Endpoint |
|--------------|--------------|
| None | Production API |
| `?useLocalAPI=true` | Local API (port 3001) |
| `?useLocalAPI=false` | Production API |

## Troubleshooting

### CORS Errors

**Problem:**
```
Access to fetch at 'http://localhost:3001/api/vagas/hoteis' from origin 
'http://localhost:8080' has been blocked by CORS policy
```

**Solution:**
This happens when trying to access a local API that isn't running. Either:
1. Remove `?useLocalAPI=true` from URL to use production API
2. Start the local API server (see options above)

### 404 Not Found

**Problem:**
```
GET http://localhost:3001/api/vagas/hoteis 404 (File not found)
```

**Solution:**
The local API server is not running. Start it:
```bash
node docs/api/mock-api-server.js
```

### Connection Failed

**Problem:**
```
TypeError: Failed to fetch
```

**Solution:**
Check if:
1. You have internet connection (for production API)
2. Local API server is running on port 3001 (for local API)
3. Port 3001 is not blocked by firewall

## Testing with Different APIs

### Unit Tests
```bash
npm run test:api
```
Uses mocked data, no API needed.

### E2E Tests (Production API)
```bash
npm run test:e2e
```
Uses production API by default.

### E2E Tests (Local API)
```bash
TEST_API_URL=http://localhost:3001/api npm run test:e2e
```
Requires local API server running.

## API Endpoints

### Production API
- Base URL: `https://www.mpbarbosa.com/api`
- Health: `GET /vagas/health`
- Hotels: `GET /vagas/hoteis`
- Search: `GET /vagas/search?hotel={id}&checkin={date}&checkout={date}`

### Local API
- Base URL: `http://localhost:3001/api`
- Same endpoints as production

## Configuration File

Location: `public/src/config/environment.js`

Key settings:
```javascript
API_BASE_URL: // API endpoint
CACHE_TTL: 300000, // 5 minutes
RATE_LIMIT_MAX_REQUESTS: 10,
RATE_LIMIT_WINDOW: 900000 // 15 minutes
```

## Security Considerations

- Production API uses HTTPS with CORS enabled
- Local API is for development only (HTTP)
- No sensitive data stored in configuration
- API keys should be server-side only

## Migration from v1.x

**Old behavior (v1.x):**
- Localhost → Local API (required running server)
- Other domains → Production API

**New behavior (v2.x):**
- Any domain → Production API (default)
- Add `?useLocalAPI=true` → Local API (optional)

This change makes the app work out-of-the-box without setup.

---

**Last Updated:** 2025-12-17  
**Version:** 2.0.0
