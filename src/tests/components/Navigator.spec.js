import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import Navigator from '@/components/Navigator/index.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('Navigator.vue', () => {
  let wrapper;

  const routes = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  beforeEach(() => {
    wrapper = mount(Navigator, {
      props: {
        routes,
      },
      global: {
        plugins: [i18n, UnnnicSystem],
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
          'unnnic-icon-svg': true,
        },
      },
    });
  });

  it('renders the correct number of routes', () => {
    const links = wrapper.findAll('a');
    expect(links.length).toBe(routes.length);
  });

  it('renders the correct route names and paths', () => {
    const links = wrapper.findAll('a');
    links.forEach((link, index) => {
      expect(link.text()).toBe(routes[index].name);
      expect(link.attributes('href')).toBe(routes[index].path);
    });
  });

  it('renders the correct number of divider icons', () => {
    const dividers = wrapper.findAllComponents({ name: 'unnnic-icon-svg' });
    expect(dividers.length).toBe(routes.length - 1);
  });
});
