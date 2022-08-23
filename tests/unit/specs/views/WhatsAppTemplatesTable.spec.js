import { shallowMount, createLocalVue } from '@vue/test-utils';
import WhatsAppTemplatesTable from '@/views/WhatsAppTemplatesTable.vue';

const localVue = createLocalVue();

describe('views/WhatsAppTemplatesTable.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(WhatsAppTemplatesTable, {
      localVue,
      stubs: {
        UnnnicBreadcrumb: true,
        TemplatesHeader: true,
        TemplatesTable: true,
      },
      mocks: {
        $router: {
          push: jest.fn(),
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleCrumbClick()', () => {
    it('should call router.push with desired path if defined', () => {
      const spy = spyOn(wrapper.vm.$router, 'push');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.handleCrumbClick({ path: '/path' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('/path');
    });

    it('should not call router.push if path is not defined', () => {
      const spy = spyOn(wrapper.vm.$router, 'push');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.handleCrumbClick({});
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
