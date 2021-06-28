import { shallowMount, createLocalVue } from '@vue/test-utils';
import Discovery from '@/views/Discovery.vue';

const localVue = createLocalVue();

describe('Discovery.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Discovery, {
      localVue,
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
