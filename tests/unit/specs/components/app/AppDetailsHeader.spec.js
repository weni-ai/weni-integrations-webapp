import { mount, createLocalVue } from '@vue/test-utils';
import AppDetailsHeader from '@/components/app/AppDetailsHeader.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

describe('AppDetailsHeader.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(AppDetailsHeader, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call method on add button', async () => {
    const spy = spyOn(wrapper.vm, 'emitAdd');

    const addButton = wrapper.findComponent({ ref: 'unnnic-button-add' });
    await addButton.vm.$emit('click');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit on add', () => {
    wrapper.vm.emitAdd();
    expect(wrapper.emitted('add'));
  });
});
