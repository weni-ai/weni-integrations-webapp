import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';
jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

jest.mock('@/utils/files', () => ({
  ...jest.requireActual('@/utils/files'),
  dataUrlToFile: jest.fn(),
}));

import { shallowMount, createLocalVue } from '@vue/test-utils';
import { singleApp } from '../../../../../../__mocks__/appMock.js';
import i18n from '@/utils/plugins/i18n';
import Vuex from 'vuex';

import whatsappConfig from '@/components/config/channels/whatsapp/Config.vue';
import skeletonLoading from '@/components/config/channels/whatsapp/loadings/Config.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('WhatsAppConfig.vue', () => {
  let wrapper;
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      getApp: jest.fn(() => {
        return { data: singleApp };
      }),
      fetchWppProfile: jest.fn(() => {
        return { data: { photo_url: 'photo' } };
      }),
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(whatsappConfig, {
      localVue,
      i18n,
      store,
      propsData: {
        app: singleApp,
      },
      stubs: {
        skeletonLoading,
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

  describe('fetchData()', () => {
    it('should stop loading state', async () => {
      expect(wrapper.vm.loading).toBeTruthy();
      await wrapper.vm.fetchData();
      expect(wrapper.vm.loading).toBeFalsy();
    });

    it('should call fetchAppInfo()', async () => {
      const spy = spyOn(wrapper.vm, 'fetchAppInfo');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.fetchData();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        code: wrapper.vm.app.code,
        appUuid: wrapper.vm.app.uuid,
      });
    });

    it('should call fetchProfile', async () => {
      const spy = spyOn(wrapper.vm, 'fetchProfile');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.fetchData();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        code: wrapper.vm.app.code,
        appUuid: wrapper.vm.app.uuid,
      });
    });

    it('should call unnnicCallAlert on request failure', async () => {
      actions.getApp.mockImplementation(() => {
        return Promise.reject();
      });
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.fetchData();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            title: 'Error',
            text: expect.any(String),
            icon: expect.any(String),
            scheme: expect.any(String),
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });
  });

  describe('fetchAppInfo', () => {
    it('should call getApp()', async () => {
      jest.clearAllMocks();
      const options = { code: 'code', appUuid: 'appUuid' };
      expect(actions.getApp).not.toHaveBeenCalled();
      await wrapper.vm.fetchAppInfo(options);
      expect(actions.getApp).toHaveBeenCalledTimes(1);
    });

    it('should set appInfo with getApp() return data', async () => {
      const options = { code: 'code', appUuid: 'appUuid' };
      await wrapper.setData({ appInfo: null });
      await wrapper.vm.fetchAppInfo(options);
      expect(wrapper.vm.appInfo).toEqual(singleApp);
    });
  });

  describe('fetchProfile', () => {
    it('should call fetchWppProfile()', async () => {
      jest.clearAllMocks();
      const options = { code: 'code', appUuid: 'appUuid' };
      expect(actions.fetchWppProfile).not.toHaveBeenCalled();
      await wrapper.vm.fetchProfile(options);
      expect(actions.fetchWppProfile).toHaveBeenCalledTimes(1);
    });
  });
});
