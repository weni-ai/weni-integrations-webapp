import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import TableHeaderLoading from '@/components/whatsAppTemplates/loadings/TableHeaderLoading.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('TableHeaderLoading.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(TableHeaderLoading, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });
  });

  it('should render two skeletons', () => {
    const skeletons = wrapper.findAllComponents({ name: 'unnnic-skeleton-loading' });
    expect(skeletons.length).toBe(2);
  });

  it('should have correct dimensions for each skeleton', async () => {
    await wrapper.vm.$nextTick();

    const skeletons = wrapper.findAllComponents({ name: 'unnnic-skeleton-loading' });
    expect(skeletons.length).toBe(2);

    const firstSkeleton = skeletons[0].props();
    const secondSkeleton = skeletons[1].props();

    expect(firstSkeleton.width).toBe('40px');
    expect(firstSkeleton.height).toBe('40px');

    expect(secondSkeleton.width).toBe('120px');
    expect(secondSkeleton.height).toBe('40px');
  });
});
