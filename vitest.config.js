import { defineConfig, configDefaults } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    root: fileURLToPath(new URL('./', import.meta.url)),
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{vue,js}'],
      exclude: [
        'src/miragejs/**/*',
        'src/router/**',
        'src/utils/**',
        'src/api/**/*',
        'src/App.vue',
        'src/main.js',
        'src/router.js',
      ],
    },
  },
});
