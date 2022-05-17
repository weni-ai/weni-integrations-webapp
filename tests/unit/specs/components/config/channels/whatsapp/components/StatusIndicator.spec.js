import { shallowMount, createLocalVue } from '@vue/test-utils';
import StatusIndicator from '@/components/config/channels/whatsapp/components/StatusIndicator.vue';

const localVue = createLocalVue();

describe('whatsapp/components/StatusIndicator.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(StatusIndicator, {
      localVue,
      propsData: {
        status: 'green',
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
