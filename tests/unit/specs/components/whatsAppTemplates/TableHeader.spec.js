import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Header from '@/components/whatsAppTemplates/TableHeader.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('components/whatsAppTemplates/TableHeader.vue', () => {
  let wrapper;
  let store;
  let actions;
  let state;

  beforeEach(() => {
    actions = {
      getAppType: jest.fn(() => {
        return { data: { icon: 'icon' } };
      }),
      fetchWppProfile: jest.fn(() => {
        return { data: { photo_url: 'photo' } };
      }),
    };

    state = {
      appType: {
        currentAppType: { icon: 'icon' },
        loadingCurrentAppType: false,
      },
    };

    store = new Vuex.Store({
      actions,
      state,
    });

    wrapper = shallowMount(Header, {
      localVue,
      store,
      i18n,
      stubs: {
        UnnnicButton: true,
      },
      mocks: {
        $route: {
          params: {
            appCode: 'wpp-cloud',
            appUuid: '123',
          },
        },
        $router: {
          push: jest.fn(),
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('navigateToCreateTemplate()', () => {
    it('should change route to create template', () => {
      const spy = spyOn(wrapper.vm.$router, 'push');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.navigateToCreateTemplate();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        path: `/apps/my/${wrapper.vm.$route.params.appCode}/${wrapper.vm.$route.params.appUuid}/templates/create`,
      });
    });
  });
});
