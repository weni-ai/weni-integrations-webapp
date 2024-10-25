import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  beforeEach(() => {
    wrapper = mount(ConfigModal, {
      global: {
        plugins: [i18n, UnnnicSystem, pinia],
        mocks: {
          $t: (msg) => msg,
          $i18n: {
            locale: 'pt-br',
          },
        },
      },
    });
  });

  it('opens the modal correctly', async () => {
    await wrapper.vm.openModal({ app: { code: 'wpp' }, isConfigured: true });
    expect(wrapper.vm.show).toBe(true);
    expect(wrapper.vm.currentApp.code).toBe('wpp');
    expect(wrapper.vm.isConfigured).toBe(true);
  });

  it('closes the modal without confirmation when needConfirmation is false', async () => {
    wrapper.vm.needConfirmation = false;
    await wrapper.vm.closeModal();
    expect(wrapper.vm.show).toBe(false);
  });

  it('shows confirmation modal when needConfirmation is true', async () => {
    wrapper.vm.needConfirmation = true;
    await wrapper.vm.closeModal();
    expect(wrapper.vm.showConfirmationModal).toBe(true);
  });

  it('confirms closing the modal', async () => {
    wrapper.vm.needConfirmation = true;
    await wrapper.vm.closeModal();
    await wrapper.vm.confirmClose();
    expect(wrapper.vm.show).toBe(false);
    expect(wrapper.vm.showConfirmationModal).toBe(false);
  });

  it('renders the correct component based on app type', async () => {
    await wrapper.vm.openModal({
      app: {
        code: 'tg',
        config: {
          token: '1234',
        },
      },
      isConfigured: false,
    });
    expect(wrapper.vm.currentComponent).toBe(telegramConfig);

    await wrapper.vm.openModal({ app: { code: 'wpp' }, isConfigured: false });
    expect(wrapper.vm.currentComponent).toBe(wppConfig);
  });

  it('toggles the confirmation modal', async () => {
    await wrapper.vm.toggleConfirmationModal();
    expect(wrapper.vm.showConfirmationModal).toBe(true);

    await wrapper.vm.toggleConfirmationModal();
    expect(wrapper.vm.showConfirmationModal).toBe(false);
  });

  it('closes the modal when the backdrop is clicked', async () => {
    await wrapper.vm.openModal({ app: { code: 'wpp' }, isConfigured: true });
    await wrapper.find('.config-modal__backdrop').trigger('click');
    expect(wrapper.vm.show).toBe(false);
  });

  it('setConfirmation value', async () => {
    await wrapper.vm.setConfirmation(true);
    expect(wrapper.vm.needConfirmation).toBe(true);
  });
});
