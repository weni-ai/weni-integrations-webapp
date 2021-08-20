import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConfigModal from '@/components/ConfigModal.vue';
import { singleApp } from '../../../__mocks__/appMock';
import i18n from '@/utils/plugins/i18n';

import wwcConfig from '@/components/config/channels/WWC/Config.vue';

const localVue = createLocalVue();

describe('ConfigModal.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ConfigModal, {
      localVue,
      i18n,
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should close modal', () => {
    wrapper.vm.show = true;

    expect(wrapper.vm.show).toBeTruthy();
    wrapper.vm.closeModal();
    expect(wrapper.vm.show).toBeFalsy();
  });

  it('should open configModal', async () => {
    expect(wrapper.vm.currentApp).toMatchObject({});

    wrapper.vm.openModal(singleApp);

    expect(wrapper.vm.show).toBeTruthy();
    expect(wrapper.vm.currentApp).toMatchObject(singleApp);
  });

  it('should set current component to WWC', async () => {
    await wrapper.setData({ type: 'wwc' });

    const currentComponent = wrapper.vm.currentComponent;

    expect(currentComponent).toMatchObject(wwcConfig);
  });

  it('should return default currentComponent', () => {
    const currentComponent = wrapper.vm.currentComponent;

    expect(currentComponent).toMatchObject(wwcConfig);
  });
});
