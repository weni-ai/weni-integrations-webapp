import AppModal from '../../../../src/views/Insights/index.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

describe('AppModal', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(AppModal, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
        UnnnicAvatarIcon: true,
        UnnnicBreadcrumb: true,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call toggleOpenModal', async () => {
    const spy = spyOn(wrapper.vm, 'toggleOpenModal');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.toggleOpenModal();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
