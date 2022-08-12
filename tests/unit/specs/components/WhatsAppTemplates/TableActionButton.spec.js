import { shallowMount, createLocalVue } from '@vue/test-utils';
import TableActionButton from '@/components/WhatsAppTemplates/TableActionButton.vue';

const localVue = createLocalVue();

describe('components/WhatsAppTemplates/TableActionButton.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(TableActionButton, {
      localVue,
      stubs: {
        UnnnicDropdown: true,
        UnnnicDropdownItem: true,
        UnnnicButton: true,
        UnnnicIconSvg: true,
      },
      mocks: {
        $t: () => 'some specific text',
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
