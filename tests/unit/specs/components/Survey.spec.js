import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import Survey from '@/components/Survey/index.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  surveyStatus = 'TO_ANSWER',
  loadingSurveyAnswer = false,
  errorSurveyAnswer = null,
  surveyAnswerResult = null,
} = {}) => {
  const state = {
    surveyStatus,
    loadingSurveyAnswer,
    errorSurveyAnswer,
    surveyAnswerResult,
  };

  const actions = {
    setSurveyStatus: jest.fn(),
    submitSurveyAnswer: jest.fn(),
  };

  const store = new Vuex.Store({
    modules: {
      survey: {
        namespaced: true,
        state,
        actions,
      },
    },
  });

  const wrapper = mount(Survey, {
    localVue,
    store,
    i18n,
  });

  await wrapper.vm.$nextTick();

  return { wrapper, actions, state };
};

describe('components/Survey.vue', () => {
  it('should be rendered properly with content open', async () => {
    let { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should be rendered properly with content closed', async () => {
    let { wrapper } = await mountComponent({ surveyStatus: 'ANSWERED' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should invert isOpen to false on toggle click', async () => {
    const { wrapper } = await mountComponent();

    expect(wrapper.vm.isOpen).toEqual(true);

    let toggleButton = wrapper.find('.survey__toggle');
    await toggleButton.trigger('click');

    expect(wrapper.vm.isOpen).toEqual(false);

    let content = wrapper.find('.survey__content');
    expect(content.exists()).toBe(false);
  });

  it('should call setSurveyStatus to CLOSED if user never answered and content survey is open', async () => {
    const { wrapper, actions } = await mountComponent();

    expect(wrapper.vm.isOpen).toEqual(true);

    let toggleButton = wrapper.find('.survey__toggle');
    await toggleButton.trigger('click');

    expect(wrapper.vm.isOpen).toEqual(false);

    expect(actions.setSurveyStatus).toHaveBeenCalledTimes(1);
    expect(actions.setSurveyStatus).toHaveBeenCalledWith(expect.any(Object), { status: 'CLOSED' });

    let content = wrapper.find('.survey__content');
    expect(content.exists()).toBe(false);
  });

  it('should call setSurveyStatus to TO_ANSWER if user never answered and content survey is closed', async () => {
    const { wrapper, actions } = await mountComponent({ surveyStatus: 'CLOSED' });

    expect(wrapper.vm.isOpen).toEqual(false);

    let toggleButton = wrapper.find('.survey__toggle');
    await toggleButton.trigger('click');

    expect(wrapper.vm.isOpen).toEqual(true);

    expect(actions.setSurveyStatus).toHaveBeenCalledTimes(1);
    expect(actions.setSurveyStatus).toHaveBeenCalledWith(expect.any(Object), {
      status: 'TO_ANSWER',
    });

    let content = wrapper.find('.survey__content');
    expect(content.exists()).toBe(true);
  });

  it('should not call setSurveyStatus if user has already answered', async () => {
    const { wrapper, actions } = await mountComponent({ surveyStatus: 'ANSWERED' });

    expect(wrapper.vm.isOpen).toEqual(false);

    let toggleButton = wrapper.find('.survey__toggle');
    await toggleButton.trigger('click');

    expect(wrapper.vm.isOpen).toEqual(true);

    expect(actions.setSurveyStatus).not.toHaveBeenCalled();

    let content = wrapper.find('.survey__content');
    expect(content.exists()).toBe(true);
  });

  it('should set isOpen as closed on exit click', async () => {
    const { wrapper } = await mountComponent();

    expect(wrapper.vm.isOpen).toEqual(true);

    let closeButton = wrapper.find('.survey__content__buttons__exit');
    await closeButton.trigger('click');

    expect(wrapper.vm.isOpen).toEqual(false);

    const content = wrapper.find('.survey__content');
    expect(content.exists()).toBe(false);
  });

  it('should send answer and close content', async () => {
    const { wrapper, actions } = await mountComponent();
    const alertSpy = spyOn(wrapper.vm, 'callModal');

    expect(wrapper.vm.isOpen).toEqual(true);

    await wrapper.setData({ answer: 'answer content' });

    const sendButton = wrapper.find('.survey__content__buttons__send');
    await sendButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(actions.submitSurveyAnswer).toHaveBeenCalledWith(expect.any(Object), {
      payload: { answer: 'answer content' },
    });

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith({ type: 'Success', text: 'Feedback successfully sent!' });

    expect(wrapper.vm.isOpen).toEqual(false);
    const content = wrapper.find('.survey__content');
    expect(content.exists()).toBe(false);
  });

  it('should try send answer and alert on error', async () => {
    const { wrapper, actions } = await mountComponent({ errorSurveyAnswer: true });
    const alertSpy = spyOn(wrapper.vm, 'callModal');

    expect(wrapper.vm.isOpen).toEqual(true);

    await wrapper.setData({ answer: 'answer content' });

    const sendButton = wrapper.find('.survey__content__buttons__send');
    await sendButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(actions.submitSurveyAnswer).toHaveBeenCalledWith(expect.any(Object), {
      payload: { answer: 'answer content' },
    });

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith({
      type: 'Error',
      text: 'Failed to submit feedback, please try again later.',
    });

    expect(wrapper.vm.isOpen).toEqual(true);
    const content = wrapper.find('.survey__content');
    expect(content.exists()).toBe(true);
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
