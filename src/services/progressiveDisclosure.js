/**
 * Progressive Disclosure Service
 * Manages advanced options visibility and state
 * Implements progressive disclosure UX pattern
 * 
 * @module progressiveDisclosure
 * @version 1.0.0
 */

import { logger } from './logger.js';

const STORAGE_KEY = 'advanced-options-state';

/**
 * ProgressiveDisclosure class
 * Manages advanced options accordion state
 */
class ProgressiveDisclosure {
    constructor() {
        this.isExpanded = false;
        this.options = new Map();
        this.accordion = null;
        this.collapseElement = null;
    }

    /**
     * Initialize progressive disclosure
     */
    init() {
        this.accordion = document.getElementById('advanced-options-toggle');
        this.collapseElement = document.getElementById('collapseAdvanced');
        
        if (!this.accordion || !this.collapseElement) {
            logger.warn('Progressive disclosure elements not found', 'ProgressiveDisclosure');
            return;
        }

        // Load saved state
        this.loadState();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Track options
        this.trackOptions();
        
        logger.debug('Progressive disclosure initialized', 'ProgressiveDisclosure');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for accordion state changes
        this.collapseElement.addEventListener('shown.bs.collapse', () => {
            this.isExpanded = true;
            this.saveState();
            logger.debug('Advanced options expanded', 'ProgressiveDisclosure');
        });

        this.collapseElement.addEventListener('hidden.bs.collapse', () => {
            this.isExpanded = false;
            this.saveState();
            logger.debug('Advanced options collapsed', 'ProgressiveDisclosure');
        });

        // Track option changes
        this.collapseElement.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                this.trackOptionChange(e.target);
            }
        });
    }

    /**
     * Track all available options
     */
    trackOptions() {
        const inputs = this.collapseElement.querySelectorAll('input[type="checkbox"], input[type="radio"]');
        
        inputs.forEach(input => {
            this.options.set(input.id, {
                id: input.id,
                type: input.type,
                checked: input.checked,
                label: this.getLabelText(input)
            });
        });

        logger.debug(`Tracking ${this.options.size} advanced options`, 'ProgressiveDisclosure');
    }

    /**
     * Track when an option changes
     * @param {HTMLElement} input - Input element
     */
    trackOptionChange(input) {
        if (this.options.has(input.id)) {
            this.options.get(input.id).checked = input.checked;
            logger.debug(`Option changed: ${input.id} = ${input.checked}`, 'ProgressiveDisclosure');
        }
    }

    /**
     * Get label text for an input
     * @param {HTMLElement} input - Input element
     * @returns {string} Label text
     */
    getLabelText(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        return label ? label.textContent.trim() : input.id;
    }

    /**
     * Expand advanced options
     */
    expand() {
        if (this.collapseElement) {
            const bsCollapse = new bootstrap.Collapse(this.collapseElement, {
                toggle: true
            });
            this.isExpanded = true;
        }
    }

    /**
     * Collapse advanced options
     */
    collapse() {
        if (this.collapseElement) {
            const bsCollapse = bootstrap.Collapse.getInstance(this.collapseElement);
            if (bsCollapse) {
                bsCollapse.hide();
            }
            this.isExpanded = false;
        }
    }

    /**
     * Toggle advanced options
     */
    toggle() {
        if (this.isExpanded) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    /**
     * Get current state of all options
     * @returns {Object} Options state
     */
    getOptionsState() {
        const state = {};
        this.options.forEach((option, id) => {
            state[id] = option.checked;
        });
        return state;
    }

    /**
     * Get option value
     * @param {string} optionId - Option ID
     * @returns {boolean|null} Option checked state
     */
    getOption(optionId) {
        const option = this.options.get(optionId);
        return option ? option.checked : null;
    }

    /**
     * Set option value
     * @param {string} optionId - Option ID
     * @param {boolean} checked - Checked state
     */
    setOption(optionId, checked) {
        const input = document.getElementById(optionId);
        if (input) {
            input.checked = checked;
            this.trackOptionChange(input);
        }
    }

    /**
     * Count active options (non-default state)
     * @returns {number} Count of active options
     */
    countActiveOptions() {
        let count = 0;
        this.options.forEach(option => {
            // Count as active if checkbox is checked
            if (option.type === 'checkbox' && option.checked) {
                count++;
            }
        });
        return count;
    }

    /**
     * Update badge with active options count
     */
    updateBadge() {
        const badge = document.getElementById('advanced-options-badge');
        if (badge) {
            const count = this.countActiveOptions();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline' : 'none';
        }
    }

    /**
     * Save state to localStorage
     */
    saveState() {
        try {
            const state = {
                isExpanded: this.isExpanded,
                options: this.getOptionsState()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            logger.warn('Failed to save advanced options state', error, 'ProgressiveDisclosure');
        }
    }

    /**
     * Load state from localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const state = JSON.parse(saved);
                
                // Restore expansion state
                if (state.isExpanded && this.collapseElement) {
                    this.expand();
                }
                
                // Restore option states
                if (state.options) {
                    Object.entries(state.options).forEach(([id, checked]) => {
                        this.setOption(id, checked);
                    });
                }
            }
        } catch (error) {
            logger.warn('Failed to load advanced options state', error, 'ProgressiveDisclosure');
        }
    }

    /**
     * Reset all options to defaults
     */
    reset() {
        this.options.forEach((option, id) => {
            const input = document.getElementById(id);
            if (input) {
                // Reset to default (usually checked for booking rules)
                input.checked = true;
                this.trackOptionChange(input);
            }
        });
        
        this.collapse();
        this.saveState();
        logger.info('Advanced options reset', 'ProgressiveDisclosure');
    }

    /**
     * Get summary of current settings
     * @returns {string} Human-readable summary
     */
    getSummary() {
        const summaryParts = [];
        
        this.options.forEach(option => {
            if (option.checked) {
                summaryParts.push(option.label);
            }
        });
        
        return summaryParts.length > 0 
            ? summaryParts.join(', ') 
            : 'Nenhuma opção avançada ativa';
    }
}

// Export singleton instance
export const progressiveDisclosure = new ProgressiveDisclosure();
