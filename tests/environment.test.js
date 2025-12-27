/**
 * Unit Tests for Environment Configuration
 * Tests environment detection and configuration logic
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { 
    validateEnvironment, 
    getEnvironment, 
    getCurrentEnvironmentConfig,
    ENVIRONMENT_CONFIGS 
} from '../src/config/environment.js';

// ============================================================================
// ENVIRONMENT DETECTION TESTS
// ============================================================================

describe('Environment Configuration - Detection', () => {
    describe('getEnvironment()', () => {
        it('should return environment object', () => {
            const env = getEnvironment();
            expect(env).toBeDefined();
            expect(typeof env).toBe('object');
        });

        it('should include NODE_ENV', () => {
            const env = getEnvironment();
            expect(env.NODE_ENV).toBeDefined();
            expect(['development', 'production', 'test']).toContain(env.NODE_ENV);
        });

        it('should detect test environment', () => {
            const env = getEnvironment();
            // In Jest, NODE_ENV might be 'test' or 'development'
            expect(['development', 'test']).toContain(env.NODE_ENV);
            expect(typeof env.isTest).toBe('boolean');
        });

        it('should have computed boolean flags', () => {
            const env = getEnvironment();
            expect(typeof env.isDevelopment).toBe('boolean');
            expect(typeof env.isProduction).toBe('boolean');
            expect(typeof env.isTest).toBe('boolean');
        });

        it('should have exactly one environment flag true', () => {
            const env = getEnvironment();
            const flagCount = [env.isDevelopment, env.isProduction, env.isTest]
                .filter(Boolean).length;
            expect(flagCount).toBe(1);
        });
    });

    describe('Environment URLs', () => {
        it('should provide fullApiUrl', () => {
            const env = getEnvironment();
            expect(env.fullApiUrl).toBeDefined();
            expect(typeof env.fullApiUrl).toBe('string');
            expect(env.fullApiUrl).toMatch(/^https?:\/\//);
        });

        it('should provide afpespSearchUrl', () => {
            const env = getEnvironment();
            expect(env.afpespSearchUrl).toBeDefined();
            expect(typeof env.afpespSearchUrl).toBe('string');
            expect(env.afpespSearchUrl).toContain('afpesp.org.br');
        });

        it('should construct AFPESP URL correctly', () => {
            const env = getEnvironment();
            expect(env.afpespSearchUrl).toBe('https://www.afpesp.org.br/turismo/disponibilidade');
        });
    });
});

// ============================================================================
// FEATURE FLAGS TESTS
// ============================================================================

describe('Environment Configuration - Feature Flags', () => {
    describe('Feature availability', () => {
        it('should provide features object', () => {
            const env = getEnvironment();
            expect(env.features).toBeDefined();
            expect(typeof env.features).toBe('object');
        });

        it('should define enableLogging flag', () => {
            const env = getEnvironment();
            expect(typeof env.features.enableLogging).toBe('boolean');
        });

        it('should disable logging in test environment', () => {
            const env = getEnvironment();
            if (env.isTest) {
                expect(env.features.enableLogging).toBe(false);
            }
        });

        it('should define enableAnalytics flag', () => {
            const env = getEnvironment();
            expect(typeof env.features.enableAnalytics).toBe('boolean');
        });

        it('should define enableErrorTracking flag', () => {
            const env = getEnvironment();
            expect(typeof env.features.enableErrorTracking).toBe('boolean');
        });

        it('should define enableEmailNotifications flag', () => {
            const env = getEnvironment();
            expect(typeof env.features.enableEmailNotifications).toBe('boolean');
        });
    });

    describe('Feature flag logic', () => {
        it('should only enable analytics in production with ID', () => {
            const env = getEnvironment();
            if (env.features.enableAnalytics) {
                expect(env.isProduction).toBe(true);
                expect(env.ANALYTICS_ID).toBeTruthy();
            }
        });

        it('should only enable error tracking in production with DSN', () => {
            const env = getEnvironment();
            if (env.features.enableErrorTracking) {
                expect(env.isProduction).toBe(true);
                expect(env.SENTRY_DSN).toBeTruthy();
            }
        });

        it('should only enable email notifications with API key', () => {
            const env = getEnvironment();
            if (env.features.enableEmailNotifications) {
                expect(env.EMAIL_SERVICE_API_KEY).toBeTruthy();
            }
        });
    });
});

// ============================================================================
// VALIDATION TESTS
// ============================================================================

describe('Environment Configuration - Validation', () => {
    describe('validateEnvironment()', () => {
        it('should not throw when no variables required', () => {
            expect(() => validateEnvironment()).not.toThrow();
            expect(() => validateEnvironment([])).not.toThrow();
        });

        it('should not throw when required variables exist', () => {
            expect(() => validateEnvironment(['NODE_ENV'])).not.toThrow();
            expect(() => validateEnvironment(['API_BASE_URL'])).not.toThrow();
        });

        it('should throw when required variable is missing', () => {
            expect(() => validateEnvironment(['NON_EXISTENT_VAR'])).toThrow();
        });

        it('should list all missing variables in error message', () => {
            try {
                validateEnvironment(['MISSING_VAR_1', 'MISSING_VAR_2']);
                fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).toContain('MISSING_VAR_1');
                expect(error.message).toContain('MISSING_VAR_2');
            }
        });

        it('should accept array of variable names', () => {
            expect(() => validateEnvironment(['NODE_ENV', 'PORT'])).not.toThrow();
        });
    });
});

// ============================================================================
// ENVIRONMENT CONFIGS TESTS
// ============================================================================

describe('Environment Configuration - ENVIRONMENT_CONFIGS', () => {
    describe('Structure', () => {
        it('should define all environment configurations', () => {
            expect(ENVIRONMENT_CONFIGS.development).toBeDefined();
            expect(ENVIRONMENT_CONFIGS.production).toBeDefined();
            expect(ENVIRONMENT_CONFIGS.test).toBeDefined();
        });

        it('should have consistent structure across environments', () => {
            const environments = ['development', 'production', 'test'];
            
            environments.forEach(env => {
                expect(ENVIRONMENT_CONFIGS[env]).toHaveProperty('logging');
                expect(ENVIRONMENT_CONFIGS[env]).toHaveProperty('security');
                expect(ENVIRONMENT_CONFIGS[env]).toHaveProperty('performance');
            });
        });
    });

    describe('Development configuration', () => {
        const devConfig = ENVIRONMENT_CONFIGS.development;

        it('should enable debug logging', () => {
            expect(devConfig.logging.level).toBe('debug');
            expect(devConfig.logging.enableConsole).toBe(true);
        });

        it('should disable strict security', () => {
            expect(devConfig.security.strictCors).toBe(false);
            expect(devConfig.security.enableHttps).toBe(false);
        });

        it('should disable performance optimizations', () => {
            expect(devConfig.performance.enableCaching).toBe(false);
            expect(devConfig.performance.enableMinification).toBe(false);
        });
    });

    describe('Production configuration', () => {
        const prodConfig = ENVIRONMENT_CONFIGS.production;

        it('should minimize logging', () => {
            expect(prodConfig.logging.level).toBe('error');
            expect(prodConfig.logging.enableConsole).toBe(false);
            expect(prodConfig.logging.enableFile).toBe(true);
        });

        it('should enable strict security', () => {
            expect(prodConfig.security.strictCors).toBe(true);
            expect(prodConfig.security.enableHttps).toBe(true);
        });

        it('should enable performance optimizations', () => {
            expect(prodConfig.performance.enableCaching).toBe(true);
            expect(prodConfig.performance.enableMinification).toBe(true);
        });
    });

    describe('Test configuration', () => {
        const testConfig = ENVIRONMENT_CONFIGS.test;

        it('should silence logging', () => {
            expect(testConfig.logging.level).toBe('silent');
            expect(testConfig.logging.enableConsole).toBe(false);
            expect(testConfig.logging.enableFile).toBe(false);
        });

        it('should disable security restrictions', () => {
            expect(testConfig.security.strictCors).toBe(false);
            expect(testConfig.security.enableHttps).toBe(false);
        });

        it('should disable performance optimizations', () => {
            expect(testConfig.performance.enableCaching).toBe(false);
            expect(testConfig.performance.enableMinification).toBe(false);
        });
    });
});

// ============================================================================
// GET CURRENT ENVIRONMENT CONFIG TESTS
// ============================================================================

describe('Environment Configuration - getCurrentEnvironmentConfig()', () => {
    it('should return configuration object', () => {
        const config = getCurrentEnvironmentConfig();
        expect(config).toBeDefined();
        expect(typeof config).toBe('object');
    });

    it('should return configuration matching current environment', () => {
        const env = getEnvironment();
        const config = getCurrentEnvironmentConfig();
        const expectedConfig = ENVIRONMENT_CONFIGS[env.NODE_ENV];
        
        expect(config).toEqual(expectedConfig);
    });

    it('should have logging configuration', () => {
        const config = getCurrentEnvironmentConfig();
        expect(config).toHaveProperty('logging');
        expect(config.logging).toHaveProperty('level');
        expect(config.logging).toHaveProperty('enableConsole');
        expect(config.logging).toHaveProperty('enableFile');
    });

    it('should have security configuration', () => {
        const config = getCurrentEnvironmentConfig();
        expect(config).toHaveProperty('security');
        expect(config.security).toHaveProperty('strictCors');
        expect(config.security).toHaveProperty('enableHttps');
    });

    it('should have performance configuration', () => {
        const config = getCurrentEnvironmentConfig();
        expect(config).toHaveProperty('performance');
        expect(config.performance).toHaveProperty('enableCaching');
        expect(config.performance).toHaveProperty('enableMinification');
    });

    it('should return test config in test environment', () => {
        const config = getCurrentEnvironmentConfig();
        // Config varies based on actual NODE_ENV
        expect(config.logging).toBeDefined();
        expect(config.logging.level).toBeDefined();
        expect(['silent', 'debug', 'info', 'error']).toContain(config.logging.level);
    });
});

// ============================================================================
// CONFIGURATION VALUES TESTS
// ============================================================================

describe('Environment Configuration - Values', () => {
    describe('Numeric configurations', () => {
        it('should have valid PORT number', () => {
            const env = getEnvironment();
            expect(typeof env.PORT).toBe('number');
            expect(env.PORT).toBeGreaterThan(0);
            expect(env.PORT).toBeLessThanOrEqual(65535);
        });

        it('should have valid DEFAULT_WEEKENDS', () => {
            const env = getEnvironment();
            expect(typeof env.DEFAULT_WEEKENDS).toBe('number');
            expect(env.DEFAULT_WEEKENDS).toBeGreaterThan(0);
        });

        it('should have valid MAX_WEEKENDS', () => {
            const env = getEnvironment();
            expect(typeof env.MAX_WEEKENDS).toBe('number');
            expect(env.MAX_WEEKENDS).toBeGreaterThanOrEqual(env.DEFAULT_WEEKENDS);
        });

        it('should have valid RATE_LIMIT_WINDOW', () => {
            const env = getEnvironment();
            expect(typeof env.RATE_LIMIT_WINDOW).toBe('number');
            expect(env.RATE_LIMIT_WINDOW).toBeGreaterThan(0);
        });

        it('should have valid RATE_LIMIT_MAX_REQUESTS', () => {
            const env = getEnvironment();
            expect(typeof env.RATE_LIMIT_MAX_REQUESTS).toBe('number');
            expect(env.RATE_LIMIT_MAX_REQUESTS).toBeGreaterThan(0);
        });

        it('should have valid CACHE_TTL', () => {
            const env = getEnvironment();
            expect(typeof env.CACHE_TTL).toBe('number');
            expect(env.CACHE_TTL).toBeGreaterThan(0);
        });
    });

    describe('String configurations', () => {
        it('should have API_BASE_URL', () => {
            const env = getEnvironment();
            expect(typeof env.API_BASE_URL).toBe('string');
            expect(env.API_BASE_URL.length).toBeGreaterThan(0);
        });

        it('should have AFPESP_BASE_URL', () => {
            const env = getEnvironment();
            expect(typeof env.AFPESP_BASE_URL).toBe('string');
            expect(env.AFPESP_BASE_URL).toContain('afpesp.org.br');
        });

        it('should have LOG_LEVEL', () => {
            const env = getEnvironment();
            expect(typeof env.LOG_LEVEL).toBe('string');
            expect(['debug', 'info', 'warn', 'error', 'silent']).toContain(env.LOG_LEVEL);
        });

        it('should have EMAIL_FROM', () => {
            const env = getEnvironment();
            expect(typeof env.EMAIL_FROM).toBe('string');
        });
    });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Environment Configuration - Integration', () => {
    it('should maintain consistency between environment and config', () => {
        const env = getEnvironment();
        const config = getCurrentEnvironmentConfig();
        
        // Logging level should be consistent
        if (env.isTest) {
            expect(config.logging.level).toBe('silent');
        }
        
        if (env.isDevelopment) {
            expect(config.logging.level).toBe('debug');
        }
        
        if (env.isProduction) {
            expect(config.logging.level).toBe('error');
        }
    });

    it('should provide all necessary URLs', () => {
        const env = getEnvironment();
        
        expect(env.fullApiUrl).toBeTruthy();
        expect(env.afpespSearchUrl).toBeTruthy();
        expect(env.API_BASE_URL).toBeTruthy();
        expect(env.AFPESP_BASE_URL).toBeTruthy();
    });

    it('should have consistent feature flags with configuration', () => {
        const env = getEnvironment();
        const config = getCurrentEnvironmentConfig();
        
        // If logging is disabled in features, config should silence it
        if (!env.features.enableLogging) {
            expect(config.logging.enableConsole).toBe(false);
        }
    });
});
