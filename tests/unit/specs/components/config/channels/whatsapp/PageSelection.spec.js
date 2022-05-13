import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import PageSelection from '@/components/config/channels/whatsapp/PageSelection.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../../../../__mocks__/appMock';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
describe('whatsapp/PageSelection.vue', () => {
  let wrapper;
  beforeEach(() => {
    const customData = {
      pages: [
        { id: 1, name: 'page1' },
        { id: 2, name: 'page2' },
      ],
    };

    wrapper = shallowMount(PageSelection, {
      localVue,
      i18n,
      router,
      propsData: {
        app: singleApp,
        customData,
      },
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicModal: true,
        UnnnicButton: true,
        UnnnicSelect: true,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('closePopUp()', () => {
    it('should set showModal oposite', () => {
      wrapper.setData({ showModal: true });
      expect(wrapper.vm.showModal).toBeTruthy();
      wrapper.vm.closePopUp();
      expect(wrapper.vm.showModal).toBeFalsy();
    });

    it('should call parent closePopUp()', () => {
      expect(wrapper.emitted('closePopUp')).toBeFalsy();
      wrapper.vm.closePopUp();
      expect(wrapper.emitted('closePopUp')).toBeTruthy();
    });
  });

  describe('selectPage()', () => {
    it('should redirect to /apps/my', () => {
      const spy = spyOn(wrapper.vm.$router, 'replace');

      expect(spy).not.toHaveBeenCalled();

      wrapper.vm.selectPage();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('/apps/my');
    });
  });
});
