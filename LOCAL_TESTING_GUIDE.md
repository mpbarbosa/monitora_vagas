# 🧪 Local Testing Guide with Mock API

**Last Updated:** 2024-12-03  
**Purpose:** Run complete test suite locally without production API dependency

---

## 🎯 Quick Start (2 Steps)

### Step 1: Start Mock API Server
```bash
cd /home/mpb/Documents/GitHub/monitora_vagas
node mock-api-server.js
```

Expected output:
```
╔══════════════════════════════════════════════════════════════════╗
║           🎭 MOCK API SERVER RUNNING                            ║
╚══════════════════════════════════════════════════════════════════╝

✅ Server running at: http://localhost:3001
```

### Step 2: Open Application (New Terminal)
```bash
cd /home/mpb/Documents/GitHub/monitora_vagas/src
python3 -m http.server 8080
```

Then browse to: http://localhost:8080/

---

## 📋 What's Mocked

The mock API server simulates all endpoints from DATA_FLOW_DOCUMENTATION.md:

### ✅ Endpoints Available

1. **Health Check**
   ```
   GET http://localhost:3001/api/health
   ```

2. **Hotel List**
   ```
   GET http://localhost:3001/api/vagas/hoteis
   ```

3. **Hotel Scrape**
   ```
   GET http://localhost:3001/api/vagas/hoteis/scrape
   ```

4. **Vacancy Search**
   ```
   GET http://localhost:3001/api/vagas/search?hotel=-1&checkin=2025-12-09&checkout=2025-12-11
   ```

5. **Weekend Search**
   ```
   GET http://localhost:3001/api/vagas/search/weekends?count=8
   ```

---

## 🔄 Auto-Detection

The application automatically detects localhost and uses the mock API:

**When browsing to:**
- `http://localhost:8080/` → Uses `http://localhost:3001/api` (mock)
- `https://www.mpbarbosa.com/...` → Uses `https://www.mpbarbosa.com/api` (production)

This is configured in: `src/config/environment.js`

---

## 🎭 Mock Behavior

### Realistic Simulation
- **500ms delay** on search requests (simulates network/processing)
- **80% chance** of finding vacancies (realistic success rate)
- **Random room types** and quantities
- **Correct date formatting** (M/D/YYYY for display, DD/MM for vacancies)
- **Proper response structure** matching DATA_FLOW_DOCUMENTATION.md

### Mock Hotels
```javascript
[
  { hotelId: '-1', name: 'Todas', type: 'All' },
  { hotelId: 'amparo', name: 'Amparo', type: 'Hotel' },
  { hotelId: 'appenzell', name: 'Appenzell', type: 'Hotel' },
  { hotelId: 'areado', name: 'Areado', type: 'Hotel' },
  { hotelId: 'avare', name: 'Avaré', type: 'Hotel' },
  { hotelId: 'perdizes', name: 'Perdizes', type: 'Hotel' }
]
```

### Mock Vacancies
Example output:
```
Amparo: COQUEIROS (até 3 pessoas)09/12 - 11/12 (2 dias livres) - 3 Quarto(s)
Appenzell: JAZZ Luxo (até 2 pessoas)09/12 - 11/12 (2 dias livres) - 1 Quarto(s)
Areado: FURNAS STANDARD (até 2 pessoas)09/12 - 11/12 (2 dias livres) - 2 Quarto(s)
```

---

## 🧪 Complete Local Test Workflow

### Terminal 1: Mock API
```bash
cd /home/mpb/Documents/GitHub/monitora_vagas
node mock-api-server.js

# Keep running...
```

### Terminal 2: Web Application
```bash
cd /home/mpb/Documents/GitHub/monitora_vagas/src
python3 -m http.server 8080

# Keep running...
```

### Terminal 3: Run Tests
```bash
cd /home/mpb/Documents/GitHub/monitora_vagas

# Test mock API directly
curl http://localhost:3001/api/health

# Test vacancy search
curl "http://localhost:3001/api/vagas/search?hotel=-1&checkin=2025-12-09&checkout=2025-12-11"

# Test weekend search
curl "http://localhost:3001/api/vagas/search/weekends?count=4"
```

### Browser: Interactive Testing
1. Open: http://localhost:8080/
2. Fill in search form:
   - Hotel: Todas
   - Check-in: 09/12/2025
   - Check-out: 11/12/2025
3. Click "busca vagas"
4. Verify results appear in textarea

---

## 📊 Test Scenarios

### Scenario 1: Successful Search
```bash
# Mock API returns vacancies 80% of the time
curl "http://localhost:3001/api/vagas/search?hotel=-1&checkin=2025-12-09&checkout=2025-12-11"
```

**Expected:**
- Status: 200 OK
- hasAvailability: true
- 1-3 hotels with vacancies
- Proper response structure

### Scenario 2: No Availability
```bash
# Mock API returns no availability 20% of the time
# Try multiple times to hit this scenario
curl "http://localhost:3001/api/vagas/search?hotel=-1&checkin=2025-01-01&checkout=2025-01-02"
```

**Expected:**
- Status: 200 OK
- hasAvailability: false
- Empty vacancies array
- "No período escolhido não há nenhum quarto disponível"

### Scenario 3: Missing Parameters
```bash
curl "http://localhost:3001/api/vagas/search?hotel=-1"
```

**Expected:**
- Status: 400 Bad Request
- Error message about missing parameters

### Scenario 4: Health Check
```bash
curl http://localhost:3001/api/health
```

**Expected:**
```json
{
  "status": "OK",
  "message": "Mock API está funcionando",
  "version": "1.3.0-mock"
}
```

---

## 🎨 Testing Interactive Features

### Test Copy Button
1. Run search with mock API
2. Click "📋 Copiar Resultados"
3. Button text changes to "✅ Copiado!"
4. Paste somewhere to verify clipboard content

### Test Clear Button
1. With results displayed
2. Click "🗑️ Limpar Resultados"
3. Textarea content cleared
4. Results container hidden

### Test Loading States
1. Click "busca vagas"
2. Button text changes to "🔍 Buscando..."
3. Button disabled during search
4. After 500ms, results appear

### Test Error Handling
1. Stop mock API server
2. Try to search
3. Error message appears in textarea
4. Console shows error log

---

## 🔍 Console Output

### Mock API Server Console
```
2024-12-03T00:30:00.000Z - GET /api/health
2024-12-03T00:30:15.000Z - GET /api/vagas/search
2024-12-03T00:30:20.000Z - GET /api/vagas/hoteis
```

### Browser Console (Application)
```
🚀 Starting vacancy search flow...
📝 Input parameters: { hotel: '-1', checkinBR: '09/12/2025', checkoutBR: '11/12/2025' }
✅ Dates converted to ISO format: { checkin: '2025-12-09', checkout: '2025-12-11' }
🌐 API Request URL: http://localhost:3001/api/vagas/search?hotel=-1&checkin=2025-12-09&checkout=2025-12-11
📤 Posting data to API...
📥 Fetching API response...
✅ API Response received
📊 Formatting and displaying results...
✅ Results displayed successfully
```

---

## 🐛 Troubleshooting

### Issue: Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solution:**
- Make sure mock API server is running: `node mock-api-server.js`
- Check port 3000 is not in use: `lsof -i :3000`

### Issue: CORS Error
```
Access to fetch at 'http://localhost:3001' has been blocked by CORS policy
```

**Solution:**
- Mock API already includes CORS headers
- Restart mock API server
- Check browser console for actual error

### Issue: Wrong API Being Used
**Check:**
```javascript
// In browser console
console.log(window.location.hostname);
// Should be 'localhost' or '127.0.0.1' for mock
```

**Solution:**
- Access via http://localhost:8080/ (not file://)
- Check `src/config/environment.js`

### Issue: Mock Data Not Changing
**Explanation:**
- Mock generates random data each request
- 80% chance of vacancies, 20% no availability

**To Force Scenario:**
- Edit `mock-api-server.js`
- Change `Math.random() > 0.2` to `true` (always vacancies) or `false` (never)

---

## 📁 Files

| File | Purpose |
|------|---------|
| `mock-api-server.js` | Node.js mock API server |
| `src/config/environment.js` | Auto-detects localhost for mock |
| `LOCAL_TESTING_GUIDE.md` | This file |

---

## ✅ Validation Checklist

- [ ] Mock API starts without errors
- [ ] Health endpoint responds
- [ ] Hotels endpoint returns list
- [ ] Search endpoint returns vacancies
- [ ] Weekend endpoint returns results
- [ ] Web app connects to mock API
- [ ] Search form works
- [ ] Results display in textarea
- [ ] Copy button works
- [ ] Clear button works
- [ ] Console logs show correct flow
- [ ] Error handling works (stop mock server)

---

## 🚀 Benefits of Mock API

1. **No Production Dependency** - Test without internet or production API
2. **Fast Development** - Instant responses, no waiting
3. **Predictable Testing** - Control scenarios (vacancies vs no availability)
4. **Offline Development** - Work anywhere, anytime
5. **Safe Experimentation** - Break things without affecting production
6. **CI/CD Ready** - Automated tests can run in isolation

---

## 📊 Mock vs Production

| Feature | Mock API | Production API |
|---------|----------|----------------|
| **Speed** | 500ms | 30-60 seconds |
| **Data** | Random | Real scraping |
| **Availability** | Always up | Depends on AFPESP |
| **CORS** | Enabled | Enabled |
| **Structure** | Matches docs | Matches docs |
| **Vacancies** | 80% chance | Real availability |

---

## 🎯 Next Steps

1. **Start mock server** → `node mock-api-server.js`
2. **Start web server** → `cd src && python3 -m http.server 8080`
3. **Open browser** → http://localhost:8080/
4. **Test all features** → Use checklist above
5. **Run automated tests** → Can point to localhost:3001

---

**Quick Command:**
```bash
# One-liner to start both servers (requires tmux)
tmux new-session -d 'node mock-api-server.js' \; split-window 'cd src && python3 -m http.server 8080' \; attach
```

---

**Status:** ✅ Ready for Local Testing  
**Requirements:** Node.js, Python 3  
**Setup Time:** < 1 minute
