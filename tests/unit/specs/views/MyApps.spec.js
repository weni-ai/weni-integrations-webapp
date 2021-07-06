import { shallowMount, createLocalVue } from '@vue/test-utils';
import MyApps from '@/views/MyApps.vue';

const localVue = createLocalVue();

describe('App.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(MyApps, {
      localVue,

      stubs: {
        AppGrid: true,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
