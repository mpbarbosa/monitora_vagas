/**
 * Unit Tests for Holiday Package Service
 * Tests pure validation and messaging functions
 * @version 1.0.0
 */

import { describe, it, expect } from '@jest/globals';
import {
    HOLIDAY_PACKAGES,
    matchesPackage,
    isInRestrictedPeriod,
    isInChristmasPeriod,
    isInNewYearPeriod,
    extractMonthDay,
    validateHolidayPackage
} from '../src/js/holidayPackageService.js';

// ============================================================================
// HOLIDAY PACKAGE DEFINITIONS TESTS
// ============================================================================

describe('Holiday Package Service - Package Definitions', () => {
    describe('HOLIDAY_PACKAGES', () => {
        it('should define Christmas package', () => {
            expect(HOLIDAY_PACKAGES.CHRISTMAS).toBeDefined();
            expect(HOLIDAY_PACKAGES.CHRISTMAS.id).toBe('CHRISTMAS');
            expect(HOLIDAY_PACKAGES.CHRISTMAS.start).toBe('12-22');
            expect(HOLIDAY_PACKAGES.CHRISTMAS.end).toBe('12-27');
            expect(HOLIDAY_PACKAGES.CHRISTMAS.nights).toBe(4);
            expect(HOLIDAY_PACKAGES.CHRISTMAS.days).toBe(5);
        });

        it('should define New Year package', () => {
            expect(HOLIDAY_PACKAGES.NEW_YEAR).toBeDefined();
            expect(HOLIDAY_PACKAGES.NEW_YEAR.id).toBe('NEW_YEAR');
            expect(HOLIDAY_PACKAGES.NEW_YEAR.start).toBe('12-27');
            expect(HOLIDAY_PACKAGES.NEW_YEAR.end).toBe('01-02');
            expect(HOLIDAY_PACKAGES.NEW_YEAR.nights).toBe(5);
            expect(HOLIDAY_PACKAGES.NEW_YEAR.days).toBe(6);
        });

        it('should have complete period arrays', () => {
            expect(HOLIDAY_PACKAGES.CHRISTMAS.period).toHaveLength(5);
            expect(HOLIDAY_PACKAGES.NEW_YEAR.period).toHaveLength(7);
        });

        it('should have valid message strings', () => {
            expect(HOLIDAY_PACKAGES.CHRISTMAS.message).toContain('Natal');
            expect(HOLIDAY_PACKAGES.NEW_YEAR.message).toContain('Ano Novo');
            expect(HOLIDAY_PACKAGES.CHRISTMAS.warningMessage).toContain('⚠');
            expect(HOLIDAY_PACKAGES.NEW_YEAR.warningMessage).toContain('⚠');
        });
    });
});

// ============================================================================
// PURE FUNCTION TESTS - matchesPackage()
// ============================================================================

describe('Holiday Package Service - matchesPackage()', () => {
    it('should return true for exact Christmas package dates', () => {
        const result = matchesPackage('12-22', '12-27', HOLIDAY_PACKAGES.CHRISTMAS);
        expect(result).toBe(true);
    });

    it('should return true for exact New Year package dates', () => {
        const result = matchesPackage('12-27', '01-02', HOLIDAY_PACKAGES.NEW_YEAR);
        expect(result).toBe(true);
    });

    it('should return false for partial Christmas dates', () => {
        expect(matchesPackage('12-22', '12-26', HOLIDAY_PACKAGES.CHRISTMAS)).toBe(false);
        expect(matchesPackage('12-23', '12-27', HOLIDAY_PACKAGES.CHRISTMAS)).toBe(false);
    });

    it('should return false for partial New Year dates', () => {
        expect(matchesPackage('12-27', '01-01', HOLIDAY_PACKAGES.NEW_YEAR)).toBe(false);
        expect(matchesPackage('12-28', '01-02', HOLIDAY_PACKAGES.NEW_YEAR)).toBe(false);
    });

    it('should return false for non-holiday dates', () => {
        expect(matchesPackage('12-01', '12-05', HOLIDAY_PACKAGES.CHRISTMAS)).toBe(false);
        expect(matchesPackage('01-10', '01-15', HOLIDAY_PACKAGES.NEW_YEAR)).toBe(false);
    });

    it('should be case sensitive', () => {
        expect(matchesPackage('12-22', '12-27', HOLIDAY_PACKAGES.CHRISTMAS)).toBe(true);
        // Month-day format should always be lowercase, but test boundary
        expect(matchesPackage('12-22 ', '12-27', HOLIDAY_PACKAGES.CHRISTMAS)).toBe(false);
    });
});

// ============================================================================
// PURE FUNCTION TESTS - isInRestrictedPeriod()
// ============================================================================

describe('Holiday Package Service - isInRestrictedPeriod()', () => {
    it('should return true for Christmas period dates', () => {
        expect(isInRestrictedPeriod('12-22')).toBe(true);
        expect(isInRestrictedPeriod('12-23')).toBe(true);
        expect(isInRestrictedPeriod('12-24')).toBe(true);
        expect(isInRestrictedPeriod('12-25')).toBe(true);
        expect(isInRestrictedPeriod('12-26')).toBe(true);
    });

    it('should return true for New Year period dates', () => {
        expect(isInRestrictedPeriod('12-27')).toBe(true);
        expect(isInRestrictedPeriod('12-28')).toBe(true);
        expect(isInRestrictedPeriod('12-29')).toBe(true);
        expect(isInRestrictedPeriod('12-30')).toBe(true);
        expect(isInRestrictedPeriod('12-31')).toBe(true);
        expect(isInRestrictedPeriod('01-01')).toBe(true);
        expect(isInRestrictedPeriod('01-02')).toBe(true);
    });

    it('should return false for non-restricted dates', () => {
        expect(isInRestrictedPeriod('12-21')).toBe(false);
        expect(isInRestrictedPeriod('01-03')).toBe(false);
        expect(isInRestrictedPeriod('06-15')).toBe(false);
        expect(isInRestrictedPeriod('01-10')).toBe(false);
    });

    it('should handle edge cases', () => {
        expect(isInRestrictedPeriod('12-27')).toBe(true); // Overlaps both packages
        expect(isInRestrictedPeriod('12-20')).toBe(false); // Just before Christmas
        expect(isInRestrictedPeriod('01-04')).toBe(false); // Just after New Year
    });
});

// ============================================================================
// PURE FUNCTION TESTS - isInChristmasPeriod()
// ============================================================================

describe('Holiday Package Service - isInChristmasPeriod()', () => {
    it('should return true for Christmas dates only', () => {
        expect(isInChristmasPeriod('12-22')).toBe(true);
        expect(isInChristmasPeriod('12-23')).toBe(true);
        expect(isInChristmasPeriod('12-24')).toBe(true);
        expect(isInChristmasPeriod('12-25')).toBe(true);
        expect(isInChristmasPeriod('12-26')).toBe(true);
    });

    it('should return false for New Year dates', () => {
        expect(isInChristmasPeriod('12-27')).toBe(false);
        expect(isInChristmasPeriod('12-31')).toBe(false);
        expect(isInChristmasPeriod('01-01')).toBe(false);
    });

    it('should return false for non-holiday dates', () => {
        expect(isInChristmasPeriod('12-21')).toBe(false);
        expect(isInChristmasPeriod('01-10')).toBe(false);
    });
});

// ============================================================================
// PURE FUNCTION TESTS - isInNewYearPeriod()
// ============================================================================

describe('Holiday Package Service - isInNewYearPeriod()', () => {
    it('should return true for New Year dates only', () => {
        expect(isInNewYearPeriod('12-27')).toBe(true);
        expect(isInNewYearPeriod('12-28')).toBe(true);
        expect(isInNewYearPeriod('12-29')).toBe(true);
        expect(isInNewYearPeriod('12-30')).toBe(true);
        expect(isInNewYearPeriod('12-31')).toBe(true);
        expect(isInNewYearPeriod('01-01')).toBe(true);
        expect(isInNewYearPeriod('01-02')).toBe(true);
    });

    it('should return false for Christmas dates', () => {
        expect(isInNewYearPeriod('12-22')).toBe(false);
        expect(isInNewYearPeriod('12-25')).toBe(false);
        expect(isInNewYearPeriod('12-26')).toBe(false);
    });

    it('should return false for non-holiday dates', () => {
        expect(isInNewYearPeriod('01-03')).toBe(false);
        expect(isInNewYearPeriod('06-15')).toBe(false);
    });
});

// ============================================================================
// PURE FUNCTION TESTS - extractMonthDay()
// ============================================================================

describe('Holiday Package Service - extractMonthDay()', () => {
    it('should extract MM-DD from ISO date string', () => {
        expect(extractMonthDay('2024-12-25')).toBe('12-25');
        expect(extractMonthDay('2024-01-01')).toBe('01-01');
        expect(extractMonthDay('2024-06-15')).toBe('06-15');
    });

    it('should handle different years correctly', () => {
        expect(extractMonthDay('2023-12-31')).toBe('12-31');
        expect(extractMonthDay('2025-01-02')).toBe('01-02');
    });

    it('should handle leap year dates', () => {
        expect(extractMonthDay('2024-02-29')).toBe('02-29');
    });

    it('should return substring from position 5', () => {
        // Testing the implementation detail (substring(5))
        expect(extractMonthDay('2024-12-25')).toBe('12-25');
        expect('2024-12-25'.substring(5)).toBe('12-25');
    });
});

// ============================================================================
// VALIDATION LOGIC TESTS - validateHolidayPackage()
// ============================================================================

describe('Holiday Package Service - validateHolidayPackage()', () => {
    describe('Complete package matches', () => {
        it('should validate complete Christmas package', () => {
            const result = validateHolidayPackage('2024-12-22', '2024-12-27');
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('complete');
            expect(result.matchedPackage).toBe(HOLIDAY_PACKAGES.CHRISTMAS);
            expect(result.message).toContain('Natal');
        });

        it('should validate complete New Year package', () => {
            const result = validateHolidayPackage('2024-12-27', '2025-01-02');
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('complete');
            expect(result.matchedPackage).toBe(HOLIDAY_PACKAGES.NEW_YEAR);
            expect(result.message).toContain('Ano Novo');
        });
    });

    describe('Partial package matches (restricted period)', () => {
        it('should warn about partial Christmas dates', () => {
            const result = validateHolidayPackage('2024-12-23', '2024-12-27');
            expect(result.isValid).toBe(false);
            expect(result.type).toBe('partial');
            expect(result.message).toContain('⚠');
            expect(result.message).toContain('Natal');
        });

        it('should warn about partial New Year dates', () => {
            const result = validateHolidayPackage('2024-12-28', '2025-01-02');
            expect(result.isValid).toBe(false);
            expect(result.type).toBe('partial');
            expect(result.message).toContain('⚠');
            expect(result.message).toContain('Ano Novo');
        });

        it('should warn when checkout is in restricted period', () => {
            const result = validateHolidayPackage('2024-12-20', '2024-12-24');
            expect(result.isValid).toBe(false);
            expect(result.type).toBe('partial');
        });

        it('should warn when checkin is in restricted period', () => {
            const result = validateHolidayPackage('2024-12-25', '2024-12-30');
            expect(result.isValid).toBe(false);
            expect(result.type).toBe('partial');
        });
    });

    describe('No package match', () => {
        it('should allow non-holiday dates', () => {
            const result = validateHolidayPackage('2024-06-15', '2024-06-20');
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('none');
            expect(result.message).toBeNull();
            expect(result.matchedPackage).toBeNull();
        });

        it('should allow dates before holiday season', () => {
            const result = validateHolidayPackage('2024-12-01', '2024-12-05');
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('none');
            expect(result.message).toBeNull();
        });

        it('should allow dates after holiday season', () => {
            const result = validateHolidayPackage('2025-01-10', '2025-01-15');
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('none');
            expect(result.message).toBeNull();
        });
    });

    describe('Edge cases', () => {
        it('should handle empty checkin', () => {
            const result = validateHolidayPackage('', '2024-12-27');
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('none');
            expect(result.message).toBeNull();
        });

        it('should handle empty checkout', () => {
            const result = validateHolidayPackage('2024-12-22', '');
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('none');
            expect(result.message).toBeNull();
        });

        it('should handle both dates empty', () => {
            const result = validateHolidayPackage('', '');
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('none');
            expect(result.message).toBeNull();
        });

        it('should handle null dates', () => {
            const result = validateHolidayPackage(null, null);
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('none');
            expect(result.message).toBeNull();
        });

        it('should handle undefined dates', () => {
            const result = validateHolidayPackage(undefined, undefined);
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('none');
            expect(result.message).toBeNull();
        });
    });

    describe('Return value structure', () => {
        it('should always return object with required properties', () => {
            const result = validateHolidayPackage('2024-12-22', '2024-12-27');
            expect(result).toHaveProperty('isValid');
            expect(result).toHaveProperty('message');
            expect(result).toHaveProperty('type');
            expect(result).toHaveProperty('matchedPackage');
        });

        it('should return boolean for isValid', () => {
            const result = validateHolidayPackage('2024-12-22', '2024-12-27');
            expect(typeof result.isValid).toBe('boolean');
        });

        it('should return string or null for message', () => {
            const validResult = validateHolidayPackage('2024-12-22', '2024-12-27');
            expect(typeof validResult.message).toBe('string');
            
            const noMatchResult = validateHolidayPackage('2024-06-15', '2024-06-20');
            expect(noMatchResult.message).toBeNull();
        });

        it('should return valid type enum', () => {
            const completeResult = validateHolidayPackage('2024-12-22', '2024-12-27');
            expect(['complete', 'partial', 'none']).toContain(completeResult.type);
            
            const partialResult = validateHolidayPackage('2024-12-23', '2024-12-27');
            expect(['complete', 'partial', 'none']).toContain(partialResult.type);
            
            const noneResult = validateHolidayPackage('2024-06-15', '2024-06-20');
            expect(['complete', 'partial', 'none']).toContain(noneResult.type);
        });
    });

    describe('Year boundaries', () => {
        it('should handle New Year crossing year boundary', () => {
            const result = validateHolidayPackage('2024-12-27', '2025-01-02');
            expect(result.isValid).toBe(true);
            expect(result.type).toBe('complete');
            expect(result.matchedPackage.id).toBe('NEW_YEAR');
        });

        it('should work for any year', () => {
            const result2023 = validateHolidayPackage('2023-12-22', '2023-12-27');
            const result2024 = validateHolidayPackage('2024-12-22', '2024-12-27');
            const result2025 = validateHolidayPackage('2025-12-22', '2025-12-27');
            
            expect(result2023.type).toBe('complete');
            expect(result2024.type).toBe('complete');
            expect(result2025.type).toBe('complete');
        });
    });
});

// ============================================================================
// INTEGRATION TESTS - Real-world scenarios
// ============================================================================

describe('Holiday Package Service - Integration Scenarios', () => {
    it('should handle sequential package bookings', () => {
        const christmas = validateHolidayPackage('2024-12-22', '2024-12-27');
        const newYear = validateHolidayPackage('2024-12-27', '2025-01-02');
        
        expect(christmas.isValid).toBe(true);
        expect(newYear.isValid).toBe(true);
        expect(christmas.matchedPackage.id).toBe('CHRISTMAS');
        expect(newYear.matchedPackage.id).toBe('NEW_YEAR');
    });

    it('should reject bookings that span both packages', () => {
        const result = validateHolidayPackage('2024-12-22', '2025-01-02');
        expect(result.isValid).toBe(false);
        expect(result.type).toBe('partial');
    });

    it('should reject weekend stays during restricted periods', () => {
        const result = validateHolidayPackage('2024-12-24', '2024-12-26');
        expect(result.isValid).toBe(false);
        expect(result.type).toBe('partial');
    });
});
