# 🧪 Web Flow Testing Guide

## Quick Test Steps

### 1. Local Testing (Development)

```bash
# Start local server
cd /home/mpb/Documents/GitHub/monitora_vagas/src
python3 -m http.server 8000

# Open in browser
http://localhost:8000/
```

### 2. Production Testing

```
URL: https://www.mpbarbosa.com/submodules/monitora_vagas/src/
```

### 3. Test Checklist

- [ ] Page loads without errors
- [ ] Hotel dropdown populates
- [ ] Date pickers work
- [ ] Form validation works
- [ ] "Busca vagas" button changes to "🔍 Buscando..."
- [ ] Button is disabled during search
- [ ] API call is made (check Network tab)
- [ ] Results appear in textarea
- [ ] Results are properly formatted
- [ ] Copy button works
- [ ] Clear button works
- [ ] Error handling works

### 4. Test Scenarios

**Scenario 1: Successful Search**
```
Hotel: -1 (Todas)
Check-in: 09/12/2025
Check-out: 11/12/2025
Expected: Results with vacancies displayed
```

**Scenario 2: No Vacancies**
```
Hotel: -1 (Todas)
Check-in: 01/01/2026
Check-out: 02/01/2026
Expected: "Nenhuma vaga encontrada" message
```

**Scenario 3: Invalid Dates**
```
Hotel: -1
Check-in: (empty)
Check-out: 11/12/2025
Expected: Validation error
```

**Scenario 4: API Error**
```
Disconnect internet or use invalid API URL
Expected: Error message in textarea
```

### 5. Console Verification

Open browser console (F12) and check for:
```
✅ 🚀 Starting vacancy search flow...
✅ 📝 Input parameters: {...}
✅ ✅ Dates converted to ISO format: {...}
✅ 🌐 API Request URL: ...
✅ 📤 Posting data to API...
✅ 📥 Fetching API response...
✅ ✅ API Response received: {...}
✅ 📊 Formatting and displaying results...
✅ ✅ Results displayed successfully
```

### 6. Network Tab Verification

Check Network tab for:
- Request URL: `https://www.mpbarbosa.com/api/vagas/search?hotel=-1&checkin=2025-12-09&checkout=2025-12-11`
- Status: 200 OK
- Response: JSON with expected structure

### 7. Expected Results Format

```
════════════════════════════════════════════════════════════════════════════════
         🏨 BUSCA DE VAGAS EM HOTÉIS SINDICAIS - AFPESP
════════════════════════════════════════════════════════════════════════════════

📋 PARÂMETROS DA BUSCA:
...
🤖 INFORMAÇÕES DA API:
...
📊 RESUMO DOS RESULTADOS:
...
🏨 VAGAS DISPONÍVEIS POR HOTEL
...
```

### 8. Screenshots

Take screenshots of:
1. Form with data filled
2. Loading state (button showing "Buscando...")
3. Results displayed in textarea
4. Copy button action
5. Console logs

---

**Status:** Ready for Testing  
**Date:** 2024-12-03
