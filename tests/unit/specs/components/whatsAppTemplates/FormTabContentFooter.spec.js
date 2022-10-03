import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import { unnnicTextArea } from '@weni/unnnic-system';
import FormTabContentFooter from '@/components/whatsAppTemplates/FormTabContentFooter.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = ({ footer = '' } = {}) => {
  const getters = {
    templateTranslationCurrentForm: jest.fn(() => {
      return { footer };
    }),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsApp: {
        namespaced: true,
        getters,
      },
    },
  });

  const wrapper = mount(FormTabContentFooter, {
    localVue,
    store,
    i18n,
  });

  return { wrapper, getters };
};

describe('components/whatsAppTemplates/FormTabContentFooter.vue', () => {
  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should emit input-change on header text change', async () => {
    const { wrapper } = mountComponent();
    const inputComponent = wrapper.findComponent(unnnicTextArea);

    inputComponent.vm.$emit('input', 'text123');
    await wrapper.vm.$nextTick();

    const event = wrapper.emitted('input-change');

    expect(event).toBeTruthy();
    expect(event.length).toBe(1);
    expect(event[0]).toEqual([
      {
        fieldName: 'footer',
        fieldValue: 'text123',
      },
    ]);
  });
});
