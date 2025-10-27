/**
 * SearchForm Handler
 * Manages form interactions and date selection logic
 */

export class SearchFormHandler {
    constructor() {
        this.initializeDateMethodSelection();
        this.initializeDateValidation();
    }

    /**
     * Initialize date method selection radio buttons
     */
    initializeDateMethodSelection() {
        const monthsRadio = document.getElementById('date-method-months');
        const rangeRadio = document.getElementById('date-method-range');
        const monthContainer = document.getElementById('month-selection-container');
        const rangeContainer = document.getElementById('date-range-container');

        if (!monthsRadio || !rangeRadio || !monthContainer || !rangeContainer) {
            console.warn('Date method selection elements not found');
            return;
        }

        // Handle months selection
        monthsRadio.addEventListener('change', () => {
            if (monthsRadio.checked) {
                monthContainer.style.display = 'block';
                rangeContainer.style.display = 'none';
                this.clearDateRange();
            }
        });

        // Handle date range selection
        rangeRadio.addEventListener('change', () => {
            if (rangeRadio.checked) {
                monthContainer.style.display = 'none';
                rangeContainer.style.display = 'block';
                this.clearMonthSelection();
                this.setDefaultDateRange();
            }
        });
    }

    /**
     * Initialize date validation for range inputs
     */
    initializeDateValidation() {
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');

        if (!startDateInput || !endDateInput) {
            return;
        }

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        startDateInput.min = today;
        endDateInput.min = today;

        // Validate date range
        startDateInput.addEventListener('change', () => {
            if (startDateInput.value) {
                endDateInput.min = startDateInput.value;
                
                // If end date is before start date, clear it
                if (endDateInput.value && endDateInput.value < startDateInput.value) {
                    endDateInput.value = '';
                }
            }
        });

        endDateInput.addEventListener('change', () => {
            if (endDateInput.value && startDateInput.value) {
                if (endDateInput.value < startDateInput.value) {
                    alert('A data de saída deve ser posterior à data de entrada.');
                    endDateInput.value = '';
                }
            }
        });
    }

    /**
     * Clear date range inputs
     */
    clearDateRange() {
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        
        if (startDate) startDate.value = '';
        if (endDate) endDate.value = '';
    }

    /**
     * Clear month selection
     */
    clearMonthSelection() {
        const monthSelect = document.getElementById('month-selection');
        if (monthSelect) {
            monthSelect.selectedIndex = 0;
        }
    }

    /**
     * Set default date range (today + 7 days)
     */
    setDefaultDateRange() {
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        
        if (startDate && endDate) {
            const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            
            startDate.value = today.toISOString().split('T')[0];
            endDate.value = nextWeek.toISOString().split('T')[0];
        }
    }

    /**
     * Get selected date parameters for search
     */
    getDateParameters() {
        const monthsRadio = document.getElementById('date-method-months');
        const rangeRadio = document.getElementById('date-method-range');
        
        if (monthsRadio && monthsRadio.checked) {
            const monthSelect = document.getElementById('month-selection');
            return {
                method: 'months',
                value: monthSelect ? monthSelect.value : 'both'
            };
        } else if (rangeRadio && rangeRadio.checked) {
            const startDate = document.getElementById('start-date');
            const endDate = document.getElementById('end-date');
            
            return {
                method: 'range',
                startDate: startDate ? startDate.value : '',
                endDate: endDate ? endDate.value : ''
            };
        }
        
        return { method: 'months', value: 'both' }; // Default fallback
    }

    /**
     * Validate date selection before search
     */
    validateDateSelection() {
        const dateParams = this.getDateParameters();
        
        if (dateParams.method === 'range') {
            if (!dateParams.startDate || !dateParams.endDate) {
                return {
                    valid: false,
                    message: 'Por favor, selecione as datas de entrada e saída.'
                };
            }
            
            const start = new Date(dateParams.startDate);
            const end = new Date(dateParams.endDate);
            
            if (start >= end) {
                return {
                    valid: false,
                    message: 'A data de saída deve ser posterior à data de entrada.'
                };
            }
        }
        
        return { valid: true };
    }
}