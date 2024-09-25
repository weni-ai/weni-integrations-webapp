import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import StatusIndicator from '@/components/config/channels/whatsapp/components/StatusIndicator.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('StatusIndicator.vue', () => {
  it('renders with default status "green"', () => {
    const wrapper = mount(StatusIndicator, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });
    expect(wrapper.find('span').classes()).toContain('green');
  });

  it('renders with provided status "yellow"', () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'yellow',
      },
    });
    expect(wrapper.find('span').classes()).toContain('yellow');
  });

  it('renders with provided status "red"', () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'red',
      },
    });
    expect(wrapper.find('span').classes()).toContain('red');
  });

  it('rejects invalid status', () => {
    const validator = StatusIndicator.props.status.validator;
    expect(validator('green')).toBe(true);
    expect(validator('yellow')).toBe(true);
    expect(validator('red')).toBe(true);
    expect(validator('blue')).toBe(false);
  });

  it('applies the correct class based on status prop', () => {
    const statuses = ['green', 'yellow', 'red'];
    statuses.forEach((status) => {
      const wrapper = mount(StatusIndicator, {
        props: { status },
      });
      expect(wrapper.find('span').classes()).toContain(status);
    });
  });
});
