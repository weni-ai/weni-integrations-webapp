// setupTest.js
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { beforeEach } from 'vitest';
import { config } from '@vue/test-utils';
import i18n from '@/utils/plugins/i18n';

beforeEach(() => {
  const pinia = createTestingPinia();
  setActivePinia(pinia);
});

config.global.plugins = [i18n];
config.mocks = {
  $t: (msg) => msg,
};
