import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Discovery from '@/views/Discovery.vue';
import AppGrid from '@/components/AppGrid.vue';
import { singleApp } from '../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Discovery.vue', () => {
  let wrapper;
  let actions;
  let state;
  let store;

  beforeEach(() => {
    actions = {
      getAllAppTypes: jest.fn(() => {
        return { data: [singleApp] };
      }),
    };

    state = {
      appType: {
        loadingDeleteApp: false,
        errorDeleteApp: false,
      },
      auth: {
        project: '123',
      },
    };

    store = new Vuex.Store({
      actions,
      state,
    });

    wrapper = shallowMount(Discovery, {
      localVue,
      store,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        AppGrid,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
