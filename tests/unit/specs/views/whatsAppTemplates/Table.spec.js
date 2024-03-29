import { shallowMount, createLocalVue } from '@vue/test-utils';
import Table from '@/views/whatsAppTemplates/Table.vue';

const localVue = createLocalVue();

describe('views/whatsAppTemplates/Table.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Table, {
      localVue,
      stubs: {
        TemplatesHeader: true,
        TemplatesTable: true,
      },
      mocks: {
        $route: {
          name: 'WhatsApp Templates Table',
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
