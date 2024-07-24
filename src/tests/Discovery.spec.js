import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import Discovery from '../views/Discovery/index.vue';

describe('Discovery.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Discovery, {
      global: {
        mocks: {
          $t: (msg) => msg,
          $route: {
            query: {}
          }
        }
      },
      data() {
        return {
          searchTerm: '',
          channels: {
            loading: true,
            data: null,
          },
          biApps: [
            {
              code: 'power-bi',
              name: 'Power BI',
              category: 'bi-tools',
              config_design: 'sidebar',
              description: 'PowerBi.data.description',
              summary: 'PowerBi.data.summary',
              icon: '',
            },
          ],
        };
      },
    });
  });

  it('renders search input correctly', () => {
    const input = wrapper.find('.discovery-content__search');
    expect(input.exists()).toBe(true);
  });
});
