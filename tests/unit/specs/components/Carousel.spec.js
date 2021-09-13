import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Carousel from '@/components/Carousel.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Carousel.vue', () => {
  let wrapper;
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      fetchFeatured: jest.fn(() => {
        return { data: [singleApp] };
      }),
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(Carousel, {
      localVue,
      store,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should return true autoPlay if more than 1 app', async () => {
    await wrapper.setData({ apps: [singleApp, singleApp] });
    expect(wrapper.vm.hasAutoPlay).toBeTruthy();
  });

  it('should return true autoPlay if more than 1 app', async () => {
    await wrapper.setData({ apps: [singleApp] });
    expect(wrapper.vm.hasAutoPlay).toBeFalsy();
  });
});
