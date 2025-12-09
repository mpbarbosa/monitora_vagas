#!/bin/bash

# API Integration Test Script
# Tests the updated API integration against DATA_FLOW_DOCUMENTATION.md

echo "🧪 API Integration Test"
echo "======================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API endpoint
API_BASE="https://www.mpbarbosa.com/api"

# Test dates (7 days from today)
CHECKIN=$(date -d "+7 days" +%Y-%m-%d 2>/dev/null || date -v+7d +%Y-%m-%d)
CHECKOUT=$(date -d "+9 days" +%Y-%m-%d 2>/dev/null || date -v+9d +%Y-%m-%d)

echo "📅 Test Dates:"
echo "   Check-in:  $CHECKIN"
echo "   Check-out: $CHECKOUT"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "--------------------"
HEALTH_URL="${API_BASE}/health"
echo "🔍 Testing: $HEALTH_URL"

HEALTH_RESPONSE=$(curl -s "$HEALTH_URL")
HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ "$HEALTH_STATUS" = "operational" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "   Status: $HEALTH_STATUS"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "   Response: $HEALTH_RESPONSE"
fi
echo ""

# Test 2: Basic Vacancy Search (without hotel parameter)
echo "Test 2: Basic Search (Default Hotel)"
echo "------------------------------------"
SEARCH_URL="${API_BASE}/vagas/search?checkin=${CHECKIN}&checkout=${CHECKOUT}"
echo "🔍 Testing: $SEARCH_URL"

SEARCH_RESPONSE=$(curl -s "$SEARCH_URL")
SEARCH_SUCCESS=$(echo "$SEARCH_RESPONSE" | grep -o '"success":[^,]*' | head -1 | cut -d':' -f2)

if [ "$SEARCH_SUCCESS" = "true" ]; then
    echo -e "${GREEN}✅ Basic search completed${NC}"
    
    # Check for expected fields
    HAS_METHOD=$(echo "$SEARCH_RESPONSE" | grep -c '"method"')
    HAS_DATA=$(echo "$SEARCH_RESPONSE" | grep -c '"data"')
    HAS_RESULT=$(echo "$SEARCH_RESPONSE" | grep -c '"result"')
    
    if [ "$HAS_METHOD" -gt 0 ] && [ "$HAS_DATA" -gt 0 ] && [ "$HAS_RESULT" -gt 0 ]; then
        echo -e "${GREEN}✅ Response structure matches DATA_FLOW_DOCUMENTATION${NC}"
        echo "   - Has 'method' field"
        echo "   - Has 'data' field"
        echo "   - Has 'result' field"
    else
        echo -e "${YELLOW}⚠️  Response structure may not match documentation${NC}"
    fi
else
    echo -e "${RED}❌ Basic search failed${NC}"
    echo "   Response: ${SEARCH_RESPONSE:0:200}..."
fi
echo ""

# Test 3: Search with Hotel Parameter
echo "Test 3: Search with Hotel Parameter"
echo "-----------------------------------"
HOTEL_SEARCH_URL="${API_BASE}/vagas/search?hotel=-1&checkin=${CHECKIN}&checkout=${CHECKOUT}"
echo "🔍 Testing: $HOTEL_SEARCH_URL"

HOTEL_RESPONSE=$(curl -s "$HOTEL_SEARCH_URL")
HOTEL_SUCCESS=$(echo "$HOTEL_RESPONSE" | grep -o '"success":[^,]*' | head -1 | cut -d':' -f2)
HOTEL_FILTER=$(echo "$HOTEL_RESPONSE" | grep -o '"hotelFilter":"[^"]*"' | cut -d'"' -f4)

if [ "$HOTEL_SUCCESS" = "true" ]; then
    echo -e "${GREEN}✅ Hotel parameter search completed${NC}"
    echo "   Hotel Filter: $HOTEL_FILTER"
    
    if [ "$HOTEL_FILTER" = "-1" ]; then
        echo -e "${GREEN}✅ Hotel filter correctly set to '-1' (All Hotels)${NC}"
    fi
else
    echo -e "${RED}❌ Hotel parameter search failed${NC}"
fi
echo ""

# Test 4: Response Structure Validation
echo "Test 4: Response Structure Validation"
echo "-------------------------------------"

# Check for all required top-level fields
REQUIRED_FIELDS=("success" "method" "headlessMode" "resourceSavings" "hotelFilter" "data")
ALL_PRESENT=true

for field in "${REQUIRED_FIELDS[@]}"; do
    if echo "$HOTEL_RESPONSE" | grep -q "\"$field\""; then
        echo -e "${GREEN}✅${NC} Field present: $field"
    else
        echo -e "${RED}❌${NC} Field missing: $field"
        ALL_PRESENT=false
    fi
done

# Check nested data fields
echo ""
echo "Checking nested 'data' fields:"
DATA_FIELDS=("success" "date" "hasAvailability" "result")

for field in "${DATA_FIELDS[@]}"; do
    if echo "$HOTEL_RESPONSE" | grep -q "\"$field\""; then
        echo -e "${GREEN}✅${NC} Field present: data.$field"
    else
        echo -e "${RED}❌${NC} Field missing: data.$field"
        ALL_PRESENT=false
    fi
done

echo ""
if [ "$ALL_PRESENT" = true ]; then
    echo -e "${GREEN}✅ All required fields present!${NC}"
    echo -e "${GREEN}✅ Response structure matches DATA_FLOW_DOCUMENTATION.md${NC}"
else
    echo -e "${YELLOW}⚠️  Some fields are missing${NC}"
fi

echo ""
echo "======================="
echo "🎉 Integration Test Complete"
echo ""

# Save full response to file for inspection
echo "📝 Full response saved to: api_test_response.json"
echo "$HOTEL_RESPONSE" | python3 -m json.tool > api_test_response.json 2>/dev/null

echo ""
echo "💡 Next Steps:"
echo "   1. Review api_test_response.json for full details"
echo "   2. Open test-api-integration.html in browser for interactive testing"
echo "   3. Test QuickSearch component in main application"
