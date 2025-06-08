/**
 * Jest Configuration for Mahardika Platform Scripts
 * Configured to test Node.js scripts with mocking capabilities
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Root directory for tests
  rootDir: '.',

  // Test file patterns
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Files to collect coverage from
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js',
    '!coverage/**',
    '!__tests__/**',
  ],

  // Setup files
  setupFilesAfterEnv: [],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Module paths
  moduleDirectories: ['node_modules'],

  // Transform configuration (none needed for plain JS)
  transform: {},

  // Test timeout
  testTimeout: 10000,
};
