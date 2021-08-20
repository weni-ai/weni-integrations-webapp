jest.mock('@/api/appType', () => jest.fn());

import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import AppGrid from '@/components/AppGrid.vue';
import i18n from '@/utils/plugins/i18n';
import AppTypeStore from '@/store/appType';
import { singleApp } from '../../../__mocks__/appMock';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('AppGrid.vue with mocked loadApps', () => {
  let wrapper;
  let store;
  let loadAppsSpy;

  beforeEach(() => {
    loadAppsSpy = spyOn(AppGrid.methods, 'loadApps');

    store = new Vuex.Store(AppTypeStore);

    wrapper = mount(AppGrid, {
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
        UnnnicCard: true,
      },
      propsData: {
        section: 'communication_channels',
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

  it('should set AddModal state as open', () => {
    expect(wrapper.vm.showAddModal).toBeFalsy();
    wrapper.vm.openAddModal();
    expect(wrapper.vm.showAddModal).toBeTruthy();
  });

  it('should set AddModal state as closed on modal close', async () => {
    const addModalComponent = wrapper.findComponent({ ref: 'unnnic-add-modal' });

    wrapper.vm.openAddModal();
    expect(wrapper.vm.showAddModal).toBeTruthy();

    await addModalComponent.vm.$emit('close');
    expect(wrapper.vm.showAddModal).toBeFalsy();
  });

  it('should change route to app on modal button action', async () => {
    const spy = spyOn(wrapper.vm.$router, 'push');
    const addModalNavigationButton = wrapper.findComponent({
      ref: 'unnnic-add-modal-navigate-button',
    });

    await addModalNavigationButton.vm.$emit('click');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('apps');
  });

  it('should open App modal on trigger', async () => {
    const spy = spyOn(wrapper.vm, 'openAppModal');

    await wrapper.setData({ apps: [singleApp] });
    const cardComponent = wrapper.findComponent({ ref: 'unnnic-marketplace-card' });

    await cardComponent.vm.$emit('openModal');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should change AppModal', async () => {
    const appId = 123;
    expect(wrapper.vm.$route.path).not.toEqual(`/apps/${appId}/details`);

    wrapper.vm.openAppModal(appId);

    expect(wrapper.vm.$route.path).toEqual(`/apps/${appId}/details`);
  });

  it('should call loadApps when mounted', () => {
    expect(loadAppsSpy).toHaveBeenCalledTimes(1);
  });
});

describe('AppGrid.vue without mocked loadApps', () => {
  let wrapper;
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      getAllAppTypes: jest.fn(() => {
        return { data: [singleApp] };
      }),
    };
    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(AppGrid, {
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
        UnnnicCard: true,
      },
      propsData: {
        section: 'communication_channels',
        type: 'add',
      },
    });
  });

  describe('loadApps', () => {
    it('should fetch apps from API when type is add', async () => {
      expect(actions.getAllAppTypes).toHaveBeenCalledTimes(1);
      const filter = {
        category: 'channel',
      };
      await wrapper.vm.loadApps(filter);
      expect(actions.getAllAppTypes).toHaveBeenCalledTimes(2);
      expect(actions.getAllAppTypes).toHaveBeenCalledWith(expect.any(Object), filter);
    });

    // TODO: test when API return other sections
    it('should return mocked app if type is not add', async () => {
      await wrapper.setProps({ type: 'edit' });
      await wrapper.vm.loadApps();
      expect(wrapper.vm.apps).toEqual([singleApp]);
    });
  });
});
