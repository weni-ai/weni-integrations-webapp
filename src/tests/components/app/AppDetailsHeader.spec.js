import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppDetailsHeader from '@/components/app/AppDetailsHeader.vue';
import IntegrateButton from '@/components/IntegrateButton/index.vue';
import addModal from '@/components/AddModal/index.vue';

describe('AppDetailsHeader.vue', () => {
  let wrapper;

  const app = {
    icon: 'icon-url',
    name: 'App Name',
    summary: 'app.summary',
    bg_color: 'blue',
    can_add: true,
  };

  beforeEach(() => {
    wrapper = mount(AppDetailsHeader, {
      props: { app },
      global: {
        mocks: {
          $t: (msg) => msg,
        },
      },
    });
  });

  it('renders the app icon correctly', () => {
    const iconImg = wrapper.find('.app-details-header__icon__src');
    expect(iconImg.exists()).toBe(true);
    expect(iconImg.attributes('src')).toBe('icon-url');
  });

  it('renders the app title correctly', () => {
    const title = wrapper.find('.app-details-header__content__title');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('App Name');
  });

  it('renders the app description correctly', () => {
    const description = wrapper.find('.app-details-header__content__description');
    expect(description.exists()).toBe(true);
    expect(description.text()).toBe('app.summary');
  });

  it('applies CSS variables correctly', () => {
    expect(wrapper.element.style.getPropertyValue('--icon-bg-color')).toBe('blue');
  });

  it('renders IntegrateButton with correct props', () => {
    const button = wrapper.findComponent(IntegrateButton);
    expect(button.exists()).toBe(true);
    expect(button.props('size')).toBe('large');
    expect(button.props('icon')).toBe('add-1');
    expect(button.props('text')).toBe('apps.details.header.add');
    expect(button.props('disabled')).toBe(false);
  });

  it('renders AddModal component', () => {
    const modal = wrapper.findComponent(addModal);
    expect(modal.exists()).toBe(true);
  });

  it('disables IntegrateButton when app.can_add is false', async () => {
    await wrapper.setProps({
      app: {
        ...app,
        can_add: false,
      },
    });
    const button = wrapper.findComponent(IntegrateButton);
    expect(button.props('disabled')).toBe(true);
  });
});
