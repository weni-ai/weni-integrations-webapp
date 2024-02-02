import { mount, createLocalVue } from '@vue/test-utils';
import CreateCatalogModalContent from '@/components/config/channels/whatsapp/components/CreateCatalogModalContent.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

const mountComponent = async () => {
  const wrapper = mount(CreateCatalogModalContent, {
    localVue,
    i18n,
  });

  return { wrapper };
};

describe('components/config/channels/whatsapp/components/CreateCatalogModalContent.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should emit createCatalog with selected type', async () => {
    const { wrapper } = await mountComponent();

    const metaOption = wrapper.findComponent({ ref: 'metaOption' });
    await metaOption.trigger('click');

    const createButton = wrapper.findComponent({ ref: 'createButton' });
    await createButton.trigger('click');

    expect(wrapper.emitted().createCatalog).toBeTruthy();
    expect(wrapper.emitted().createCatalog[0]).toEqual(['meta']);
  });

  it('should emit closeModal on close click', async () => {
    const { wrapper } = await mountComponent();

    const closeButton = wrapper.findComponent({ ref: 'closeButton' });
    closeButton.trigger('click');

    expect(wrapper.emitted().closeModal).toBeTruthy();
  });
});
