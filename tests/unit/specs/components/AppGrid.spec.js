import { shallowMount, createLocalVue } from '@vue/test-utils';
import AppGrid from '@/components/AppGrid.vue';
import ConfigModal from '@/components/ConfigModal.vue';
import i18n from '@/utils/plugins/i18n';
import VueRouter from 'vue-router';
import {
  attendanceApps,
  communicationApps,
  configuredApps,
  installedApps,
} from '../../../__mocks__/appMock';
const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('AppGrid.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AppGrid, {
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
        section: 'communication_channels',
      },
      computed: {
        loaded() {
          return true;
        },
      },
    });
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
    const cardComponent = wrapper.findComponent({ ref: 'unnnic-marketplace-card' });

    await cardComponent.vm.$emit('openModal');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should change change route on card click when type is "add"', async () => {
    await wrapper.setProps({ type: 'add' });
    const app = wrapper.vm.apps[0];
    expect(wrapper.vm.$route.path).not.toEqual(`/apps/${app.id}/details`);

    wrapper.vm.openAppModal(app);

    expect(wrapper.vm.$route.path).toEqual(`/apps/${app.id}/details`);
  });

  it('should open configModal if type is not "add"', async () => {
    await wrapper.setProps({ type: 'config' });
    const app = wrapper.vm.apps[0];
    const configModal = wrapper.findComponent({ ref: 'configModal' });

    expect(configModal.vm.show).toBeFalsy();

    wrapper.vm.openAppModal(app);

    expect(configModal.vm.show).toBeTruthy();
  });

  // TODO: check test when mocked apps are gone
  it('should return communication_channel apps', () => {
    expect(wrapper.vm.apps).toMatchObject(communicationApps);
  });

  it('should return attendance_manager apps', async () => {
    await wrapper.setProps({ section: 'attendance_managers' });

    expect(wrapper.vm.apps).toMatchObject(attendanceApps);
  });

  it('should return configured_apps apps', async () => {
    await wrapper.setProps({ section: 'configured_apps' });

    expect(wrapper.vm.apps).toMatchObject(configuredApps);
  });

  it('should return installed_apps apps', async () => {
    await wrapper.setProps({ section: 'installed_apps' });

    expect(wrapper.vm.apps).toMatchObject(installedApps);
  });
});
