import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CatalogProducts from '@/views/whatsAppCatalogs/CatalogProducts.vue';
import ProductList from '@/components/whatsAppCatalogs/ProductList.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

describe('CatalogProducts.vue', () => {
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  it('renders ProductList with the correct catalogName prop', () => {
    const catalogName = 'Test Catalog';

    const wrapper = mount(CatalogProducts, {
      props: {
        catalogName,
      },
      global: {
        plugins: [i18n, UnnnicSystem, pinia],
        stubs: {
          ProductList,
        },
        mocks: {
          $route: {
            params: {
              appUuid: '1234',
              catalogUuid: '5678',
            },
          },
        },
      },
    });

    const productList = wrapper.findComponent(ProductList);

    expect(productList.exists()).toBe(true);
    expect(productList.props('catalogName')).toBe(catalogName);
  });
});
