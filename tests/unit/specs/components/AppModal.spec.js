import AppModal from '../../../../src/components/AppModal/index.vue';
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
        UnnnicModal: true,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call toggleRemoveModal', async () => {
    const spy = spyOn(wrapper.vm, 'toggleRemoveModal');
    expect(spy).not.toHaveBeenCalled();
    wrapper.vm.toggleRemoveModal();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set RemoveModal state as closed on modal close', async () => {
    const removeModalComponent = wrapper.findComponent({ ref: 'unnnic-remove-modal' });
    await removeModalComponent.vm.$emit('close');
    expect(wrapper.vm.showRemoveModal).toBeTruthy();
  });
});
