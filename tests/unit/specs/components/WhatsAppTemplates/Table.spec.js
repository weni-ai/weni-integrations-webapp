import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Table from '@/components/WhatsAppTemplates/Table.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('components/WhatsAppTemplates/Table.vue', () => {
  let wrapper;
  let store;
  let actions;
  let state;

  beforeEach(() => {
    actions = {
      getWhatsAppTemplates: jest.fn(),
    };

    state = {
      whatsAppTemplates: {
        count: 1,
        templates: [
          {
            uuid: '123',
            name: 'template name',
            created_on: '2020-01-01',
            category: 'MARKETING',
            template_type: 'TEXT',
            namespace: '456',
            translations: [
              { language: 'en', status: 'APPROVED' },
              { language: 'es', status: 'REJECTED' },
            ],
          },
        ],
      },
      loadingWhatsAppTemplates: false,
      errorWhatsAppTemplates: null,
    };

    store = new Vuex.Store({
      modules: {
        WhatsApp: {
          namespaced: true,
          actions,
          state,
        },
      },
    });

    wrapper = shallowMount(Table, {
      localVue,
      store,
      stubs: {
        TableLoading: true,
        UnnnicTable: true,
        UnnnicTableRow: true,
        UnnnicPagination: true,
        TableActionButton: true,
        LanguageDropdown: true,
      },
      mocks: {
        $t: () => 'some specific text',
        $route: {
          params: {
            appCode: 'wpp-cloud',
            appUuid: '123',
          },
        },
        $i18n: {
          locale: 'pt-br',
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('computed', () => {
    describe('totalCount', () => {
      it('should return pageLimit if there are no templates provided', () => {
        store.state.WhatsApp.whatsAppTemplates.count = 0;
        expect(wrapper.vm.totalCount).toBe(12);
      });
    });

    describe('pageCount', () => {
      it('should return 1 if there are no templates', () => {
        store.state.WhatsApp.whatsAppTemplates.count = 0;
        expect(wrapper.vm.pageCount).toBe(1);
      });

      it('should return correct number of pages based on limit and count', () => {
        store.state.WhatsApp.whatsAppTemplates = { count: 30 };
        expect(wrapper.vm.pageCount).toBe(3);
      });
    });

    describe('currentPageStart', () => {
      it('should return 1 if its the first page', () => {
        expect(wrapper.vm.currentPageStart).toBe(1);
      });

      it('should return page limit start based on the current page', async () => {
        await wrapper.setData({ page: 2 });
        expect(wrapper.vm.currentPageStart).toBe(12);
      });
    });

    describe('currentPageCount', () => {
      it('should return currentPageCount as 0 if there are not enough templates', () => {
        store.state.WhatsApp.whatsAppTemplates.count = 0;
        expect(wrapper.vm.currentPageCount).toBe(0);
      });

      it('should return current number of templates if there are more than one and less than page limit and page equals one', () => {
        store.state.WhatsApp.whatsAppTemplates.count = 2;
        expect(wrapper.vm.currentPageCount).toBe(2);
      });

      it('should return the pageLimit as count if there are enough templates to show', () => {
        store.state.WhatsApp.whatsAppTemplates.count = 13;
        expect(wrapper.vm.currentPageCount).toBe(12);
      });
    });
  });

  describe('getTranslationsLanguage()', () => {
    it('should return an array of template translations language', () => {
      const translations = wrapper.vm.getTranslationsLanguages(
        wrapper.vm.whatsAppTemplates.templates[0].translations,
      );
      expect(translations).toEqual(['en', 'es']);
    });
  });

  describe('formatDate()', () => {
    it('should return formatted date', () => {
      const date = wrapper.vm.formatDate('2022-01-01T00:00:00');
      expect(date).toBe('jan/2022');
    });
  });

  describe('watchers', () => {
    it('should call fetchData on page change', async () => {
      const spy = spyOn(wrapper.vm, 'fetchData');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.setData({ page: 2 });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ page: 2 });
    });

    it('should set firstLoad to false on whatsAppTemplates change', async () => {
      expect(wrapper.vm.firstLoad).toBe(true);
      store.state.WhatsApp.whatsAppTemplates = {
        templates: [
          {
            uuid: '789',
            name: 'new template name',
            created_on: '2021-01-01',
            category: 'OTP',
            template_type: 'MEDIA',
            namespace: '999',
            translations: [
              { language: 'en', status: 'REJECTED' },
              { language: 'es', status: 'APPROVED' },
            ],
          },
        ],
      };
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.firstLoad).toBe(false);
    });
  });
});
