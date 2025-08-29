import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import FormTabs from '@/components/whatsAppTemplates/FormTabs.vue';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import { createRouter, createMemoryHistory } from 'vue-router';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/some-path/:appUuid', name: 'some-route' }],
});

describe('FormTabs.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    wrapper = mount(FormTabs, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem, router],
        mocks: {
          $t: (msg) => msg,
        },
      },
      mocks: {
        formMode: 'create',
        $route: {
          params: {
            appUuid: '1234',
          },
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should mount the component correctly', () => {
    const wrapper = mount(FormTabs, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem, router],
        mocks: {
          $t: (msg) => msg,
        },
      },
      props: {
        formMode: 'create',
        templateUuid: null,
      },
      mocks: {
        $route: {
          params: {
            appUuid: '1234',
          },
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.dataProcessingLoading).toBe(true);
  });

  it('should validate a correct header', async () => {
    const store = whatsapp_store();
    store.templateTranslationCurrentForm = {
      header: {
        text: 'Valid Header',
        header_type: 'TEXT',
      },
    };

    const result = wrapper.vm.validateHeader();
    await wrapper.vm.$nextTick();

    expect(result).toEqual({ header_type: 'TEXT', text: 'Valid Header' });
  });

  it('should validate an empty header as null', () => {
    wrapper.vm.templateTranslationCurrentForm.header = '';

    const result = wrapper.vm.validateHeader();

    expect(result).toBeNull();
  });

  it('should validate a correct body', () => {
    wrapper.vm.templateTranslationCurrentForm.body = 'Valid Body';

    const result = wrapper.vm.validateBody();

    expect(result).toEqual({ type: 'BODY', text: 'Valid Body' });
  });

  it('should validate a correct footer', () => {
    wrapper.vm.templateTranslationCurrentForm.footer = 'Valid Footer';

    const result = wrapper.vm.validateFooter();

    expect(result).toEqual({ type: 'FOOTER', text: 'Valid Footer' });
  });

  it('should fetch languages on creation', async () => {
    const spy = vi.spyOn(FormTabs.methods, 'fetchLanguages');
    const wrapper = mount(FormTabs, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem, router],
        mocks: {
          $t: (msg) => msg,
        },
      },
      mocks: {
        formMode: 'create',
        $route: {
          params: {
            appUuid: '1234',
          },
        },
      },
    });
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalled();
  });

  it('should show error modal on invalid name', async () => {
    const wrapper = mount(FormTabs, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem, router],
        mocks: {
          $t: (msg) => msg,
        },
      },
      mocks: {
        formMode: 'create',
        templateUuid: '123',
        $route: {
          params: {
            appUuid: '1234',
          },
        },
      },
    });
    wrapper.vm.templateForm.name = '';
    const spy = vi.spyOn(wrapper.vm, 'callErrorModal');
    await wrapper.vm.$nextTick();

    await wrapper.vm.handleSave();
    expect(spy).toHaveBeenCalledWith({
      text: expect.any(String),
    });
  });

  it('should validate the form correctly', () => {
    const wrapper = mount(FormTabs, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem, router],
        mocks: {
          $t: (msg) => msg,
        },
      },
      props: {
        formMode: 'edit',
      },
      mocks: {
        $route: {
          params: {
            appUuid: '1234',
          },
        },
        $t: (msg) => msg,
      },
    });

    wrapper.vm.templateTranslationCurrentForm = {
      header: { header_type: 'TEXT', text: 'Header' },
      body: 'Body text',
      footer: 'Footer text',
      buttons: [],
    };

    const result = wrapper.vm.validateForm();
    expect(result).toBeDefined();
  });

  it('should not call save if form is invalid', async () => {
    const spyCreate = vi.spyOn(FormTabs.methods, 'createTemplate');
    const spyUpdate = vi.spyOn(FormTabs.methods, 'updateTemplateForm');
    wrapper.vm.templateForm.name = '';

    await wrapper.vm.handleSave();

    expect(spyCreate).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  });
});
