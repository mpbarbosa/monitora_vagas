/**
 * Breadcrumb Navigation Service
 * Manages breadcrumb trail for search flow
 * Provides visual feedback of user location
 * 
 * @module breadcrumb
 * @version 1.0.0
 */

import { logger } from './logger.js';

const BREADCRUMB_STEPS = {
    HOME: {
        id: 'home',
        label: '🏠 Início',
        icon: '🏠',
        title: 'Página inicial'
    },
    SEARCH: {
        id: 'search',
        label: '🔍 Busca de Hotéis',
        icon: '🔍',
        title: 'Formulário de busca'
    },
    RESULTS: {
        id: 'results',
        label: '📋 Resultados',
        icon: '📋',
        title: 'Resultados da busca'
    }
};

/**
 * Breadcrumb class
 * Manages breadcrumb navigation state
 */
class Breadcrumb {
    constructor() {
        this.currentStep = 'home';
        this.container = null;
    }

    /**
     * Initialize breadcrumb
     */
    init() {
        this.container = document.getElementById('breadcrumb-nav');
        if (!this.container) {
            logger.warn('Breadcrumb container not found', 'Breadcrumb');
            return;
        }

        logger.debug('Breadcrumb initialized', 'Breadcrumb');
        this.updateBreadcrumb('home');
    }

    /**
     * Update breadcrumb to show current step
     * @param {string} step - Current step ('home', 'search', 'results')
     * @param {Object} data - Optional data (hotel name, date range, etc)
     */
    updateBreadcrumb(step, data = {}) {
        if (!this.container) return;

        this.currentStep = step;
        
        const steps = this.getStepsUpTo(step);
        const breadcrumbHTML = steps.map((s, index) => {
            const isLast = index === steps.length - 1;
            const stepData = BREADCRUMB_STEPS[s.toUpperCase()];
            
            if (isLast) {
                // Current step - not clickable
                return `
                    <li class="breadcrumb-item active" 
                        data-step="${s}" 
                        aria-current="page">
                        <span title="${stepData.title}">
                            ${stepData.label}
                        </span>
                    </li>
                `;
            } else {
                // Previous step - clickable
                return `
                    <li class="breadcrumb-item" data-step="${s}">
                        <a href="#" 
                           class="breadcrumb-link" 
                           data-step="${s}"
                           title="${stepData.title}"
                           aria-label="Voltar para ${stepData.title}">
                            ${stepData.label}
                        </a>
                    </li>
                `;
            }
        }).join('');

        this.container.innerHTML = breadcrumbHTML;
        
        // Add click handlers to links
        this.container.querySelectorAll('.breadcrumb-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetStep = link.getAttribute('data-step');
                this.navigateToStep(targetStep);
            });
        });

        logger.debug(`Breadcrumb updated to: ${step}`, 'Breadcrumb');
    }

    /**
     * Get array of steps up to current step
     * @param {string} step - Target step
     * @returns {Array<string>} Array of step IDs
     */
    getStepsUpTo(step) {
        const allSteps = ['home', 'search', 'results'];
        const targetIndex = allSteps.indexOf(step);
        
        if (targetIndex === -1) {
            return ['home'];
        }
        
        return allSteps.slice(0, targetIndex + 1);
    }

    /**
     * Navigate to a specific step
     * @param {string} step - Target step
     */
    navigateToStep(step) {
        logger.debug(`Navigating to step: ${step}`, 'Breadcrumb');
        
        switch (step) {
            case 'home':
                this.goHome();
                break;
            case 'search':
                this.goToSearch();
                break;
            case 'results':
                // Already at results, do nothing
                break;
        }
    }

    /**
     * Go to home (reset everything)
     */
    goHome() {
        // Clear results
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.classList.remove('visible');
        }
        
        const hotelsContainer = document.getElementById('hotels-cards-container');
        if (hotelsContainer) {
            hotelsContainer.innerHTML = '';
        }
        
        // Reset form
        const hotelSelect = document.getElementById('hotel-select');
        if (hotelSelect) {
            hotelSelect.value = '';
            hotelSelect.focus();
        }
        
        this.updateBreadcrumb('home');
        logger.info('Navigated to home', 'Breadcrumb');
    }

    /**
     * Go to search (show form, hide results)
     */
    goToSearch() {
        // Just hide results, keep form values
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.classList.remove('visible');
        }
        
        // Focus hotel select
        const hotelSelect = document.getElementById('hotel-select');
        if (hotelSelect) {
            hotelSelect.focus();
        }
        
        this.updateBreadcrumb('search');
        logger.info('Navigated to search', 'Breadcrumb');
    }

    /**
     * Show search step (when form is being filled)
     */
    showSearch() {
        this.updateBreadcrumb('search');
    }

    /**
     * Show results step (when results are displayed)
     * @param {Object} data - Search data (optional)
     */
    showResults(data = {}) {
        this.updateBreadcrumb('results', data);
    }

    /**
     * Get current step
     * @returns {string} Current step ID
     */
    getCurrentStep() {
        return this.currentStep;
    }
}

// Export singleton instance
export const breadcrumb = new Breadcrumb();

// Export constants
export { BREADCRUMB_STEPS };
