import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import CatalogCard from '@/components/whatsAppCatalogs/CatalogCard.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('CatalogCard.vue', () => {
  let wrapper;
  const catalog = {
    name: 'Test Catalog',
    facebook_catalog_id: '12345',
    is_connected: true,
  };
  const enabledCart = true;

  beforeEach(() => {
    wrapper = mount(CatalogCard, {
      props: {
        catalog,
        enabledCart,
      },
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });
  });

  it('should render catalog details correctly', () => {
    expect(wrapper.text()).toContain(catalog.name);
    expect(wrapper.text()).toContain(catalog.facebook_catalog_id);
    expect(wrapper.text()).toContain(wrapper.vm.$t('WhatsApp.catalog.list.identification'));
  });

  it('should emit "enable" when catalog status is toggled to true', async () => {
    const catalogConnectSwitch = wrapper.findComponent({ ref: 'catalogConnectSwitch' });

    await catalogConnectSwitch.vm.$emit('update:modelValue', true);

    expect(wrapper.emitted().enable).toBeTruthy();
  });

  it('should emit "disable" when catalog status is toggled to false', async () => {
    await wrapper.setData({ catalogStatus: false });

    const catalogConnectSwitch = wrapper.findComponent({ ref: 'catalogConnectSwitch' });

    await catalogConnectSwitch.vm.$emit('update:modelValue', false);

    expect(wrapper.emitted().disable).toBeTruthy();
  });

  it('should emit "toggleCart" when cart status is toggled', async () => {
    const cartEnableSwitch = wrapper.findComponent({ ref: 'cartEnableSwitch' });
    await cartEnableSwitch.vm.$emit('update:modelValue', !enabledCart);

    expect(wrapper.emitted().toggleCart).toBeTruthy();
  });

  it('should handle click on the wrapper correctly', async () => {
    const wrapperDiv = wrapper.find('.whatsapp-catalog-card__wrapper');

    await wrapperDiv.trigger('click');

    expect(wrapper.emitted().redirectClick).toBeTruthy();
  });

  it('should display the correct text on the switches', () => {
    const catalogConnectSwitch = wrapper.findComponent({ ref: 'catalogConnectSwitch' });
    const cartEnableSwitch = wrapper.findComponent({ ref: 'cartEnableSwitch' });

    const catalogText = catalog.is_connected
      ? wrapper.vm.$t('WhatsApp.catalog.list.actions.active_catalog')
      : wrapper.vm.$t('WhatsApp.catalog.list.actions.inactive_catalog');
    expect(catalogConnectSwitch.text()).toContain(catalogText);

    if (catalog.is_connected) {
      const cartText = enabledCart
        ? wrapper.vm.$t('WhatsApp.catalog.list.actions.active_cart')
        : wrapper.vm.$t('WhatsApp.catalog.list.actions.inactive_cart');
      expect(cartEnableSwitch.text()).toContain(cartText);
    }
  });
});
