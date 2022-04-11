import { shallowMount, createLocalVue } from '@vue/test-utils';
import GeneralTab from '@/components/config/channels/whatsapp/components/tabs/GeneralTab.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
describe('whatsapp/components/tabs/GeneralTab.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(GeneralTab, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicIconSvg: true,
        StatusIndicator: true,
        UnnnicButton: true,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('emitClose()', () => {
    it('should emit close event', async () => {
      expect(wrapper.emitted('close')).toBeFalsy();
      wrapper.vm.emitClose();
      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });
});
