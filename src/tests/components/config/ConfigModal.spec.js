import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ConfigModal from '@/components/config/ConfigModal.vue';
import wppConfig from '@/components/config/channels/whatsapp/Config.vue';
import telegramConfig from '@/components/config/channels/telegram/Config.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createI18n: () => ({
      t: (key) => key,
      locale: 'pt-br',
    }),
  };
});

describe('ConfigModal.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  const openDrawer = (app, isConfigured = false) =>
    wrapper.setProps({ open: true, app, isConfigured });

  beforeEach(() => {
    wrapper = mount(ConfigModal, {
      global: {
        plugins: [i18n, UnnnicSystem, pinia],
        stubs: {
          UnnnicDrawerNext: true,
          UnnnicDrawerContent: true,
          UnnnicDrawerHeader: true,
          UnnnicDrawerTitle: true,
        },
        mocks: {
          $t: (msg) => msg,
          $i18n: {
            locale: 'pt-br',
          },
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('opens the modal correctly', async () => {
    await openDrawer({ code: 'wpp' }, true);
    expect(wrapper.vm.open).toBe(true);
    expect(wrapper.vm.currentApp.code).toBe('wpp');
    expect(wrapper.vm.isConfigured).toBe(true);
  });

  it('emits update:open and close when the modal is closed', async () => {
    await openDrawer({ code: 'wpp' }, true);
    await wrapper.vm.closeModal();
    expect(wrapper.emitted('update:open')).toEqual([[false]]);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('renders the correct component based on app type', async () => {
    await openDrawer({
      code: 'tg',
      config: {
        token: '1234',
      },
    });
    expect(wrapper.vm.currentComponent).toBe(telegramConfig);

    await openDrawer({ code: 'wpp' });
    expect(wrapper.vm.currentComponent).toBe(wppConfig);
  });

  it('closes the drawer when onDrawerOpenChange receives false', async () => {
    await openDrawer({ code: 'wpp' }, true);
    wrapper.vm.onDrawerOpenChange(false);
    expect(wrapper.emitted('update:open')).toEqual([[false]]);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('does not emit close when onDrawerOpenChange repeats the current open state', () => {
    wrapper.vm.onDrawerOpenChange(false);
    expect(wrapper.emitted('close')).toBeUndefined();
    expect(wrapper.emitted('update:open')).toBeUndefined();
  });

  it('emits update:open true when onDrawerOpenChange receives true', () => {
    wrapper.vm.onDrawerOpenChange(true);
    expect(wrapper.emitted('update:open')).toEqual([[true]]);
  });

  it('does not render a header icon for WhatsApp', async () => {
    await openDrawer(
      {
        code: 'wpp',
        name: 'WhatsApp',
        icon: 'https://example.com/wpp.png',
      },
      true,
    );
    expect(wrapper.vm.showHeaderIcon).toBe(false);
    expect(wrapper.vm.headerTitle).toBe('WhatsApp');
  });

  it('shows WhatsApp title for wpp-cloud when instance has no name', async () => {
    await openDrawer(
      { code: 'wpp-cloud', uuid: 'baa88c70-55fc-47a9-b1ee-093f48248005' },
      true,
    );
    expect(wrapper.vm.headerTitle).toBe('WhatsApp');
  });

  it('renders a header icon for apps that use one', async () => {
    await openDrawer({
      code: 'tg',
      name: 'Telegram',
      icon: 'https://example.com/telegram.png',
    });
    expect(wrapper.vm.showHeaderIcon).toBe(true);
    expect(wrapper.vm.headerIcon).toBe('https://example.com/telegram.png');
    expect(wrapper.vm.headerTitle).toBe('Telegram');
  });

  describe('close event', () => {
    it('emits close when closeModal is called', async () => {
      await openDrawer({ code: 'wpp' }, true);
      await wrapper.vm.closeModal();
      expect(wrapper.emitted('close')).toHaveLength(1);
    });
  });
});
