import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import ProductList from '@/components/whatsAppCatalogs/ProductList.vue';
import '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  catalogName = 'catalog name',
  catalogProducts = {
    results: [
      {
        image_link: 'image-link',
        title: 'title',
        available: true,
        price: 'R$ 10,00',
        base_price: 'R$ 12,00',
        facebook_product_id: 'fb-id-123',
      },
    ],
    count: 1,
  },
  loadingCatalogProducts = false,
  errorCatalogProducts = null,
} = {}) => {
  const state = {
    catalogProducts,
    loadingCatalogProducts,
    errorCatalogProducts,
  };

  const actions = {
    getCatalogProducts: jest.fn(),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsAppCloud: {
        namespaced: true,
        actions,
        state,
      },
    },
  });

  const wrapper = mount(ProductList, {
    localVue,
    store,
    i18n,
    propsData: {
      catalogName,
    },
    mocks: {
      $route: {
        params: {
          appUuid: 'app-uuid-123',
          catalogUuid: 'catalog-uuid-123',
        },
      },
    },
  });

  return { wrapper, actions, state };
};

describe('components/whatsAppCatalog/ProductList.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('computed', () => {
    describe('listItems', () => {
      it('should return an empty array if there are no catalogs', async () => {
        const { wrapper } = await mountComponent({ catalogProducts: null });
        expect(wrapper.vm.listItems).toEqual([]);
      });

      it('should return an array of catalog products', async () => {
        const { wrapper } = await mountComponent();
        expect(wrapper.vm.listItems).toEqual(wrapper.vm.catalogProducts.results);
      });
    });

    describe('totalCount', () => {
      it('should return pageSize if there are no catalogs provided', async () => {
        const { wrapper } = await mountComponent({
          catalogProducts: { results: [], count: 0 },
        });
        expect(wrapper.vm.totalCount).toBe(wrapper.vm.pageSize);
      });
    });

    describe('pageCount', () => {
      it('should return 1 if there are no catalogs', async () => {
        const { wrapper } = await mountComponent({ catalogProducts: { results: [], count: 0 } });
        expect(wrapper.vm.pageCount).toBe(1);
      });

      it('should return correct number of pages based on limit and count', async () => {
        const { wrapper } = await mountComponent({ catalogProducts: { results: [], count: 30 } });
        expect(wrapper.vm.pageCount).toBe(2);
      });
    });

    describe('currentPageStart', () => {
      it('should return 1 if its the first page', async () => {
        const { wrapper } = await mountComponent({ catalogProducts: { results: [], count: 0 } });
        expect(wrapper.vm.currentPageStart).toBe(1);
      });

      it('should return page limit start based on the current page', async () => {
        const { wrapper } = await mountComponent({ catalogProducts: { results: [], count: 30 } });
        await wrapper.setData({ page: 2 });
        expect(wrapper.vm.currentPageStart).toBe(wrapper.vm.pageSize);
      });
    });

    describe('currentPageCount', () => {
      it('should return currentPageCount as 0 if there are not enough templates', async () => {
        const { wrapper } = await mountComponent({ catalogProducts: { results: [], count: 0 } });
        expect(wrapper.vm.currentPageCount).toBe(0);
      });

      it('should return current number of templates if there are more than one and less than page limit and page equals one', async () => {
        const { wrapper } = await mountComponent({ catalogProducts: { results: [], count: 2 } });
        expect(wrapper.vm.currentPageCount).toBe(2);
      });

      it('should return the pageSize as count if there are enough templates to show', async () => {
        const { wrapper } = await mountComponent({ catalogProducts: { results: [], count: 23 } });
        expect(wrapper.vm.currentPageCount).toBe(wrapper.vm.pageSize);
      });
    });
  });
});
