import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Header from '@/components/WhatsAppTemplates/Header.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('components/WhatsAppTemplates/Header.vue', () => {
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
      stubs: {
        UnnnicButton: true,
      },
      mocks: {
        $t: () => 'some specific text',
        $route: {
          params: {
            appCode: 'wpp-cloud',
          },
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
