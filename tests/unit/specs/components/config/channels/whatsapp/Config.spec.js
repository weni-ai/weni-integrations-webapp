import { shallowMount, createLocalVue } from '@vue/test-utils';
import { singleApp } from '../../../../../../__mocks__/appMock.js';
import i18n from '@/utils/plugins/i18n';

import whatsappConfig from '@/components/config/channels/whatsapp/Config.vue';

const localVue = createLocalVue();

describe('WhatsAppConfig.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(whatsappConfig, {
      localVue,
      i18n,
      propsData: {
        app: singleApp,
      },
      stubs: {
        DynamicForm: true,
        UnnnicTab: true,
        UnnnicIconSvg: true,
        UnnnicInput: true,
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

  describe('closeConfig()', () => {
    it('should emit closeModal', () => {
      expect(wrapper.emitted('closeModal')).toBeFalsy();
      wrapper.vm.closeConfig();
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });
  });
});
