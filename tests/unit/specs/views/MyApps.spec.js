import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import MyApps from '@/views/MyApps.vue';
import AppGrid from '@/components/AppGrid.vue';
import { singleApp } from '../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('MyApps.vue', () => {
  let wrapper;
  let actions;
  let getters;
  let store;

  beforeEach(() => {
    // const fetchCategoriesSpy = spyOn(MyApps.methods, 'fetchCategories');
    actions = {
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

    wrapper = shallowMount(MyApps, {
      localVue,
      store,
      mocks: {
        $t: () => 'some specific text',
        $router: {
          replace: jest.fn(),
        },
        $route: {
          path: '/apps/1/details',
        },
      },
      stubs: {
        AppGrid,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('hasApps', () => {
    it('should return true if loadings are still ocurring', () => {
      expect(wrapper.vm.hasApps).toBeTruthy();
    });

    it('should return true if not loading and have data', async () => {
      await wrapper.setData({
        configuredApps: {
          loading: false,
          data: [singleApp],
        },
      });
      await wrapper.setData({
        installedApps: {
          loading: false,
          data: [],
        },
      });

      expect(wrapper.vm.hasApps).toBeTruthy();
    });

    it('should return false if not loading and dont have data', async () => {
      await wrapper.setData({
        configuredApps: {
          loading: false,
          data: [],
        },
      });
      await wrapper.setData({
        installedApps: {
          loading: false,
          data: [],
        },
      });

      expect(wrapper.vm.hasApps).toBeFalsy();
    });
  });

  describe('navigateToDiscovery', () => {
    it('should change route to discovery', () => {
      const spy = spyOn(wrapper.vm.$router, 'replace');
      wrapper.vm.navigateToDiscovery();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(`/apps/discovery`);
    });
  });

  describe('fetchCategories()', () => {
    it('should call fetchConfigured()', async () => {
      const spy = spyOn(wrapper.vm, 'fetchConfigured');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.fetchCategories();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call fetchInstalled()', async () => {
      const spy = spyOn(wrapper.vm, 'fetchInstalled');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.fetchCategories();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchConfigured()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call getConfiguredApps()', async () => {
      expect(actions.getConfiguredApps).not.toHaveBeenCalled();
      await wrapper.vm.fetchConfigured();
      expect(actions.getConfiguredApps).toHaveBeenCalledTimes(1);
    });

    it('should set new data on configuredApps', async () => {
      await wrapper.setData({ configuredApps: { loading: true, data: null } });
      expect(wrapper.vm.configuredApps.data).toBeNull();
      await wrapper.vm.fetchConfigured();
      expect(wrapper.vm.configuredApps.data).toEqual([singleApp]);
    });
  });

  describe('fetchInstalled()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call getInstalledApps()', async () => {
      expect(actions.getInstalledApps).not.toHaveBeenCalled();
      await wrapper.vm.fetchInstalled();
      expect(actions.getInstalledApps).toHaveBeenCalledTimes(1);
    });

    it('should set new data on installedApps', async () => {
      await wrapper.setData({ installedApps: { loading: true, data: null } });
      expect(wrapper.vm.installedApps.data).toBeNull();
      await wrapper.vm.fetchInstalled();
      expect(wrapper.vm.installedApps.data).toEqual([singleApp]);
    });
  });
});
