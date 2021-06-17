import { shallowMount, createLocalVue } from '@vue/test-utils';
import Carousel from '@/components/Carousel.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

describe('AppGrid.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Carousel, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
