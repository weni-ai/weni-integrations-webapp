jest.mock('@/api/appType', () => {
  return {
    createApp: jest.fn(),
    getSharedWabas: jest.fn(),
  };
});

import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import IntegrateButton from '@/components/IntegrateButton.vue';
import addModal from '@/components/AddModal.vue';
import ConfigPopUp from '@/components/config/ConfigPopUp.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../__mocks__/appMock';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('IntegrateButton.vue', () => {
  let wrapper, actions, getters, store;

  beforeEach(() => {
    actions = {
      createApp: jest.fn(() => {}),
      getSharedWabas: jest.fn(() => []),
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

    wrapper = mount(IntegrateButton, {
      localVue,
      store,
      i18n,
      router,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
        UnnnicModal: true,
        ConfigPopUp,
        addModal,
      },
      propsData: {
        app: singleApp,
        icon: 'add-1',
        disabled: false,
        text: 'Add',
        size: 'large',
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call addApp on button click', async () => {
    const spy = spyOn(wrapper.vm, 'addApp');
    expect(spy).not.toHaveBeenCalled();

    const button = wrapper.findComponent({ ref: 'button' });
    button.vm.$emit('click', { stopPropagation: () => {} });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(wrapper.props('app'));
  });

  describe('created()', () => {
    it('should add getFbPages into DOM', async () => {
      expect(window.getFbPages).toEqual(wrapper.vm.getFbPages);
    });
  });

  describe('addApp()', () => {
    it('should call facebookLogin if app code is wpp', async () => {
      const spy = spyOn(wrapper.vm, 'facebookLoginAppCreation');
      expect(spy).not.toHaveBeenCalled();
      const app = {
        code: 'wpp',
      };
      await wrapper.vm.addApp(app);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call createApp method', async () => {
      expect(actions.createApp).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'sidemenu',
      };
      await wrapper.vm.addApp(app);
      expect(actions.createApp).toHaveBeenCalledTimes(1);
      expect(actions.createApp).toHaveBeenCalledWith(expect.any(Object), {
        code: app.code,
        payload: expect.any(Object),
      });
    });

    it('should call getSelectedProject getter', async () => {
      expect(getters.getSelectedProject).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'sidemenu',
      };
      await wrapper.vm.addApp(app);
      expect(getters.getSelectedProject).toHaveBeenCalledTimes(1);
    });

    it('should call unnnicCallAlert on error', async () => {
      actions.createApp.mockImplementation(() => {
        throw new Error('error fetching');
      });
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'sidemenu',
      };
      await wrapper.vm.addApp(app);
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });

    it('should call toggleModal if design not popup', async () => {
      const spy = spyOn(wrapper.vm.$refs.addModal, 'toggleModal');
      expect(spy).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'sidemenu',
      };
      await wrapper.vm.addApp(app);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call openPopUp if design is popup', async () => {
      const spy = spyOn(wrapper.vm.$refs.configPopUp, 'openPopUp');
      actions.createApp.mockImplementation(() => {
        return Promise.resolve({
          data: {
            config: {
              redirect_url: 'https://url.com',
            },
          },
        });
      });
      expect(spy).not.toHaveBeenCalled();
      const app = {
        code: 'code',
        config_design: 'popup',
      };
      await wrapper.vm.addApp(app);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFbPages', () => {
    it('should call getSharedWabas with incoming parameter', async () => {
      expect(actions.getSharedWabas).not.toHaveBeenCalled();
      const input_token = '123';
      await wrapper.vm.getFbPages(input_token);
      expect(actions.getSharedWabas).toHaveBeenCalledTimes(1);
      expect(actions.getSharedWabas).toHaveBeenCalledWith(expect.any(Object), {
        code: wrapper.props('app').code,
        params: {
          input_token,
        },
      });
    });

    it('should call openPupUp from configPupUp', async () => {
      const spy = spyOn(wrapper.vm.$refs.configPopUp, 'openPopUp');
      expect(spy).not.toHaveBeenCalled();
      const token = '123';
      await wrapper.vm.getFbPages(token);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
