import { shallowMount, createLocalVue } from '@vue/test-utils';
import AppDetails from '@/views/AppDetails.vue';
import i18n from '@/utils/plugins/i18n';
import VueRouter from 'vue-router';
const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('AppDetails.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AppDetails, {
      localVue,
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
});
