import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import NavBar from '@/components/NavBar/index.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/apps',
      children: [
        { name: 'Discovery', path: 'discovery', component: { template: '<div />' } },
        { name: 'Apps', path: 'my', component: { template: '<div />' } },
        {
          name: 'App Config Direct',
          path: 'my/configured/:appCode/:appUuid',
          component: { template: '<div />' },
        },
        { name: 'Other Apps', path: 'other-apps', component: { template: '<div />' } },
      ],
    },
  ],
});

describe('NavBar.vue', () => {
  let wrapper;

  beforeEach(async () => {
    await router.push('/apps/my/configured/wwc/1234');

    wrapper = mount(NavBar, {
      global: {
        plugins: [i18n, UnnnicSystem, router],
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
    expect(links[1].text()).toBe('My apps');
    expect(links[2].text()).toBe('Other apps');
  });

  it('resolves absolute hrefs from configured app route', () => {
    const links = wrapper.findAll('a');

    expect(links[0].attributes('href')).toBe('/apps/discovery');
    expect(links[1].attributes('href')).toBe('/apps/my');
    expect(links[2].attributes('href')).toBe('/apps/other-apps');
  });
});
