import { shallowMount, createLocalVue } from '@vue/test-utils';
import Simulator from '@/components/config/channels/WWC/Simulator.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

describe('Simulator.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Simulator, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicIconSvg: true,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should toggle chat state', () => {
    expect(wrapper.vm.isOpen === true);
    wrapper.vm.toggleChat();
    expect(wrapper.vm.isOpen === false);
  });

  it('should return the defined mainColor', async () => {
    const mainColor = '#ff00ff';
    await wrapper.setProps({ mainColor });
    expect(wrapper.vm.cssVars['--main-color']).toEqual(mainColor);
  });

  it('should return the default mainColor on empty string', async () => {
    const mainColor = '';
    await wrapper.setProps({ mainColor });
    expect(wrapper.vm.cssVars['--main-color']).toEqual('#009E96');
  });
});
