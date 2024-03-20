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
import { mount, createLocalVue } from '@vue/test-utils';
import AppGrid from '@/components/AppGrid/index.vue';
import addModal from '@/components/AddModal/index.vue';
import configPopUp from '@/components/config/ConfigPopUp.vue';
import ConfigModal from '@/components/config/ConfigModal.vue';
import IntegrateButton from '@/components/IntegrateButton/index.vue';
import skeletonLoading from '@/components/loadings/AppGrid.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../__mocks__/appMock';

const mockIntegrateButtonAddApp = jest.fn();
IntegrateButton.methods = {
  ...IntegrateButton.methods,
  addApp: mockIntegrateButtonAddApp,
};

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('AppGrid.vue', () => {
  let wrapper;
  let actions;
  let state;
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

    state = {
      appType: {
        loadingDeleteApp: false,
        errorDeleteApp: false,
      },
      auth: {
        project: '123',
      },
    };

    store = new Vuex.Store({
      modules: {
        insights: {
          namespaced: true,
          actions: {
            setHasInsights: jest.fn(),
          },
        },
      },
      actions,
      state,
    });

    wrapper = mount(AppGrid, {
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
        IntegrateButton,
      },
      propsData: {
        section: 'channel',
        type: 'add',
        apps: [
          { ...singleApp, can_add: true },
          { ...singleApp, can_add: false, code: 'tg' },
        ],
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

  describe('openAppModal()', () => {
    it('should open App modal on trigger', async () => {
      const spy = spyOn(wrapper.vm, 'openAppModal');

      const cardComponent = wrapper.findComponent({ ref: 'unnnic-marketplace-card' });

      await cardComponent.vm.$emit('openModal');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should change route on card click when type is "add"', async () => {
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

    it('should not open app modal if type is add and app is generic', () => {
      const app = {
        generic: true,
      };
      const spy = spyOn(wrapper.vm, 'openAppDetails');

      wrapper.vm.openAppModal(app);

      expect(spy).toHaveBeenCalledTimes(0);
      expect(wrapper.vm.$route.path).not.toEqual(`/apps/${app.code}/details`);
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
      store.state.appType.errorDeleteApp = true;
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      expect(spy).not.toHaveBeenCalled();
      const code = 'code';
      const appUuid = '123';
      await wrapper.vm.removeApp(code, appUuid);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('pagination', () => {
    const elevenAppsArray = [
      singleApp,
      singleApp,
      singleApp,
      singleApp,
      singleApp,
      singleApp,
      singleApp,
      singleApp,
      singleApp,
      singleApp,
      singleApp,
    ];

    const threeAppsArray = [singleApp, singleApp, singleApp];

    describe('currentPageStart', () => {
      it('should return 1 if it is the first page', async () => {
        await wrapper.setData({ currentPage: 1 });
        expect(wrapper.vm.currentPageStart).toEqual(1);
      });

      it('should return correct start number based on current page', async () => {
        await wrapper.setData({ currentPage: 4 });
        expect(wrapper.vm.currentPageStart).toEqual(30);
      });
    });

    describe('currentPageCount', () => {
      it('should return current page maximum', async () => {
        await wrapper.setProps({ apps: elevenAppsArray });
        expect(wrapper.vm.currentPageCount).toEqual(10);
      });
      it('should return current page maximum', async () => {
        await wrapper.setProps({ apps: threeAppsArray });
        expect(wrapper.vm.currentPageCount).toEqual(3);
      });
    });

    describe('maxGridPages', () => {
      it('should return the max page count based on grid size and apps array length', async () => {
        await wrapper.setProps({ apps: elevenAppsArray });

        expect(wrapper.vm.maxGridPages).toEqual(2);
      });

      it('should return the max page count based on grid size and apps array length', async () => {
        await wrapper.setProps({ apps: threeAppsArray });
        expect(wrapper.vm.maxGridPages).toEqual(1);
      });

      it('should return 0 if there are no apps', async () => {
        await wrapper.setProps({ apps: undefined });
        expect(wrapper.vm.maxGridPages).toEqual(0);
      });
    });

    describe('currentGridApps', () => {
      it('should a maximum of apps allowed in page size', async () => {
        await wrapper.setProps({ apps: elevenAppsArray });
        expect(wrapper.vm.currentGridApps).toHaveLength(10);
      });

      it('should return the max page count based on grid size and apps array length', async () => {
        await wrapper.setProps({ apps: threeAppsArray });
        expect(wrapper.vm.currentGridApps).toHaveLength(3);
      });

      it('should return empty array if there are no apps', async () => {
        await wrapper.setProps({ apps: undefined });
        expect(wrapper.vm.currentGridApps).toHaveLength(0);
      });
    });
  });

  describe('manuallyCreateApp()', () => {
    it('should call integrateButton.addApp if app with provided code exists', async () => {
      expect(mockIntegrateButtonAddApp).not.toHaveBeenCalled();
      wrapper.vm.manuallyCreateApp('wwc');
      expect(mockIntegrateButtonAddApp).toHaveBeenCalledTimes(1);
    });

    it('should not call integrateButton.addApp if app with provided code does not exists', async () => {
      expect(mockIntegrateButtonAddApp).not.toHaveBeenCalled();
      wrapper.vm.manuallyCreateApp('random');
      expect(mockIntegrateButtonAddApp).toHaveBeenCalledTimes(0);
    });

    it('should not call integrateButton.addApp if app with provided code exists but cannot be added', async () => {
      expect(mockIntegrateButtonAddApp).not.toHaveBeenCalled();
      wrapper.vm.manuallyCreateApp('tg');
      expect(mockIntegrateButtonAddApp).toHaveBeenCalledTimes(0);
    });
  });

  describe('callErrorModal', () => {
    it('should call unnnicCallAlert', () => {
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      wrapper.vm.callErrorModal({ text: 'error text' });
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            text: 'error text',
            title: expect.any(String),
            icon: expect.any(String),
            scheme: expect.any(String),
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });
  });
});
