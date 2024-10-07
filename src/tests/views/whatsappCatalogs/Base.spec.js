import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import WhatsAppCatalogs from '@/views/whatsAppCatalogs/Base.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';

const routes = [
  {
    path: '/apps/my',
    name: 'MyApps',
    meta: { crumb_title: 'apps.nav.my_apps' },
  },
  {
    path: '/catalogs',
    name: 'WhatsApp Catalogs List',
    meta: { crumb_title: 'WhatsApp Catalogs' },
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

describe('WhatsAppCatalogs.vue', () => {
  it('renders the breadcrumb correctly based on route', async () => {
    router.push('/catalogs');
    await router.isReady();

    const wrapper = mount(WhatsAppCatalogs, {
      global: {
        plugins: [i18n, UnnnicSystem, router, createTestingPinia()],
      },
    });

    wrapper.vm.baseCrumbs = routes;
    await wrapper.vm.$nextTick();

    const crumbs = wrapper.vm.crumbs;
    expect(crumbs).toEqual([
      { name: 'MyApps', path: '/apps/my', meta: { crumb_title: 'apps.nav.my_apps' } },
      {
        name: 'WhatsApp Catalogs List',
        path: '/catalogs',
        meta: { crumb_title: 'WhatsApp Catalogs' },
      },
    ]);

    const breadcrumbComponent = wrapper.findComponent({ ref: 'breadcrumb' });
    expect(breadcrumbComponent.exists()).toBe(true);
  });
});
