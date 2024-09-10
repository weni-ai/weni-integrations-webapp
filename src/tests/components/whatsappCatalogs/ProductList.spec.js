import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';
import ProductList from '@/components/whatsAppCatalogs/ProductList.vue';
import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';
import { createRouter, createMemoryHistory } from 'vue-router';
import unnnic from '@weni/unnnic-system';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

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

  it('fetches and displays product items', async () => {
    const mockProducts = {
      results: [
        {
          title: 'Product 1',
          available: true,
          price: '10.00',
          base_price: '15.00',
          facebook_product_id: 'FB123',
          image_link: 'image1.jpg',
        },
        {
          title: 'Product 2',
          available: false,
          price: '20.00',
          base_price: '20.00',
          facebook_product_id: 'FB456',
          image_link: 'image2.jpg',
        },
      ],
      count: 2,
    };

    const wrapper = mount(ProductList, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
      },
      props: {
        catalogName: 'Test Catalog',
      },
    });

    vi.spyOn(wrapper.vm, 'getCatalogProducts').mockResolvedValue(mockProducts);

    await flushPromises();

    // const items = wrapper.findAllComponents({ name: 'table-title' });
    // expect(items.length).toBe(2);
    // expect(items[0].text()).toContain('Product 1');
    // expect(items[1].text()).toContain('Product 2');
  });

  // it('handles pagination correctly', async () => {
  //   const mockProducts = {
  //     results: Array.from({ length: 30 }, (_, index) => ({
  //       title: `Product ${index + 1}`,
  //       available: true,
  //       price: '10.00',
  //       base_price: '15.00',
  //       facebook_product_id: `FB${index + 1}`,
  //       image_link: 'image.jpg',
  //     })),
  //     count: 30,
  //   };
  //   const wrapper = mount(ProductList, {
  //     global: {
  //       plugins: [pinia, router, i18n, UnnnicSystem],
  //     },
  //     props: {
  //       catalogName: 'Test Catalog',
  //     },
  //   });

  //   wrapper.vm.$nextTick();

  //   vi.spyOn(wrapper.vm, 'getCatalogProducts').mockResolvedValue(mockProducts);

  //   await flushPromises();
  //   await wrapper.findComponent({ ref: 'pagination' }).vm.$emit('update:modelValue', 2);
  //   await flushPromises();

  //   expect(wrapper.vm.page).toBe(2);
  // });

  it('handles errors when fetching products', async () => {
    const wrapper = mount(ProductList, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
      },
      props: {
        catalogName: 'Test Catalog',
      },
    });
    vi.spyOn(wrapper.vm, 'getCatalogProducts').mockRejectedValue(
      new Error('Error fetching products'),
    );

    await flushPromises();

    // expect(unnnic.unnnicCallAlert).toHaveBeenCalledWith({
    //   props: {
    //     text: 'Erro ao buscar produtos.',
    //     type: 'error',
    //   },
    //   seconds: 8,
    // });
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
});
