import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import chatGptSetup from '@/components/config/external/chatgpt/Setup.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../../../../__mocks__/appMock';
import { unnnicRadio } from '@weni/unnnic-system';

singleApp.code = 'chatgpt';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({ errorCreateApp = false } = {}) => {
  const state = {
    auth: {
      project: '123',
    },
    appType: {
      errorCreateApp,
      loadingCreateApp: false,
    },
  };

  const actions = {
    createApp: jest.fn(),
  };

  const store = new Vuex.Store({
    actions,
    state,
  });

  const wrapper = shallowMount(chatGptSetup, {
    localVue,
    i18n,
    store,
    propsData: {
      app: singleApp,
    },
    mocks: {
      $router: {
        replace: jest.fn(),
      },
      $route: {
        path: '/apps/1/details',
      },
    },
    stubs: {
      UnnnicModal: true,
      UnnnicButton: true,
      UnnnicIconSvg: true,
      UnnnicTooltip: true,
      unnnicRadio: true,
    },
  });

  return { wrapper, actions, state };
};

describe('components/config/external/chatgpt/Setup.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call parent closePopUp()', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper.emitted('closePopUp')).toBeFalsy();
    wrapper.vm.closePopUp();
    expect(wrapper.emitted('closePopUp')).toBeTruthy();
  });

  describe('setupChatGptService()', () => {
    it('should call createApp with the correct payload', async () => {
      const { wrapper, actions } = await mountComponent();

      const nameInput = wrapper.find('.chatgpt-modal__content__form__input__name');
      const tokenInput = wrapper.find('.chatgpt-modal__content__form__input__token');
      const versionRadio = wrapper
        .find('.chatgpt-modal__content__form__version-wrapper__options')
        .findAll(unnnicRadio)
        .at(0);

      nameInput.vm.$emit('input', 'chatgpt name');
      tokenInput.vm.$emit('input', 'chatgpt token');
      versionRadio.vm.$emit('change', 'gpt-3.5-turbo');

      expect(actions.createApp).not.toHaveBeenCalled();
      await wrapper.vm.setupChatGptService();
      expect(actions.createApp).toHaveBeenCalledWith(expect.anything(), {
        code: 'chatgpt',
        payload: {
          project_uuid: '123',
          name: 'chatgpt name',
          api_key: 'chatgpt token',
          ai_model: 'gpt-3.5-turbo',
        },
      });

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'Successfully created ChatGPT integration',
          title: 'Success',
          icon: 'check-circle-1-1',
          scheme: 'feedback-green',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });

    it('should call unnnicCallAlert with error state', async () => {
      const { wrapper } = await mountComponent({ errorCreateApp: true });

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      await wrapper.vm.setupChatGptService();

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'Failed to create ChatGPT integration, please try again later',
          title: 'Error',
          icon: 'alert-circle-1',
          scheme: 'feedback-red',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });
  });

  describe('callModal', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call unnnicCallAlert with Success state', async () => {
      const { wrapper } = await mountComponent();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      wrapper.vm.callModal({ text: 'success', type: 'Success' });

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'success',
          title: 'Success',
          icon: 'check-circle-1-1',
          scheme: 'feedback-green',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });

    it('should call unnnicCallAlert with Error state', async () => {
      const { wrapper } = await mountComponent();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      wrapper.vm.callModal({ text: 'error', type: 'Error' });

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'error',
          title: 'Error',
          icon: 'alert-circle-1',
          scheme: 'feedback-red',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });
  });
});
