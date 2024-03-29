import { shallowMount, createLocalVue } from '@vue/test-utils';
import Apps from '@/views/Apps/index.vue';
import VueRouter from 'vue-router';
const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('App/index.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Apps, {
      localVue,
      router,
      stubs: {
        NavBar: true,
        Carousel: true,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
