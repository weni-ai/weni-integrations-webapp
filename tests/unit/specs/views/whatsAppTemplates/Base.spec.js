import { shallowMount, createLocalVue } from '@vue/test-utils';
import Base from '@/views/whatsAppTemplates/Base.vue';

const localVue = createLocalVue();

describe('views/whatsAppTemplates/Base.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Base, {
      localVue,
      stubs: {
        UnnnicBreadcrumb: true,
        routerView: true,
      },
      mocks: {
        $t: () => 'some specific text',
        $router: {
          push: jest.fn(),
          go: jest.fn(),
        },
        $route: {
          meta: {
            crumb_title: 'title',
          },
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('watchers', () => {
    it('should change crumb_title on $route.meta.crumb_title change', async () => {
      const newTitle = 'new_title';
      expect(wrapper.vm.crumb_title).not.toEqual(newTitle);
      wrapper.vm.$route.meta.crumb_title = newTitle;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.crumb_title).toEqual(newTitle);
    });
  });

  describe('handleCrumbClick()', () => {
    it('should call router.go(-1) path is defined', () => {
      const spy = spyOn(wrapper.vm.$router, 'go');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.handleCrumbClick({ path: '/path' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(-1);
    });

    it('should not call router.go if path is not defined', () => {
      const spy = spyOn(wrapper.vm.$router, 'go');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.handleCrumbClick({});
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
