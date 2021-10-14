import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConfigPopUp from '@/components/config/ConfigPopUp.vue';
import { singleApp } from '../../../../__mocks__/appMock';
import i18n from '@/utils/plugins/i18n';

import wppDemoConfig from '@/components/config/channels/wpp_demo/Config.vue';

const localVue = createLocalVue();

describe('ConfigModal.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ConfigPopUp, {
      localVue,
      i18n,
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should close popup', () => {
    wrapper.vm.show = true;

    expect(wrapper.vm.show).toBeTruthy();
    wrapper.vm.closePopUp();
    expect(wrapper.vm.show).toBeFalsy();
  });

  it('should open configPopUp', async () => {
    expect(wrapper.vm.currentApp).toMatchObject({});

    wrapper.vm.openPopUp(singleApp);

    expect(wrapper.vm.show).toBeTruthy();
    expect(wrapper.vm.currentApp).toMatchObject(singleApp);
  });

  it('should set current component to wpp_demo', async () => {
    await wrapper.setData({ type: 'whatsapp_demo' });

    const currentComponent = wrapper.vm.currentComponent;

    expect(currentComponent).toMatchObject(wppDemoConfig);
  });

  it('should return default currentComponent', () => {
    const currentComponent = wrapper.vm.currentComponent;

    expect(currentComponent).toMatchObject(wppDemoConfig);
  });
});
