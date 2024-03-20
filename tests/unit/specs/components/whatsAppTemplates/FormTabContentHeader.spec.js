import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import { unnnicSelect, unnnicInput, unnnicButton } from '@weni/unnnic-system';
import FormTabContentHeader from '@/components/whatsAppTemplates/FormTabContentHeader.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = ({ header = {}, disableInputs = false } = {}) => {
  const getters = {
    templateTranslationCurrentForm: jest.fn(() => {
      return { header: header };
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

  const wrapper = mount(FormTabContentHeader, {
    localVue,
    store,
    i18n,
    propsData: {
      disableInputs,
    },
  });

  return { wrapper, getters };
};

describe('components/whatsAppTemplates/FormTabContentHeader.vue', () => {
  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('mounted()', () => {
    it('should call fillEmptyHeader', async () => {
      const spy = spyOn(FormTabContentHeader.methods, 'fillEmptyHeader');
      mountComponent({ header: null });

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('beforeUpdate()', () => {
    it('should call fillEmptyHeader', async () => {
      const spy = spyOn(FormTabContentHeader.methods, 'fillEmptyHeader');
      const { wrapper } = mountComponent({ header: null });

      expect(spy).toHaveBeenCalledTimes(1);

      await wrapper.setProps({ disableInputs: true });
      await wrapper.vm.$nextTick();

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('fillEmptyHeader()', () => {
    it('should emit deafult TEXT header if null', () => {
      const { wrapper } = mountComponent({ header: null });

      const event = wrapper.emitted('input-change');

      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'header',
          fieldValue: {
            header_type: 'TEXT',
            text: null,
          },
        },
      ]);
    });

    it('should not emit deafult TEXT header if null', () => {
      const { wrapper } = mountComponent({ header: { header_type: 'TEXT', text: '' } });

      const event = wrapper.emitted('input-change');
      expect(event).toBeFalsy();
    });
  });

  describe('handleNewHeaderInput()', () => {
    it('should emit input-change on select change into MEDIA', async () => {
      const { wrapper } = mountComponent({ header: { header_type: 'TEXT', text: '' } });
      const selectComponent = wrapper.findComponent(unnnicSelect);

      selectComponent.vm.$emit('input', 'MEDIA');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');

      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'header',
          fieldValue: {
            header_type: 'MEDIA',
            mediaType: 'IMAGE',
          },
        },
      ]);
    });

    it('should emit input-change on select change into TEXT', async () => {
      const { wrapper } = mountComponent({ header: { header_type: 'MEDIA', mediaType: 'IMAGE' } });
      const selectComponent = wrapper.findComponent(unnnicSelect);

      selectComponent.vm.$emit('input', 'TEXT');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');

      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'header',
          fieldValue: {
            header_type: 'TEXT',
            text: null,
          },
        },
      ]);
    });
  });

  it('should emit input-change on header text change', async () => {
    const { wrapper } = mountComponent({ header: { header_type: 'TEXT', text: '' } });
    const inputComponent = wrapper.findComponent(unnnicInput);

    inputComponent.vm.$emit('input', 'text123');
    await wrapper.vm.$nextTick();

    const event = wrapper.emitted('input-change');

    expect(event).toBeTruthy();
    expect(event.length).toBe(1);
    expect(event[0]).toEqual([
      {
        fieldName: 'header',
        fieldValue: {
          header_type: 'TEXT',
          text: 'text123',
        },
      },
    ]);
  });

  it('should set mediaType as IMAGE on image button click', async () => {
    const { wrapper } = mountComponent({ header: { header_type: 'MEDIA' } });
    const imageButtonComponent = wrapper.findAllComponents(unnnicButton).at(0);

    await imageButtonComponent.trigger('click');

    const event = wrapper.emitted('input-change');
    expect(event).toBeTruthy();
    expect(event.length).toBe(1);
    expect(event[0]).toEqual([
      {
        fieldName: 'header',
        fieldValue: {
          header_type: 'MEDIA',
          mediaType: 'IMAGE',
        },
      },
    ]);
  });

  it('should set mediaType as VIDEO on video button click', async () => {
    const { wrapper } = mountComponent({ header: { header_type: 'MEDIA' } });
    const videoButtonComponent = wrapper.findAllComponents(unnnicButton).at(1);

    await videoButtonComponent.trigger('click');

    const event = wrapper.emitted('input-change');
    expect(event).toBeTruthy();
    expect(event.length).toBe(1);
    expect(event[0]).toEqual([
      {
        fieldName: 'header',
        fieldValue: {
          header_type: 'MEDIA',
          mediaType: 'VIDEO',
        },
      },
    ]);
  });

  it('should set mediaType as DOCUMENT on document button click', async () => {
    const { wrapper } = mountComponent({ header: { header_type: 'MEDIA' } });
    const documentButtonComponent = wrapper.findAllComponents(unnnicButton).at(2);

    await documentButtonComponent.trigger('click');

    const event = wrapper.emitted('input-change');
    expect(event).toBeTruthy();
    expect(event.length).toBe(1);
    expect(event[0]).toEqual([
      {
        fieldName: 'header',
        fieldValue: {
          header_type: 'MEDIA',
          mediaType: 'DOCUMENT',
        },
      },
    ]);
  });

  describe('buttonType()', () => {
    it('should return secondary if disabled inputs is false', () => {
      const { wrapper } = mountComponent({
        header: { header_type: 'MEDIA', mediaType: 'IMAGE' },
        disableInputs: false,
      });

      expect(wrapper.vm.buttonType('IMAGE')).toEqual('secondary');
    });

    it('should return secondary if disabled inputs is true and received type is equal to mediaType', () => {
      const { wrapper } = mountComponent({
        header: { header_type: 'MEDIA', mediaType: 'IMAGE' },
        disableInputs: true,
      });

      expect(wrapper.vm.buttonType('IMAGE')).toEqual('secondary');
    });

    it('should return primary if disabled inputs is true and received type is not equal to mediaType', async () => {
      const { wrapper } = mountComponent({
        header: { header_type: 'MEDIA', mediaType: 'IMAGE' },
        disableInputs: true,
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.buttonType('VIDEO')).toEqual('primary');
    });
  });
});
