/**
 * Form Validation Service
 * Provides accessible inline form validation with ARIA support
 */

import { logger } from './logger.js';

/**
 * Validation result object
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the validation passed
 * @property {string} message - Error message if validation failed
 */

/**
 * Validates and provides user feedback for form fields
 */
class FormValidator {
    constructor() {
        this.validators = new Map();
        this.errorElements = new Map();
    }

    /**
     * Register a form field for validation
     * @param {string} fieldId - ID of the form field
     * @param {Function} validatorFn - Validation function that returns ValidationResult
     */
    registerField(fieldId, validatorFn) {
        const field = document.getElementById(fieldId);
        if (!field) {
            logger.warn(`Field not found: ${fieldId}`, 'FormValidator');
            return;
        }

        this.validators.set(fieldId, validatorFn);
        
        // Find or create error element
        const errorId = `${fieldId}-error`;
        let errorElement = document.getElementById(errorId);
        
        if (!errorElement) {
            logger.warn(`Error element not found: ${errorId}`, 'FormValidator');
            // Create error element dynamically if missing
            errorElement = document.createElement('small');
            errorElement.id = errorId;
            errorElement.className = 'form-text text-danger';
            errorElement.setAttribute('role', 'alert');
            errorElement.style.display = 'none';
            field.parentElement.appendChild(errorElement);
        }
        
        this.errorElements.set(fieldId, errorElement);
        
        logger.debug(`Registered field: ${fieldId}`, 'FormValidator');
    }

    /**
     * Validate a single field
     * @param {string} fieldId - ID of the field to validate
     * @returns {boolean} - True if valid
     */
    validateField(fieldId) {
        const validator = this.validators.get(fieldId);
        if (!validator) {
            logger.warn(`No validator registered for: ${fieldId}`, 'FormValidator');
            return true;
        }

        const field = document.getElementById(fieldId);
        const errorElement = this.errorElements.get(fieldId);

        try {
            const result = validator(field.value, field);
            
            if (result.isValid) {
                this.clearError(fieldId);
                return true;
            } else {
                this.showError(fieldId, result.message);
                return false;
            }
        } catch (error) {
            logger.error(`Validation error for ${fieldId}`, error, 'FormValidator');
            return false;
        }
    }

    /**
     * Validate all registered fields
     * @returns {boolean} - True if all fields are valid
     */
    validateAll() {
        let allValid = true;
        
        for (const fieldId of this.validators.keys()) {
            const isValid = this.validateField(fieldId);
            if (!isValid) {
                allValid = false;
            }
        }
        
        logger.debug(`Validation result: ${allValid ? 'PASS' : 'FAIL'}`, 'FormValidator');
        return allValid;
    }

    /**
     * Show error message for a field
     * @param {string} fieldId - ID of the field
     * @param {string} message - Error message to display
     */
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = this.errorElements.get(fieldId);

        if (!field || !errorElement) {
            return;
        }

        // Update ARIA attributes
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('is-invalid');

        // Show error message
        errorElement.textContent = message;
        errorElement.style.display = 'block';

        logger.debug(`Showing error for ${fieldId}: ${message}`, 'FormValidator');
    }

    /**
     * Clear error message for a field
     * @param {string} fieldId - ID of the field
     */
    clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = this.errorElements.get(fieldId);

        if (!field || !errorElement) {
            return;
        }

        // Update ARIA attributes
        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('is-invalid');

        // Hide error message
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    /**
     * Clear all errors
     */
    clearAllErrors() {
        for (const fieldId of this.validators.keys()) {
            this.clearError(fieldId);
        }
    }

    /**
     * Reset the validator (clear all registrations)
     */
    reset() {
        this.validators.clear();
        this.errorElements.clear();
        logger.debug('Validator reset', 'FormValidator');
    }
}

// Create singleton instance
const formValidator = new FormValidator();

// Common validation functions
export const validators = {
    /**
     * Validates that a field is not empty
     */
    required: (message = 'Este campo é obrigatório') => {
        return (value) => ({
            isValid: value && value.trim().length > 0,
            message: message
        });
    },

    /**
     * Validates that a select has a valid option selected
     */
    selectRequired: (message = 'Por favor, selecione uma opção') => {
        return (value) => ({
            isValid: value && value !== '' && value !== '-1',
            message: message
        });
    },

    /**
     * Validates date format and that it's not empty
     */
    dateRequired: (message = 'Por favor, selecione uma data') => {
        return (value) => ({
            isValid: value && value.trim().length > 0,
            message: message
        });
    },

    /**
     * Validates that checkout is after checkin
     */
    dateRange: (checkinFieldId, message = 'Check-out deve ser posterior ao check-in') => {
        return (checkoutValue) => {
            const checkinField = document.getElementById(checkinFieldId);
            if (!checkinField || !checkinField.value) {
                return { isValid: true, message: '' }; // Skip if checkin not set
            }

            const checkinDate = new Date(checkinField.value);
            const checkoutDate = new Date(checkoutValue);

            return {
                isValid: checkoutDate > checkinDate,
                message: message
            };
        };
    },

    /**
     * Custom validator that accepts a validation function
     */
    custom: (validatorFn, message) => {
        return (value, field) => ({
            isValid: validatorFn(value, field),
            message: message
        });
    }
};

export { formValidator };
