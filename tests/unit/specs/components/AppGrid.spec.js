jest.mock('@/api/appType', () => {
  return {
    getAllAppTypes: jest.fn(),
    getAppType: jest.fn(),
    listComments: jest.fn(),
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    updateComment: jest.fn(),
    createApp: jest.fn(),
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
import ConfigModal from '@/components/ConfigModal.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../__mocks__/appMock';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('AppGrid.vue with mocked loadApps', () => {
  // eslint-disable-next-line no-unused-vars
  let wrapper;
  let loadAppsSpy;

  localVue.use(Vuex);

  beforeEach(() => {
    loadAppsSpy = spyOn(AppGrid.methods, 'loadApps');

    wrapper = shallowMount(AppGrid, {
      mocks: {
        $t: () => 'some specific text',
      },
    });
  });

  it('should call loadApps when mounted', () => {
    expect(loadAppsSpy).toHaveBeenCalledTimes(1);
  });
});

describe('AppGrid.vue without mocked loadApps', () => {
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
        ConfigModal,
        addModal,
      },
      propsData: {
        section: 'channel',
        type: 'add',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call loadApps on updateGrid event', () => {
    const spy = spyOn(wrapper.vm, 'loadApps');
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.vm.$root.$emit('updateGrid');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('shold return add icon', async () => {
    await wrapper.setProps({ type: 'add' });
    expect(wrapper.vm.actionIcon).toEqual('add-1');
  });

  it('shold return config icon', async () => {
    await wrapper.setProps({ type: 'config' });
    expect(wrapper.vm.actionIcon).toEqual('cog-1');
  });

  it('shold return add icon', async () => {
    await wrapper.setProps({ type: 'edit' });
    expect(wrapper.vm.actionIcon).toEqual('pencil-write-1');
  });

  it('should open App modal on trigger', async () => {
    const spy = spyOn(wrapper.vm, 'openAppModal');

    await wrapper.setData({ apps: [singleApp] });
    const cardComponent = wrapper.findComponent({ ref: 'unnnic-marketplace-card' });

    await cardComponent.vm.$emit('openModal');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should change change route on card click when type is "add"', async () => {
    await wrapper.setProps({ type: 'add' });
    await wrapper.setData({ apps: [singleApp] });
    const app = wrapper.vm.apps[0];
    expect(wrapper.vm.$route.path).not.toEqual(`/apps/${app.code}/details`);

    wrapper.vm.openAppModal(app);

    expect(wrapper.vm.$route.path).toEqual(`/apps/${app.code}/details`);
  });

  it('should open configModal if type is not "add"', async () => {
    await wrapper.setProps({ type: 'config' });
    await wrapper.setData({ apps: [singleApp] });

    const app = wrapper.vm.apps[0];
    const configModal = wrapper.findComponent({ ref: 'configModal' });

    expect(configModal.vm.show).toBeFalsy();

    wrapper.vm.openAppModal(app);

    expect(configModal.vm.show).toBeTruthy();
  });

  describe('loadApps', () => {
    it('should fetch apps from API when type is add', async () => {
      expect(actions.getAllAppTypes).toHaveBeenCalledTimes(1);
      const filter = {
        category: 'channel',
      };
      await wrapper.vm.loadApps(filter);
      expect(actions.getAllAppTypes).toHaveBeenCalledTimes(2);
      expect(actions.getAllAppTypes).toHaveBeenCalledWith(expect.any(Object), filter);
    });

    it('should fetch installed apps from API when type is config', async () => {
      const params = {
        project_uuid: getters.getSelectedProject(),
      };
      expect(actions.getInstalledApps).toHaveBeenCalledTimes(0);
      await wrapper.setProps({ type: 'config' });
      await wrapper.vm.loadApps();
      expect(actions.getInstalledApps).toHaveBeenCalledTimes(1);
      expect(actions.getInstalledApps).toHaveBeenCalledWith(expect.any(Object), { params });
    });

    it('should fetch configured apps from API when type is edit', async () => {
      const params = {
        project_uuid: getters.getSelectedProject(),
      };
      expect(actions.getConfiguredApps).toHaveBeenCalledTimes(0);
      await wrapper.setProps({ type: 'edit' });
      await wrapper.vm.loadApps();
      expect(actions.getConfiguredApps).toHaveBeenCalledTimes(1);
      expect(actions.getConfiguredApps).toHaveBeenCalledWith(expect.any(Object), { params });
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

  describe('addApp()', () => {
    it('should call createApp method', async () => {
      expect(actions.createApp).not.toHaveBeenCalled();
      const code = 'code';
      await wrapper.vm.addApp(code);
      expect(actions.createApp).toHaveBeenCalledTimes(1);
    });

    it('should call getSelectedProject getter', async () => {
      expect(getters.getSelectedProject).not.toHaveBeenCalled();
      const code = 'code';
      await wrapper.vm.addApp(code);
      expect(getters.getSelectedProject).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on error', async () => {
      actions.createApp.mockImplementation(() => {
        throw new Error('error fetching');
      });
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      const code = 'code';
      await wrapper.vm.addApp(code);
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
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
