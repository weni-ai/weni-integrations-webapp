module.exports = {
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
  ],
};
