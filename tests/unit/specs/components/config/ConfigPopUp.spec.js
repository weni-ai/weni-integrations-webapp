import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConfigPopUp from '@/components/config/ConfigPopUp.vue';
import { singleApp } from '../../../../__mocks__/appMock';
import i18n from '@/utils/plugins/i18n';

import wppDemoConfig from '@/components/config/channels/wpp_demo/Config.vue';
import wppCloudSetup from '@/components/config/channels/whatsapp/Setup.vue';
import instagramSetup from '@/components/config/channels/facebook/Setup.vue';
import facebookSetup from '@/components/config/channels/facebook/Setup.vue';

const localVue = createLocalVue();

describe('ConfigPopUp.vue', () => {
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

  it('should close popup', async () => {
    await wrapper.setData({ type: 'wpp-demo' });
    wrapper.vm.show = true;

    expect(wrapper.vm.show).toBeTruthy();
    wrapper.vm.closePopUp();
    expect(wrapper.vm.show).toBeFalsy();
  });

  it('should open configPopUp', async () => {
    await wrapper.setData({ type: 'wpp-demo' });
    expect(wrapper.vm.currentApp).toMatchObject({});

    wrapper.vm.openPopUp(singleApp);

    expect(wrapper.vm.show).toBeTruthy();
    expect(wrapper.vm.currentApp).toMatchObject(singleApp);
  });

  it('should set current component to wpp_demo', async () => {
    await wrapper.setData({ type: 'wpp-demo' });

    const currentComponent = wrapper.vm.currentComponent;

    expect(currentComponent).toMatchObject(wppDemoConfig);
  });

  it('should set current component to whatsapp setup', async () => {
    await wrapper.setData({ type: 'wpp-cloud' });

    const currentComponent = wrapper.vm.currentComponent;

    expect(currentComponent).toMatchObject(wppCloudSetup);
  });

  it('should set current component to instagram setup', async () => {
    await wrapper.setData({ type: 'ig' });

    const currentComponent = wrapper.vm.currentComponent;

    expect(currentComponent).toMatchObject(instagramSetup);
  });

  it('should set current component to facebook setup', async () => {
    await wrapper.setData({ type: 'fba' });

    const currentComponent = wrapper.vm.currentComponent;

    expect(currentComponent).toMatchObject(facebookSetup);
  });

  it('should return undefined currentComponent', async () => {
    // await wrapper.setData({ type: 'wpp-demo' });
    const currentComponent = wrapper.vm.currentComponent;

    expect(currentComponent).toBe(undefined);
  });
});
