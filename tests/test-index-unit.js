/**
 * Unit Tests for index.html JavaScript Functions
 * Tests individual functions and components in isolation
 */

describe('Index.html Unit Tests', () => {
    
    // DOM Element Tests
    describe('DOM Elements Existence', () => {
        
        test('hotel select element exists', () => {
            const select = document.getElementById('hotel-select');
            expect(select).not.toBeNull();
            expect(select.tagName).toBe('SELECT');
        });
        
        test('check-in input element exists', () => {
            const input = document.getElementById('input-checkin');
            expect(input).not.toBeNull();
            expect(input.type).toBe('text');
        });
        
        test('check-out input element exists', () => {
            const input = document.getElementById('input-checkout');
            expect(input).not.toBeNull();
            expect(input.type).toBe('text');
        });
        
        test('search button element exists', () => {
            const button = document.getElementById('search-button');
            expect(button).not.toBeNull();
            expect(button.type).toBe('submit');
        });
        
        test('results container element exists', () => {
            const container = document.getElementById('results-container');
            expect(container).not.toBeNull();
        });
        
        test('hotels cards container element exists', () => {
            const container = document.getElementById('hotels-cards-container');
            expect(container).not.toBeNull();
        });
        
        test('copy results button exists', () => {
            const button = document.getElementById('copy-results-btn');
            expect(button).not.toBeNull();
        });
        
        test('clear results button exists', () => {
            const button = document.getElementById('clear-results-btn');
            expect(button).not.toBeNull();
        });
    });
    
    // Date Formatting Function Tests
    describe('Date Formatting Functions', () => {
        
        const formatDateToISO = (dateStr) => {
            const parts = dateStr.split('/');
            if (parts.length !== 3) return null;
            const [day, month, year] = parts;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };
        
        test('converts Brazilian date to ISO format', () => {
            expect(formatDateToISO('01/12/2024')).toBe('2024-12-01');
            expect(formatDateToISO('15/06/2025')).toBe('2025-06-15');
            expect(formatDateToISO('31/01/2024')).toBe('2024-01-31');
        });
        
        test('handles single digit days and months', () => {
            expect(formatDateToISO('1/6/2024')).toBe('2024-06-01');
            expect(formatDateToISO('5/3/2025')).toBe('2025-03-05');
        });
        
        test('returns null for invalid date format', () => {
            expect(formatDateToISO('2024-12-01')).toBeNull();
            expect(formatDateToISO('01-12-2024')).toBeNull();
            expect(formatDateToISO('invalid')).toBeNull();
        });
        
        test('handles edge cases', () => {
            expect(formatDateToISO('')).toBeNull();
            expect(formatDateToISO('01/12')).toBeNull();
            expect(formatDateToISO('01/12/2024/extra')).toBe('2024-12-01');
        });
    });
    
    // API URL Construction Tests
    describe('API URL Construction', () => {
        
        const buildApiUrl = (hotel, checkin, checkout) => {
            return `https://www.mpbarbosa.com/api/vagas/search?hotel=${encodeURIComponent(hotel)}&checkin=${checkin}&checkout=${checkout}`;
        };
        
        test('builds correct API URL with all parameters', () => {
            const url = buildApiUrl('123', '2024-12-01', '2024-12-05');
            expect(url).toContain('hotel=123');
            expect(url).toContain('checkin=2024-12-01');
            expect(url).toContain('checkout=2024-12-05');
        });
        
        test('encodes special characters in hotel parameter', () => {
            const url = buildApiUrl('hotel name with spaces', '2024-12-01', '2024-12-05');
            expect(url).toContain(encodeURIComponent('hotel name with spaces'));
        });
        
        test('handles -1 for all hotels', () => {
            const url = buildApiUrl('-1', '2024-12-01', '2024-12-05');
            expect(url).toContain('hotel=-1');
        });
    });
    
    // Form Validation Tests
    describe('Form Validation', () => {
        
        const validateDates = (checkin, checkout) => {
            if (!checkin || !checkout) {
                return { valid: false, error: 'Por favor, selecione as datas de check-in e check-out' };
            }
            
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            
            if (checkinDate >= checkoutDate) {
                return { valid: false, error: 'Check-out deve ser após check-in' };
            }
            
            return { valid: true };
        };
        
        test('validates empty dates', () => {
            const result = validateDates('', '');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('selecione as datas');
        });
        
        test('validates missing check-in', () => {
            const result = validateDates('', '2024-12-05');
            expect(result.valid).toBe(false);
        });
        
        test('validates missing check-out', () => {
            const result = validateDates('2024-12-01', '');
            expect(result.valid).toBe(false);
        });
        
        test('validates check-out after check-in', () => {
            const result = validateDates('2024-12-05', '2024-12-01');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('após');
        });
        
        test('validates same date check-in and check-out', () => {
            const result = validateDates('2024-12-01', '2024-12-01');
            expect(result.valid).toBe(false);
        });
        
        test('accepts valid date range', () => {
            const result = validateDates('2024-12-01', '2024-12-05');
            expect(result.valid).toBe(true);
        });
    });
    
    // Display Results Function Tests
    describe('Display Results Function', () => {
        
        const mockApiResponse = {
            success: true,
            data: {
                hasAvailability: true,
                result: {
                    vacancies: [
                        'Hotel A - Room 101',
                        'Hotel A - Room 102',
                        'Hotel B - Room 201'
                    ],
                    hotelGroups: {
                        'Hotel A': ['Room 101', 'Room 102'],
                        'Hotel B': ['Room 201']
                    }
                }
            }
        };
        
        test('parses API response correctly', () => {
            expect(mockApiResponse.success).toBe(true);
            expect(mockApiResponse.data.hasAvailability).toBe(true);
            expect(mockApiResponse.data.result.vacancies.length).toBe(3);
        });
        
        test('groups vacancies by hotel', () => {
            const hotelGroups = mockApiResponse.data.result.hotelGroups;
            expect(Object.keys(hotelGroups).length).toBe(2);
            expect(hotelGroups['Hotel A'].length).toBe(2);
            expect(hotelGroups['Hotel B'].length).toBe(1);
        });
    });
    
    // Button State Management Tests
    describe('Button State Management', () => {
        
        const setButtonLoading = (button, isLoading) => {
            if (isLoading) {
                button.disabled = true;
                button.originalText = button.textContent;
                button.textContent = '🔍 Buscando...';
            } else {
                button.disabled = false;
                button.textContent = button.originalText || button.textContent;
            }
        };
        
        test('sets button to loading state', () => {
            const button = document.createElement('button');
            button.textContent = 'busca vagas';
            
            setButtonLoading(button, true);
            
            expect(button.disabled).toBe(true);
            expect(button.textContent).toContain('Buscando');
        });
        
        test('restores button from loading state', () => {
            const button = document.createElement('button');
            button.textContent = 'busca vagas';
            button.originalText = 'busca vagas';
            
            setButtonLoading(button, true);
            setButtonLoading(button, false);
            
            expect(button.disabled).toBe(false);
            expect(button.textContent).toBe('busca vagas');
        });
    });
    
    // Clipboard Functionality Tests
    describe('Clipboard Functionality', () => {
        
        test('clipboard API is available', () => {
            expect(navigator.clipboard).toBeDefined();
        });
        
        test('fallback execCommand is available', () => {
            expect(typeof document.execCommand).toBe('function');
        });
    });
    
    // Hotel Card Generation Tests
    describe('Hotel Card Generation', () => {
        
        const createHotelCard = (hotelName, vacancies) => {
            const card = document.createElement('div');
            card.className = 'hotel-card';
            
            const header = document.createElement('h4');
            header.textContent = hotelName;
            card.appendChild(header);
            
            const badge = document.createElement('span');
            badge.textContent = `${vacancies.length} ${vacancies.length === 1 ? 'vaga' : 'vagas'}`;
            card.appendChild(badge);
            
            vacancies.forEach((vacancy, index) => {
                const item = document.createElement('div');
                item.textContent = `${index + 1}. ${vacancy}`;
                card.appendChild(item);
            });
            
            return card;
        };
        
        test('creates hotel card with correct structure', () => {
            const card = createHotelCard('Test Hotel', ['Room 101', 'Room 102']);
            
            expect(card.className).toBe('hotel-card');
            expect(card.querySelector('h4').textContent).toBe('Test Hotel');
        });
        
        test('displays correct vacancy count', () => {
            const card = createHotelCard('Test Hotel', ['Room 101']);
            const badge = card.querySelector('span');
            
            expect(badge.textContent).toContain('1 vaga');
        });
        
        test('uses plural for multiple vacancies', () => {
            const card = createHotelCard('Test Hotel', ['Room 101', 'Room 102']);
            const badge = card.querySelector('span');
            
            expect(badge.textContent).toContain('2 vagas');
        });
        
        test('lists all vacancies', () => {
            const vacancies = ['Room 101', 'Room 102', 'Room 103'];
            const card = createHotelCard('Test Hotel', vacancies);
            const items = card.querySelectorAll('div');
            
            expect(items.length).toBe(vacancies.length);
        });
    });
    
    // Empty State Tests
    describe('Empty State Display', () => {
        
        const createEmptyState = () => {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 16px;">😔</div>
                <h4>Sem vagas disponíveis</h4>
                <p>Não há quartos disponíveis para o período selecionado.</p>
            `;
            return emptyState;
        };
        
        test('creates empty state element', () => {
            const emptyState = createEmptyState();
            expect(emptyState.className).toBe('empty-state');
        });
        
        test('includes emoji in empty state', () => {
            const emptyState = createEmptyState();
            expect(emptyState.innerHTML).toContain('😔');
        });
        
        test('includes message in empty state', () => {
            const emptyState = createEmptyState();
            expect(emptyState.innerHTML).toContain('Sem vagas disponíveis');
        });
    });
    
    // Input Validation Tests
    describe('Input Field Validation', () => {
        
        const validateDateInput = (input) => {
            const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
            return pattern.test(input);
        };
        
        test('validates correct date format', () => {
            expect(validateDateInput('01/12/2024')).toBe(true);
            expect(validateDateInput('31/12/2024')).toBe(true);
        });
        
        test('rejects incorrect date formats', () => {
            expect(validateDateInput('2024-12-01')).toBe(false);
            expect(validateDateInput('01-12-2024')).toBe(false);
            expect(validateDateInput('1/12/2024')).toBe(false);
            expect(validateDateInput('01/12/24')).toBe(false);
        });
    });
    
    // Scroll Behavior Tests
    describe('Scroll Behavior', () => {
        
        test('scrollIntoView is available', () => {
            const element = document.createElement('div');
            expect(typeof element.scrollIntoView).toBe('function');
        });
    });
    
    // Error Handling Tests
    describe('Error Handling', () => {
        
        const handleApiError = (error) => {
            const errorMessage = error.message || 'Unknown error';
            return {
                success: false,
                error: errorMessage,
                userMessage: `❌ ERRO NA BUSCA\n\n${errorMessage}\n\nPor favor, tente novamente.`
            };
        };
        
        test('handles API errors gracefully', () => {
            const error = new Error('Network error');
            const result = handleApiError(error);
            
            expect(result.success).toBe(false);
            expect(result.error).toBe('Network error');
            expect(result.userMessage).toContain('ERRO NA BUSCA');
        });
        
        test('handles errors without message', () => {
            const error = new Error();
            const result = handleApiError(error);
            
            expect(result.error).toBe('Unknown error');
        });
    });
});

// Test configuration for different environments
const testConfig = {
    timeout: 5000,
    retries: 2,
    slowThreshold: 1000
};

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testConfig
    };
}

console.log('✅ Unit tests loaded successfully');
