import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import PhoneNumberSelection from '@/components/config/channels/whatsapp/loadings/PhoneNumberSelection.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('PhoneNumberSelection.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(PhoneNumberSelection, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });
  });
  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the UnnnicSkeletonLoading component', () => {
    const skeletonLoading = wrapper.findComponent({ ref: 'skeleton' });
    expect(skeletonLoading.exists()).toBe(true);
  });

  it('applies the correct class to the skeleton loading content', () => {
    const skeletonLoading = wrapper.findComponent({ ref: 'skeleton' });
    expect(skeletonLoading.exists()).toBe(true);
    expect(skeletonLoading.props('height')).toBe('38px');
  });
});
