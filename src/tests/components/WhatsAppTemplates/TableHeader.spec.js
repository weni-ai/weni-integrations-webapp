import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import TableHeader from '@/components/whatsAppTemplates/TableHeader.vue';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import i18n from '@/utils/plugins/i18n';
import whatsApp from '@/api/appType/whatsapp';

vi.mock('@/api/appType/whatsapp');
vi.mock('@/utils/sentry');
vi.mock('@weni/unnnic-system', () => ({
  default: {
    unnnicCallAlert: vi.fn(),
  },
}));

describe('TableHeader.vue', () => {
  let wrapper;
  let store;
  const routerPush = vi.fn();

  const mountComponent = () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    });
    setActivePinia(pinia);
    store = whatsapp_store();

    return mount(TableHeader, {
      global: {
        plugins: [pinia, i18n],
        stubs: {
          UnnnicButton: {
            name: 'unnnic-button',
            props: ['disabled', 'loading', 'type', 'iconLeft'],
            template: '<button :disabled="disabled"><slot /></button>',
          },
          UnnnicToolTip: {
            name: 'unnnic-tool-tip',
            props: ['text', 'enabled', 'side', 'maxWidth'],
            template: '<div class="tooltip-stub"><slot /></div>',
          },
        },
        mocks: {
          $route: { params: { appCode: 'wpp-cloud', appUuid: 'app-uuid' } },
          $router: { push: routerPush },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    whatsApp.getWhatsAppTemplatesSyncStatus.mockResolvedValue({ last_synced_at: null });
    wrapper = mountComponent();
  });

  afterEach(() => {
    if (wrapper?.vm?.remainingTickId) {
      clearInterval(wrapper.vm.remainingTickId);
      wrapper.vm.remainingTickId = null;
    }
    wrapper?.unmount();
  });

  it('renders sync and new template buttons', async () => {
    await flushPromises();
    expect(wrapper.text()).toContain('Sync templates');
    expect(wrapper.text()).toContain('New template');
  });

  it('fetches sync status on mount', async () => {
    await flushPromises();
    expect(whatsApp.getWhatsAppTemplatesSyncStatus).toHaveBeenCalledWith('app-uuid');
  });

  it('disables sync button and shows remaining time in tooltip when in cooldown', async () => {
    await flushPromises();
    store.templatesLastSyncedAt = new Date(Date.now() - 50 * 60 * 1000).toISOString();
    wrapper.vm.nowMs = Date.now();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isSyncOnCooldown).toBe(true);
    expect(wrapper.vm.remainingMinutes).toBe(10);
    expect(wrapper.vm.syncCooldownTooltip).toContain('10 min');
  });

  it('calls sync and emits templates-synced on success', async () => {
    await flushPromises();
    whatsApp.syncWhatsAppTemplates.mockResolvedValue({
      last_synced_at: new Date().toISOString(),
    });
    await wrapper.vm.syncTemplates();
    await flushPromises();

    expect(whatsApp.syncWhatsAppTemplates).toHaveBeenCalledWith('app-uuid');
    expect(wrapper.emitted('templates-synced')).toBeTruthy();
  });

  it('does not call sync when cooldown is active', async () => {
    await flushPromises();
    store.templatesLastSyncedAt = new Date().toISOString();
    wrapper.vm.nowMs = Date.now();
    await wrapper.vm.$nextTick();

    await wrapper.vm.syncTemplates();
    expect(whatsApp.syncWhatsAppTemplates).not.toHaveBeenCalled();
  });

  it('navigates to create template', () => {
    wrapper.vm.navigateToCreateTemplate();
    expect(routerPush).toHaveBeenCalledWith({
      path: '/apps/my/wpp-cloud/app-uuid/templates/create',
    });
  });
});
