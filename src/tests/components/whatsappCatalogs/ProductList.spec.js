import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';
import ProductList from '@/components/whatsAppCatalogs/ProductList.vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/products/:appUuid/:catalogUuid',
      name: 'ProductList',
    },
  ],
});

const pinia = createTestingPinia({ stubActions: false });

describe('ProductList.vue', () => {
  beforeEach(() => {
    setActivePinia(pinia);
  });

  it('renders the component and displays the header correctly', async () => {
    const wrapper = mount(ProductList, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
      },
      props: {
        catalogName: 'Test Catalog',
      },
    });

    await flushPromises();

    expect(
      wrapper
        .find(
          '.whatsapp-product-list__header__title span.u.font.primary.title-sm.color-neutral-darkest',
        )
        .text(),
    ).toBe('Test Catalog');
    expect(
      wrapper
        .find(
          '.whatsapp-product-list__header__title span.u.font.secondary.body-gt.color-neutral-darkest',
        )
        .text(),
    ).toBe(
      'Here you manage your inventory information. Add all the items you want to advertise or sell',
    );
  });

  it('handles page changes correctly', async () => {
    const wrapper = mount(ProductList, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
      },
      props: {
        catalogName: 'Test Catalog',
      },
    });

    wrapper.vm.onPageChange(2);
    await flushPromises();

    expect(wrapper.vm.page).toBe(2);
  });

  it('should set pageCount', async () => {
    const wrapper = mount(ProductList, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
      },
      props: {
        catalogName: 'Test Catalog',
      },
    });
    const store = whatsapp_cloud();
    store.catalogProducts = {};
    expect(wrapper.vm.pageCount).toBe(1);

    store.catalogProducts = {
      count: 30,
    };

    expect(wrapper.vm.pageCount).toBe(2);
  });

  it('should set currentPageCount', async () => {
    const wrapper = mount(ProductList, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
      },
      props: {
        catalogName: 'Test Catalog',
      },
    });

    const store = whatsapp_cloud();
    store.catalogProducts = {
      count: 30,
    };
    await wrapper.setData({ page: 3 });
    expect(wrapper.vm.currentPageCount).toBe(30);

    await wrapper.setData({ page: 1 });
    expect(wrapper.vm.currentPageCount).toBe(15);
  });
});
