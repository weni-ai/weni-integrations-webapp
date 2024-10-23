import { mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Table from '@/components/whatsAppTemplates/Table.vue';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

vi.mock('@/components/whatsAppTemplates/loadings/TableLoading.vue', () => ({ default: vi.fn() }));
vi.mock('@/components/whatsAppTemplates/TableActionButton.vue', () => ({ default: vi.fn() }));
vi.mock('@/components/whatsAppTemplates/TableLanguageDropdown.vue', () => ({ default: vi.fn() }));
vi.mock('@/components/whatsAppTemplates/TableSort.vue', () => ({ default: vi.fn() }));

describe('Table.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  const store = whatsapp_store();

  beforeEach(() => {
    store.getWhatsAppTemplates = vi.fn();
    store.loadingWhatsAppTemplates = false;
    store.errorWhatsAppTemplates = false;
    store.whatsAppTemplates = { count: 10, results: [{ name: 'Test', created_on: '2023-09-10' }] };

    wrapper = mount(Table, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $route: { params: { appUuid: '123' } },
        },
      },
    });
  });

  it('should fetch data on creation', async () => {
    const wrapper = mount(Table, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $route: { params: { appUuid: '123' } },
        },
      },
    });
    const spy = vi.spyOn(wrapper.vm, 'fetchData').mockResolvedValue({});
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalled();
  });

  it('should render the table items correctly', () => {
    const rows = wrapper.findAll('.whatsapp-templates-table__item__month');
    expect(rows.length).toBe(1);
    expect(rows[0].text()).toBe('Sep/2023');
  });

  it('should trigger sorting when the header is clicked', async () => {
    const nameHeader = wrapper.find({ ref: 'header-name' });
    expect(nameHeader.exists()).toBe(true);
    await nameHeader.trigger('click');
    expect(wrapper.vm.nameSortDirection).toBe('NONE');
  });

  it('should handle category selection change', async () => {
    const categorySelect = wrapper.findComponent({ name: 'unnnic-select-smart' });
    await categorySelect.vm.$emit('update:modelValue', 'MARKETING');

    expect(wrapper.vm.selectedCategory).toBe('MARKETING');
  });

  it('should render loading state when loading', async () => {
    const store = whatsapp_store();
    store.loadingWhatsAppTemplates = true;
    await wrapper.vm.$nextTick();

    const loadingComponent = wrapper.find({ ref: 'loading' });
    expect(loadingComponent.exists()).toBe(true);
  });

  it('should calculate pagination counts correctly', async () => {
    expect(wrapper.vm.currentPageStart).toBe(1);
    expect(wrapper.vm.currentPageCount).toBe(10);
  });
});
