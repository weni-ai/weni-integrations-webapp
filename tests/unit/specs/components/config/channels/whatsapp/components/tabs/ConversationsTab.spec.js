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
  let store;

  beforeEach(() => {
    actions = {
      getConversations: jest.fn(() => {
        return { data: singleApp };
      }),
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(ConversationsTab, {
      localVue,
      i18n,
      store,
      propsData: {
        app: singleApp,
      },
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        ConversationsTable: true,
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
      actions.getConversations.mockImplementation(() => {
        throw new Error('error fetching');
      });

      const event = {
        startDate: '03-12-22',
        endDate: '04-13-23',
      };
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.handleDateFilter(event);
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });
  });
});
