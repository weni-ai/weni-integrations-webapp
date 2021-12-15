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
  let getters;
  let store;

  beforeEach(() => {
    actions = {
      getAllAppTypes: jest.fn(() => {
        return { data: [singleApp] };
      }),
    };

    getters = {
      getSelectedProject: jest.fn(() => {
        return '123';
      }),
    };

    store = new Vuex.Store({
      actions,
      getters,
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
