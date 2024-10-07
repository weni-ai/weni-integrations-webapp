import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import WhatsAppTemplatesForm from '@/views/whatsAppTemplates/Form.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

const pinia = createPinia();
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/templates/:templateUuid', name: 'TemplateForm' }],
});

describe('WhatsAppTemplatesForm.vue', () => {
  it('sets formMode to edit and templateUuid correctly if route has templateUuid', async () => {
    const wrapper = mount(WhatsAppTemplatesForm, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
        mocks: {
          $route: {
            params: { templateUuid: '1234' },
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.formMode).toBe('edit');
    expect(wrapper.vm.templateUuid).toBe('1234');
  });

  it('sets formMode to create and templateUuid to empty string if no templateUuid in route', async () => {
    const wrapper = mount(WhatsAppTemplatesForm, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
        mocks: {
          $route: {
            params: {},
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.formMode).toBe('create');
    expect(wrapper.vm.templateUuid).toBe('');
  });

  it('increments previewKey when updatePreview is called', async () => {
    const wrapper = mount(WhatsAppTemplatesForm, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
      },
    });

    expect(wrapper.vm.previewKey).toBe(0);

    wrapper.vm.updatePreview();

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.previewKey).toBe(1);
  });
});
