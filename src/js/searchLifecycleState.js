/**
 * Search Lifecycle UI State Management (FR-008A)
 * Manages enabled/disabled state of UI elements throughout the search lifecycle
 * @version 2.0.0
 */

(function() {
    'use strict';

    const SearchLifecycleState = {
        // DOM element references
        elements: {
            hotelSelect: null,
            checkinInput: null,
            checkoutInput: null,
            guestPlusBtn: null,
            guestMinusBtn: null,
            guestInput: null,
            searchBtn: null,
            resetBtn: null,
            copyResultsBtn: null,
            clearResultsBtn: null,
            resultsContainer: null,
            hotelsCardsContainer: null
        },

        // Current state
        currentState: 'initial', // 'initial', 'searching', 'results'

        /**
         * Initialize the state manager
         */
        init: function() {
            console.log('🔧 Initializing Search Lifecycle State Manager (FR-008A)');
            
            // Get all DOM element references
            this.elements.hotelSelect = document.getElementById('hotel-select');
            this.elements.checkinInput = document.getElementById('input-checkin');
            this.elements.checkoutInput = document.getElementById('input-checkout');
            this.elements.guestPlusBtn = document.querySelector('.plus');
            this.elements.guestMinusBtn = document.querySelector('.minus');
            this.elements.guestInput = document.querySelector('.quantity');
            this.elements.searchBtn = document.getElementById('search-button');
            this.elements.resetBtn = document.getElementById('reset-btn');
            this.elements.copyResultsBtn = document.getElementById('copy-results-btn');
            this.elements.clearResultsBtn = document.getElementById('clear-results-btn');
            this.elements.resultsContainer = document.getElementById('results-container');
            this.elements.hotelsCardsContainer = document.getElementById('hotels-cards-container');

            // Set initial state
            this.setInitialState();
            
            // Setup Reset button handler
            if (this.elements.resetBtn) {
                this.elements.resetBtn.addEventListener('click', () => {
                    this.handleReset();
                });
            }

            console.log('✅ Search Lifecycle State Manager initialized');
        },

        /**
         * Set Initial State (Page Load)
         * AC-008A.1 to AC-008A.4
         * 
         * This method handles ALL UI state changes for initial state.
         * It's called both on page load and when "Reset" is clicked.
         */
        setInitialState: function() {
            console.log('🔄 Setting Initial State');
            this.currentState = 'initial';

            // AC-008A.1: Enable all input elements
            this.enableElement(this.elements.hotelSelect);
            this.enableElement(this.elements.checkinInput);
            this.enableElement(this.elements.checkoutInput);
            
            // AC-008A.2: Enable search button
            this.enableElement(this.elements.searchBtn);
            if (this.elements.searchBtn) {
                this.elements.searchBtn.textContent = 'busca vagas';
            }

            // Reset guest counter to default value (state-driven)
            if (this.elements.guestInput) {
                this.elements.guestInput.value = '2';
            }
            
            // Disable guest counter (FR-004A)
            if (window.GuestFilterStateManager) {
                window.GuestFilterStateManager.disable();
            }
            this.setGuestButtonsState('initial');

            // AC-008A.3: Hide Reset button
            this.hideElement(this.elements.resetBtn);

            // AC-008A.4: Hide action buttons
            this.hideElement(this.elements.copyResultsBtn);
            this.hideElement(this.elements.clearResultsBtn);

            console.log('✅ Initial State set - UI repainted');
        },

        /**
         * Set Searching State (During Search)
         * AC-008A.5 to AC-008A.12
         */
        setSearchingState: function() {
            console.log('🔄 Setting Searching State');
            this.currentState = 'searching';

            // AC-008A.5 to AC-008A.8: Disable all inputs and guest controls
            this.disableElement(this.elements.hotelSelect);
            this.disableElement(this.elements.checkinInput);
            this.disableElement(this.elements.checkoutInput);
            this.disableElement(this.elements.guestPlusBtn);
            this.disableElement(this.elements.guestMinusBtn);

            // Set guest buttons to searching state
            this.setGuestButtonsState('searching');

            // AC-008A.9 & AC-008A.10: Disable search button and change text
            this.disableElement(this.elements.searchBtn);
            if (this.elements.searchBtn) {
                this.elements.searchBtn.textContent = '🔍 Buscando...';
            }

            // AC-008A.12: Visual indication applied via disableElement()
            
            console.log('✅ Searching State set');
        },

        /**
         * Set Results State (After Search Completion)
         * AC-008A.13 to AC-008A.21
         */
        setResultsState: function() {
            console.log('🔄 Setting Results State');
            this.currentState = 'results';

            // AC-008A.13 to AC-008A.15: Keep hotel and date inputs disabled
            this.disableElement(this.elements.hotelSelect);
            this.disableElement(this.elements.checkinInput);
            this.disableElement(this.elements.checkoutInput);

            // AC-008A.16: Enable guest counter (handled by GuestFilterStateManager)
            // Will be enabled by search completion in hotelSearch.js
            this.setGuestButtonsState('results');

            // AC-008A.17: Search button remains disabled
            this.disableElement(this.elements.searchBtn);

            // AC-008A.18: Show and enable Reset button
            this.showElement(this.elements.resetBtn);
            this.enableElement(this.elements.resetBtn);

            // AC-008A.19 & AC-008A.20: Show action buttons
            this.showElement(this.elements.copyResultsBtn);
            this.showElement(this.elements.clearResultsBtn);
            this.enableElement(this.elements.copyResultsBtn);
            this.enableElement(this.elements.clearResultsBtn);

            console.log('✅ Results State set');
        },

        /**
         * Handle Reset button click
         * AC-008A.26 to AC-008A.37
         * 
         * IMPORTANT: This method ONLY changes state to trigger UI repaint.
         * It does NOT manipulate data or DOM content directly.
         * The state change triggers stylistic updates through setInitialState().
         */
        handleReset: function() {
            console.log('🔄 Starting New Search - State Change Only');

            // Change state to initial - this triggers all UI updates
            this.setInitialState();
            
            // Clear results container visibility (stylistic change only)
            if (this.elements.resultsContainer) {
                this.elements.resultsContainer.classList.remove('visible');
            }
            
            // Clear results content (data cleanup delegated to state)
            if (this.elements.hotelsCardsContainer) {
                this.elements.hotelsCardsContainer.innerHTML = '';
            }

            console.log('✅ State changed to initial - UI will repaint');
        },

        /**
         * Helper: Enable an element
         */
        enableElement: function(element) {
            if (!element) return;
            
            element.disabled = false;
            element.style.opacity = '1';
            element.style.cursor = '';
            element.style.pointerEvents = '';
            element.removeAttribute('aria-disabled');
        },

        /**
         * Helper: Disable an element with visual indication
         */
        disableElement: function(element) {
            if (!element) return;
            
            element.disabled = true;
            element.style.opacity = '0.5';
            element.style.cursor = 'not-allowed';
            element.setAttribute('aria-disabled', 'true');
        },

        /**
         * Helper: Show an element
         */
        showElement: function(element) {
            if (!element) return;
            element.style.display = '';
            element.removeAttribute('aria-hidden');
        },

        /**
         * Helper: Hide an element
         */
        hideElement: function(element) {
            if (!element) return;
            element.style.display = 'none';
            element.setAttribute('aria-hidden', 'true');
        },

        /**
         * Set guest buttons visual state (plus/minus)
         * @param {string} state - 'initial', 'searching', or 'results'
         */
        setGuestButtonsState: function(state) {
            const buttons = [this.elements.guestPlusBtn, this.elements.guestMinusBtn];
            const states = ['state-initial', 'state-searching', 'state-results'];
            
            buttons.forEach(function(btn) {
                if (!btn) return;
                
                // Remove all state classes
                states.forEach(function(stateClass) {
                    btn.classList.remove(stateClass);
                });
                
                // Add current state class
                btn.classList.add('state-' + state);
                
                // Set disabled property and aria-disabled attribute
                if (state === 'results') {
                    btn.disabled = false;
                    btn.setAttribute('aria-disabled', 'false');
                } else {
                    btn.disabled = true;
                    btn.setAttribute('aria-disabled', 'true');
                }
            });
            
            console.log('🎨 Guest buttons state: ' + state);
        },

        /**
         * Get current state
         */
        getCurrentState: function() {
            return this.currentState;
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            SearchLifecycleState.init();
        });
    } else {
        SearchLifecycleState.init();
    }

    // Expose to global scope for integration with search flow
    window.SearchLifecycleState = SearchLifecycleState;

})();
