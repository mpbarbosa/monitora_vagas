/**
 * Jest Configuration for API Client Tests
 * Supports ES6 modules with --experimental-vm-modules
 */

export default {
    // Use jsdom environment for testing (browser-like environment)
    testEnvironment: 'jsdom',
    
    // Setup files to run before tests
    setupFiles: ['<rootDir>/tests/jest.setup.js'],
    
    // Test file patterns
    testMatch: [
        '**/tests/**/*.test.js',
        '**/__tests__/**/*.js'
    ],
    
    // Coverage configuration
    collectCoverageFrom: [
        'src/services/**/*.js',
        'src/js/**/*.js',
        'src/config/**/*.js',
        '!src/js/global.js', // Initialization only - not unit testable
        '!src/services/**/*.test.js',
        '!**/node_modules/**'
    ],
    
    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    
    // Transform - empty for native ES modules
    transform: {},
    
    // Ignore transforming node_modules except specific packages
    // Empty array means transform all modules including node_modules
    transformIgnorePatterns: [],
    
    // Module name mapper for aliases and mocks
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^.*ibira-loader\\.js$': '<rootDir>/tests/__mocks__/ibira-loader.js'
    },
    
    // Verbose output
    verbose: true,
    
    // Clear mocks between tests
    clearMocks: true,
    
    // Reset mocks between tests
    resetMocks: true,
    
    // Restore mocks between tests
    restoreMocks: true,
    
    // Maximum number of workers
    maxWorkers: '50%',
    
    // Timeout for tests (30 seconds)
    testTimeout: 30000
};
