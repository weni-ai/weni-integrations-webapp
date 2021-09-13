jest.mock('@/api/appType', () => {
  return {
    getAllAppTypes: jest.fn(),
    getAppType: jest.fn(),
    listComments: jest.fn(),
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    updateComment: jest.fn(),
    createApp: jest.fn(),
  };
});

// import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import VueRouter from 'vue-router';
// import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import AddModal from '@/components/AddModal.vue';
import ConfigModal from '@/components/ConfigModal.vue';
import i18n from '@/utils/plugins/i18n';
// import { singleApp } from '../../../__mocks__/appMock';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('AddModal.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AddModal, {
      localVue,
      i18n,
      router,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
        UnnnicModal: true,
        UnnnicCard: true,
        ConfigModal,
      },
      propsData: {
        section: 'channel',
        type: 'add',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should change route to app on modal button action', async () => {
    const spy = spyOn(wrapper.vm.$router, 'replace');
    const addModalNavigationButton = wrapper.findComponent({
      ref: 'unnnic-add-modal-navigate-button',
    });

    await addModalNavigationButton.vm.$emit('click');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('/apps/my');
  });
});
