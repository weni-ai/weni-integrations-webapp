import { shallowMount, createLocalVue } from '@vue/test-utils';
import Base from '@/views/whatsAppCatalogs/Base.vue';

const localVue = createLocalVue();

describe('views/whatsAppCatalogs/Base.vue', () => {
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
          name: 'Base route',
          meta: {
            crumb_title: 'title',
          },
          matched: [
            {
              name: 'another name',
              path: '/another-path',
              meta: {
                crumb_title: 'another title',
              },
            },
            {
              name: 'another name 1',
              path: '/another-path1',
              meta: {
                crumb_title: 'another title1',
              },
            },
          ],
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleCrumbClick()', () => {
    it('should not call neither router.go nor router.push if path is the same as the current route', () => {
      const spyPush = spyOn(wrapper.vm.$router, 'push');
      const spyGo = spyOn(wrapper.vm.$router, 'go');
      expect(spyPush).not.toHaveBeenCalled();
      expect(spyGo).not.toHaveBeenCalled();
      wrapper.vm.handleCrumbClick({ path: '/catalogs', meta: 'Base route' });
      expect(spyPush).not.toHaveBeenCalled();
      expect(spyGo).not.toHaveBeenCalled();
    });

    it('should call router.go(-1) path is for WhatsApp Catalogs List', () => {
      const spy = spyOn(wrapper.vm.$router, 'go');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.handleCrumbClick({ path: '/list', meta: 'WhatsApp Catalogs List' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(-1);
    });

    it('should call router.push if path not equal as the current and different from WhatsApp Catalogs List', () => {
      const spy = spyOn(wrapper.vm.$router, 'push');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.handleCrumbClick({ meta: 'Different', path: '/different' });
      expect(spy).toHaveBeenCalledWith('/different');
    });
  });
});
