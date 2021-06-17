const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  collectCoverageFrom: [
    '**/*.{js,vue}',
    '!src/main.js',
    '!src/router.js',
    '!src/App.vue',
    '!**/node_modules/**',
    '!tests/**',
  ],
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
  },
  moduleNameMapper: { '\\.(css|less)$': '<rootDir>/tests/__mocks__/styleMock.js' },
};
