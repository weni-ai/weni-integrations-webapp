import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import { mount, createLocalVue } from '@vue/test-utils';
import AppDetailsHeader from '@/components/app/AppDetailsHeader.vue';
import i18n from '@/utils/plugins/i18n';
import Vuex from 'vuex';
import { singleApp } from '../../../../__mocks__/appMock';

const localVue = createLocalVue();

describe('AppDetailsHeader.vue', () => {
  let wrapper;
  let actions;
  let getters;
  let store;

  localVue.use(Vuex);

  beforeEach(() => {
    actions = {
      createApp: jest.fn(() => {}),
    };

    getters = {
      getSelectedProject: jest.fn(() => {
        return '123';
      }),
    };

    store = new Vuex.Store({
      actions,
      getters,
    });

    wrapper = mount(AppDetailsHeader, {
      localVue,
      store,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
      },
      propsData: {
        app: singleApp,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('openAddModal()', () => {
    it('should toggle addModal', async () => {
      const addModalComponent = wrapper.findComponent({ ref: 'addModal' });
      const addModalToggleSpy = spyOn(addModalComponent.vm, 'toggleModal');

      expect(addModalToggleSpy).not.toHaveBeenCalled();

      const code = 'code';
      await wrapper.vm.openAddModal(code);

      expect(addModalToggleSpy).toHaveBeenCalledTimes(1);
    });

    it('should call createApp method', async () => {
      expect(actions.createApp).not.toHaveBeenCalled();
      const code = 'code';
      await wrapper.vm.openAddModal(code);
      expect(actions.createApp).toHaveBeenCalledTimes(1);
    });

    it('should call getSelectedProject getter', async () => {
      expect(getters.getSelectedProject).not.toHaveBeenCalled();
      const code = 'code';
      await wrapper.vm.openAddModal(code);
      expect(getters.getSelectedProject).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on error', async () => {
      actions.createApp.mockImplementation(() => {
        throw new Error('error fetching');
      });
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      const code = 'code';
      await wrapper.vm.openAddModal(code);
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });
  });
});
