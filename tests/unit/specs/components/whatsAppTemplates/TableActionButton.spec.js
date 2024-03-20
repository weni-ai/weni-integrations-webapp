import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { mount, createLocalVue } from '@vue/test-utils';
import TableActionButton from '@/components/whatsAppTemplates/TableActionButton.vue';
import { unnnicDropdownItem, unnnicButton } from '@weni/unnnic-system';

const localVue = createLocalVue();
localVue.use(Vuex);
const router = new VueRouter();

describe('components/whatsAppTemplates/TableActionButton.vue', () => {
  let wrapper;
  let actions;
  let store;
  beforeEach(() => {
    actions = {
      setSelectedTemplate: jest.fn(),
      setAppUuid: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        insights: {
          namespaced: true,
          actions: {
            setSelectedTemplate: jest.fn(),
            setAppUuid: jest.fn(),
          },
        },
      },
      actions,
    });
    wrapper = mount(TableActionButton, {
      localVue,
      router,
      store,
      mocks: {
        $t: () => 'some specific text',
        $route: {
          params: {
            appCode: 'code',
            appUuid: '123',
          },
        },
        $router: {
          push: jest.fn(),
        },
      },
      propsData: {
        templateUuid: '123',
        data: {
          uuid: 'uuid123',
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render options properly', async () => {
    const triggerButton = wrapper.findComponent(unnnicButton);
    await triggerButton.trigger('click');
    expect(wrapper).toMatchSnapshot();
  });

  it('should go to edit template on Add Language option click', async () => {
    const triggerButton = wrapper.findComponent(unnnicButton);
    await triggerButton.trigger('click');
    const addLanguageOption = wrapper.findAllComponents(unnnicDropdownItem).at(0);

    expect(wrapper.vm.$router.push).not.toHaveBeenCalled();
    await addLanguageOption.trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      path: '/apps/my/code/123/templates/edit/123',
    });
  });

  it('should go to template details on See Details option click', async () => {
    const triggerButton = wrapper.findComponent(unnnicButton);
    await triggerButton.trigger('click');
    const seeDetails = wrapper.findAllComponents(unnnicDropdownItem).at(1);
    expect(seeDetails.exists()).toBe(true);

    expect(wrapper.vm.$router.push).not.toHaveBeenCalled();
    await seeDetails.trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
  });

  it('should call setSelectedTemplate', async () => {
    const triggerButton = wrapper.findComponent(unnnicButton);
    await triggerButton.trigger('click');
    const seeDetails = wrapper.findAllComponents(unnnicDropdownItem).at(1);
    expect(seeDetails.exists()).toBe(true);

    const spy = spyOn(wrapper.vm, 'setSelectedTemplate');
    expect(spy).not.toHaveBeenCalled();
    await seeDetails.trigger('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call setAppUuid', async () => {
    const triggerButton = wrapper.findComponent(unnnicButton);
    await triggerButton.trigger('click');
    const seeDetails = wrapper.findAllComponents(unnnicDropdownItem).at(1);
    expect(seeDetails.exists()).toBe(true);

    const spy = spyOn(wrapper.vm, 'setAppUuid');
    expect(spy).not.toHaveBeenCalled();
    await seeDetails.trigger('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
