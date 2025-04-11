import { mount } from '@vue/test-utils';
import ConnectCatalogModalContent from '@/components/config/ecommerce/vtex/ConnectCatalogModalContent.vue';
import UnnnicSystem from '@weni/unnnic-system';
import { describe, it, expect } from 'vitest';
import i18n from '@/utils/plugins/i18n';

describe('ConnectCatalogModalContent.vue', () => {
  it('should render the modal with title, input, and footer', () => {
    const wrapper = mount(ConnectCatalogModalContent, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      mocks: {
        $t: (e) => e,
      },
    });

    const title = wrapper.find('.modal__content__title');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Basic informations');

    const input = wrapper.findComponent({ name: 'unnnic-input' });
    expect(input.exists()).toBe(true);
    expect(input.props().label).toBe('Catalog ID');
    expect(input.props().placeholder).toBe('');

    const footer = wrapper.find('.modal__content__form__footer');
    expect(footer.exists()).toBe(true);
    expect(footer.html()).toContain(
      `<span data-v-ecca50a3="" class="modal__content__form__footer">By creating a catalog, you agree to the <a class="link" target="_blank" href="https://google.com"><b>Catalog Manager Terms</b></a> and confirm that you follow <a class="link" target="_blank" href="https://google.com"><b>Facebook's Advertising Policies</b></a>. Please review these policies and confirm that the items you upload to your catalog comply with them.</span>`,
    );
  });

  it('should emit closeModal when the cancel button is clicked', async () => {
    const wrapper = mount(ConnectCatalogModalContent, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });

    const closeButton = wrapper.findComponent({ ref: 'closeButton' });
    expect(closeButton.exists()).toBe(true);

    await closeButton.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('closeModal');
  });

  it('should emit connectCatalog with the correct name when the continue button is clicked', async () => {
    const wrapper = mount(ConnectCatalogModalContent, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
    });

    const connectButton = wrapper.findComponent({ ref: 'connectButton' });
    expect(connectButton.exists()).toBe(true);

    const input = wrapper.findComponent({ name: 'unnnic-input' });
    await input.setValue('My Catalog');

    await connectButton.trigger('click');

    expect(wrapper.emitted('connectCatalog')).toBeTruthy();
    expect(wrapper.emitted('connectCatalog')[0]).toEqual([{ name: 'My Catalog' }]);

    expect(wrapper.emitted()).toHaveProperty('closeModal');
  });

  it('should display loading state on the continue button', () => {
    const wrapper = mount(ConnectCatalogModalContent, {
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      props: {
        loading: true,
      },
    });

    const connectButton = wrapper.findComponent({ ref: 'connectButton' });
    expect(connectButton.exists()).toBe(true);

    expect(connectButton.props('loading')).toBe(true);
  });
});
