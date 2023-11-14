jest.mock('lodash.debounce', () => jest.fn((fn) => fn));
import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import List from '@/components/whatsAppCatalogs/List.vue';
import Card from '@/components/whatsAppCatalogs/Card.vue';
import '@weni/unnnic-system';
import { unnnicModalNext } from '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';
import VueRouter from 'vue-router';
const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

const mountComponent = async ({
  errorDisableCatalog = false,
  loadingWhatsAppCloudCatalogs = false,
  errorWhatsAppCloudCatalogs = false,
  whatsAppCloudCatalogs = {},
  errorEnableCatalog = false,
  commerceSettings = {},
  errorToggleCartVisibility = false,
} = {}) => {
  const state = {
    errorDisableCatalog,
    loadingWhatsAppCloudCatalogs,
    errorWhatsAppCloudCatalogs,
    whatsAppCloudCatalogs,
    errorEnableCatalog,
    commerceSettings,
    errorToggleCartVisibility,
  };

  const actions = {
    getWhatsAppCloudCatalogs: jest.fn(),
    disableWhatsAppCloudCatalogs: jest.fn(),
    enableWhatsAppCloudCatalogs: jest.fn(),
    getCommerceSettings: jest.fn(),
    toggleCartVisibility: jest.fn(),
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

  const wrapper = mount(List, {
    localVue,
    store,
    i18n,
    router,
    stubs: {
      Card,
    },
    mocks: {
      $router: {
        push: jest.fn(),
      },
    },
  });

  await wrapper.vm.$nextTick();
  await jest.runAllTimers();

  return { wrapper, actions, state };
};

describe('components/whatsAppCatalog/List.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('computed', () => {
    describe('listItems', () => {
      it('listItems should return empty array if whatsAppCloudCatalogs does not have a result', async () => {
        const { wrapper } = await mountComponent();
        expect(wrapper.vm.listItems).toEqual([]);
      });

      it('listItems should return whatsAppCloudCatalogs results', async () => {
        const { wrapper } = await mountComponent({
          whatsAppCloudCatalogs: {
            results: [
              {
                uuid: 'uuid',
              },
            ],
          },
        });
        expect(wrapper.vm.listItems).toEqual([
          {
            uuid: 'uuid',
          },
        ]);
      });
    });

    describe('totalCount', () => {
      it('totalCount should return pageSize if whatAppCloudCatgalogs does not have a count', async () => {
        const { wrapper } = await mountComponent();
        expect(wrapper.vm.totalCount).toEqual(wrapper.vm.pageSize);
      });

      it('totalCount should return whatsAppCloudCatalogs count', async () => {
        const { wrapper } = await mountComponent({
          whatsAppCloudCatalogs: {
            count: 1,
          },
        });
        expect(wrapper.vm.totalCount).toEqual(1);
      });
    });

    describe('pageCount', () => {
      it('should return the ceil of whatsAppCloudCatalogs count divided by pageSize', async () => {
        const { wrapper } = await mountComponent({
          whatsAppCloudCatalogs: {
            count: 32,
          },
        });
        expect(wrapper.vm.pageCount).toEqual(3);
      });

      it('should return 1 if whatsAppCloudCatalogs count is not provided', async () => {
        const { wrapper } = await mountComponent();
        expect(wrapper.vm.pageCount).toEqual(1);
      });
    });

    describe('currentPageStart', () => {
      it('should return 1 if its the first page', async () => {
        const { wrapper } = await mountComponent();
        expect(wrapper.vm.currentPageStart).toBe(1);
      });

      it('should return page limit start based on the current page', async () => {
        const { wrapper } = await mountComponent();
        await wrapper.setData({ page: 2 });
        expect(wrapper.vm.currentPageStart).toBe(wrapper.vm.pageSize);
      });
    });

    describe('currentPageCount', () => {
      it('should return current page maximum', async () => {
        const { wrapper } = await mountComponent({
          whatsAppCloudCatalogs: {
            count: 32,
          },
        });
        await wrapper.setData({ page: 2 });
        expect(wrapper.vm.currentPageCount).toEqual(30);
      });
      it('should return current page value', async () => {
        const { wrapper } = await mountComponent({
          whatsAppCloudCatalogs: {
            count: 7,
          },
        });
        expect(wrapper.vm.currentPageCount).toEqual(7);
      });
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('fetchData', () => {
      it('should call modal when fetch data fails', async () => {
        const { wrapper } = await mountComponent({
          errorWhatsAppCloudCatalogs: true,
        });

        await wrapper.vm.$nextTick();

        expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      });
    });

    describe('handleDisableCatalog', () => {
      it('should call disableCatalog when a Card components emits a disable event', async () => {
        const { wrapper } = await mountComponent({
          whatsAppCloudCatalogs: {
            results: [
              {
                uuid: 'uuid123',
              },
            ],
          },
        });

        const card = wrapper.findAll('.whatsapp-catalog-card').at(0);
        expect(wrapper.vm.openModal).toBe(false);
        card.vm.$emit('disable');
        expect(wrapper.vm.openModal).toBe(true);
      });
    });

    describe('handleEnableCatalog', () => {
      it('should not call enableCatalog when a Card components emits a enable event and it has a connected catalog', async () => {
        const { wrapper, actions } = await mountComponent({
          whatsAppCloudCatalogs: {
            results: [
              {
                uuid: 'uuid1',
              },
              {
                uuid: 'uuid12',
              },
              {
                uuid: 'uuid123',
                is_connected: true,
              },
            ],
          },
        });

        const card = wrapper.findAll('.whatsapp-catalog-card').at(0);
        expect(actions.enableWhatsAppCloudCatalogs).not.toHaveBeenCalled();
        expect(wrapper.vm.openModal).toBe(false);
        expect(wrapper.vm.catalogToEnable).not.toEqual({
          uuid: 'uuid1',
        });
        card.vm.$emit('enable');
        expect(wrapper.vm.openModal).toBe(true);
        expect(wrapper.vm.catalogToEnable).toEqual({
          uuid: 'uuid1',
        });
        expect(actions.enableWhatsAppCloudCatalogs).not.toHaveBeenCalled();
      });
    });

    describe('enableCatalog', () => {
      it('should call enableWhatsappCloudCatalogs when a Card components emits a enable event and it does not have a connected catalog', async () => {
        const { wrapper, actions } = await mountComponent({
          whatsAppCloudCatalogs: {
            results: [
              {
                uuid: 'uuid123',
              },
            ],
          },
        });

        const card = wrapper.findAll('.whatsapp-catalog-card').at(0);
        expect(actions.enableWhatsAppCloudCatalogs).not.toHaveBeenCalled();
        card.vm.$emit('enable', 'uuid123');

        await wrapper.vm.$nextTick();
        expect(actions.enableWhatsAppCloudCatalogs).toHaveBeenCalled();
      });

      it('should call enableWhatsappCloudCatalogs when a Card components emits a enable event and it does not have a connected catalog and call error modal on error', async () => {
        const { wrapper, actions } = await mountComponent({
          whatsAppCloudCatalogs: {
            results: [
              {
                uuid: 'uuid123',
              },
            ],
          },
          errorEnableCatalog: true,
        });

        const card = wrapper.findAll('.whatsapp-catalog-card').at(0);
        expect(actions.enableWhatsAppCloudCatalogs).not.toHaveBeenCalled();
        card.vm.$emit('enable', 'uuid123');

        await wrapper.vm.$nextTick();

        expect(actions.enableWhatsAppCloudCatalogs).toHaveBeenCalled();
        expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      });
    });

    describe('disableCatalog', () => {
      it('should call disableCatalog and if disableCatalog is successful, it should call enableCatalog with the newer catalog', async () => {
        const { wrapper, actions } = await mountComponent({
          whatsAppCloudCatalogs: {
            results: [
              {
                uuid: 'uuid1',
                name: 'catalog 1',
              },
              {
                uuid: 'uuid12',
                name: 'catalog 2',
              },
              {
                uuid: 'uuid123',
                name: 'catalog 3',
                is_connected: true,
              },
            ],
          },
        });

        const card = wrapper.findAll('.whatsapp-catalog-card').at(0);
        card.vm.$emit('enable');

        await wrapper.vm.$nextTick();

        const modal = wrapper.findComponent(unnnicModalNext);
        expect(actions.disableWhatsAppCloudCatalogs).not.toHaveBeenCalled();
        modal.vm.$emit('click-action-primary');
        await wrapper.vm.$nextTick();

        expect(actions.disableWhatsAppCloudCatalogs).toHaveBeenCalled();
      });

      it('should call disableWhatsappCloudCatalogs when a Card components emits a disable event and call error modal on error', async () => {
        const { wrapper, actions } = await mountComponent({
          whatsAppCloudCatalogs: {
            results: [
              {
                uuid: 'uuid1',
                name: 'catalog 1',
              },
              {
                uuid: 'uuid12',
                name: 'catalog 2',
              },
              {
                uuid: 'uuid123',
                name: 'catalog 3',
                is_connected: true,
              },
            ],
          },
          errorDisableCatalog: true,
        });

        const card = wrapper.findAll('.whatsapp-catalog-card').at(0);
        card.vm.$emit('enable');

        await wrapper.vm.$nextTick();

        const modal = wrapper.findComponent(unnnicModalNext);
        expect(actions.disableWhatsAppCloudCatalogs).not.toHaveBeenCalled();
        expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
        modal.vm.$emit('click-action-primary');
        await wrapper.vm.$nextTick();

        expect(actions.disableWhatsAppCloudCatalogs).toHaveBeenCalled();
        expect(mockUnnnicCallAlert).toHaveBeenCalled();
      });
    });

    describe('handleCatalogConfirmation', () => {
      it('should call disableCatalog and if disableCatalog is successful, it should call enableCatalog with the newer catalog', async () => {
        const { wrapper, actions } = await mountComponent({
          whatsAppCloudCatalogs: {
            results: [
              {
                uuid: 'uuid1',
                name: 'catalog 1',
              },
              {
                uuid: 'uuid12',
                name: 'catalog 2',
              },
              {
                uuid: 'uuid123',
                name: 'catalog 3',
                is_connected: true,
              },
            ],
          },
        });

        const card = wrapper.findAll('.whatsapp-catalog-card').at(0);
        card.vm.$emit('enable');

        await wrapper.vm.$nextTick();

        const modal = wrapper.findComponent(unnnicModalNext);
        expect(actions.disableWhatsAppCloudCatalogs).not.toHaveBeenCalled();
        expect(actions.enableWhatsAppCloudCatalogs).not.toHaveBeenCalled();

        modal.vm.$emit('click-action-primary');
        await wrapper.vm.$nextTick();

        expect(actions.disableWhatsAppCloudCatalogs).toHaveBeenCalled();
        expect(actions.enableWhatsAppCloudCatalogs).not.toHaveBeenCalled();

        await wrapper.vm.$nextTick();

        expect(actions.enableWhatsAppCloudCatalogs).toHaveBeenCalled();
      });
    });

    describe('closeModal', () => {
      it('should unset catalogToEnable and openModal', async () => {
        const { wrapper } = await mountComponent();
        wrapper.setData({
          catalogToEnable: {
            uuid: 'uuid123',
          },
          openModal: true,
        });

        wrapper.vm.closeModal();

        expect(wrapper.vm.catalogToEnable).toEqual(null);
        expect(wrapper.vm.openModal).toBe(false);
      });
    });

    describe('toggleCart', () => {
      it('should call toggleCartVisibility when a Card components emits a toggleCart event', async () => {
        const { wrapper, actions } = await mountComponent({
          whatsAppCloudCatalogs: {
            results: [
              {
                uuid: 'uuid123',
              },
            ],
          },
        });

        const card = wrapper.findAll('.whatsapp-catalog-card').at(0);
        expect(actions.toggleCartVisibility).not.toHaveBeenCalled();
        card.vm.$emit('toggleCart');
        expect(actions.toggleCartVisibility).toHaveBeenCalled();
      });

      it('should call toggleCartVisibility when a Card components emits a toggleCart event and call error modal on error', async () => {
        const { wrapper, actions } = await mountComponent({
          whatsAppCloudCatalogs: {
            results: [
              {
                uuid: 'uuid123',
              },
            ],
          },
          errorToggleCartVisibility: true,
        });

        const card = wrapper.findAll('.whatsapp-catalog-card').at(0);
        expect(actions.toggleCartVisibility).not.toHaveBeenCalled();
        card.vm.$emit('toggleCart');

        await wrapper.vm.$nextTick();

        expect(actions.toggleCartVisibility).toHaveBeenCalled();
        expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('watch', () => {
    describe('page', () => {
      it('should call getWhatsAppCloudCatalogs when page changes', async () => {
        const { wrapper, actions } = await mountComponent();

        jest.clearAllMocks();

        expect(actions.getWhatsAppCloudCatalogs).not.toHaveBeenCalled();
        await wrapper.setData({ page: 2 });

        await wrapper.vm.$nextTick();

        expect(actions.getWhatsAppCloudCatalogs).toHaveBeenCalled();
      });
    });

    describe('whatsappCloudCatalogs', () => {
      it('should have have firstLoad to false after whatsAppCloudCatalogs change', async () => {
        const { wrapper } = await mountComponent();

        expect(wrapper.vm.firstLoad).toBe(true);

        await wrapper.setData({ whatsAppCloudCatalogs: { results: [] } });

        expect(wrapper.vm.firstLoad).toBe(false);
      });
    });

    describe('searchTerm', () => {
      it('should call getWhatsAppCloudCatalogs when searchTerm changes', async () => {
        const { wrapper, actions } = await mountComponent();

        jest.clearAllMocks();

        expect(actions.getWhatsAppCloudCatalogs).not.toHaveBeenCalled();
        await wrapper.setData({ searchTerm: 'test' });

        await wrapper.vm.$nextTick();

        expect(actions.getWhatsAppCloudCatalogs).toHaveBeenCalled();
      });

      it('should call getWhatsAppCloudCatalogs when searchTerm changes and set page to one', async () => {
        const { wrapper, actions } = await mountComponent();
        await wrapper.setData({ page: 2 });

        await wrapper.vm.$nextTick();

        jest.clearAllMocks();

        expect(actions.getWhatsAppCloudCatalogs).not.toHaveBeenCalled();
        await wrapper.setData({ searchTerm: 'test' });

        await wrapper.vm.$nextTick();

        expect(actions.getWhatsAppCloudCatalogs).toHaveBeenCalled();
        expect(wrapper.vm.page).toBe(1);
      });
    });
  });

  // describe('catalog connect emits', () => {
  //   it('should emit enable on toggle catalog connect', async () => {
  //     const { wrapper } = await mountComponent();
  //     const toggle = wrapper.findComponent({ ref: 'catalogConnectSwitch' });
  //     toggle.vm.$emit('input', true);
  //     expect(wrapper.emitted().enable).toBeTruthy();
  //   });

  //   it('should emit disable on toggle catalog connect', async () => {
  //     const { wrapper } = await mountComponent();
  //     const toggle = wrapper.findComponent({ ref: 'catalogConnectSwitch' });
  //     toggle.vm.$emit('input', false);
  //     expect(wrapper.emitted().disable).toBeTruthy();
  //   });
  // });

  // describe('toggleCart emit', () => {
  //   it('should emit toggleCart on switch click', async () => {
  //     const { wrapper } = await mountComponent({ catalog: { is_connected: true } });
  //     const toggle = wrapper.findComponent({ ref: 'cartEnableSwitch' });
  //     toggle.trigger('click');
  //     expect(wrapper.emitted().toggleCart).toBeTruthy();
  //   });
  // });
});
