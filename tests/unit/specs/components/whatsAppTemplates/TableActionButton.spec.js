import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import TableActionButton from '@/components/whatsAppTemplates/TableActionButton.vue';
import { unnnicDropdownItem, unnnicButton } from '@weni/unnnic-system';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('components/whatsAppTemplates/TableActionButton.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(TableActionButton, {
      localVue,
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
});
