import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import WhatsAppCatalogsList from '@/views/whatsAppCatalogs/List.vue';
import CatalogList from '@/components/whatsAppCatalogs/CatalogList.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createMemoryHistory } from 'vue-router';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/catalogs', name: 'WhatsApp Catalogs List' },
    { path: '/other', name: 'Other Route' },
  ],
});

describe('WhatsAppCatalogsList.vue', () => {
  it('renders CatalogList when route name is WhatsApp Catalogs List', async () => {
    router.push('/catalogs');
    await router.isReady();

    const wrapper = mount(WhatsAppCatalogsList, {
      global: {
        plugins: [i18n, UnnnicSystem, router, createTestingPinia()],
        stubs: {
          CatalogList: true,
        },
      },
    });

    expect(wrapper.findComponent(CatalogList).exists()).toBe(true);
    expect(wrapper.find('router-view').exists()).toBe(false);
  });

  it('renders router-view when route name is not WhatsApp Catalogs List', async () => {
    router.push('/other');
    await router.isReady();

    const wrapper = mount(WhatsAppCatalogsList, {
      global: {
        plugins: [i18n, UnnnicSystem, router, createTestingPinia()],
        stubs: {
          CatalogList: true,
        },
        mocks: {
          $route: {
            name: 'test',
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(CatalogList).exists()).toBe(false);
  });
});
