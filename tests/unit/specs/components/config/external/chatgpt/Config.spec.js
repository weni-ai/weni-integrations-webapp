jest.mock('lodash.debounce', () => jest.fn((fn) => fn));
import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import chatGptConfig from '@/components/config/external/chatgpt/Config.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../../../../__mocks__/appMock';
import { unnnicRadio, unnnicTag } from '@weni/unnnic-system';

singleApp.code = 'chatgpt';
singleApp.config = {
  regras: 'rules',
  base: 'base',
  ai_model: 'gpt-4',
};

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  mockApp = singleApp,
  errorUpdateApp = false,
  errorCreatePrompt = false,
  createPromptResult = null,
  errorGetPrompts = false,
  getPromptsResult = null,
  errorDeletePrompts = false,
  deletePromptsResult = null,
} = {}) => {
  const state = {
    auth: {
      project: '123',
    },
    appType: {
      loadingUpdateApp: false,
      errorUpdateApp,
    },
  };

  const actions = {
    updateApp: jest.fn(),
  };

  const externalsActions = {
    createPrompts: jest.fn(),
    getPrompts: jest.fn(),
    deletePrompts: jest.fn(),
  };

  const externalsState = {
    loadingCreatePrompt: false,
    errorCreatePrompt,
    createPromptResult,
    loadingGetPrompts: false,
    errorGetPrompts,
    getPromptsResult,
    loadingDeletePrompts: false,
    errorDeletePrompts,
    deletePromptsResult,
  };

  const store = new Vuex.Store({
    modules: {
      externals: {
        namespaced: true,
        actions: externalsActions,
        state: externalsState,
      },
    },
    actions,
    state,
  });

  const wrapper = shallowMount(chatGptConfig, {
    localVue,
    i18n,
    store,
    propsData: {
      app: mockApp,
    },
    stubs: {
      UnnnicModal: true,
      UnnnicButton: true,
      UnnnicIconSvg: true,
      UnnnicTooltip: true,
      unnnicRadio,
      unnnicTag,
    },
  });

  await wrapper.vm.$nextTick();

  return { wrapper, actions, state, externalsActions, externalsState };
};

describe('components/config/external/chatgpt/Config.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should be rendered properly without config', async () => {
    const { wrapper } = await mountComponent({ mockApp: { ...singleApp, config: null } });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call emit closeModal', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper.emitted('closeModal')).toBeFalsy();
    wrapper.vm.closeConfig();
    expect(wrapper.emitted('closeModal')).toBeTruthy();
  });

  describe('addPrompt()', () => {
    it('should add prompt into availablePrompts and toAddPrompts arrays', async () => {
      const { wrapper } = await mountComponent();
      const promptInput = wrapper.findComponent({ ref: 'prompt-input' });

      promptInput.vm.$emit('input', 'prompt 1');
      promptInput.vm.$emit('keyup', new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(wrapper.vm.availablePrompts).toEqual([{ text: 'prompt 1' }]);
      expect(wrapper.vm.toAddPrompts).toEqual([{ text: 'prompt 1' }]);
    });

    it('should not add prompt if there is no prompt input', async () => {
      const { wrapper } = await mountComponent();
      const promptInput = wrapper.findComponent({ ref: 'prompt-input' });

      promptInput.vm.$emit('input', '   ');
      promptInput.vm.$emit('keyup', new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(wrapper.vm.availablePrompts).toEqual([]);
      expect(wrapper.vm.toAddPrompts).toEqual([]);
    });
  });

  describe('removePrompt()', () => {
    it('should remove correct prompt if it is an added one', async () => {
      const { wrapper } = await mountComponent({
        getPromptsResult: [{ text: 'existing prompt', uuid: '123' }],
      });
      const promptInput = wrapper.findComponent({ ref: 'prompt-input' });

      promptInput.vm.$emit('input', 'existing prompt');
      promptInput.vm.$emit('keyup', new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(wrapper.vm.availablePrompts).toEqual([
        { text: 'existing prompt', uuid: '123' },
        { text: 'existing prompt' },
      ]);
      expect(wrapper.vm.toAddPrompts).toEqual([{ text: 'existing prompt' }]);

      await wrapper.vm.$nextTick();

      const promptTag = wrapper.findAllComponents(unnnicTag).at(1);

      promptTag.vm.$emit('close', { text: 'existing prompt' });

      expect(wrapper.vm.availablePrompts).toEqual([{ text: 'existing prompt', uuid: '123' }]);
      expect(wrapper.vm.toAddPrompts).toEqual([]);
    });
  });

  describe('reloadPrompts()', () => {
    it('should call error alert if getPrompts fails', async () => {
      const { wrapper, externalsState } = await mountComponent();

      externalsState.errorGetPrompts = true;
      jest.clearAllMocks();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalledWith();
      await wrapper.vm.reloadPrompts();
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'Failed to fetch prompts, please try again later',
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

  describe('saveConfig()', () => {
    it('should call updateApp with the correct payload if rules || knowledgeBase || selectedVersion changed', async () => {
      const { wrapper, actions } = await mountComponent();

      const rulesInput = wrapper.findComponent({ ref: 'rules-input' });
      const knowledgeBaseInput = wrapper.findComponent({ ref: 'base-input' });

      rulesInput.vm.$emit('input', 'rules 1');
      knowledgeBaseInput.vm.$emit('input', 'knowledge base 1');

      expect(actions.updateApp).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(actions.updateApp).toHaveBeenCalledWith(expect.anything(), {
        code: 'chatgpt',
        appUuid: '123',
        payload: {
          config: {
            ai_model: 'gpt-4',
            regras: 'rules 1',
            base: 'knowledge base 1',
          },
        },
      });
    });

    it('should call unnnicCallAlert with error state if updateApps fails', async () => {
      const { wrapper } = await mountComponent({ errorUpdateApp: true });

      const rulesInput = wrapper.findComponent({ ref: 'rules-input' });
      rulesInput.vm.$emit('input', 'rules 1');

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'Failed to update fields, please try again later',
          title: 'Error',
          icon: 'alert-circle-1',
          scheme: 'feedback-red',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });

    it('should not call updateApp if rules || knowledgeBase || selectedVersion not changed', async () => {
      const { wrapper, actions } = await mountComponent();

      expect(actions.updateApp).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(actions.updateApp).not.toHaveBeenCalled();
    });

    it('should call createPrompts with the correct payload if toAddPrompts is not empty', async () => {
      const { wrapper, externalsActions } = await mountComponent();

      const promptInput = wrapper.findComponent({ ref: 'prompt-input' });

      promptInput.vm.$emit('input', 'prompt 1');
      promptInput.vm.$emit('keyup', new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(externalsActions.createPrompts).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(externalsActions.createPrompts).toHaveBeenCalledWith(expect.anything(), {
        appUuid: '123',
        code: 'chatgpt',
        payload: {
          project_uuid: '123',
          prompts: [{ text: 'prompt 1' }],
        },
      });
    });

    it('should call unnnicCallAlert with error state if createPrompts fails', async () => {
      const { wrapper } = await mountComponent({ errorCreatePrompt: true });

      const promptInput = wrapper.findComponent({ ref: 'prompt-input' });

      promptInput.vm.$emit('input', 'prompt 1');
      promptInput.vm.$emit('keyup', new KeyboardEvent('keyup', { key: 'Enter' }));

      await wrapper.vm.$nextTick();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'Failed to create prompts, please try again later',
          title: 'Error',
          icon: 'alert-circle-1',
          scheme: 'feedback-red',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });

    it('should call deletePrompts with the correct payload if toRemovePrompts is not empty', async () => {
      const { wrapper, externalsActions } = await mountComponent({
        getPromptsResult: [{ text: 'existing prompt', uuid: '123' }],
      });

      const promptTag = wrapper.findComponent(unnnicTag);

      promptTag.vm.$emit('close', { text: 'existing prompt', uuid: '123' });

      expect(externalsActions.deletePrompts).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(externalsActions.deletePrompts).toHaveBeenCalledWith(expect.anything(), {
        appUuid: '123',
        code: 'chatgpt',
        payload: {
          project_uuid: '123',
          prompts: ['123'],
        },
      });
    });

    it('should call unnnicCallAlert with error state if deletePrompts fails', async () => {
      const { wrapper } = await mountComponent({
        getPromptsResult: [{ text: 'existing prompt', uuid: '123' }],
        errorDeletePrompts: true,
      });

      const promptTag = wrapper.findComponent(unnnicTag);

      promptTag.vm.$emit('close', { text: 'existing prompt', uuid: '123' });

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.saveConfig();
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'Failed to delete prompts, please try again later',
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

  describe('watchers', () => {
    describe('selectedVersion', () => {
      it('should call handleUpdateApp on selectedVersion change', async () => {
        const { wrapper, actions } = await mountComponent();
        // jest.spyOn(wrapper.vm, 'handleUpdateApp');
        // expect(wrapper.vm.handleUpdateApp).not.toHaveBeenCalled();
        expect(actions.updateApp).not.toHaveBeenCalled();
        expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

        const versionRadio = wrapper
          .find('.config-chatgpt__settings__content__version-wrapper__options')
          .findAll(unnnicRadio)
          .at(1);

        versionRadio.vm.$emit('change', 'gpt-3.5-turbo');
        await wrapper.vm.$nextTick();

        expect(actions.updateApp).toHaveBeenCalled();
        await wrapper.vm.$nextTick();

        expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
          props: {
            text: 'Successfully updated integration',
            title: 'Success',
            icon: 'check-circle-1-1',
            scheme: 'feedback-green',
            closeText: 'Close',
            position: 'bottom-right',
          },
          seconds: 6,
        });
      });

      it('should call not call success modal on selectedVersion change if updateApp fails', async () => {
        const { wrapper } = await mountComponent({ errorUpdateApp: true });

        const versionRadio = wrapper
          .find('.config-chatgpt__settings__content__version-wrapper__options')
          .findAll(unnnicRadio)
          .at(1);

        versionRadio.vm.$emit('change', 'gpt-3.5-turbo');

        await wrapper.vm.$nextTick();

        expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
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
