import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App.vue';
import i18n from '@/utils/plugins/i18n';
import VueRouter from 'vue-router';
const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('App.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(App, {
      localVue,
      i18n,
      router,
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
