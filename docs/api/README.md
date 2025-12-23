# API Documentation

Welcome to the Monitora Vagas API documentation. This folder contains comprehensive documentation for integrating with the busca_vagas API service.

## Documentation Files

### 📖 Main Documentation

**[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - **START HERE**
- Complete API reference
- All endpoints and methods
- Request/response formats
- Usage examples and best practices
- Error handling and caching strategies
- Testing guidelines

### 📋 Integration Guides

**[API_INTEGRATION_UPDATE.md](./API_INTEGRATION_UPDATE.md)**
- Latest integration changes (v1.2.1)
- Migration from old to new API structure
- Validation checklist
- Expected behavior examples

**[API_INTEGRATION_CHANGES.md](./API_INTEGRATION_CHANGES.md)**
- Historical changes log
- Breaking changes documentation
- Migration guides

**[API_INTEGRATION_SUCCESS.md](./API_INTEGRATION_SUCCESS.md)**
- Integration success stories
- Working examples
- Performance metrics

**[INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)**
- Step-by-step integration checklist
- Validation points
- Testing requirements

**[API_CLIENT_USAGE_REVIEW.md](./API_CLIENT_USAGE_REVIEW.md)**
- Code review of API client usage
- Best practices
- Common patterns

## Quick Start

1. **Read the main documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. **Check integration guide**: [API_INTEGRATION_UPDATE.md](./API_INTEGRATION_UPDATE.md)
3. **Review the checklist**: [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)
4. **Run the tests**: `test-api-integration.html`

## API Overview

The Monitora Vagas application integrates with the busca_vagas API to provide:

- 🏨 **Hotel Availability Search** - Real-time vacancy checking
- 📅 **Weekend Search** - Multi-weekend availability scanning
- 🏷️ **Hotel List Management** - Static and dynamic hotel lists
- 💾 **Intelligent Caching** - Persistent storage for optimal performance

## API Client Location

The main API client is located at:
```
src/services/apiClient.js
```

Import and use:
```javascript
import { apiClient } from './services/apiClient.js';

const results = await apiClient.searchVacancies('2025-04-03', '2025-04-05');
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/vagas/hoteis` | GET | Get static hotel list |
| `/api/vagas/hoteis/scrape` | GET | Scrape current hotels |
| `/api/vagas/search` | GET | Search vacancies |
| `/api/vagas/search/weekends` | GET | Search weekends |

## Testing

### Test Files

- **`test-api-integration.html`** - Interactive browser-based tests
- **`tests/simple_ui_test.py`** - Automated UI tests
- **`tests/e2e_test_suite.py`** - End-to-end tests

### Run Tests

```bash
# Start local server
python3 -m http.server 8000

# Open test page
open http://localhost:8000/test-api-integration.html

# Run automated tests
python3 tests/simple_ui_test.py
```

## API Versions

- **Current API Version:** v1.4.1 (busca_vagas, released 2025-12-14)
- **Compatible With:** v1.2.1+ (no breaking changes)
- **Client Version:** 2.1.0
- **Last Updated:** 2025-12-14

### Recent API Updates

- **v1.4.1** (2025-12-14) - Holiday package booking rules (BR-18, BR-19)
- **v1.4.0** (2025-12-09) - Referential transparency refactoring
- **v1.3.0** (2025-12-02) - Added hotel parameter to search endpoint

## External References

- [busca_vagas Repository](https://github.com/mpbarbosa/busca_vagas)
- [DATA_FLOW_DOCUMENTATION.md](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/DATA_FLOW_DOCUMENTATION.md)
- [API_CLIENT_DOCUMENTATION.md](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API_CLIENT_DOCUMENTATION.md)

## Need Help?

1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete reference
2. Review Support & Troubleshooting section in API_DOCUMENTATION.md
3. Check API health: `https://www.mpbarbosa.com/api/health`
4. Review console logs for detailed error messages

## Contributing

When updating API documentation:

1. Update [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) with latest changes
2. Add migration notes to [API_INTEGRATION_CHANGES.md](./API_INTEGRATION_CHANGES.md)
3. Update version numbers and timestamps
4. Test all documented examples
5. Update this README if adding new files

---

**Last Updated:** 2025-12-14  
**Maintained By:** Monitora Vagas Team
