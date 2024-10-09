import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import FormHeaderLoading from '@/components/whatsAppTemplates/loadings/FormHeaderLoading.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('FormHeaderLoading.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(FormHeaderLoading, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });
  });

  it('should render all skeleton loading components', () => {
    const skeletons = wrapper.findAllComponents({ name: 'unnnic-skeleton-loading' });
    expect(skeletons[0].exists()).toBe(true);
    expect(skeletons).toHaveLength(3);
  });

  it('should have correct classes applied', () => {
    expect(wrapper.classes()).toContain('loading');
  });

  it('should have correct number of skeletons', () => {
    expect(wrapper.findAll('.loading > *').length).toBe(3);
  });

  it('should have correct dimensions for each skeleton', async () => {
    const wrapper = mount(FormHeaderLoading, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });

    await wrapper.vm.$nextTick();

    const skeletons = wrapper.findAllComponents({ name: 'unnnic-skeleton-loading' });
    expect(skeletons.length).toBe(3);

    const firstSkeleton = skeletons[0].props();
    const secondSkeleton = skeletons[1].props();
    const thirdSkeleton = skeletons[2].props();

    expect(firstSkeleton.width).toBe('40px');
    expect(firstSkeleton.height).toBe('40px');

    expect(secondSkeleton.width).toBe('120px');
    expect(secondSkeleton.height).toBe('40px');

    expect(thirdSkeleton.width).toBe('80px');
    expect(thirdSkeleton.height).toBe('20px');
  });
});
