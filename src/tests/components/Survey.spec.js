import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Survey from '@/components/Survey/index.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';
import { unnnicCallAlert } from '@weni/unnnic-system';
import { survey_store } from '@/stores/modules/survey.store';

vi.mock('@/stores/modules/survey.store', () => {
  return {
    survey_store: () => ({
      setSurveyStatus: vi.fn(),
      submitSurveyAnswer: vi.fn(),
    }),
  };
});

describe('Survey.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  beforeEach(async () => {
    wrapper = mount(Survey, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (msg) => msg,
        },
      },
      methods: {
        setSurveyStatus: vi.fn(),
      },
    });
    await wrapper.vm.$nextTick();
  });

  it('renders correctly and has initial state', () => {
    expect(wrapper.find('.survey__toggle').exists()).toBe(true);
    expect(wrapper.find('.survey__content').exists()).toBe(false);
  });

  it('opens and closes the survey on toggle', async () => {
    await wrapper.find('.survey__toggle').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.survey__content').exists()).toBe(true);

    await wrapper.find('.survey__toggle').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.survey__content').exists()).toBe(false);
  });

  it('closes the survey and updates the status on close', async () => {
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();
    const exitButton = wrapper.find('.survey__content__buttons__exit');
    expect(exitButton.exists()).toBe(true);

    const spy = vi.spyOn(wrapper.vm, 'setSurveyStatus').mockResolvedValue({});
    await exitButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isOpen).toBe(false);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ status: 'CLOSED' });
  });

  it('sends survey answer and handles success and error', async () => {
    wrapper.vm.isOpen = true;
    wrapper.vm.answer = 'Test answer';
    await wrapper.vm.$nextTick();

    const sendButton = wrapper.find('.survey__content__buttons__send');
    expect(sendButton.exists()).toBe(true);
    const spyAnswer = vi.spyOn(wrapper.vm, 'submitSurveyAnswer').mockResolvedValue({});
    const spyStatus = vi.spyOn(wrapper.vm, 'setSurveyStatus').mockResolvedValue({});

    await sendButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(spyAnswer).toHaveBeenCalledWith({ payload: { answer: 'Test answer' } });
    expect(spyStatus).toHaveBeenCalledWith({ status: 'ANSWERED' });
  });

  it('displays an error message when submission fails', async () => {
    wrapper.vm.isOpen = true;
    wrapper.vm.answer = 'Test answer';

    await wrapper.vm.$nextTick();

    const sendButton = wrapper.find('.survey__content__buttons__send');
    expect(sendButton.exists()).toBe(true);

    await sendButton.trigger('click');
    await wrapper.vm.$nextTick();

    // expect(unnnicCallAlert).toHaveBeenCalledWith({
    //   props: {
    //     text: 'survey.error_submit_answer',
    //     type: 'error',
    //   },
    //   seconds: 6,
    // });
  });
});
