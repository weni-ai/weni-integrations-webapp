import { shallowMount, createLocalVue } from '@vue/test-utils';
import List from '@/views/whatsAppCatalogs/List.vue';

const localVue = createLocalVue();

describe('views/whatsAppCatalogs/List.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(List, {
      localVue,
      stubs: {
        List: true,
        Card: true,
      },
      mocks: {
        $route: {
          name: 'WhatsApp Catalogs List',
          meta: {
            crumb_title: 'title',
          },
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
