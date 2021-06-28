const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  coverageReporters: ['text', 'text-summary'],
  verbose: true,
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router.js',
    '!**/node_modules/**',
    '!tests/**',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: -1,
    },
  },
  moduleFileExtensions: ['js', 'json', 'vue'],
  snapshotSerializers: ['jest-serializer-vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
  },
  moduleNameMapper: { '\\.(css|less)$': '<rootDir>/tests/__mocks__/styleMock.js' },
};
