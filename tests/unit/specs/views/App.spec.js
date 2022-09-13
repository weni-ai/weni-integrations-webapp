jest.mock('@/api/auth', () => {
  return {
    getFlowToken: jest.fn(),
  };
});

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App.vue';
import i18n from '@/utils/plugins/i18n';
import VueRouter from 'vue-router';
const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('App.vue', () => {
  let wrapper;
  let actions, store;

  beforeEach(() => {
    actions = {
      getFlowToken: jest.fn(),
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(App, {
      localVue,
      i18n,
      store,
      router,
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
