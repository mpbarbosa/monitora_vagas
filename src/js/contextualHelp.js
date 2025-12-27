/**
 * Contextual Help Tooltip System
 * Provides accessible help tooltips for complex UI elements
 * @module contextualHelp
 * @version 1.0.0
 * @since 2.3.0
 */

import { logger } from '../services/logger.js';

const COMPONENT_NAME = 'ContextualHelp';

/**
 * Help content definitions
 * @const {Object<string, Object>}
 */
const HELP_CONTENT = {
    guestCounter: {
        title: 'Contador de Hóspedes',
        text: 'Selecione o número de hóspedes (adultos e crianças) para sua reserva. Este campo só é habilitado após selecionar um hotel.'
    },
    bookingRules: {
        title: 'Regras de Reserva',
        text: 'Quando ativado, filtra os resultados aplicando regras de permanência mínima, antecedência necessária e períodos bloqueados configurados para cada hotel.'
    },
    checkin: {
        title: 'Data de Check-In',
        text: 'Selecione a data de entrada no hotel. A data deve ser no futuro e anterior ao check-out.'
    },
    checkout: {
        title: 'Data de Check-Out',
        text: 'Selecione a data de saída do hotel. Deve ser posterior à data de check-in.'
    }
};

/**
 * Initialize contextual help tooltips
 * @returns {void}
 */
export function initializeContextualHelp() {
    try {
        logger.info('Initializing contextual help system', COMPONENT_NAME);
        
        // Add help icons to form labels
        addHelpIcon('guest-filter-card', 'guestCounter');
        addHelpIcon('booking-rules-toggle', 'bookingRules', true);
        addHelpIcon('input-checkin', 'checkin');
        addHelpIcon('input-checkout', 'checkout');
        
        // Initialize Bootstrap tooltips
        initializeTooltips();
        
        logger.info('Contextual help initialized successfully', COMPONENT_NAME);
    } catch (error) {
        logger.error('Failed to initialize contextual help', error, COMPONENT_NAME);
    }
}

/**
 * Add help icon next to a form element
 * @param {string} targetId - ID of the target element or its parent
 * @param {string} helpKey - Key to look up help content
 * @param {boolean} isCheckbox - Whether the target is a checkbox (different placement)
 * @returns {void}
 */
function addHelpIcon(targetId, helpKey, isCheckbox = false) {
    try {
        const target = document.getElementById(targetId);
        if (!target) {
            logger.warn(`Target element not found: ${targetId}`, COMPONENT_NAME);
            return;
        }
        
        const helpContent = HELP_CONTENT[helpKey];
        if (!helpContent) {
            logger.warn(`Help content not found for key: ${helpKey}`, COMPONENT_NAME);
            return;
        }
        
        // Create help icon
        const helpIcon = document.createElement('span');
        helpIcon.className = 'help-icon';
        helpIcon.setAttribute('role', 'button');
        helpIcon.setAttribute('tabindex', '0');
        helpIcon.setAttribute('aria-label', `Ajuda: ${helpContent.title}`);
        helpIcon.setAttribute('data-bs-toggle', 'tooltip');
        helpIcon.setAttribute('data-bs-placement', 'top');
        helpIcon.setAttribute('data-bs-html', 'true');
        helpIcon.setAttribute('data-bs-custom-class', 'help-tooltip');
        helpIcon.setAttribute('data-bs-title', `<strong>${helpContent.title}</strong><br>${helpContent.text}`);
        helpIcon.textContent = '?';
        
        // Insert help icon
        if (isCheckbox) {
            // For checkbox, insert after the label
            const label = target.parentElement.querySelector('label');
            if (label) {
                label.appendChild(helpIcon);
            }
        } else {
            // For other inputs, insert after the label in the parent
            const label = target.parentElement.querySelector('label');
            if (label) {
                label.appendChild(helpIcon);
            } else {
                // Fallback: insert at the beginning of parent
                target.parentElement.insertBefore(helpIcon, target.parentElement.firstChild);
            }
        }
        
        logger.debug(`Help icon added for: ${targetId}`, COMPONENT_NAME);
    } catch (error) {
        logger.error(`Failed to add help icon for ${targetId}`, error, COMPONENT_NAME);
    }
}

/**
 * Initialize Bootstrap tooltips for all help icons
 * @returns {void}
 */
function initializeTooltips() {
    try {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => 
            new bootstrap.Tooltip(tooltipTriggerEl, {
                trigger: 'hover focus',
                delay: { show: 300, hide: 100 }
            })
        );
        
        logger.debug(`Initialized ${tooltipList.length} tooltips`, COMPONENT_NAME);
    } catch (error) {
        logger.error('Failed to initialize tooltips', error, COMPONENT_NAME);
    }
}

/**
 * Clean up tooltips on page unload
 * @returns {void}
 */
export function cleanupContextualHelp() {
    try {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(element => {
            const tooltip = bootstrap.Tooltip.getInstance(element);
            if (tooltip) {
                tooltip.dispose();
            }
        });
        
        logger.debug('Contextual help cleaned up', COMPONENT_NAME);
    } catch (error) {
        logger.error('Failed to cleanup contextual help', error, COMPONENT_NAME);
    }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanupContextualHelp);
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeContextualHelp);
    } else {
        // DOM is already loaded
        initializeContextualHelp();
    }
}
