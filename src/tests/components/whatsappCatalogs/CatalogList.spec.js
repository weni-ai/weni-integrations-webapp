import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CatalogList from '@/components/whatsAppCatalogs/CatalogList.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';

describe('CatalogList.vue', () => {
  let wrapper;

  const pinia = createTestingPinia({ stubActions: false });

  beforeEach(() => {
    wrapper = mount(CatalogList, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $route: {
            params: { appUuid: 'test-app-uuid' },
          },
          $router: {
            push: vi.fn(),
          },
        },
      },
    });
  });

  it('should render catalog list header correctly', () => {
    expect(wrapper.find('.whatsapp-catalog-list__header__title').text()).toContain(
      wrapper.vm.$t('WhatsApp.catalog.list.title'),
    );
    expect(wrapper.find('.whatsapp-catalog-list__header__text').text()).toContain(
      wrapper.vm.$t('WhatsApp.catalog.list.description'),
    );
  });

  it('should close the modal correctly', async () => {
    wrapper.vm.openModal = true;
    await wrapper.vm.closeModal();

    expect(wrapper.vm.openModal).toBe(false);
    expect(wrapper.vm.catalogToEnable).toBe(null);
  });

  it('should handle search term change and reset page number', async () => {
    await wrapper.setData({ searchTerm: 'New Search' });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.page).toBe(1);
  });

  it('should handle page change and fetch new data', async () => {
    const spy = vi.spyOn(wrapper.vm, 'fetchData');
    await wrapper.vm.onPageChange(2);
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.page).toBe(2);
    expect(spy).toHaveBeenCalled();
  });
});
