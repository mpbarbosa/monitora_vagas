/**
 * Holiday Package Service
 * Handles validation and messaging for mandatory holiday packages
 * Extracted from hotelSearch.js for better maintainability
 * @version 1.0.0
 */

import { logger } from '../services/logger.js';

// ============================================================================
// HOLIDAY PACKAGE DEFINITIONS
// ============================================================================

/**
 * Holiday package configurations
 * Each package has start/end dates and descriptive information
 */
export const HOLIDAY_PACKAGES = {
    CHRISTMAS: {
        id: 'CHRISTMAS',
        name: 'Natal',
        start: '12-22',
        end: '12-27',
        nights: 4,
        days: 5,
        period: ['12-22', '12-23', '12-24', '12-25', '12-26'],
        message: '✅ 5 dias / 4 noites - Pacote de Natal completo',
        warningMessage: '⚠ Datas em período de pacote obrigatório - Pacote de Natal: 22 a 27/dez'
    },
    NEW_YEAR: {
        id: 'NEW_YEAR',
        name: 'Ano Novo',
        start: '12-27',
        end: '01-02',
        nights: 5,
        days: 6,
        period: ['12-27', '12-28', '12-29', '12-30', '12-31', '01-01', '01-02'],
        message: '✅ 6 dias / 5 noites - Pacote de Ano Novo completo',
        warningMessage: '⚠ Datas em período de pacote obrigatório - Pacote de Ano Novo: 27/dez a 02/jan'
    }
};

// ============================================================================
// PURE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Check if dates match a complete holiday package
 * Pure function - deterministic, no side effects
 * @param {string} checkinMD - Check-in date in MM-DD format
 * @param {string} checkoutMD - Check-out date in MM-DD format
 * @param {Object} packageDef - Holiday package definition
 * @returns {boolean} True if dates match package exactly
 */
export function matchesPackage(checkinMD, checkoutMD, packageDef) {
    return checkinMD === packageDef.start && checkoutMD === packageDef.end;
}

/**
 * Check if a date falls within a restricted holiday period
 * Pure function - deterministic, no side effects
 * @param {string} monthDay - Date in MM-DD format
 * @returns {boolean} True if date is in restricted period
 */
export function isInRestrictedPeriod(monthDay) {
    const allRestrictedDates = [
        ...HOLIDAY_PACKAGES.CHRISTMAS.period,
        ...HOLIDAY_PACKAGES.NEW_YEAR.period
    ];
    return allRestrictedDates.includes(monthDay);
}

/**
 * Check if date is in Christmas period
 * Pure function
 * @param {string} monthDay - Date in MM-DD format
 * @returns {boolean} True if in Christmas period
 */
export function isInChristmasPeriod(monthDay) {
    return HOLIDAY_PACKAGES.CHRISTMAS.period.includes(monthDay);
}

/**
 * Check if date is in New Year period
 * Pure function
 * @param {string} monthDay - Date in MM-DD format
 * @returns {boolean} True if in New Year period
 */
export function isInNewYearPeriod(monthDay) {
    return HOLIDAY_PACKAGES.NEW_YEAR.period.includes(monthDay);
}

/**
 * Extract month-day from ISO date string
 * Pure function - data transformation
 * @param {string} isoDate - Date in YYYY-MM-DD format
 * @returns {string} Date in MM-DD format
 */
export function extractMonthDay(isoDate) {
    return isoDate.substring(5); // MM-DD
}

// ============================================================================
// VALIDATION LOGIC
// ============================================================================

/**
 * Validate holiday package dates and return appropriate validation result
 * Pure function - no side effects, returns validation object
 * @param {string} checkin - Check-in date in YYYY-MM-DD format
 * @param {string} checkout - Check-out date in YYYY-MM-DD format
 * @returns {Object} Validation result
 * @returns {boolean} returns.isValid - Whether dates are valid
 * @returns {string|null} returns.message - Message to display (null if no package match)
 * @returns {string} returns.type - 'complete' | 'partial' | 'none'
 * @returns {Object|null} returns.matchedPackage - Matched package definition
 */
export function validateHolidayPackage(checkin, checkout) {
    if (!checkin || !checkout) {
        return {
            isValid: true,
            message: null,
            type: 'none',
            matchedPackage: null
        };
    }
    
    const checkinMD = extractMonthDay(checkin);
    const checkoutMD = extractMonthDay(checkout);
    
    // Check for complete Christmas package match
    if (matchesPackage(checkinMD, checkoutMD, HOLIDAY_PACKAGES.CHRISTMAS)) {
        return {
            isValid: true,
            message: HOLIDAY_PACKAGES.CHRISTMAS.message,
            type: 'complete',
            matchedPackage: HOLIDAY_PACKAGES.CHRISTMAS
        };
    }
    
    // Check for complete New Year package match
    if (matchesPackage(checkinMD, checkoutMD, HOLIDAY_PACKAGES.NEW_YEAR)) {
        return {
            isValid: true,
            message: HOLIDAY_PACKAGES.NEW_YEAR.message,
            type: 'complete',
            matchedPackage: HOLIDAY_PACKAGES.NEW_YEAR
        };
    }
    
    // Check if dates fall within restricted periods but don't match packages
    if (isInRestrictedPeriod(checkinMD) || isInRestrictedPeriod(checkoutMD)) {
        const isChristmas = isInChristmasPeriod(checkinMD) || isInChristmasPeriod(checkoutMD);
        const isNewYear = isInNewYearPeriod(checkinMD) || isInNewYearPeriod(checkoutMD);
        
        let message;
        if (isChristmas && isNewYear) {
            message = '⚠ Datas em período de pacote obrigatório - Natal (22 a 27/dez) ou Ano Novo (27/dez a 02/jan)';
        } else if (isChristmas) {
            message = HOLIDAY_PACKAGES.CHRISTMAS.warningMessage;
        } else if (isNewYear) {
            message = HOLIDAY_PACKAGES.NEW_YEAR.warningMessage;
        } else {
            message = '⚠ Datas em período de pacote obrigatório - Verifique pacotes disponíveis';
        }
        
        return {
            isValid: false,
            message,
            type: 'partial',
            matchedPackage: null
        };
    }
    
    // No holiday package match
    return {
        isValid: true,
        message: null,
        type: 'none',
        matchedPackage: null
    };
}

// ============================================================================
// EXPORT FOR TESTING
// ============================================================================

export default {
    HOLIDAY_PACKAGES,
    matchesPackage,
    isInRestrictedPeriod,
    isInChristmasPeriod,
    isInNewYearPeriod,
    extractMonthDay,
    validateHolidayPackage
};

logger.info('Holiday Package Service loaded', 'HolidayPackage');
