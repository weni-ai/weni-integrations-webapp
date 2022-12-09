import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import FormTabContentBody from '@/components/whatsAppTemplates/FormTabContentBody.vue';
import InputEditor from '@/components/whatsAppTemplates/InputEditor.vue';
import '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = ({ body = '', disableInputs = false } = {}) => {
  const getters = {
    templateTranslationCurrentForm: jest.fn(() => {
      return { body };
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

  const wrapper = mount(FormTabContentBody, {
    localVue,
    store,
    i18n,
    stubs: {
      InputEditor: true,
    },
    propsData: {
      disableInputs,
    },
  });

  return { wrapper, getters };
};

describe('components/whatsAppTemplates/FormTabContentBody.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call format event on inputEditor event', async () => {
    const spy = spyOn(FormTabContentBody.methods, 'handleFormatEvent');
    const { wrapper } = mountComponent({ body: 'Text {{1}} with {{2}} variables' });
    const inputEditor = wrapper.findComponent(InputEditor);

    inputEditor.vm.$emit('format-event', 'bold');
    await wrapper.vm.$nextTick();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('bold');
  });

  it('should not add variable if body will be greater than 1024', async () => {
    const lengthyText =
      'Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie, porttitor ut, iaculis quis, sem. Phasellus rhoncus. Aenean id metus id velit ullamcorper pulvinar. Vestibulum fermentum tortor id mi. Pellentesque ipsum. Nulla non arcu lacinia neque faucibus fringilla. Nulla non lectus sed nisl molestie malesuada. Proin in tellus sit amet nibh dignissim sagittis. Vivamus luctus egestas leo. Maecenas sollicitudin. Nullam rhoncus aliquam metus. Etiam egestas wisi a erat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus, nec bibendum odio risus sit amet ante. Aliquam erat volutpat. Nunc auctor. Mauris pretium quam et urna. Fusce nibh. Duis risus. Curabitur sagittis hendrerit ante. Aliquam erat volutpat. Vestibulum erat nulla, ullamcorper nec, rutrum non, nonummy ac, erat. Duis condimentum augue id magna semper rutrum. Nullam justo enim, consectetuer nec, ullamcorper ac, v';
    const { wrapper } = mountComponent({
      body: lengthyText,
    });

    const inputEditor = wrapper.findComponent(InputEditor);

    inputEditor.vm.$emit('add-variable');
    await wrapper.vm.$nextTick();

    const event = wrapper.emitted('input-change');
    expect(event).toBeFalsy();
  });

  it('should not add variable if disabledInputs is true', async () => {
    const { wrapper } = mountComponent({ body: 'text', disableInputs: true });

    const inputEditor = wrapper.findComponent(InputEditor);

    inputEditor.vm.$emit('add-variable');
    await wrapper.vm.$nextTick();

    const event = wrapper.emitted('input-change');
    expect(event).toBeFalsy();
  });

  it('should add variable on inputEditor event', async () => {
    const { wrapper } = mountComponent({ body: 'Text {{1}} with {{2}} variables' });
    const inputEditor = wrapper.findComponent(InputEditor);

    inputEditor.vm.$emit('add-variable');
    await wrapper.vm.$nextTick();

    const event = wrapper.emitted('input-change');
    expect(event).toBeTruthy();
    expect(event.length).toBe(1);
    expect(event[0]).toEqual([
      {
        fieldName: 'body',
        fieldValue: 'Text {{1}} with {{2}} variables {{3}}',
      },
    ]);
  });

  it('should add variable on inputEditor event even without body', async () => {
    const { wrapper } = mountComponent({ body: undefined });
    const inputEditor = wrapper.findComponent(InputEditor);

    inputEditor.vm.$emit('add-variable');
    await wrapper.vm.$nextTick();

    const event = wrapper.emitted('input-change');
    expect(event).toBeTruthy();
    expect(event.length).toBe(1);
    expect(event[0]).toEqual([
      {
        fieldName: 'body',
        fieldValue: '{{1}}',
      },
    ]);
  });

  describe('handleNewEmoji()', () => {
    it('should not emit input-change if disableInputs is true', async () => {
      const { wrapper } = mountComponent({ body: 'text', disableInputs: true });

      const inputEditor = wrapper.findComponent(InputEditor);

      inputEditor.vm.$emit('emoji-event', { data: '👍' });
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeFalsy();
    });

    it('should  emit input-change with new emoji appended', async () => {
      const { wrapper } = mountComponent({ body: 'text' });

      const inputEditor = wrapper.findComponent(InputEditor);

      inputEditor.vm.$emit('emoji-event', { data: '👍' });
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'body',
          fieldValue: 'text👍',
        },
      ]);
    });

    it('should  emit input-change with new emoji appended even if body is undefined', async () => {
      const { wrapper } = mountComponent({ body: undefined });

      const inputEditor = wrapper.findComponent(InputEditor);

      inputEditor.vm.$emit('emoji-event', { data: '👍' });
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'body',
          fieldValue: '👍',
        },
      ]);
    });
  });

  describe('errorsList', () => {
    it('should return empty array if there are no errors', () => {
      const { wrapper } = mountComponent({ body: 'text with {{1}} as valid variable' });
      expect(wrapper.vm.errorsList).toEqual([]);
    });

    it('should return start_or_end_with_variable if variables are at start or end', () => {
      const errorMessage = 'The body text contains variable parameters at the beginning or end.';
      let { wrapper } = mountComponent({ body: '{{1}} text with varaible at start' });
      expect(wrapper.vm.errorsList).toEqual([errorMessage]);

      ({ wrapper } = mountComponent({ body: 'text with variable at end {{1}}' }));
      expect(wrapper.vm.errorsList).toEqual([errorMessage]);
    });

    it('should return incomplete_bracket_variable if variable is not at the correct format', () => {
      const errorMessage =
        'This template contains variable parameters with incorrect formatting. Variable parameters must be whole numbers with two sets of curly brackets (for example, {{1}}, {{2}}).';
      let { wrapper } = mountComponent({ body: 'text {1}}' });
      expect(wrapper.vm.errorsList).toEqual([errorMessage]);

      ({ wrapper } = mountComponent({ body: 'text {{1}' }));
      expect(wrapper.vm.errorsList).toEqual([errorMessage]);

      ({ wrapper } = mountComponent({ body: 'text {1}' }));
      expect(wrapper.vm.errorsList).toEqual([errorMessage]);
    });

    it('should return too_many_variables if text does not contains enough words', () => {
      const errorMessage =
        'This template contains too many variable parameters relative to the message length. You need to decrease the number of variable parameters or increase the message length.';
      const { wrapper } = mountComponent({ body: 'text {{1}} {{2}} end' });
      expect(wrapper.vm.errorsList).toEqual([errorMessage]);
    });
  });
});
