/**
 * Jest Setup File
 * Provides polyfills and global configuration for test environment
 */

import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = NodeTextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = NodeTextDecoder;
}

// Suppress console errors/warnings during tests (optional)
// Uncomment to reduce noise in test output
// global.console = {
//     ...console,
//     error: () => {},
//     warn: () => {},
// };
