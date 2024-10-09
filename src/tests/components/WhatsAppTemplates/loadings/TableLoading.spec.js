import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import TableLoading from '@/components/whatsAppTemplates/loadings/TableLoading.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('TableLoading.vue', () => {
  let wrapper;
  const headers = ['Header 1', 'Header 2', 'Header 3'];

  beforeEach(() => {
    wrapper = mount(TableLoading, {
      props: {
        headers,
      },
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });
  });

  it('should render a table with skeletons', () => {
    const table = wrapper.findComponent({ name: 'unnnic-table' });
    expect(table.exists()).toBe(true);

    const skeletons = wrapper.findAllComponents({ name: 'unnnic-skeleton-loading' });
    expect(skeletons.length).toBe(10);
  });

  it('should have correct dimensions for each skeleton', async () => {
    await wrapper.vm.$nextTick();

    const skeletons = wrapper.findAllComponents({ name: 'unnnic-skeleton-loading' });

    skeletons.forEach((skeleton) => {
      const skeletonStyles = skeleton.props();
      expect(skeletonStyles.width).toBe('100%');
      expect(skeletonStyles.height).toBe('64px');
    });
  });

  it('should have the correct number of table rows', () => {
    const tableRows = wrapper.findAllComponents({ name: 'unnnic-table-row' });
    expect(tableRows.length).toBe(1);
  });
});
