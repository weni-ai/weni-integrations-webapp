import { shallowMount, createLocalVue } from '@vue/test-utils';
import LanguageDropdown from '@/components/WhatsAppTemplates/LanguageDropdown.vue';

const localVue = createLocalVue();

describe('components/WhatsAppTemplates/LanguageDropdown.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(LanguageDropdown, {
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
        template: {
          translations: [
            { language: 'en', status: 'APPROVED' },
            { language: 'es', status: 'REJECTED' },
          ],
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
