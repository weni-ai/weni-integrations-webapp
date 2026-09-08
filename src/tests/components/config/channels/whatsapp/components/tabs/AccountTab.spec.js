import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import AccountTab from '@/components/config/channels/whatsapp/components/tabs/AccountTab.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createRouter, createWebHistory } from 'vue-router';
import { unnnicToastManager } from '@weni/unnnic-system';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/templates', name: 'WhatsApp Templates Table' },
    { path: '/other', name: 'OtherRoute' },
  ],
});

describe('AccountTab.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  const push = vi.fn();

  const createWrapper = (props = {}, options = {}) => {
    return shallowMount(AccountTab, {
      global: {
        plugins: [i18n, UnnnicSystem, pinia, router],
      },
      props: {
        appInfo: {
          code: 'app_code',
          uuid: 'app_uuid',
          config: {
            wa_business_id: '123456',
            phone_number: {
              display_phone_number: '+1234567890',
              display_name: 'Test Phone',
            },
            waba: {
              name: 'Business Name',
              message_behalf_name: 'Behalf Name',
              timezone: 'GMT-3',
              id: 'waba_id_123',
              namespace: 'namespace_123',
            },
            certificate: 'Test Certificate',
            default_template_language: 'en',
            consent_status: 'Approved',
          },
        },
        hasCatalog: false,
        ...props,
      },
      mocks: {
        $router: {
          push,
        },
      },
      ...options,
    });
  };

  beforeEach(() => {
    wrapper = createWrapper();
  });

  it('renders component properly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders a single manage content label', () => {
    expect(wrapper.find('.account-tab__content__section__title').text()).toBe(
      'Manage content',
    );
  });

  it('renders phone number correctly', () => {
    expect(wrapper.vm.phoneNumber.display_phone_number).toBe('+1234567890');
  });

  it('renders section fields correctly', () => {
    const section = wrapper.vm.accountSections[0];
    expect(section.fields[0].label).toBe(
      'WhatsApp.config.channel.fields.phone_number',
    );
    expect(section.fields[0].value).toBe('+1234567890');
  });

  it('navigates to templates when button is clicked', async () => {
    const button = wrapper.find(
      '.account-tab__content__templates__buttons unnnic-button-stub',
    );
    const spy = vi.spyOn(wrapper.vm.$router, 'push');
    expect(button.exists()).toBe(true);
    await button.trigger('click');
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalledWith({
      path: '/apps/my/app_code/app_uuid/templates',
    });
  });

  it('navigates to catalog when button is clicked with catalog', async () => {
    wrapper = createWrapper({ hasCatalog: true });
    const catalogButton = wrapper.findComponent({ ref: 'catalogButton' });
    expect(catalogButton.exists()).toBe(true);
    await catalogButton.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      path: '/apps/my/app_code/app_uuid/catalogs',
    });
  });

  it('copies the phone number and shows a success toast', async () => {
    const writeText = vi.fn().mockResolvedValue();
    global.navigator.clipboard = { writeText };
    const toastSpy = vi
      .spyOn(unnnicToastManager, 'success')
      .mockResolvedValue();

    await wrapper
      .find('.account-tab__content__section__fields__field__copy')
      .trigger('click');

    expect(writeText).toHaveBeenCalledWith('+1234567890');
    expect(toastSpy).toHaveBeenCalledWith(
      wrapper.vm.$t('apps.config.copy_success'),
    );
    toastSpy.mockRestore();
  });

  it('opens WhatsApp URL when the outbound button is clicked', async () => {
    const openSpy = vi
      .spyOn(window, 'open')
      .mockReturnValue({ focus: vi.fn() });

    await wrapper
      .find('.account-tab__content__section__fields__field__open')
      .trigger('click');

    expect(openSpy).toHaveBeenCalledWith('https://wa.me/1234567890', '_blank');
    openSpy.mockRestore();
  });

  it('calls alert correctly on error when connecting catalog', async () => {
    wrapper.vm.vtexApp = null;
    wrapper.vm.callAlert = vi.fn();
    await wrapper.vm.handleCatalogConnect({ name: 'Test Catalog' });
    expect(wrapper.vm.callAlert).toHaveBeenCalledWith({
      type: 'Error',
      text: wrapper.vm.$t('WhatsApp.config.catalog.error.missing_vtex_app'),
    });
  });

  it('displays WABA info correctly in business account section', () => {
    const section = wrapper.vm.accountSections[1];
    expect(section.fields[0].value).toBe('Business Name');
    expect(section.fields[1].value).toBe('waba_id_123');
    expect(section.fields[2].value).toBe('Behalf Name');
  });

  describe('BRL billing disclaimer', () => {
    const findBrlDisclaimer = (component) =>
      component.find('.account-tab__content__brl-disclaimer');

    const createWrapperWithConfig = (config) =>
      createWrapper({
        appInfo: {
          ...wrapper.vm.appInfo,
          config: {
            ...wrapper.vm.appInfo.config,
            ...config,
          },
        },
      });

    const migratedConfig = (overrides = {}) => ({
      currency_migration: {
        migration_date: '2026-07-30T23:53:08.065026+00:00',
        old_waba_id: '1623066789051136',
        ...overrides,
      },
    });

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-08-13T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('does not render when currency_migration is missing', () => {
      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('does not render when currency_migration is null', () => {
      wrapper = createWrapperWithConfig({
        currency_migration: null,
      });

      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('does not render when currency_migration is empty', () => {
      wrapper = createWrapperWithConfig({
        currency_migration: {},
      });

      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('does not render when migration_date is missing', () => {
      wrapper = createWrapperWithConfig({
        currency_migration: {
          old_waba_id: '1623066789051136',
        },
      });

      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('does not render when old_waba_id is missing', () => {
      wrapper = createWrapperWithConfig({
        currency_migration: {
          migration_date: '2026-07-30T23:53:08.065026+00:00',
        },
      });

      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('renders when currency_migration has date and previous WABA id', () => {
      wrapper = createWrapperWithConfig(migratedConfig());

      expect(findBrlDisclaimer(wrapper).exists()).toBe(true);
    });

    it('does not render more than 30 days after the migration date', () => {
      vi.setSystemTime(new Date('2026-08-30T00:00:00.000Z'));
      wrapper = createWrapperWithConfig(migratedConfig());

      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('renders on the 30th day after the migration date', () => {
      vi.setSystemTime(new Date('2026-08-29T23:53:08.065026+00:00'));
      wrapper = createWrapperWithConfig(migratedConfig());

      expect(findBrlDisclaimer(wrapper).exists()).toBe(true);
    });

    it('uses currency_migration.migration_date as the disclaimer date', () => {
      wrapper = createWrapperWithConfig(migratedConfig());

      expect(wrapper.vm.brlMigrationDate).toBe('July 30, 2026');
      expect(
        wrapper.vm.$t('WhatsApp.config.billing.brl_disclaimer.description', {
          migrationDate: wrapper.vm.brlMigrationDate,
        }),
      ).toContain('July 30, 2026');
    });
  });
});
