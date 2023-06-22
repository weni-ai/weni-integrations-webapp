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
import wppDemoPreview from '@/components/config/channels/wpp_demo/Preview.vue';
import { singleApp } from '../../../../../../__mocks__/appMock';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('components/config/channels/wpp_demo/Preview.vue', () => {
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

    wrapper = shallowMount(wppDemoPreview, {
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

  describe('closePreview()', () => {
    it('should emit closeModal', () => {
      expect(wrapper.emitted('closeModal')).toBeFalsy();
      wrapper.vm.closePreview();
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });
  });
});
