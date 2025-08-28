import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';
import FormHeader from '@/components/whatsAppTemplates/FormHeader.vue';
import FormHeaderLoading from '@/components/whatsAppTemplates/loadings/FormHeaderLoading.vue';
import { app_type } from '@/stores/modules/appType/appType.store';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';

describe('FormHeader.vue', () => {
  let wrapper;
  let appTypeStore;
  let whatsappStore;
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });

  beforeEach(() => {
    wrapper = shallowMount(FormHeader, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      mocks: {
        $route: {
          params: '1234',
        },
      },
    });

    appTypeStore = app_type();
    whatsappStore = whatsapp_store();
  });

  it('renders FormHeaderLoading if loadingCurrentAppType is true', async () => {
    appTypeStore.loadingCurrentAppType = true;
    await wrapper.vm.$nextTick();

    const loadingComponent = wrapper.findComponent(FormHeaderLoading);
    expect(loadingComponent.exists()).toBe(true);
  });

  it('renders the form header content if loadingCurrentAppType is false', async () => {
    appTypeStore.loadingCurrentAppType = false;
    appTypeStore.currentAppType = { icon: 'app-icon-url' };
    whatsappStore.templateTranslationCurrentForm = { status: 'APPROVED' };

    await wrapper.vm.$nextTick();

    const formHeaderWrapper = wrapper.find('.form-header__wrapper');
    expect(formHeaderWrapper.exists()).toBe(true);

    const title = wrapper.find('.form-header__title');
    expect(title.text()).toBe('WhatsApp Templates');
  });

  it('calls fetchData method on created lifecycle hook', async () => {
    const fetchDataSpy = vi.spyOn(FormHeader.methods, 'fetchData');

    shallowMount(FormHeader, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });

    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('fetches appType when fetchData is called', () => {
    const appCode = 'test-app-code';
    wrapper.vm.$route = { params: { appCode } };
    wrapper.vm.fetchData();
    expect(appTypeStore.getAppType).toHaveBeenCalledWith({ code: appCode, shouldLoad: true });
  });
});
