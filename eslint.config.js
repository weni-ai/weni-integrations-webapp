import { defineConfig, globalIgnores } from 'eslint/config';
import weniConfig from '@weni/eslint-config/vue3.js';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['**/dist/**', '**/coverage/**']),
  weniConfig,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.spec.js', 'src/tests/**', 'setupTest.js'],
    languageOptions: {
      globals: { ...globals.vitest },
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'commonjs',
    },
  },
]);
