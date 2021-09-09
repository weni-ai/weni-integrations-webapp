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
import AppTypeStore from '@/store/appType';
import { singleApp } from '../../../__mocks__/appMock';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('AppDetails.vue', () => {
  let wrapper;
  let store;
  let actions;

  beforeEach(() => {
    store = new Vuex.Store(AppTypeStore);

    actions = {
      getAppType: jest.fn(() => {
        return { data: singleApp };
      }),
      postRating: jest.fn(),
    };

    store = new Vuex.Store({
      actions,
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
      expect(actions.getAppType).toHaveBeenCalledWith(expect.any(Object), appCode);

      expect(wrapper.vm.app).toEqual(singleApp);
      expect(wrapper.vm.loading).toEqual(false);
    });
  });

  describe('appRatingString()', () => {
    it('should return zero if rating average is null', async () => {
      await wrapper.setData({ app: { rating: { average: null } } });
      const str = wrapper.vm.appRatingString;
      expect(str).toEqual('0');
      expect(typeof str).toEqual('string');
    });

    it('should return rating as a string if not null', async () => {
      await wrapper.setData({ app: { rating: { average: 2 } } });
      const str = wrapper.vm.appRatingString;
      expect(str).toEqual('2');
      expect(typeof str).toEqual('string');
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
      const assets = [{ type: 'notLink' }, { type: 'link' }];
      wrapper.vm.app.assets = assets;
      expect(wrapper.vm.appLinks).toHaveLength(1);
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
        code: wrapper.vm.app.code,
        payload: { rate },
      });
    });

    it('should call unnnicCallAlert on error', async () => {
      actions.postRating.mockImplementation(() => {
        throw new Error();
      });
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.handleRating();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });

    describe('appMetrics', () => {
      it('should return hifen if no app metrics', () => {
        expect(wrapper.vm.appMetrics).toEqual('-');
      });

      it('should return metric as string if exists', async () => {
        await wrapper.setData({ app: { metrics: 2 } });
        expect(wrapper.vm.appMetrics).toEqual('2');
      });
    });

    describe('appIntegrationsCount', () => {
      it('should return hifen if no app integrations_count', () => {
        expect(wrapper.vm.appIntegrationsCount).toEqual('-');
      });

      it('should return integrations_count as string if exists', async () => {
        await wrapper.setData({ app: { integrations_count: 2 } });
        expect(wrapper.vm.appIntegrationsCount).toEqual('2');
      });
    });
  });
});
