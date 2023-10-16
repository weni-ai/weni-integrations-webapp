jest.mock('lodash.debounce', () => jest.fn((fn) => fn));
import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import List from '@/components/whatsAppCatalogs/List.vue';
import { unnnicModalNext } from '@weni/unnnic-system';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('components/whatsAppCatalogs/List.vue', () => {
  let wrapper;
  let store;
  let actions;
  let state;

  beforeEach(() => {
    actions = {
      getWhatsAppCatalogs: jest.fn(),
    };

    state = {
      whatsAppCatalogs: {
        count: 1,
        results: [
          {
            uuid: '123',
            name: 'template name',
            facebook_catalog_id: '456',
            category: 'COMMERCE',
            is_connected: 'false',
          },
        ],
      },
      loadingWhatsAppCloudCatalogs: false,
      errorWhatsAppCloudCatalogs: null,
    };

    store = new Vuex.Store({
      modules: {
        whatsAppCloud: {
          namespaced: true,
          actions,
          state,
        },
      },
    });

    wrapper = mount(List, {
      localVue,
      store,
      stubs: {
        unnnicModalNext: unnnicModalNext,
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

  describe('fetchData()', () => {
    it('should call unnnicCallAlert on getWhatsAppCloudCatalogs error', async () => {
      store.state.WhatsApp.errorWhatsAppCloudCatalogs = true;
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.fetchData();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });

    describe('filters', () => {
      it('should add category filter if selectedCategory is not ANY', async () => {
        await wrapper.setData({ selectedCategory: 'MARKETING' });
        await wrapper.vm.fetchData({ page: 1 });
        expect(actions.getWhatsAppTemplates).toHaveBeenCalledWith(expect.any(Object), {
          appUuid: '123',
          params: {
            page: wrapper.vm.page,
            page_size: wrapper.vm.pageSize,
            category: 'MARKETING',
          },
        });
      });

      it('should add start filter if startDate is not null', async () => {
        await wrapper.setData({ startDate: '2020-01-13' });
        await wrapper.vm.fetchData({ page: 1 });
        expect(actions.getWhatsAppTemplates).toHaveBeenCalledWith(expect.any(Object), {
          appUuid: '123',
          params: {
            page: wrapper.vm.page,
            page_size: wrapper.vm.pageSize,
            start: '2020-01-13',
          },
        });
      });

      it('should add end filter if endDate is not null', async () => {
        await wrapper.setData({ endDate: '2020-01-13' });
        await wrapper.vm.fetchData({ page: 1 });
        expect(actions.getWhatsAppTemplates).toHaveBeenCalledWith(expect.any(Object), {
          appUuid: '123',
          params: {
            page: wrapper.vm.page,
            page_size: wrapper.vm.pageSize,
            end: '2020-01-13',
          },
        });
      });

      it('should andd name if searchTerm is not null or empty', async () => {
        await wrapper.setData({ searchTerm: 'some search term' });
        await wrapper.vm.fetchData({ page: 1 });
        expect(actions.getWhatsAppTemplates).toHaveBeenCalledWith(expect.any(Object), {
          appUuid: '123',
          params: {
            page: wrapper.vm.page,
            page_size: wrapper.vm.pageSize,
            name: 'some search term',
          },
        });
      });

      it('should add name sort in ASC state', async () => {
        await wrapper.setData({ nameSortDirection: 'ASC' });
        await wrapper.vm.fetchData({ page: 1 });
        expect(actions.getWhatsAppTemplates).toHaveBeenCalledWith(expect.any(Object), {
          appUuid: '123',
          params: {
            page: wrapper.vm.page,
            page_size: wrapper.vm.pageSize,
            sort: 'name',
          },
        });
      });

      it('should add name sort in DESC state', async () => {
        await wrapper.setData({ nameSortDirection: 'DESC' });
        await wrapper.vm.fetchData({ page: 1 });
        expect(actions.getWhatsAppTemplates).toHaveBeenCalledWith(expect.any(Object), {
          appUuid: '123',
          params: {
            page: wrapper.vm.page,
            page_size: wrapper.vm.pageSize,
            sort: '-name',
          },
        });
      });

      it('should add date sort in ASC state', async () => {
        await wrapper.setData({ dateSortDirection: 'ASC' });
        await wrapper.vm.fetchData({ page: 1 });
        expect(actions.getWhatsAppTemplates).toHaveBeenCalledWith(expect.any(Object), {
          appUuid: '123',
          params: {
            page: wrapper.vm.page,
            page_size: wrapper.vm.pageSize,
            sort: 'created_on',
          },
        });
      });

      it('should add date sort in DESC state', async () => {
        await wrapper.setData({ dateSortDirection: 'DESC' });
        await wrapper.vm.fetchData({ page: 1 });
        expect(actions.getWhatsAppTemplates).toHaveBeenCalledWith(expect.any(Object), {
          appUuid: '123',
          params: {
            page: wrapper.vm.page,
            page_size: wrapper.vm.pageSize,
            sort: '-created_on',
          },
        });
      });
    });
  });

  describe('getTranslationsLanguage()', () => {
    it('should return an array of template translations language', () => {
      const translations = wrapper.vm.getTranslationsLanguages(
        wrapper.vm.whatsAppTemplates.results[0].translations,
      );
      expect(translations).toEqual(['en', 'es']);
    });
  });

  describe('formatDate()', () => {
    it('should return formatted date', () => {
      const date = wrapper.vm.formatDate('2022-01-13T00:00:00');
      expect(date).toBe('jan/2022');
    });
  });

  describe('dropdownPosition()', () => {
    it('should return top-left if item index is greater than 7', () => {
      store.state.WhatsApp.whatsAppTemplates.results = [...Array(9)].map((_, index) => {
        return {
          uuid: `${index + 1}`,
          name: 'template name',
          created_on: '2020-01-13',
          category: 'MARKETING',
          template_type: 'TEXT',
          namespace: '456',
          translations: [
            { language: 'en', status: 'APPROVED' },
            { language: 'es', status: 'REJECTED' },
          ],
        };
      });

      const dropdownPosition = wrapper.vm.dropdownPosition({ uuid: '9' });
      expect(dropdownPosition).toBe('top-left');
    });

    it('should return bottom-left if item index is lesser than 7', () => {
      store.state.WhatsApp.whatsAppTemplates.results = [...Array(9)].map((_, index) => {
        return {
          uuid: `${index + 1}`,
          name: 'template name',
          created_on: '2020-01-13',
          category: 'MARKETING',
          template_type: 'TEXT',
          namespace: '456',
          translations: [
            { language: 'en', status: 'APPROVED' },
            { language: 'es', status: 'REJECTED' },
          ],
        };
      });

      const dropdownPosition = wrapper.vm.dropdownPosition({ uuid: '3' });
      expect(dropdownPosition).toBe('bottom-left');
    });

    it('should return bottom-left as default if there ar no templates', () => {
      store.state.WhatsApp.whatsAppTemplates = null;
      const dropdownPosition = wrapper.vm.dropdownPosition({ uuid: '3' });
      expect(dropdownPosition).toBe('bottom-left');
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
        results: [
          {
            uuid: '789',
            name: 'new template name',
            created_on: '2021-01-13',
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

    it('should call fetchData if on first page and filterState was modified', async () => {
      const spy = spyOn(wrapper.vm, 'fetchData');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.setData({ searchTerm: 'template' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ page: 1 });
    });

    it('should chang page to first if not on first page and filterState was modified', async () => {
      await wrapper.setData({ page: 2 });
      await wrapper.setData({ searchTerm: 'template' });
      expect(wrapper.vm.page).toBe(1);
    });
  });

  describe('filters', () => {
    it('should call fetchData on search change', async () => {
      const spy = spyOn(wrapper.vm, 'fetchData');

      const searchInput = wrapper.find('.whatsapp-templates-table__filters__search');

      expect(spy).not.toHaveBeenCalled();
      expect(wrapper.vm.searchTerm).toBe('');

      searchInput.vm.$emit('input', 'template');

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.searchTerm).toBe('template');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ page: 1 });
    });

    it('should call fetchData on category change', async () => {
      const spy = spyOn(wrapper.vm, 'fetchData');

      const categoryInput = wrapper.find('.whatsapp-templates-table__filters__category');

      expect(spy).not.toHaveBeenCalled();
      expect(wrapper.vm.selectedCategory).toBe('ANY');

      categoryInput.vm.$emit('input', 'OTP');

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.selectedCategory).toBe('OTP');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ page: 1 });
    });

    it('should call fetchData on date change', async () => {
      const spy = spyOn(wrapper.vm, 'fetchData');

      const dateInput = wrapper.find(
        '.whatsapp-templates-table__filters__date__dropdown-date__picker',
      );

      expect(spy).not.toHaveBeenCalled();
      expect(wrapper.vm.startDate).toBe(null);
      expect(wrapper.vm.endDate).toBe(null);

      dateInput.vm.$emit('submit', { startDate: '01-01-2023', endDate: '31-01-2023' });

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.startDate).toBe('01-01-2023');
      expect(wrapper.vm.endDate).toBe('31-01-2023');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ page: 1 });
    });

    it('should call fetchData on name sort change', async () => {
      const spy = spyOn(wrapper.vm, 'fetchData');

      const nameSortInput = wrapper.find('.whatsapp-templates-table__table__header__name');

      expect(spy).not.toHaveBeenCalled();
      expect(wrapper.vm.nameSortDirection).toBe('NONE');

      nameSortInput.vm.$emit('sort', 'DESC');

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.nameSortDirection).toBe('DESC');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ page: 1 });

      nameSortInput.vm.$emit('sort', 'ASC');

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.nameSortDirection).toBe('ASC');
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith({ page: 1 });
    });

    it('should call fetchData on date sort change', async () => {
      const spy = spyOn(wrapper.vm, 'fetchData');

      const dateSortInput = wrapper.find('.whatsapp-templates-table__table__header__date');

      expect(spy).not.toHaveBeenCalled();
      expect(wrapper.vm.dateSortDirection).toBe('NONE');

      dateSortInput.vm.$emit('sort', 'DESC');

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.dateSortDirection).toBe('DESC');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ page: 1 });

      dateSortInput.vm.$emit('sort', 'ASC');

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.dateSortDirection).toBe('ASC');
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith({ page: 1 });
    });
  });
});
