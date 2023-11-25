import { mount, createLocalVue } from '@vue/test-utils';
import ConnectCatalogModalContent from '@/components/config/ecommerce/vtex/ConnectCatalogModalContent.vue';
import i18n from '@/utils/plugins/i18n';
import '@weni/unnnic-system';

const localVue = createLocalVue();

const mountComponent = async () => {
  const wrapper = mount(ConnectCatalogModalContent, {
    localVue,
    i18n,
  });

  return { wrapper };
};

describe('components/config/ecommerce/vtex/ConnectCatalogModalContent.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should emit connectCatalog with name and businessType', async () => {
    const { wrapper } = await mountComponent();

    wrapper.vm.name = 'name';
    wrapper.vm.businessType = [{ value: 'other' }];

    const createButton = wrapper.findComponent({ ref: 'connectButton' });
    await createButton.trigger('click');

    expect(wrapper.emitted().connectCatalog).toBeTruthy();
    expect(wrapper.emitted().connectCatalog[0]).toEqual([
      {
        name: 'name',
        businessType: 'other',
      },
    ]);
  });

  it('should emit closeModal on close click', async () => {
    const { wrapper } = await mountComponent();

    const closeButton = wrapper.findComponent({ ref: 'closeButton' });
    closeButton.trigger('click');

    expect(wrapper.emitted().closeModal).toBeTruthy();
  });
});
