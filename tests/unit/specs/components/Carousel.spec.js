import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Carousel from '@/components/Carousel/index.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Carousel.vue', () => {
  let wrapper;
  let actions;
  let state;
  let store;

  beforeEach(() => {
    actions = {
      fetchFeatured: jest.fn(() => {
        return { data: [singleApp] };
      }),
    };

    state = {
      appType: {
        featuredApps: [singleApp],
        loadingFeaturedApps: false,
        errorFeaturedApps: false,
      },
    };

    store = new Vuex.Store({
      actions,
      state,
    });

    wrapper = shallowMount(Carousel, {
      localVue,
      store,
      i18n,
      mocks: {
        $t: () => 'some specific text',
        $router: {
          push: () => {},
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should return true autoPlay if more than 1 app', async () => {
    store.state.appType.featuredApps = [singleApp, singleApp];
    expect(wrapper.vm.hasAutoPlay).toBeTruthy();
  });

  it('should return true autoPlay if more than 1 app', async () => {
    store.state.appType.featuredApps = [singleApp];
    expect(wrapper.vm.hasAutoPlay).toBeFalsy();
  });

  it('should change route on banner click', () => {
    const spy = spyOn(wrapper.vm.$router, 'push');
    const code = '123';
    wrapper.vm.openAppDetails(code);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(`/apps/${code}/details`);
  });
});
