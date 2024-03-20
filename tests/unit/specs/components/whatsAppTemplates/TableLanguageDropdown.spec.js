import { mount, createLocalVue } from '@vue/test-utils';
import TableLanguageDropdown from '@/components/whatsAppTemplates/TableLanguageDropdown.vue';

const localVue = createLocalVue();

const mountComponent = ({
  template = {
    name: 'template_name',
    category: 'MARKETING',
    translations: [
      { language: 'en_US', status: 'APPROVED' },
      { language: 'pt_BR', status: 'REJECTED' },
    ],
  },
} = {}) => {
  const wrapper = mount(TableLanguageDropdown, {
    localVue,
    stubs: {
      UnnnicDropdown: true,
      UnnnicIconSvg: true,
      UnnnicDropdownItem: true,
    },
    mocks: {
      $t: () => 'some specific text',
    },
    propsData: {
      template,
    },
  });

  return { wrapper };
};

describe('components/whatsAppTemplates/TableLanguageDropdown.vue', () => {
  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('templateDefaultLanguage', () => {
    it('should return first translation language', () => {
      const { wrapper } = mountComponent();
      expect(wrapper.vm.templateDefaultLanguage).toEqual('en_US');
    });

    it('should return empty if not translation is provided', () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [],
      };
      const { wrapper } = mountComponent({ template });
      expect(wrapper.vm.templateDefaultLanguage).toEqual('-');
    });
  });
});
