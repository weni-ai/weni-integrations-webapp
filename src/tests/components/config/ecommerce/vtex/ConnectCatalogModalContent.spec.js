import { mount } from '@vue/test-utils';
import ConnectCatalogModalContent from '@/components/config/ecommerce/vtex/ConnectCatalogModalContent.vue';
import UnnnicSystem from '@weni/unnnic-system';
import { describe, it, expect } from 'vitest';
import i18n from '@/utils/plugins/i18n';

describe('ConnectCatalogModalContent.vue', () => {
  it('should render the modal with input and footer', () => {
    const wrapper = mount(ConnectCatalogModalContent, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      mocks: {
        $t: (e) => e,
      },
    });

    const input = wrapper.findComponent({ name: 'unnnic-input' });
    expect(input.exists()).toBe(true);
    expect(input.props().label).toBe('Catalog ID');
    expect(input.props().placeholder).toBe('');

    const footer = wrapper.find('.modal__content__form__footer');
    expect(footer.exists()).toBe(true);
    expect(footer.html()).toContain(
      `By creating a catalog, you agree to the <a class="link" target="_blank" href="https://google.com"><b>Catalog Manager Terms</b></a> and confirm compliance with the <a class="link" target="_blank" href="https://google.com"><b>Facebook Advertising Policies</b></a>. Review these policies and ensure that items listed in the catalog comply.`,
    );
  });

  it('should emit closeModal when closeModal is called', () => {
    const wrapper = mount(ConnectCatalogModalContent, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });

    wrapper.vm.closeModal();

    expect(wrapper.emitted()).toHaveProperty('closeModal');
  });

  it('should emit connectCatalog with the correct name when connectCatalog is called', async () => {
    const wrapper = mount(ConnectCatalogModalContent, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });

    const input = wrapper.findComponent({ name: 'unnnic-input' });
    await input.setValue('My Catalog');

    wrapper.vm.connectCatalog();

    expect(wrapper.emitted('connectCatalog')).toBeTruthy();
    expect(wrapper.emitted('connectCatalog')[0]).toEqual([{ name: 'My Catalog' }]);

    expect(wrapper.emitted()).toHaveProperty('closeModal');
  });
});
