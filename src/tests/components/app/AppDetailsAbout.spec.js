import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AppDetailsAbout from '@/components/app/AppDetailsAbout.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';

describe('AppDetailsAbout.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  beforeEach(() => {
    wrapper = mount(AppDetailsAbout, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (msg) => msg,
        },
      },
      props: {
        description: 'This is a sample app description.',
        links: [
          { url: 'https://example.com', description: 'Example Link' },
          { url: 'https://another.com', description: 'Another Link' },
        ],
      },
    });
  });
  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.app-details-about__content__title').text()).toBe('About the App');
    expect(wrapper.find('.app-details-about__content__description').html()).toContain(
      'This is a sample app description.',
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders links when provided', () => {
    const links = wrapper.findAll('.app-details-about__links__content__link');
    expect(links.length).toBe(2);
    expect(links[0].text()).toBe('Example Link');
    expect(links[0].attributes('href')).toBe('https://example.com');
    expect(links[1].text()).toBe('Another Link');
    expect(links[1].attributes('href')).toBe('https://another.com');
  });

  it('does not render links section if no links are provided', () => {
    wrapper = mount(AppDetailsAbout, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (msg) => msg,
        },
      },
      props: {
        description: 'This is a sample app description.',
        links: [],
      },
    });
    expect(wrapper.find('.app-details-about__links').exists()).toBe(false);
  });

  it('renders description even if it is null', () => {
    expect(wrapper.find('.app-details-about__content__description').exists()).toBe(true);
  });
});
