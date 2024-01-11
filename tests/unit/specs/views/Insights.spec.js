import Insights from '../../../../src/views/Insights/index.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

describe('Insights', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Insights, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call toggleOpenModal', () => {
    const spy = spyOn(wrapper.vm, 'toggleOpenModal');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.toggleOpenModal();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set toggleModal to true', async () => {
    wrapper.vm.toggleOpenModal();
    expect(wrapper.vm.showModal).toBeTruthy();
  });
});
