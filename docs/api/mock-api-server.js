/**
 * Mock API Server for Local Testing
 * Simulates the busca_vagas API responses
 * Based on DATA_FLOW_DOCUMENTATION.md structure
 * 
 * Usage:
 *   node mock-api-server.js
 *   Then open: http://localhost:3000/api/vagas/search?hotel=-1&checkin=2025-12-09&checkout=2025-12-11
 */

const http = require('http');
const url = require('url');

const PORT = 3001; // Changed from 3000 to avoid conflicts

// Mock hotel data
const MOCK_HOTELS = [
    { hotelId: '-1', name: 'Todas', type: 'All' },
    { hotelId: 'amparo', name: 'Amparo', type: 'Hotel' },
    { hotelId: 'appenzell', name: 'Appenzell', type: 'Hotel' },
    { hotelId: 'areado', name: 'Areado', type: 'Hotel' },
    { hotelId: 'avare', name: 'Avaré', type: 'Hotel' },
    { hotelId: 'perdizes', name: 'Perdizes', type: 'Hotel' }
];

// Generate mock vacancy data based on dates
function generateMockVacancies(checkin, checkout, hotel) {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    
    // Format for display (M/D/YYYY)
    const displayDate = `${checkinDate.getMonth() + 1}/${checkinDate.getDate()}/${checkinDate.getFullYear()}`;
    
    // Simulate different scenarios based on dates
    const hasVacancies = Math.random() > 0.2; // 80% chance of finding vacancies
    
    if (!hasVacancies) {
        return {
            success: true,
            date: displayDate,
            hasAvailability: false,
            result: {
                hasAvailability: false,
                status: 'NO AVAILABILITY',
                summary: 'No período escolhido não há nenhum quarto disponível',
                vacancies: [],
                hotelGroups: {}
            }
        };
    }
    
    // Generate mock vacancies
    const mockHotels = hotel === '-1' 
        ? ['Amparo', 'Appenzell', 'Areado']
        : [hotel.charAt(0).toUpperCase() + hotel.slice(1)];
    
    const vacancies = [];
    const hotelGroups = {};
    
    // Brazilian date format for vacancy strings
    const checkinBR = `${String(checkinDate.getDate()).padStart(2, '0')}/${String(checkinDate.getMonth() + 1).padStart(2, '0')}`;
    const checkoutBR = `${String(checkoutDate.getDate()).padStart(2, '0')}/${String(checkoutDate.getMonth() + 1).padStart(2, '0')}`;
    const days = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    
    mockHotels.forEach(hotelName => {
        const roomTypes = [
            { type: 'COQUEIROS', capacity: 3, rooms: Math.floor(Math.random() * 5) + 1 },
            { type: 'JAZZ Luxo', capacity: 2, rooms: Math.floor(Math.random() * 3) + 1 },
            { type: 'FURNAS STANDARD', capacity: 2, rooms: Math.floor(Math.random() * 4) + 2 },
            { type: 'FURNAS', capacity: 3, rooms: Math.floor(Math.random() * 7) + 1 }
        ];
        
        hotelGroups[hotelName] = [];
        
        // Pick 1-2 random room types per hotel
        const numTypes = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numTypes; i++) {
            const room = roomTypes[Math.floor(Math.random() * roomTypes.length)];
            const vacancyStr = `${room.type} (até ${room.capacity} pessoas)${checkinBR} - ${checkoutBR} (${days} dias livres) - ${room.rooms} Quarto(s)`;
            const fullText = `${hotelName}: ${vacancyStr}`;
            
            hotelGroups[hotelName].push(vacancyStr);
            vacancies.push(fullText);
        }
    });
    
    const summary = `Found vacancies in ${mockHotels.length} hotel(s): ${mockHotels.join(', ')}`;
    
    return {
        success: true,
        date: displayDate,
        hasAvailability: true,
        result: {
            hasAvailability: true,
            status: 'AVAILABLE',
            summary: summary,
            vacancies: vacancies,
            hotelGroups: hotelGroups
        }
    };
}

// Request handler
const requestHandler = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    // Enable CORS for local testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);
    
    // Health check endpoint
    if (pathname === '/api/health') {
        const response = {
            status: 'OK',
            message: 'Mock API está funcionando',
            version: '1.3.0-mock',
            name: 'busca_vagas_mock_api',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));
        return;
    }
    
    // Hotels list endpoint
    if (pathname === '/api/vagas/hoteis') {
        const response = {
            success: true,
            data: MOCK_HOTELS
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));
        return;
    }
    
    // Hotels scrape endpoint (same as list for mock)
    if (pathname === '/api/vagas/hoteis/scrape') {
        const response = {
            success: true,
            data: MOCK_HOTELS,
            message: 'Mock data - includes "Todas" option'
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));
        return;
    }
    
    // Vacancy search endpoint
    if (pathname === '/api/vagas/search') {
        const { hotel = '-1', checkin, checkout } = query;
        
        // Validate parameters
        if (!checkin || !checkout) {
            const error = {
                success: false,
                error: 'Both checkin and checkout parameters are required',
                example: '/api/vagas/search?checkin=2025-12-09&checkout=2025-12-11&hotel=-1'
            };
            
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(error, null, 2));
            return;
        }
        
        // Simulate processing delay
        setTimeout(() => {
            const data = generateMockVacancies(checkin, checkout, hotel);
            
            const response = {
                success: true,
                method: 'puppeteer-mock',
                headlessMode: true,
                resourceSavings: '40-60% compared to Selenium',
                hotelFilter: hotel,
                data: data
            };
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response, null, 2));
        }, 500); // 500ms delay to simulate network/processing time
        
        return;
    }
    
    // Weekend search endpoint (simplified mock)
    if (pathname === '/api/vagas/search/weekends') {
        const count = parseInt(query.count) || 8;
        const weekendResults = [];
        
        const today = new Date();
        
        for (let i = 0; i < count; i++) {
            const friday = new Date(today);
            friday.setDate(today.getDate() + (5 - today.getDay() + 7 * i) % 7);
            
            const sunday = new Date(friday);
            sunday.setDate(friday.getDate() + 2);
            
            const checkin = friday.toISOString().split('T')[0];
            const checkout = sunday.toISOString().split('T')[0];
            
            const vacancyData = generateMockVacancies(checkin, checkout, '-1');
            
            weekendResults.push({
                weekendNumber: i + 1,
                dates: `${checkin} to ${checkout}`,
                friday: checkin,
                sunday: checkout,
                ...vacancyData
            });
        }
        
        const response = {
            success: true,
            method: 'puppeteer-mock',
            data: {
                weekendResults: weekendResults,
                searchDetails: {
                    totalWeekendsSearched: count
                }
            }
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));
        return;
    }
    
    // 404 for unknown endpoints
    const error = {
        success: false,
        error: 'Endpoint not found',
        path: pathname,
        availableEndpoints: [
            '/api/health',
            '/api/vagas/hoteis',
            '/api/vagas/hoteis/scrape',
            '/api/vagas/search?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&hotel=-1',
            '/api/vagas/search/weekends?count=8'
        ]
    };
    
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(error, null, 2));
};

// Create server
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║           🎭 MOCK API SERVER RUNNING                            ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Server running at: http://localhost:${PORT}`);
    console.log('');
    console.log('📋 Available Endpoints:');
    console.log('  GET /api/health');
    console.log('  GET /api/vagas/hoteis');
    console.log('  GET /api/vagas/hoteis/scrape');
    console.log('  GET /api/vagas/search?hotel=-1&checkin=2025-12-09&checkout=2025-12-11');
    console.log('  GET /api/vagas/search/weekends?count=8');
    console.log('');
    console.log('🧪 Test URLs:');
    console.log(`  Health:   http://localhost:${PORT}/api/health`);
    console.log(`  Search:   http://localhost:${PORT}/api/vagas/search?hotel=-1&checkin=2025-12-09&checkout=2025-12-11`);
    console.log(`  Weekends: http://localhost:${PORT}/api/vagas/search/weekends?count=4`);
    console.log('');
    console.log('🌐 Update your environment to use:');
    console.log(`  API_BASE_URL: http://localhost:${PORT}/api`);
    console.log('');
    console.log('Press Ctrl+C to stop');
    console.log('══════════════════════════════════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down mock server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
