jest.mock('lodash.debounce', () => jest.fn((fn) => fn));
import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConversationsTab from '@/components/config/channels/whatsapp/components/tabs/ConversationsTab.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../../../../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('whatsapp/components/tabs/ConversationsTab.vue', () => {
  let wrapper;

  let actions;
  let state;
  let store;

  beforeEach(() => {
    actions = {
      getConversations: jest.fn(),
      requestConversationsReport: jest.fn(),
    };

    state = {
      whatsAppConversations: {
        business_initiated: 0,
        user_initiated: 0,
        total: 0,
      },
      loadingConversations: false,
      errorConversations: false,
      loadingConversationsReport: false,
      errorConversationsReport: null,
    };

    store = new Vuex.Store({
      state: {
        auth: {
          project: '123',
        },
      },
      modules: {
        WhatsApp: {
          namespaced: true,
          actions,
          state,
        },
      },
    });

    wrapper = shallowMount(ConversationsTab, {
      localVue,
      i18n,
      store,
      propsData: {
        app: singleApp,
      },
      stubs: {
        UnnnicDateFilter: true,
        UnnnicDatePicker: true,
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

  describe('computed', () => {
    describe('hasBeforeAndAfter', () => {
      it('should return true if before and after are defined', () => {
        wrapper.setData({
          businessInitiated: 1,
          afterData: {
            MARKETING: 1,
          },
        });
        expect(wrapper.vm.hasBeforeAndAfter).toBeTruthy();
      });
    });
  });

  describe('handleDateFilter()', () => {
    it('should call getConversations()', async () => {
      const event = {
        startDate: '03-12-22',
        endDate: '04-13-23',
      };
      expect(actions.getConversations).not.toHaveBeenCalled();
      await wrapper.vm.handleDateFilter(event);
      expect(actions.getConversations).toHaveBeenCalledTimes(1);
      expect(actions.getConversations).toBeCalledWith(expect.any(Object), {
        code: singleApp.code,
        appUuid: singleApp.uuid,
        params: {
          start: event.startDate,
          end: event.endDate,
        },
      });
    });

    it('should call unnnicCallAlert on error', async () => {
      store.state.WhatsApp.errorConversations = true;
      const event = {
        startDate: '03-12-22',
        endDate: '04-13-23',
      };
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.handleDateFilter(event);
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });
  });

  describe('requestReport', () => {
    it('should call requestConversationReport', async () => {
      expect(actions.requestConversationsReport).not.toHaveBeenCalled();
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      wrapper.vm.startDate = '2020-01-01';
      wrapper.vm.endDate = '2020-01-02';
      await wrapper.vm.requestReport();
      expect(actions.requestConversationsReport).toHaveBeenCalledTimes(1);
      expect(actions.requestConversationsReport).toBeCalledWith(expect.any(Object), {
        code: singleApp.code,
        appUuid: singleApp.uuid,
        params: {
          start_date: expect.any(String),
          end_date: expect.any(String),
          project_uuid: expect.any(String),
        },
      });

      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            text: 'You will receive your detailed report by email shortly',
            title: 'Success',
            icon: expect.any(String),
            scheme: 'feedback-green',
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });

    it('should call unnnicCallAlert with default error if error is not 409', async () => {
      store.state.WhatsApp.errorConversationsReport = { response: { status: 500 } };
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.requestReport();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            text: 'Failed to request detailed report, please try again later',
            title: 'Error',
            icon: expect.any(String),
            scheme: 'feedback-red',
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });

    it('should call unnnicCallAlert with specific error if error is 409', async () => {
      store.state.WhatsApp.errorConversationsReport = { response: { status: 409 } };
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.requestReport();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            text: 'You already requested a detailed report a little while ago, you can request a new one after receiving the last one.',
            title: 'Attention',
            icon: expect.any(String),
            scheme: 'feedback-yellow',
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });
  });
});
