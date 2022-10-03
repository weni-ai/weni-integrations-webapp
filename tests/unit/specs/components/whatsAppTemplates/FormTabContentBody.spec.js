import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import FormTabContentBody from '@/components/whatsAppTemplates/FormTabContentBody.vue';
import InputEditor from '@/components/whatsAppTemplates/InputEditor.vue';
import '@weni/unnnic-system';

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
    mocks: {
      $t: () => 'some specific text',
    },
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

  it('should not add variable if disabledInputs is true', async () => {
    const lengthyText =
      'Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie, porttitor ut, iaculis quis, sem. Phasellus rhoncus. Aenean id metus id velit ullamcorper pulvinar. Vestibulum fermentum tortor id mi. Pellentesque ipsum. Nulla non arcu lacinia neque faucibus fringilla. Nulla non lectus sed nisl molestie malesuada. Proin in tellus sit amet nibh dignissim sagittis. Vivamus luctus egestas leo. Maecenas sollicitudin. Nullam rhoncus aliquam metus. Etiam egestas wisi a erat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus, nec bibendum odio risus sit amet ante. Aliquam erat volutpat. Nunc auctor. Mauris pretium quam et urna. Fusce nibh. Duis risus. Curabitur sagittis hendrerit ante. Aliquam erat volutpat. Vestibulum erat nulla, ullamcorper nec, rutrum non, nonummy ac, erat. Duis condimentum augue id magna semper rutrum. Nullam justo enim, consectetuer nec, ullamcorper ac, v';
    const { wrapper } = mountComponent({
      body: lengthyText,
    });

    const inputEditor = wrapper.findComponent(InputEditor);
    const input = wrapper.getComponent({ ref: 'bodyText' });
    expect(input.text()).toEqual(lengthyText);

    inputEditor.vm.$emit('add-variable');
    await wrapper.vm.$nextTick();

    expect(input.text()).toEqual(lengthyText);
    const event = wrapper.emitted('input-change');
    expect(event).toBeFalsy();
  });

  it('should not add variable if body will be greater than 1024', async () => {
    const { wrapper } = mountComponent({ body: 'text', disableInputs: true });

    const inputEditor = wrapper.findComponent(InputEditor);
    const input = wrapper.getComponent({ ref: 'bodyText' });
    expect(input.text()).toEqual('text');

    inputEditor.vm.$emit('add-variable');
    await wrapper.vm.$nextTick();

    expect(input.text()).toEqual('text');
    const event = wrapper.emitted('input-change');
    expect(event).toBeFalsy();
  });

  it('should add variable on inputEditor event', async () => {
    const { wrapper } = mountComponent({ body: 'Text {{1}} with {{2}} variables' });
    const inputEditor = wrapper.findComponent(InputEditor);
    const input = wrapper.getComponent({ ref: 'bodyText' });

    expect(input.text()).toEqual('Text {{1}} with {{2}} variables');

    inputEditor.vm.$emit('add-variable');
    await wrapper.vm.$nextTick();

    expect(input.text()).toEqual('Text {{1}} with {{2}} variables {{3}}');

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
    const input = wrapper.getComponent({ ref: 'bodyText' });

    expect(input.text()).toEqual('');

    inputEditor.vm.$emit('add-variable');
    await wrapper.vm.$nextTick();

    expect(input.text()).toEqual('{{1}}');

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
});
