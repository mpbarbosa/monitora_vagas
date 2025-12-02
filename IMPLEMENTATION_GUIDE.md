# API Integration Implementation Guide

## 🚀 Quick Start

The application has been updated to use the real busca_vagas backend API instead of client-side simulation.

### What Changed:
✅ Real vacancy data from AFPESP  
✅ Proper API integration with timeout and retry logic  
✅ Environment-aware configuration (dev/production)  
✅ Removed all simulation code  

---

## 📋 Testing the Changes

### 1. Test the API Client (Recommended First Step)

Open the test suite in your browser:
```bash
# If using a local server
open http://localhost:8080/src/api-test.html

# Or with Python
cd src
python3 -m http.server 8080
# Then open http://localhost:8080/api-test.html
```

Run each test in order:
1. ✅ Health Check (should be fast)
2. ✅ Hotel List (should be fast, cached)
3. ✅ Scrape Hotels (may take 30-60 seconds)
4. ✅ Search Vacancies (may take 30-60 seconds)
5. ⏳ Weekend Search (may take up to 10 minutes)

### 2. Test the Main Application

1. Open your application in the browser
2. Try the quick search with specific dates
3. Try the weekend search (be patient, it's now doing real searches!)

---

## 🔧 Configuration

### Environment Detection

The app automatically detects the environment:

- **localhost** → Uses `http://localhost:3000/api`
- **Production domain** → Uses `https://www.mpbarbosa.com/api`

This is configured in `src/config/environment.js`:
```javascript
API_BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://www.mpbarbosa.com/api'
```

### Backend API Must Be Running

⚠️ **Important:** The backend API must be running for the app to work.

**Development:**
```bash
# Start the busca_vagas backend
cd /path/to/busca_vagas
npm start
# API will run on http://localhost:3000
```

**Production:**
The production API should be running at `https://www.mpbarbosa.com/api`

---

## 📁 New Files

### `src/services/apiClient.js`
Main API client service. Use this for all API interactions:
```javascript
import { apiClient } from './services/apiClient.js';

// Search vacancies
const results = await apiClient.searchVacancies('2024-12-25', '2024-12-26');

// Search weekends
const weekends = await apiClient.searchWeekendVacancies(8);

// Get hotels
const hotels = await apiClient.getHotels();
```

### `src/api-test.html`
Interactive test suite for the API client. Open this file in your browser to test all endpoints.

---

## 🐛 Troubleshooting

### Issue: "Request timeout"
**Cause:** Search is taking longer than expected (>60 seconds)  
**Solution:** This is normal for comprehensive searches. Weekend searches can take up to 10 minutes.

### Issue: "HTTP 500" or "HTTP 502"
**Cause:** Backend API is not running or encountered an error  
**Solution:** 
1. Check if the backend API is running
2. Check backend logs for errors
3. Restart the backend API

### Issue: "Failed to fetch" or CORS error
**Cause:** Backend API is not accessible  
**Solution:**
1. Verify backend is running: `curl http://localhost:3000/api/health`
2. Check CORS configuration in backend
3. Verify firewall/network settings

### Issue: Results show "Error loading hotels"
**Cause:** Hotel scraping failed  
**Solution:**
1. Check if AFPESP website is accessible
2. Check backend logs for Puppeteer errors
3. Try again later (may be temporary AFPESP issue)

---

## 📊 API Response Times

Expected response times:

| Endpoint | Expected Time | Timeout |
|----------|--------------|---------|
| Health Check | < 1 second | 30s |
| Hotel List (cached) | < 1 second | 30s |
| Scrape Hotels | 30-60 seconds | 60s |
| Search Vacancies | 30-60 seconds | 60s |
| Weekend Search (8) | 5-10 minutes | 10min |

---

## 🔄 Reverting Changes (if needed)

If you need to revert to the simulation version:

```bash
git checkout HEAD -- src/components/QuickSearch/QuickSearch.js
git checkout HEAD -- src/index.html
git checkout HEAD -- src/config/environment.js
```

---

## 📚 Documentation

- **API Documentation:** [API_CLIENT_DOCUMENTATION.md](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API_CLIENT_DOCUMENTATION.md)
- **Usage Review:** [API_CLIENT_USAGE_REVIEW.md](./API_CLIENT_USAGE_REVIEW.md)
- **Implementation Changes:** [API_INTEGRATION_CHANGES.md](./API_INTEGRATION_CHANGES.md)

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Backend API is running in production
- [ ] Test all endpoints with api-test.html
- [ ] Verify environment detection works correctly
- [ ] Test on actual production domain
- [ ] Monitor API response times
- [ ] Check error handling and user messages
- [ ] Verify timeout settings are appropriate
- [ ] Test with slow network conditions

---

## 💡 Tips

1. **Use the test suite** (`api-test.html`) before deploying
2. **Weekend searches are slow** - warn users in the UI
3. **Cache is enabled** for hotel list (5 minutes)
4. **Retry logic is automatic** for server errors (3 attempts)
5. **Timeouts are generous** but can be adjusted in `apiClient.js`

---

## 🎯 Next Steps

1. Test the implementation locally
2. Verify backend API is working
3. Run the test suite
4. Test the main application
5. Deploy to staging/production
6. Monitor for errors

---

**Need Help?**
- Check the API documentation
- Review the test suite output
- Check browser console for errors
- Check backend API logs

**Last Updated:** 2024-12-02
