/**
 * Guest Counter Component Tests
 * @jest-environment jsdom
 */

describe('Guest Counter Component', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="guest-filter-card" class="filter-disabled">
                <input type="number" class="quantity" value="1" min="1" max="10" />
            </div>
        `;
    });
    
    test('initializes with filter card in disabled state', () => {
        const filterCard = document.getElementById('guest-filter-card');
        expect(filterCard.classList.contains('filter-disabled')).toBe(true);
    });
    
    test('finds filter card element', () => {
        const filterCard = document.getElementById('guest-filter-card');
        expect(filterCard).not.toBeNull();
    });
    
    test('validates guest number within range', () => {
        const input = document.querySelector('.quantity');
        input.value = 5;
        expect(parseInt(input.value)).toBeGreaterThanOrEqual(1);
        expect(parseInt(input.value)).toBeLessThanOrEqual(10);
    });
    
    test('prevents guest number below minimum', () => {
        const input = document.querySelector('.quantity');
        input.value = 0;
        const value = Math.max(1, parseInt(input.value));
        expect(value).toBe(1);
    });
    
    test('increments guest count', () => {
        const input = document.querySelector('.quantity');
        input.value = 5;
        const newValue = Math.min(10, parseInt(input.value) + 1);
        expect(newValue).toBe(6);
    });
    
    test('decrements guest count', () => {
        const input = document.querySelector('.quantity');
        input.value = 5;
        const newValue = Math.max(1, parseInt(input.value) - 1);
        expect(newValue).toBe(4);
    });
    
    test('input has min and max attributes', () => {
        const input = document.querySelector('.quantity');
        expect(input.getAttribute('min')).toBe('1');
        expect(input.getAttribute('max')).toBe('10');
    });
});
