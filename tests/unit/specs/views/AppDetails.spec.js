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
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(AppDetails, {
      localVue,
      store,
      i18n,
      router,
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
});
