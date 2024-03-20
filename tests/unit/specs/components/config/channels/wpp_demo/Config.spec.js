jest.mock('@/api/appType', () => {
  return {
    updateAppConfig: jest.fn(),
  };
});

// import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import wppDemoConfig from '@/components/config/channels/wpp_demo/Config.vue';
import { singleApp } from '../../../../../../__mocks__/appMock';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Config.vue', () => {
  let wrapper;
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      updateAppConfig: jest.fn(),
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(wppDemoConfig, {
      localVue,
      store,
      i18n,
      propsData: {
        app: singleApp,
      },
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicInput: true,
        UnnnicButton: true,
        UnnnicIconSvg: true,
        UnnnicModal: true,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('closePopUp()', () => {
    it('should set showModal oposite', () => {
      wrapper.setData({ showModal: true });
      expect(wrapper.vm.showModal).toBeTruthy();
      wrapper.vm.closePopUp();
      expect(wrapper.vm.showModal).toBeFalsy();
    });

    it('should call parent closePopUp()', () => {
      expect(wrapper.emitted('closePopUp')).toBeFalsy();
      wrapper.vm.closePopUp();
      expect(wrapper.emitted('closePopUp')).toBeTruthy();
    });
  });

  describe('openWppLink()', () => {
    it('should call closePopUp()', () => {
      window.open = jest.fn();
      const spy = spyOn(wrapper.vm, 'closePopUp');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.openWppLink();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
