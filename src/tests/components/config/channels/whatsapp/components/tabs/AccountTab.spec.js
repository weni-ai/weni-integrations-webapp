import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import AccountTab from '@/components/config/channels/whatsapp/components/tabs/AccountTab.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createRouter, createWebHistory } from 'vue-router';

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

  it('renders QRCode with correct URL', () => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=74x74&data=${encodeURI(
      'https://wa.me/1234567890',
    )}`;
    expect(wrapper.vm.QRCodeUrl).toBe(qrCodeUrl);
    const img = wrapper.find('img.account-tab__content__info__qr__img');
    expect(img.attributes('src')).toBe(qrCodeUrl);
  });

  it('renders phone number correctly', () => {
    expect(wrapper.vm.phoneNumber.display_phone_number).toBe('+1234567890');
  });

  it('renders section fields correctly', () => {
    const section = wrapper.vm.accountSections[0];
    expect(section.fields[0].label).toBe('WhatsApp.config.channel.fields.phone_number');
    expect(section.fields[0].value).toBe('+1234567890');
  });

  it('navigates to templates when button is clicked', async () => {
    const button = wrapper.find('.account-tab__content__info__templates__buttons__button');
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
    expect(section.fields[1].value).toBe('Behalf Name');
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

    it('does not render when currency_migration_previous_waba_info is missing', () => {
      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('does not render when currency_migration_previous_waba_info is null', () => {
      wrapper = createWrapperWithConfig({
        wa_currency: 'BRL',
        currency_migration_previous_waba_info: null,
      });

      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('does not render when currency_migration_previous_waba_info is empty', () => {
      wrapper = createWrapperWithConfig({
        wa_currency: 'BRL',
        currency_migration_previous_waba_info: {},
      });

      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('does not render when previous currency is missing', () => {
      wrapper = createWrapperWithConfig({
        wa_currency: 'BRL',
        currency_migration_previous_waba_info: {
          wa_waba_id: '1623066789051136',
        },
      });

      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('does not render when current currency is not BRL', () => {
      wrapper = createWrapperWithConfig({
        wa_currency: 'USD',
        currency_migration_previous_waba_info: {
          wa_currency: 'EUR',
        },
      });

      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('does not render when previous currency is the same as current', () => {
      wrapper = createWrapperWithConfig({
        wa_currency: 'BRL',
        currency_migration_previous_waba_info: {
          wa_currency: 'BRL',
        },
      });

      expect(findBrlDisclaimer(wrapper).exists()).toBe(false);
    });

    it('renders when current currency is BRL and previous currency is different', () => {
      wrapper = createWrapperWithConfig({
        wa_currency: 'BRL',
        currency_migration_previous_waba_info: {
          migrated_at: '2026-07-30T23:53:08.065026+00:00',
          wa_currency: 'USD',
        },
      });

      expect(findBrlDisclaimer(wrapper).exists()).toBe(true);
    });

    it('uses migrated_at as the disclaimer date', () => {
      wrapper = createWrapperWithConfig({
        wa_currency: 'BRL',
        currency_migration_previous_waba_info: {
          migrated_at: '2026-07-30T23:53:08.065026+00:00',
          wa_currency: 'USD',
        },
      });

      expect(wrapper.vm.brlMigrationDate).toBe('July 30, 2026');
      expect(
        wrapper.vm.$t('WhatsApp.config.billing.brl_disclaimer.description', {
          migrationDate: wrapper.vm.brlMigrationDate,
        }),
      ).toContain('July 30, 2026');
    });

    it('falls back to wa_migration_date when migrated_at is missing', () => {
      wrapper = createWrapperWithConfig({
        wa_currency: 'BRL',
        wa_migration_date: '2026-08-01T10:00:00.000000+00:00',
        currency_migration_previous_waba_info: {
          wa_currency: 'USD',
        },
      });

      expect(wrapper.vm.brlMigrationDate).toBe('August 1, 2026');
    });
  });
});
