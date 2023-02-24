import { shallowMount, createLocalVue } from '@vue/test-utils';
import AccountTab from '@/components/config/channels/whatsapp/components/tabs/AccountTab.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
describe('whatsapp/components/tabs/AccountTab.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AccountTab, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicIconSvg: true,
        StatusIndicator: true,
        UnnnicButton: true,
        UnnnicInput: true,
      },
      propsData: {
        appInfo: {
          config: {
            phone_number: {
              display_phone_number: '+5511999999999',
              display_name: 'Number Name',
              default_template_language: 'pt-BR',
              certificate: 'certificateData',
              consent_status: 'status',
            },
            waba: {
              name: 'Waba name',
              message_behalf_name: 'on behalf name',
              timezone: 'America/Sao_Paulo',
              id: '123',
              namespace: '123123123123123',
            },
          },
        },
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

  describe('appConfig', () => {
    it('should return app config attribute', () => {
      expect(wrapper.vm.appConfig).toBe(wrapper.vm.appInfo.config);
    });

    it('should return empty if appInfo is undefined', async () => {
      await wrapper.setProps({ appInfo: undefined });
      expect(wrapper.vm.appConfig).toEqual({
        phone_number: {},
        certificate: null,
        default_template_language: null,
        consent_status: null,
      });
    });
  });

  describe('wabaInfo', () => {
    it('should return waba config attribute', () => {
      expect(wrapper.vm.wabaInfo).toBe(wrapper.vm.appInfo.config.waba);
    });

    it('should return empty if appInfo is undefined', async () => {
      await wrapper.setProps({ appInfo: undefined });
      expect(wrapper.vm.wabaInfo).toEqual({});
    });
  });
});
