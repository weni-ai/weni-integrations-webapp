import { mount, createLocalVue } from '@vue/test-utils';
import StepIndicator from '@/components/StepIndicator.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

const mountComponent = async ({ steps = ['first', 'second'], currentStep = 1 } = {}) => {
  const wrapper = mount(StepIndicator, {
    localVue,
    i18n,
    propsData: {
      steps,
      currentStep,
    },
  });

  return { wrapper };
};

describe('components/StepIndicator.vue', () => {
  it('should render properly', async () => {
    const { wrapper } = await mountComponent();

    expect(wrapper).toMatchSnapshot();
  });
});
