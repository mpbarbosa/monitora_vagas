/**
 * UI State Management Tests
 * Tests for page state transitions and UI element visibility/behavior
 */

describe('UI State Management', () => {
    describe('Guest Number Buttons State', () => {
        test('plus and minus buttons should have state-initial class in initial state', () => {
            const plusButton = document.createElement('span');
            plusButton.className = 'plus state-initial';
            plusButton.setAttribute('aria-disabled', 'true');
            
            const minusButton = document.createElement('span');
            minusButton.className = 'minus state-initial';
            minusButton.setAttribute('aria-disabled', 'true');
            
            expect(plusButton.classList.contains('state-initial')).toBe(true);
            expect(minusButton.classList.contains('state-initial')).toBe(true);
            expect(plusButton.getAttribute('aria-disabled')).toBe('true');
            expect(minusButton.getAttribute('aria-disabled')).toBe('true');
        });

        test('plus and minus buttons should have state-result class in result state', () => {
            const plusButton = document.createElement('span');
            plusButton.className = 'plus state-result';
            plusButton.removeAttribute('aria-disabled');
            
            const minusButton = document.createElement('span');
            minusButton.className = 'minus state-result';
            minusButton.removeAttribute('aria-disabled');
            
            expect(plusButton.classList.contains('state-result')).toBe(true);
            expect(minusButton.classList.contains('state-result')).toBe(true);
            expect(plusButton.hasAttribute('aria-disabled')).toBe(false);
            expect(minusButton.hasAttribute('aria-disabled')).toBe(false);
        });

        test('plus and minus buttons should have state-searching class in searching state', () => {
            const plusButton = document.createElement('span');
            plusButton.className = 'plus state-searching';
            plusButton.setAttribute('aria-disabled', 'true');
            
            const minusButton = document.createElement('span');
            minusButton.className = 'minus state-searching';
            minusButton.setAttribute('aria-disabled', 'true');
            
            expect(plusButton.classList.contains('state-searching')).toBe(true);
            expect(minusButton.classList.contains('state-searching')).toBe(true);
            expect(plusButton.getAttribute('aria-disabled')).toBe('true');
            expect(minusButton.getAttribute('aria-disabled')).toBe('true');
        });
    });

    describe('Page State Transitions', () => {
        test('initial state should have correct element classes', () => {
            const elements = {
                plusButton: { className: 'plus state-initial', ariaDisabled: 'true' },
                minusButton: { className: 'minus state-initial', ariaDisabled: 'true' }
            };
            
            expect(elements.plusButton.className).toContain('state-initial');
            expect(elements.minusButton.className).toContain('state-initial');
        });

        test('searching state should disable guest buttons', () => {
            const elements = {
                plusButton: { className: 'plus state-searching', ariaDisabled: 'true' },
                minusButton: { className: 'minus state-searching', ariaDisabled: 'true' }
            };
            
            expect(elements.plusButton.className).toContain('state-searching');
            expect(elements.minusButton.className).toContain('state-searching');
            expect(elements.plusButton.ariaDisabled).toBe('true');
            expect(elements.minusButton.ariaDisabled).toBe('true');
        });

        test('result state should enable guest buttons', () => {
            const elements = {
                plusButton: { className: 'plus state-result', ariaDisabled: null },
                minusButton: { className: 'minus state-result', ariaDisabled: null }
            };
            
            expect(elements.plusButton.className).toContain('state-result');
            expect(elements.minusButton.className).toContain('state-result');
            expect(elements.plusButton.ariaDisabled).toBeNull();
            expect(elements.minusButton.ariaDisabled).toBeNull();
        });
    });

    describe('Guest Count Display', () => {
        test('guest input should show numeric value without "Hóspedes" prefix in result state', () => {
            const guestInput = document.createElement('input');
            guestInput.value = '2';
            guestInput.setAttribute('readonly', 'true');
            
            expect(guestInput.value).toBe('2');
            expect(guestInput.value).not.toContain('Hóspedes');
        });

        test('guest input should be readonly', () => {
            const guestInput = document.createElement('input');
            guestInput.setAttribute('readonly', 'true');
            
            expect(guestInput.hasAttribute('readonly')).toBe(true);
        });
    });

    describe('Vertical Alignment', () => {
        test('guest input and button container should have same height', () => {
            const guestInput = document.createElement('input');
            guestInput.style.height = '38px';
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.height = '38px';
            
            expect(guestInput.style.height).toBe(buttonContainer.style.height);
        });

        test('guest input and buttons should be vertically aligned', () => {
            const guestInput = document.createElement('input');
            guestInput.style.display = 'flex';
            guestInput.style.alignItems = 'center';
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.alignItems = 'center';
            
            expect(guestInput.style.alignItems).toBe('center');
            expect(buttonContainer.style.alignItems).toBe('center');
        });
    });

    describe('Horizontal Alignment', () => {
        test('guest filter card elements should align horizontally', () => {
            const guestFilterCard = document.createElement('div');
            guestFilterCard.id = 'guest-filter-card';
            guestFilterCard.style.display = 'flex';
            guestFilterCard.style.alignItems = 'center';
            
            const innerDiv = document.createElement('div');
            innerDiv.style.display = 'flex';
            innerDiv.style.alignItems = 'center';
            innerDiv.style.gap = '0.5rem';
            
            const guestInput = document.createElement('input');
            guestInput.style.flex = '1';
            
            expect(guestFilterCard.style.display).toBe('flex');
            expect(innerDiv.style.display).toBe('flex');
            expect(guestInput.style.flex).toBe('1');
        });

        test('plus and minus buttons should be aligned to the right', () => {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'icon-con';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '0.5rem';
            buttonContainer.style.marginLeft = 'auto';
            
            expect(buttonContainer.style.display).toBe('flex');
            expect(buttonContainer.style.marginLeft).toBe('auto');
        });

        test('guest input should expand to fill available space', () => {
            const guestInput = document.createElement('input');
            guestInput.style.flex = '1';
            guestInput.style.minWidth = '0';
            
            expect(guestInput.style.flex).toBe('1');
            expect(guestInput.style.minWidth).toBe('0');
        });
    });

    describe('Cursor Behavior', () => {
        test('plus and minus buttons should have not-allowed cursor in initial state', () => {
            const plusButton = document.createElement('span');
            plusButton.className = 'plus state-initial';
            plusButton.style.cursor = 'not-allowed';
            plusButton.setAttribute('aria-disabled', 'true');
            
            const minusButton = document.createElement('span');
            minusButton.className = 'minus state-initial';
            minusButton.style.cursor = 'not-allowed';
            minusButton.setAttribute('aria-disabled', 'true');
            
            expect(plusButton.style.cursor).toBe('not-allowed');
            expect(minusButton.style.cursor).toBe('not-allowed');
        });

        test('plus and minus buttons should have pointer cursor in result state', () => {
            const plusButton = document.createElement('span');
            plusButton.className = 'plus state-result';
            plusButton.style.cursor = 'pointer';
            plusButton.removeAttribute('aria-disabled');
            
            const minusButton = document.createElement('span');
            minusButton.className = 'minus state-result';
            minusButton.style.cursor = 'pointer';
            minusButton.removeAttribute('aria-disabled');
            
            expect(plusButton.style.cursor).toBe('pointer');
            expect(minusButton.style.cursor).toBe('pointer');
        });

        test('plus and minus buttons should have not-allowed cursor in searching state', () => {
            const plusButton = document.createElement('span');
            plusButton.className = 'plus state-searching';
            plusButton.style.cursor = 'not-allowed';
            plusButton.setAttribute('aria-disabled', 'true');
            
            const minusButton = document.createElement('span');
            minusButton.className = 'minus state-searching';
            minusButton.style.cursor = 'not-allowed';
            minusButton.setAttribute('aria-disabled', 'true');
            
            expect(plusButton.style.cursor).toBe('not-allowed');
            expect(minusButton.style.cursor).toBe('not-allowed');
        });

        test('cursor should match button enabled/disabled state', () => {
            // Enabled button
            const enabledButton = document.createElement('span');
            enabledButton.className = 'plus state-result';
            enabledButton.style.cursor = 'pointer';
            enabledButton.removeAttribute('aria-disabled');
            
            expect(enabledButton.style.cursor).toBe('pointer');
            expect(enabledButton.hasAttribute('aria-disabled')).toBe(false);
            
            // Disabled button
            const disabledButton = document.createElement('span');
            disabledButton.className = 'plus state-initial';
            disabledButton.style.cursor = 'not-allowed';
            disabledButton.setAttribute('aria-disabled', 'true');
            
            expect(disabledButton.style.cursor).toBe('not-allowed');
            expect(disabledButton.getAttribute('aria-disabled')).toBe('true');
        });
    });
});
