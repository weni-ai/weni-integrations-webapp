import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import AccountVerificationTab from '@/components/config/channels/whatsapp/components/tabs/AccountVerificationTab.vue';
import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import unnnic from '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

vi.mock('@/utils/dates', () => ({
  getLastNDaysRange: vi.fn(() => ({ start: '02-26-2026', end: '05-27-2026' })),
}));

describe('AccountVerificationTab', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  const app = { code: 'wpp-cloud', uuid: 'app-uuid' };

  const mountComponent = async () => {
    wrapper = mount(AccountVerificationTab, {
      props: { app },
      global: {
        plugins: [i18n, UnnnicSystem, pinia],
        stubs: {
          'unnnic-skeleton-loading': true,
        },
      },
    });
    await flushPromises();
  };

  const setVerificationState = (overrides = {}) => {
    const cloudStore = whatsapp_cloud();
    cloudStore.accountVerification = {
      ui_state: 'not_started',
      can_submit: true,
      rejection_reasons: [],
      ...overrides,
    };
    cloudStore.loadingAccountVerification = false;
    cloudStore.errorAccountVerification = null;
  };

  const setConversationTemplates = (templates) => {
    const wppStore = whatsapp_store();
    wppStore.whatsAppConversations = { templates };
    wppStore.loadingConversations = false;
    wppStore.errorConversations = null;
  };

  beforeEach(() => {
    setActivePinia(pinia);
    vi.clearAllMocks();

    const cloudStore = whatsapp_cloud();
    cloudStore.fetchAccountVerification = vi.fn().mockImplementation(async () => {
      setVerificationState();
    });
    cloudStore.submitAccountVerification = vi.fn().mockResolvedValue();

    const wppStore = whatsapp_store();
    wppStore.getConversations = vi.fn().mockImplementation(async () => {
      setConversationTemplates({
        MARKETING: 50,
        MARKETING_LITE: 0,
        UTILITY: 0,
        AUTHENTICATION: 0,
        SERVICE: 0,
      });
    });
  });

  it('shows reviewing disclaimer when ui_state is pending', async () => {
    const cloudStore = whatsapp_cloud();
    cloudStore.fetchAccountVerification = vi.fn().mockImplementation(async () => {
      setVerificationState({ ui_state: 'pending' });
    });
    setConversationTemplates({});

    await mountComponent();

    expect(wrapper.text()).toContain('Your documents are being reviewed by Meta');
    expect(wrapper.text()).not.toContain('Confirm that you verified');
  });

  it('shows not available disclaimer when usage threshold is not met', async () => {
    const cloudStore = whatsapp_cloud();
    cloudStore.fetchAccountVerification = vi.fn().mockImplementation(async () => {
      setVerificationState({ ui_state: 'not_started' });
    });

    const wppStore = whatsapp_store();
    wppStore.getConversations = vi.fn().mockImplementation(async () => {
      setConversationTemplates({
        MARKETING: 10,
        SERVICE: 10,
      });
    });

    await mountComponent();

    expect(wrapper.text()).toContain('Verification not available yet');
    expect(wrapper.text()).not.toContain('Confirm that you verified');
  });

  it('shows verification form when threshold is met', async () => {
    await mountComponent();

    expect(wrapper.text()).toContain('Confirm that you verified');
    expect(wrapper.text()).toContain('Upload supporting documents');
  });

  it('enables send when confirmations and files are set', async () => {
    await mountComponent();

    wrapper.vm.confirmations.legalEntity = true;
    wrapper.vm.confirmations.representative = true;
    wrapper.vm.confirmations.compliance = true;
    wrapper.vm.documentFiles = [new File(['x'], 'doc.pdf')];
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.canSend).toBe(true);
  });

  it('submits documents and shows success alert', async () => {
    const spyCallAlert = vi.spyOn(unnnic, 'unnnicCallAlert');
    const cloudStore = whatsapp_cloud();

    await mountComponent();

    wrapper.vm.confirmations.legalEntity = true;
    wrapper.vm.confirmations.representative = true;
    wrapper.vm.confirmations.compliance = true;
    const document = new File(['x'], 'doc.pdf');
    wrapper.vm.documentFiles = [document];
    await wrapper.vm.$nextTick();

    await wrapper.vm.handleSend();
    await flushPromises();

    expect(cloudStore.submitAccountVerification).toHaveBeenCalledWith({
      appUuid: 'app-uuid',
      documents: [document],
    });
    expect(spyCallAlert).toHaveBeenCalledWith({
      props: {
        text: 'Documents submitted successfully',
        type: 'success',
      },
      seconds: 6,
    });
  });

  it('lists selected files and removes them from documents', async () => {
    await mountComponent();

    wrapper.vm.documentFiles = [
      new File(['a'], 'contract.pdf'),
      new File(['b'], 'cnpj.png'),
    ];
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('contract.pdf');
    expect(wrapper.text()).toContain('cnpj.png');

    wrapper.vm.removeFile(0);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.documentFiles).toHaveLength(1);
    expect(wrapper.vm.documentFiles[0].name).toBe('cnpj.png');
  });

  it('adds files through the upload files button input', async () => {
    await mountComponent();

    const file = new File(['content'], 'registration.pdf', { type: 'application/pdf' });
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [file] });

    await input.trigger('change');

    expect(wrapper.vm.documentFiles).toHaveLength(1);
    expect(wrapper.vm.documentFiles[0].name).toBe('registration.pdf');
  });

  it('computes conversations sum excluding service category', async () => {
    const wppStore = whatsapp_store();
    wppStore.getConversations = vi.fn().mockImplementation(async () => {
      setConversationTemplates({
        MARKETING: 20,
        MARKETING_LITE: 10,
        UTILITY: 5,
        AUTHENTICATION: 5,
        SERVICE: 100,
      });
    });

    await mountComponent();

    expect(wrapper.vm.conversationsSum).toBe(40);
    expect(wrapper.vm.serviceTemplatesCount).toBe(100);
    expect(wrapper.vm.meetsUsageThreshold).toBe(true);
  });
});
