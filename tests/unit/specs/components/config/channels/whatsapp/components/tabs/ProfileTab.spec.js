import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ProfileTab from '@/components/config/channels/whatsapp/components/tabs/ProfileTab.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(VueRouter);
describe('whatsapp/components/tabs/ProfileTab.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ProfileTab, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        DynamicForm: true,
        UnnnicButton: true,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('updateInputs()', () => {
    it('should set profile info input data correctly', async () => {
      const inputData = {
        index: 0,
        value: 'value',
      };
      expect(wrapper.vm.profileInputs[inputData.index].value).not.toEqual(inputData.value);
      wrapper.vm.updateInputs(inputData);
      expect(wrapper.vm.profileInputs[inputData.index].value).toEqual(inputData.value);
    });
  });
});
