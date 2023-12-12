import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import NavBar from '@/components/NavBar/index.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

describe('NavBar.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(NavBar, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
