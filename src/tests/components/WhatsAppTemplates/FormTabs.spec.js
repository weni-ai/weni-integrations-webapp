import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import FormTabs from '@/components/whatsAppTemplates/FormTabs.vue';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import { createRouter, createMemoryHistory } from 'vue-router';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/some-path/:appUuid', name: 'some-route' }],
});

describe('FormTabs.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    wrapper = mount(FormTabs, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem, router],
      },
      mocks: {
        $route: {
          params: {
            appUuid: '1234',
          },
        },
      },
    });
  });

  it('should validate a correct header', async () => {
    const store = whatsapp_store();
    store.templateTranslationCurrentForm = {
      header: {
        text: 'Valid Header',
        header_type: 'TEXT',
      },
    };

    const result = wrapper.vm.validateHeader();
    await wrapper.vm.$nextTick();

    expect(result).toEqual({ header_type: 'TEXT', text: 'Valid Header' });
  });

  it('should validate an empty header as null', () => {
    wrapper.vm.templateTranslationCurrentForm.header = '';

    const result = wrapper.vm.validateHeader();

    expect(result).toBeNull();
  });

  it('should validate a correct body', () => {
    wrapper.vm.templateTranslationCurrentForm.body = 'Valid Body';

    const result = wrapper.vm.validateBody();

    expect(result).toEqual({ type: 'BODY', text: 'Valid Body' });
  });

  it('should validate a correct footer', () => {
    wrapper.vm.templateTranslationCurrentForm.footer = 'Valid Footer';

    const result = wrapper.vm.validateFooter();

    expect(result).toEqual({ type: 'FOOTER', text: 'Valid Footer' });
  });

  it('should validate buttons correctly', () => {
    wrapper.vm.templateTranslationCurrentForm.buttons = [
      { text: 'Button 1' },
      { text: 'Button 2' },
    ];

    const result = wrapper.vm.validateButtons();

    expect(result).toEqual([{ text: 'Button 1' }, { text: 'Button 2' }]);
  });
});
