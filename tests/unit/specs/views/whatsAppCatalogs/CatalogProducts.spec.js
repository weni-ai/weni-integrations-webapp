import { shallowMount, createLocalVue } from '@vue/test-utils';
import CatalogProducts from '@/views/whatsAppCatalogs/CatalogProducts.vue';

const localVue = createLocalVue();

describe('views/whatsAppCatalogs/CatalogProducts.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(CatalogProducts, {
      localVue,
      propsData: {
        catalogName: 'catalog name',
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
