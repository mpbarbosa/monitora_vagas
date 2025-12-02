// Guest Counter Handler
(function() {
    'use strict';

    function initGuestCounter() {
        const numberInputs = document.querySelectorAll('.js-number-input');
        
        numberInputs.forEach(function(numberInput) {
            const input = numberInput.querySelector('.quantity');
            const plusBtn = numberInput.querySelector('.plus');
            const minusBtn = numberInput.querySelector('.minus');
            
            if (!input || !plusBtn || !minusBtn) return;
            
            // Get initial value
            let currentValue = parseInt(input.value) || 2;
            
            plusBtn.addEventListener('click', function(e) {
                e.preventDefault();
                currentValue++;
                input.value = currentValue + ' Hóspedes';
            });
            
            minusBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentValue > 1) {
                    currentValue--;
                    input.value = currentValue + ' Hóspedes';
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGuestCounter);
    } else {
        initGuestCounter();
    }
})();
