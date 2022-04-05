jest.mock('@/api/appType', () => {
  return {
    getAllAppTypes: jest.fn(),
    getAppType: jest.fn(),
    listComments: jest.fn(),
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    updateComment: jest.fn(),
    createApp: jest.fn(),
    getApp: jest.fn(),
    getConfiguredApps: jest.fn(),
    getInstalledApps: jest.fn(),
    deleteApp: jest.fn(),
  };
});

import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import AppGrid from '@/components/AppGrid.vue';
import addModal from '@/components/AddModal.vue';
import configPopUp from '@/components/config/ConfigPopUp.vue';
import ConfigModal from '@/components/config/ConfigModal.vue';
import skeletonLoading from '@/components/loadings/AppGrid.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../__mocks__/appMock';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('AppGrid.vue', () => {
  let wrapper;
  let actions;
  let getters;
  let store;

  beforeEach(() => {
    actions = {
      getAllAppTypes: jest.fn(() => {
        return { data: [singleApp] };
      }),
      createApp: jest.fn(() => {}),
      deleteApp: jest.fn(() => {}),
      getConfiguredApps: jest.fn(() => {
        return { data: [singleApp] };
      }),
      getInstalledApps: jest.fn(() => {
        return { data: [singleApp] };
      }),
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

    wrapper = shallowMount(AppGrid, {
      localVue,
      store,
      i18n,
      router,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
        UnnnicModal: true,
        UnnnicCard: true,
        UnnnicAvatarIcon: true,
        skeletonLoading,
        ConfigModal,
        addModal,
        configPopUp,
      },
      propsData: {
        section: 'channel',
        type: 'add',
        apps: [singleApp],
        loading: false,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('actionIcon', () => {
    it('should return add icon', async () => {
      await wrapper.setProps({ type: 'add' });
      expect(wrapper.vm.actionIcon).toEqual('add-1');
    });

    it('should return config icon', async () => {
      await wrapper.setProps({ type: 'config' });
      expect(wrapper.vm.actionIcon).toEqual('cog-1');
    });

    it('should return add icon', async () => {
      await wrapper.setProps({ type: 'edit' });
      expect(wrapper.vm.actionIcon).toEqual('pencil-write-1');
    });
  });

  describe('sectionIcon', () => {
    it('should return channel section icon and color', async () => {
      await wrapper.setProps({ type: 'add', section: 'channel' });
      expect(wrapper.vm.sectionIcon).toEqual({ icon: 'messages-bubble-1', scheme: 'aux-purple' });
    });
    it('should return ticket section icon and color', async () => {
      await wrapper.setProps({ type: 'add', section: 'ticket' });
      expect(wrapper.vm.sectionIcon).toEqual({ icon: 'messaging-we-chat-3', scheme: 'aux-blue' });
    });

    it('should return configure section icon and color', async () => {
      await wrapper.setProps({ type: 'add', section: 'configured' });
      expect(wrapper.vm.sectionIcon).toEqual({ icon: 'cog-1', scheme: 'aux-purple' });
    });

    it('should return installed section icon and color', async () => {
      await wrapper.setProps({ type: 'add', section: 'installed' });
      expect(wrapper.vm.sectionIcon).toEqual({ icon: 'check-circle-1-1', scheme: 'aux-blue' });
    });
  });

  describe('cardIcon', () => {
    it('should return add icon', async () => {
      await wrapper.setProps({ type: 'add' });
      expect(wrapper.vm.cardIcon).toEqual('add-1');
    });

    it('should return config icon', async () => {
      await wrapper.setProps({ type: 'config' });
      expect(wrapper.vm.cardIcon).toEqual('navigation-menu-vertical-1');
    });

    it('should return add icon', async () => {
      await wrapper.setProps({ type: 'edit' });
      expect(wrapper.vm.cardIcon).toEqual('navigation-menu-vertical-1');
    });
  });

  describe('openAppModal()', () => {
    it('should open App modal on trigger', async () => {
      const spy = spyOn(wrapper.vm, 'openAppModal');

      const cardComponent = wrapper.findComponent({ ref: 'unnnic-marketplace-card' });

      await cardComponent.vm.$emit('openModal');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should change change route on card click when type is "add"', async () => {
      await wrapper.setProps({ type: 'add' });
      const app = wrapper.vm.apps[0];
      expect(wrapper.vm.$route.path).not.toEqual(`/apps/${app.code}/details`);

      wrapper.vm.openAppModal(app);

      expect(wrapper.vm.$route.path).toEqual(`/apps/${app.code}/details`);
    });

    it('should open configModal if type is not "add" and design not popup', async () => {
      await wrapper.setProps({ type: 'config' });

      const app = wrapper.vm.apps[0];
      const configModal = wrapper.findComponent({ ref: 'configModal' });

      expect(configModal.vm.show).toBeFalsy();

      wrapper.vm.openAppModal(app);

      expect(configModal.vm.show).toBeTruthy();
    });
  });

  describe('appRatingAverage', () => {
    it('should return zero if rating is undefined', () => {
      const app = {};
      const rating = wrapper.vm.appRatingAverage(app);
      expect(rating).toEqual(0);
    });

    it('should return zero if rating average is undefined', () => {
      const app = {
        rating: undefined,
      };
      const rating = wrapper.vm.appRatingAverage(app);
      expect(rating).toEqual(0);
    });

    it('should return a non zero rating', () => {
      const app = {
        rating: {
          average: 2.3,
        },
      };
      const rating = wrapper.vm.appRatingAverage(app);
      expect(rating).toEqual(app.rating.average);
    });
  });

  describe('removeApp()', () => {
    it('should set RemoveModal state as open', async () => {
      expect(wrapper.vm.showRemoveModal).toBeFalsy();
      await wrapper.vm.removeApp();
      expect(wrapper.vm.showRemoveModal).toBeTruthy();
    });

    it('should set RemoveModal state as closed on modal close', async () => {
      const removeModalComponent = wrapper.findComponent({ ref: 'unnnic-remove-modal' });

      await wrapper.vm.removeApp();
      expect(wrapper.vm.showRemoveModal).toBeTruthy();

      await removeModalComponent.vm.$emit('close');
      expect(wrapper.vm.showRemoveModal).toBeFalsy();
    });

    it('should call deleteApp method', async () => {
      expect(actions.deleteApp).not.toHaveBeenCalled();
      const code = 'code';
      const appUuid = '123';
      await wrapper.vm.removeApp(code, appUuid);
      expect(actions.deleteApp).toHaveBeenCalledTimes(1);
    });

    it('should call toggleRemoveModal', async () => {
      const spy = spyOn(wrapper.vm, 'toggleRemoveModal');
      expect(spy).not.toHaveBeenCalled();
      const code = 'code';
      const appUuid = '123';
      await wrapper.vm.removeApp(code, appUuid);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on success', async () => {
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      const code = 'code';
      const appUuid = '123';
      await wrapper.vm.removeApp(code, appUuid);
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on error', async () => {
      actions.deleteApp.mockImplementation(() => {
        throw new Error('error fetching');
      });
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      const code = 'code';
      const appUuid = '123';
      await wrapper.vm.removeApp(code, appUuid);
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });
  });
});
