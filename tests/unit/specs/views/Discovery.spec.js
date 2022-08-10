import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Discovery from '@/views/Discovery.vue';
import AppGrid from '@/components/AppGrid.vue';
import { singleApp } from '../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Discovery.vue', () => {
  let wrapper;
  let actions;
  let getters;
  let state;
  let store;

  beforeEach(() => {
    actions = {
      getAllAppTypes: jest.fn(),
    };

    getters = {
      getSelectedProject: jest.fn(() => {
        return '123';
      }),
    };

    state = {
      appType: {
        loadingDeleteApp: false,
        errorDeleteApp: false,

        allAppTypes: [singleApp],
        loadingAllAppTypes: false,
        errorAllAppTypes: false,
      },
    };

    store = new Vuex.Store({
      actions,
      getters,
      state,
    });

    wrapper = shallowMount(Discovery, {
      localVue,
      store,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        AppGrid,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('fetchChannels', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should call getAllAppTypes', async () => {
      expect(actions.getAllAppTypes).not.toHaveBeenCalled();
      await wrapper.vm.fetchChannels();
      expect(actions.getAllAppTypes).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on error', async () => {
      store.state.appType.errorAllAppTypes = true;
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.fetchChannels();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });
  });
});
