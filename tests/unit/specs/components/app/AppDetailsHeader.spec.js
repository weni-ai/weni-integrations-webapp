jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import { mount, createLocalVue } from '@vue/test-utils';
import AppDetailsHeader from '@/components/app/AppDetailsHeader.vue';
import i18n from '@/utils/plugins/i18n';
import Vuex from 'vuex';
import { singleApp } from '../../../../__mocks__/appMock';

const localVue = createLocalVue();

describe('AppDetailsHeader.vue', () => {
  let wrapper;
  let actions;
  let state;
  let store;

  localVue.use(Vuex);

  beforeEach(() => {
    actions = {
      createApp: jest.fn(() => {}),
    };

    state = {
      auth: {
        project: '123',
      },
    };

    store = new Vuex.Store({
      actions,
      state,
    });

    wrapper = mount(AppDetailsHeader, {
      localVue,
      store,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
      },
      propsData: {
        app: singleApp,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
