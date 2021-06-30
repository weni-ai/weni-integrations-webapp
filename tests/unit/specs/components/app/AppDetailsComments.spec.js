import { shallowMount, createLocalVue } from '@vue/test-utils';
import AppDetailsComments from '@/components/app/AppDetailsComments.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

describe('AppDetailsComments.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AppDetailsComments, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
        UnnnicInput: true,
        UnnnicComment: true,
        UnnnicDropdown: true,
        UnnnicDropdownItem: true,
        UnnnicIconSvg: true,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
