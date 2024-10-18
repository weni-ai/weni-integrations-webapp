import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import NavBar from '@/components/NavBar/index.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('NavBar.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(NavBar, {
      global: {
        plugins: [i18n, UnnnicSystem],
        stubs: {
          RouterLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
        mocks: {
          $t: (msg) => msg,
        },
      },
    });
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders three router-links', () => {
    const links = wrapper.findAll('a');
    expect(links.length).toBe(3);
  });

  it('renders the correct text for each link', () => {
    const links = wrapper.findAll('a');

    expect(links[0].text()).toBe('Discovery');
    expect(links[1].text()).toBe('My Apps');
    expect(links[2].text()).toBe('Other Apps');
  });

  it('has the correct "to" attribute for each link', () => {
    const links = wrapper.findAll('a');

    expect(links[0].attributes('href')).toBe('discovery');
    expect(links[1].attributes('href')).toBe('my');
    expect(links[2].attributes('href')).toBe('other-apps');
  });
});
