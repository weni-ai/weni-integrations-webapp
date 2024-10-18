import { mount } from '@vue/test-utils';
import LoadingButton from '@/components/LoadingButton/index.vue';
import { describe, it, expect } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('LoadingButton.vue', () => {
  it('renders the correct text when not loading', () => {
    const wrapper = mount(LoadingButton, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      props: {
        text: 'Click Me',
        isLoading: false,
      },
    });

    expect(wrapper.text()).toBe('Click Me');
  });

  it('renders the loading text when isLoading is true', () => {
    const wrapper = mount(LoadingButton, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      props: {
        loadingText: 'Loading...',
        isLoading: true,
      },
    });

    expect(wrapper.text()).toBe('Loading...');
  });

  it('passes the correct icon based on loadingPosition', () => {
    const wrapperLeft = mount(LoadingButton, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      props: {
        isLoading: true,
        loadingPosition: 'left',
        iconLeft: 'default-icon',
      },
    });

    const buttonStubLeft = wrapperLeft.findComponent({ ref: 'unnnic-button' });
    expect(buttonStubLeft.exists()).toBe(true);
    expect(buttonStubLeft.props('iconLeft')).toBe('loading-circle-1');

    const wrapperCenter = mount(LoadingButton, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      props: {
        isLoading: true,
        loadingPosition: 'center',
        iconCenter: 'default-icon',
      },
    });

    const buttonStubCenter = wrapperCenter.findComponent({ ref: 'unnnic-button' });
    expect(buttonStubCenter.exists()).toBe(true);
    expect(buttonStubCenter.props('iconCenter')).toBe('loading-circle-1');
  });

  it('does not emit "clicked" event when isLoading is true', async () => {
    const wrapper = mount(LoadingButton, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      props: {
        isLoading: true,
      },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('clicked')).toBeUndefined();
  });

  it('emits "clicked" event when not loading and not disabled', async () => {
    const wrapper = mount(LoadingButton, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      props: {
        isLoading: false,
        disabled: false,
      },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('clicked')).toHaveLength(1);
  });

  it('does not emit "clicked" event when disabled', async () => {
    const wrapper = mount(LoadingButton, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      props: {
        disabled: true,
      },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('clicked')).toBeUndefined();
  });
});
