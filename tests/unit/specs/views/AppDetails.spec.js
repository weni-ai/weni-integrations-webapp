import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

jest.mock('@/api/appType', () => jest.fn());

import { shallowMount, createLocalVue } from '@vue/test-utils';
import AppDetails from '@/views/AppDetails.vue';
import i18n from '@/utils/plugins/i18n';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { singleApp } from '../../../__mocks__/appMock';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('AppDetails.vue', () => {
  let wrapper;
  let store;
  let actions;
  let state;

  beforeEach(() => {
    actions = {
      getAppType: jest.fn(() => {
        return { data: singleApp };
      }),
      postRating: jest.fn(),
    };

    state = {
      appType: {
        currentAppType: singleApp,
        loadingCurrentAppType: false,
        errorCurrentAppType: false,
      },
    };

    store = new Vuex.Store({
      actions,
      state,
    });

    wrapper = shallowMount(AppDetails, {
      localVue,
      store,
      i18n,
      router,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicBanner: true,
        Navigator: true,
        AppImagesBanner: true,
        AppDetailsHeader: true,
        AppDetailsAbout: true,
        AppDetailsRecommended: true,
        AppDetailsComments: true,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('fetchApp()', () => {
    it('should call fetch app from API', async () => {
      expect(actions.getAppType).toHaveBeenCalledTimes(1);
      const appCode = 'code';
      await wrapper.vm.fetchApp(appCode);
      expect(actions.getAppType).toHaveBeenCalledTimes(2);
      expect(actions.getAppType).toHaveBeenCalledWith(expect.any(Object), {
        code: appCode,
        shouldLoad: true,
      });
    });
  });

  describe('appRatingString()', () => {
    it('should return zero if rating average is null', async () => {
      store.state.appType.currentAppType = { ...singleApp, rating: { average: null } };
      expect(wrapper.vm.appRatingString).toEqual('0');
      expect(typeof wrapper.vm.appRatingString).toEqual('string');
    });

    it('should return rating as a string if not null', async () => {
      store.state.appType.currentAppType = { ...singleApp, rating: { average: 2 } };
      expect(wrapper.vm.appRatingString).toEqual('2');
      expect(typeof wrapper.vm.appRatingString).toEqual('string');
    });
  });

  describe('appLinks()', () => {
    beforeEach(() => {
      wrapper.vm.app = {
        code: 'code',
        rating: { average: null },
        assets: [],
      };
    });

    it('should return no links', () => {
      const assets = [{ type: 'notLink' }, { type: 'notLink' }];
      wrapper.vm.app.assets = assets;
      expect(wrapper.vm.appLinks).toHaveLength(0);
    });

    it('should return valid links', () => {
      const assets = [{ type: 'notLink' }, { type: 'LK' }];
      store.state.appType.currentAppType = { ...singleApp, assets };
      expect(wrapper.vm.appLinks).toHaveLength(1);
    });
  });

  describe('navigatorHistory()', () => {
    it('should return history with current app', () => {
      expect(wrapper.vm.navigatorHistory).toHaveLength(2);
      expect(wrapper.vm.navigatorHistory[0].path).toEqual('/apps/discovery');
      expect(wrapper.vm.navigatorHistory[1].path).toEqual('');
    });

    it('should return history without current app', () => {
      store.state.appType.currentAppType = {};
      expect(wrapper.vm.navigatorHistory).toHaveLength(1);
      expect(wrapper.vm.navigatorHistory[0].path).toEqual('/apps/discovery');
    });
  });

  describe('handleRating()', () => {
    beforeEach(() => {
      wrapper.vm.app = {
        rating: { average: null },
        assets: [],
      };
    });

    it('should call postRating()', async () => {
      expect(actions.postRating).not.toHaveBeenCalled();
      const rate = 4;
      await wrapper.vm.handleRating(rate);
      expect(actions.postRating).toHaveBeenCalledTimes(1);
      expect(actions.postRating).toHaveBeenCalledWith(expect.any(Object), {
        code: wrapper.vm.currentAppType.code,
        payload: { rate },
      });
    });

    it('should call unnnicCallAlert on error', async () => {
      store.state.appType.errorPostRating = true;
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.handleRating();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });

    describe('appMetrics', () => {
      it('should return hifen if no app metrics', () => {
        expect(wrapper.vm.appMetrics).toEqual('-');
      });

      it('should return metric as string if exists', async () => {
        store.state.appType.currentAppType = { ...singleApp, metrics: 2 };
        expect(wrapper.vm.appMetrics).toEqual('2');
      });
    });

    describe('appIntegrationsCount', () => {
      it('should return hifen if no app integrations_count', () => {
        expect(wrapper.vm.appIntegrationsCount).toEqual('-');
      });

      it('should return integrations_count as string if exists', async () => {
        store.state.appType.currentAppType = { ...singleApp, integrations_count: 2 };
        expect(wrapper.vm.appIntegrationsCount).toEqual('2');
      });
    });
  });
});
